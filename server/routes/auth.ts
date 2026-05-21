import { compare, hash } from "bcryptjs";
import type { FastifyPluginAsync, FastifyReply } from "fastify";
import type { RequestBody } from "../utils/requestTypes";

const auth: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.post<RequestBody>(
        "/api/auth/login",
        async (request, reply: FastifyReply) => {
            const { email, password } = JSON.parse(request.body);
            console.log(email, password);

            const users = fastify
                .db()
                .users.query()
                .equalTo("email", email)
                .find();

            if (users.length === 0) {
                return reply.code(401).send({
                    error: "Invalid credentials",
                });
            }

            const isCorrectPassword = await compare(
                password,
                users[0].password,
            );
            console.log(isCorrectPassword);

            if (!isCorrectPassword) {
                return reply.code(401).send({
                    error: "Invalid credentials",
                });
            }

            users[0].loggedAt = new Date().toISOString();

            const updatedUser = fastify
                .db()
                .users.update(users[0]._id, users[0]);

            const token = fastify.jwt.sign(
                { id: updatedUser._id },
                { expiresIn: "1h" },
            );

            return reply.code(200).send({
                message: "Login successful",
                token: token,
            });
        },
    );

    fastify.post<RequestBody>(
        "/api/auth/register",
        async (request, reply: FastifyReply) => {
            const { email, username, password } = JSON.parse(request.body);

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

            const hashedPassword = await hash(password, 10);

            const newUser = fastify.db().users.insert({
                username,
                email,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                roles: [],
            });

            return reply.code(201).send({
                message: "User created successfully",
                user: newUser,
            });
        },
    );
};

export default auth;
