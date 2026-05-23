import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import type { Inbox } from "../../src/utils/types";
import { authPreHandler } from "../plugins/authPreHandler";
import type { RequestBody } from "../utils/requestTypes";

const inbox: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get(
        "/api/inbox",
        { preHandler: authPreHandler },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const result: Inbox[] = fastify
                .db()
                .inbox.query()
                .equalTo("userId", request.auth?._id as string)
                .find();

            return reply.code(200).send({
                entries: result,
            });
        },
    );

    fastify.post<RequestBody>(
        "/api/inbox",
        { preHandler: authPreHandler },
        async (request, reply: FastifyReply) => {
            const entry: Inbox = JSON.parse(request.body);

            entry.createdAt = new Date().toISOString();
            entry.userId = request.auth?._id as string;

            const result = fastify.db().inbox.insert(entry);

            return reply.code(200).send({
                entry: result,
            });
        },
    );

    fastify.delete<RequestBody>(
        "/api/inbox",
        { preHandler: authPreHandler },
        async (request, reply: FastifyReply) => {
            const { _id } = JSON.parse(request.body);

            const entries = fastify
                .db()
                .inbox.query()
                .equalTo("_id", _id)
                .find();
            if (entries.length) {
                const entry: Inbox = entries[0];
                if (entry.userId === request.auth?._id) {
                    const result = fastify.db().inbox.delete(_id);

                    return reply
                        .code(200)
                        .headers({ "access-control-allow-methods": "DELETE" })
                        .send({
                            entry: result,
                        });
                } else {
                    return reply.code(401).send({
                        err: "Not authorized to delete this entry.",
                    });
                }
            } else {
                return reply.code(404).send({
                    err: "Inbox entry not found.",
                });
            }
        },
    );
};

export default inbox;
