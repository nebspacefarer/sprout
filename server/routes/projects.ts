import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import type { RequestBody } from "../utils/requestTypes";

const projects: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get(
		"/api/projects",
		async (_request: FastifyRequest, reply: FastifyReply) => {
			const projects = fastify.db().projects.query().find();

			return reply.code(200).send({
				projects,
			});
		},
	);

	fastify.post<RequestBody>(
		"/api/projects",
		async (request, reply: FastifyReply) => {
			const project = JSON.parse(request.body);

			const result = fastify.db().projects.insert(project);

			return reply.code(200).send({
				project: result,
			});
		},
	);
};

export default projects;
