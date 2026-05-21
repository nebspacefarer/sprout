import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import type { UserDocument } from "../../src/utils/types";
import type { RequestBody, RequestParamsId } from "../utils/requestTypes";

const users: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get(
        "/api/users",
        async (_request: FastifyRequest, reply: FastifyReply) => {
            const users: UserDocument[] = fastify.db().users.query().find();

            return reply.code(200).send({
                users: users,
            });
        },
    );

    fastify.get<RequestParamsId>(
        "/api/users/:id",
        async (request, reply: FastifyReply) => {
            const { id } = request.params;

            const user: UserDocument = fastify
                .db()
                .users.query()
                .equalTo("_id", id)
                .find();

            return reply.code(200).send({
                user: user,
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
