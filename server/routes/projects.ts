import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import type {
	NoteDocument,
	Permission,
	Project,
	ProjectData,
	ProjectDocument,
	PublicUser,
	Task,
	TaskDocument,
} from "../../src/utils/types";
import { authPreHandler } from "../plugins/authPreHandler";
import type { RequestBody, RequestParamsName } from "../utils/requestTypes";

const projects: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get(
		"/api/projects",
		{ preHandler: authPreHandler },
		async (request: FastifyRequest, reply: FastifyReply) => {
			const projects = fastify.db().projects.query().find();

			const projectsData: ProjectData[] = [];

			for (const project in projects) {
				const authorized: boolean =
					projects[project].permissions?.find(
						(perm: Permission) => perm.userId === request.auth?._id,
					) !== undefined;

				if (!authorized) {
					return reply.code(401).send({
						err: "Not authorized.",
					});
				}

				const users: PublicUser[] = fastify.db().users.query().find();

				for (const perm of projects[project].permissions) {
					const userPerm = users.find((u) => u._id === perm.userId);

					perm.user = userPerm;
				}

				const tasks: Task[] = fastify
					.db()
					.tasks.query()
					.equalTo("projectId", projects[project]._id)
					.find();

				for (const task of tasks) {
					const taskUser = users.find(
						(u) => u._id === task.userId,
					) as PublicUser;
					task.user = taskUser;

					task.assignees = [] as PublicUser[];
					for (const assigneeId of task.assigneesId) {
						const assigneeUser = users.find(
							(u) => u._id === assigneeId,
						);
						task.assignees.push(assigneeUser as PublicUser);
					}
				}

				const notes: NoteDocument[] = fastify
					.db()
					.notes.query()
					.equalTo("projectId", projects[project]._id)
					.find();

				projectsData.push({
					project: projects[project],
					tasks: tasks,
					notes: notes,
				});
			}

			return reply.code(200).send({
				projects: projectsData,
			});
		},
	);

	fastify.get<RequestParamsName>(
		"/api/projects/:name",
		{ preHandler: authPreHandler },
		async (request, reply: FastifyReply) => {
			const { name } = request.params;

			const projects: ProjectDocument[] = fastify
				.db()
				.projects.query()
				.find();

			const project = projects.find(
				(p) =>
					p.title.toLowerCase().replace(" ", "_") === name ||
					p._id === name,
			);

			if (project) {
				const users: PublicUser[] = fastify.db().users.query().find();

				if (project.permissions) {
					for (const perm of project.permissions) {
						const permUser = users.find(
							(u) => u._id === perm.userId,
						) as PublicUser;

						perm.user = permUser;
					}
				}

				const tasks: TaskDocument[] = fastify
					.db()
					.tasks.query()
					.equalTo("projectId", project._id)
					.find();

				for (const task of tasks) {
					const taskUser = users.find(
						(u) => u._id === task.userId,
					) as PublicUser;
					task.user = taskUser;

					task.assignees = [] as PublicUser[];
					for (const assigneeId of task.assigneesId) {
						const assigneeUser = users.find(
							(u) => u._id === assigneeId,
						);
						task.assignees.push(assigneeUser as PublicUser);
					}
				}

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
		{ preHandler: authPreHandler },
		async (request, reply: FastifyReply) => {
			const project: Project = JSON.parse(request.body);

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

			project.createdAt = new Date().toISOString();
			project.updatedAt = project.createdAt;
			project.permissions = [
				{ level: 3, userId: request.auth?._id as string },
			];

			const result = fastify.db().projects.insert(project);

			return reply.code(200).send({
				project: result,
			});
		},
	);
};

export default projects;
