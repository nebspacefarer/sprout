import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import type {
	NoteDocument,
	ProjectDocument,
	TaskDocument,
} from "../../src/utils/types";
import type { RequestBody, RequestParamsName } from "../utils/requestTypes";

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

	fastify.get<RequestParamsName>(
		"/api/projects/:name",
		async (request, reply: FastifyReply) => {
			const { name } = request.params;

			const projects: ProjectDocument[] = fastify
				.db()
				.projects.query()
				.find();

			const project = projects.find(
				(p) => p.title.toLowerCase().replace(" ", "_") === name,
			);

			if (project) {
				const tasks: TaskDocument[] = fastify
					.db()
					.tasks.query()
					.equalTo("projectId", project._id)
					.find();

				const notes: NoteDocument[] = fastify
					.db()
					.notes.query()
					.equalTo("projectId", project._id)
					.find();

				return reply
					.code(200)
					.send({ project: project, tasks: tasks, notes: notes });
			}

			return reply.code(404).send({ error: "Not found." });
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
