import type { CookieSerializeOptions } from "@fastify/cookie";
import type { DecodePayloadType } from "@fastify/jwt";
import { compare, hash } from "bcryptjs";
import type { FastifyPluginAsync, FastifyReply } from "fastify";
import type { PublicUser, User } from "../../src/utils/types";
import { authPreHandler } from "../plugins/authPreHandler";
import type { RequestBody } from "../utils/requestTypes";

const auth: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.post<RequestBody>(
        "/api/auth/login",
        async (request, reply: FastifyReply) => {
            const { email, password } = JSON.parse(request.body);

            const users = fastify
                .db()
                .users.query()
                .equalTo("email", email)
                .find();

            // Verify User existing

            if (users.length === 0) {
                return reply.code(401).send({
                    error: "Invalid credentials",
                });
            }

            // Verify Password through bcryptjs

            const isCorrectPassword = await compare(
                password,
                users[0].password,
            );

            if (!isCorrectPassword) {
                return reply.code(401).send({
                    error: "Invalid credentials",
                });
            }

            // Update loggedAt value in DB.

            users[0].loggedAt = new Date().toISOString();

            const updatedUser = fastify
                .db()
                .users.update(users[0]._id, users[0]);

            // Sign Token and Refresh JWT.

            const cookieOptions: CookieSerializeOptions = {
                path: "/",
                httpOnly: true,
                sameSite: false,
            };

            const token = fastify.jwt.sign(
                { id: updatedUser._id, roles: updatedUser.roles },
                { expiresIn: "10 minutes" },
            );

            const refresh = fastify.jwt.sign(
                { id: updatedUser._id, roles: updatedUser.roles },
                { expiresIn: "1 day" },
            );

            // Send Response

            return reply
                .setCookie("refresh", refresh, cookieOptions)
                .setCookie("token", token, cookieOptions)
                .code(200)
                .send({
                    user: updatedUser,
                    message: "Login successful",
                });
        },
    );

    fastify.post(
        "/api/auth/logout",
        { preHandler: authPreHandler },
        async (request, reply) => {
            const users = fastify
                .db()
                .users.query()
                .equalTo("_id", request.auth?._id)
                .find();

            if (!users) {
                return reply.code(404).send({ err: "User not found." });
            }

            const user: User = users[0];
            user.token = undefined;

            fastify.db().users.update(request.auth?._id, user);

            return reply
                .code(200)
                .clearCookie("token")
                .clearCookie("refresh")
                .send({
                    message: "Logged out successfully.",
                });
        },
    );

    fastify.post("/api/auth/refresh", async (request, reply) => {
        const cookieOptions: CookieSerializeOptions = {
            path: "/",
            httpOnly: true,
            sameSite: false,
        };

        const refreshToken = request.cookies.refresh as string;

        try {
            // Verify Refresh Token Validity
            fastify.jwt.verify(refreshToken, { maxAge: "1m" });

            const decoded = fastify.jwt.decode(
                refreshToken,
            ) as DecodePayloadType & { id: string };
            const users = fastify
                .db()
                .users.query()
                .equalTo("_id", decoded.id)
                .find();

            if (!users) {
                return reply.code(401).send({
                    err: "User not found with tokens.",
                });
            }

            return reply.code(200).send({
                user: users[0] as PublicUser,
                message: "Refresh token valid.",
            });
        } catch (err) {
            if (err.code === "FAST_JWT_EXPIRED") {
                // Refresh Token is valid but expired, rotate it with Access Token.
                const decoded = fastify.jwt.decode(
                    refreshToken,
                ) as DecodePayloadType & { id: string; roles: string[] };

                const token = fastify.jwt.sign(
                    { id: decoded.id, roles: decoded.roles },
                    { expiresIn: "10 minutes" },
                );

                const refresh = fastify.jwt.sign(
                    { id: decoded.id, roles: decoded.roles },
                    { expiresIn: "1 day" },
                );

                const users = fastify
                    .db()
                    .users.query()
                    .equalTo("_id", decoded.id)
                    .find();

                if (!users) {
                    return reply.code(401).send({
                        err: "User not found with tokens.",
                    });
                }

                // Send Response
                return reply
                    .setCookie("token", token, cookieOptions)
                    .setCookie("refresh", refresh, cookieOptions)
                    .code(200)
                    .send({
                        user: users[0] as PublicUser,
                        message: "Refresh token rotated.",
                    });
            }
        }
    });

    fastify.post<RequestBody>(
        "/api/auth/register",
        async (request, reply: FastifyReply) => {
            const { email, username, password } = JSON.parse(request.body);

            // Check email and username availabilities

            const usersMail = fastify
                .db()
                .users.query()
                .equalTo("email", email)
                .find();

            const usersName = fastify
                .db()
                .users.query()
                .equalTo("username", username)
                .find();

            if (usersMail.length > 0 || usersName.length > 0) {
                return reply.code(400).send({
                    error: "User already exists",
                });
            }

            // Hash password with bcryptjs

            const hashedPassword = await hash(password, 10);

            // Store user in DB

            const newUser = fastify.db().users.insert({
                username,
                email,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                roles: [],
            });

            // Send Response

            return reply.code(201).send({
                message: "User created successfully",
                user: newUser,
            });
        },
    );
};

export default auth;
