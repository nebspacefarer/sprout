import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import type { PublicUser, UserDocument } from "../../src/utils/types";
import type { RequestBody, RequestParamsId } from "../utils/requestTypes";

const users: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get(
        "/api/users",
        async (_request: FastifyRequest, reply: FastifyReply) => {
            const usersDb: UserDocument[] = fastify.db().users.query().find();
            const publicUsers: PublicUser[] = [];

            for (const user of usersDb) {
                const publicUser: PublicUser = {
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                    bio: user.bio,
                    createdAt: user.createdAt,
                    loggedAt: user.loggedAt,
                };

                publicUsers.push(publicUser);
            }

            return reply.code(200).send({
                users: publicUsers,
            });
        },
    );

    fastify.get<RequestParamsId>(
        "/api/users/:id",
        async (request, reply: FastifyReply) => {
            const { id } = request.params;

            const users: UserDocument[] = fastify
                .db()
                .users.query()
                .equalTo("_id", id)
                .find();

            if (!users) {
                return reply.code(404).send({
                    err: "User not found.",
                });
            }
            return reply.code(200).send({
                user: users[0],
            });
        },
    );

    fastify.post<RequestBody>(
        "/api/users",
        async (request, reply: FastifyReply) => {
            const user = JSON.parse(request.body);

            const result = fastify.db().users.insert(user);

            return reply.code(200).send({
                user: result,
            });
        },
    );
};

export default users;
