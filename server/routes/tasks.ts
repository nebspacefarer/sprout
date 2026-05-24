import type { FastifyPluginAsync, FastifyReply } from "fastify";
import type { Task } from "../../src/utils/types";
import { authPreHandler } from "../plugins/authPreHandler";
import type { RequestBody } from "../utils/requestTypes";

const tasks: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.post<RequestBody>(
        "/api/tasks",
        { preHandler: authPreHandler },
        async (request, reply: FastifyReply) => {
            const task: Task = JSON.parse(request.body);

            task.userId = request.auth?._id as string;
            task.assigneesId = [request.auth?._id as string];

            const result = fastify.db().tasks.insert(task);

            return reply.code(200).send({
                task: result,
            });
        },
    );

    fastify.put<RequestBody>(
        "/api/tasks",
        { preHandler: authPreHandler },
        async (request, reply: FastifyReply) => {
            const task = JSON.parse(request.body);

            console.log(task);

            const result = fastify.db().tasks.update(task._id, task);

            return reply.code(200).send({
                task: result,
            });
        },
    );

    fastify.delete<RequestBody>(
        "/api/tasks",
        { preHandler: authPreHandler },
        async (request, reply: FastifyReply) => {
            const { _id } = JSON.parse(request.body);

            const result = fastify.db().tasks.delete(_id);

            return reply.code(200).send({
                result,
            });
        },
    );
};

export default tasks;
