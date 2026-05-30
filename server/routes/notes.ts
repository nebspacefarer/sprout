import type { FastifyPluginAsync, FastifyReply } from "fastify";
import type { Project, PublicUser } from "../../src/utils/types";
import { authPreHandler } from "../plugins/authPreHandler";
import type { RequestBody } from "../utils/requestTypes";

const notes: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.post<RequestBody>(
        "/api/notes",
        { preHandler: authPreHandler },
        async (request, reply: FastifyReply) => {
            const note = JSON.parse(request.body);

            const projects: Project[] = fastify
                .db()
                .projects.query()
                .equalTo("_id", note.projectId)
                .find();

            if (projects.length === 0) {
                return reply.code(401).send({
                    err: "Not authorized in this project.",
                });
            }
            if (
                projects[0].permissions?.find(
                    (p) => p.userId === request.auth?._id && p.level === 3,
                ) === undefined
            ) {
                return reply.code(401).send({
                    err: "Not authorized in this project.",
                });
            }

            const result = fastify.db().notes.insert(note);

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

    fastify.delete<RequestBody>(
        "/api/notes",
        { preHandler: authPreHandler },
        async (request, reply: FastifyReply) => {
            const note: Note = JSON.parse(request.body);

            const users: PublicUser[] = fastify
                .db()
                .users.query()
                .equalTo("_id", request.auth?._id)
                .find();

            if (!users) {
                return reply
                    .code(404)
                    .send({ err: "User not found from token." });
            }

            const projects = fastify
                .db()
                .projects.query()
                .equalTo("_id", note.projectId)
                .find();

            if (!projects) {
                return reply.code(404).send({
                    err: "Parent project not found.",
                });
            }

            if (projects[0].permissions) {
                for (const perm of projects[0].permissions) {
                    if (perm.userId === users[0]._id) {
                        if (perm.level !== 3) {
                            return reply.code(401).send({
                                err: "Not authorized to delete this project.",
                            });
                        }

                        const data = fastify.db().notes.delete(note._id);

                        return reply.code(200).send({
                            note: data,
                        });
                    }
                }
            }

            return reply.code(401).send({
                err: "Not authorized to delete this project.",
            });
        },
    );
};

export default notes;
