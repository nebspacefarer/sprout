import type { FastifyPluginAsync, FastifyReply } from "fastify";
import type { RequestBody } from "../utils/requestTypes";

const notes: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.post<RequestBody>(
        "/api/notes",
        async (request, reply: FastifyReply) => {
            const note = JSON.parse(request.body);

            const result = fastify.db().projects.insert(note);

            return reply.code(200).send({
                note: result,
            });
        },
    );
};

export default notes;
