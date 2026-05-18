import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { type Collection, neboa } from "neboa";
import type { Project, Task, User } from "../../src/utils/types";

declare module "fastify" {
	interface FastifyInstance {
		db(): {
			users: Collection<User>;
			projects: Collection<Project>;
			tasks: Collection<Task>;
		};
	}
}

export default fp(
	(fastify: FastifyInstance) => {
		fastify.decorate("db", () => {
			const db = neboa("sprout.db");

			const users = db.collection<User>("users");
			const projects = db.collection<Project>("projects");
			const tasks = db.collection<Task>("tasks");

			return { users, projects, tasks };
		});
	},
	{ name: "db" },
);
