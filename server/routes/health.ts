import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

const health: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get(
		"/api/health",
		async (_request: FastifyRequest, reply: FastifyReply) => {
			return reply.code(200).send({
				status: "online",
				uptime: "-",
				ping: reply.elapsedTime,
			});
		},
	);
};

export default health;
