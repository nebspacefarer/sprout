import type { FastifyPluginAsync, FastifyReply } from "fastify";
import { authPreHandler } from "../plugins/authPreHandler";
import type { RequestBody } from "../utils/requestTypes";

const notes: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.post<RequestBody>(
        "/api/notes",
        { preHandler: authPreHandler },
        async (request, reply: FastifyReply) => {
            const note = JSON.parse(request.body);

            const result = fastify.db().projects.insert(note);

            return reply.code(200).send({
                note: result,
            });
        },
    );

    fastify.put<RequestBody>(
        "/api/notes",
        { preHandler: authPreHandler },
        async (request, reply: FastifyReply) => {
            const note = JSON.parse(request.body);

            const users = fastify
                .db()
                .users.query()
                .equalTo("_id", request.auth?._id)
                .find();
            if (!users) {
                return reply.code(404).send({
                    err: "User not found",
                });
            }

            const result = fastify.db().notes.update(note._id, note);

            return reply.code(200).send({
                note: result,
            });
        },
    );
};

export default notes;
