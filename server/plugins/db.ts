import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { type Collection, neboa } from "neboa";
import type { Inbox, Note, Project, Task, User } from "../../src/utils/types";

declare module "fastify" {
	interface FastifyInstance {
		db(): {
			users: Collection<User>;
			projects: Collection<Project>;
			tasks: Collection<Task>;
			notes: Collection<Note>;
			inbox: Collection<Inbox>;
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
			const notes = db.collection<Note>("notes");
			const inbox = db.collection<Inbox>("inbox");

			return { users, projects, tasks, notes, inbox };
		});
	},
	{ name: "db" },
);
