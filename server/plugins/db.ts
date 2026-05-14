import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { type Collection, neboa } from "neboa";

declare module "fastify" {
	interface FastifyInstance {
		db(): { users: Collection; projects: Collection; tasks: Collection };
	}
}

export default fp(
	(fastify: FastifyInstance) => {
		fastify.decorate("db", () => {
			const db = neboa("sprout.db");

			const users = db.collection("users");
			const projects = db.collection("projects");
			const tasks = db.collection("tasks");

			return { users, projects, tasks };
		});
	},
	{ name: "db" },
);
