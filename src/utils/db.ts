import { createDatabase } from "@nebula-db/nebula-db";
import type { Project, Task, User } from "./types";

const db = createDatabase({
	storage: "fileSystem",
	path: "./sprout.db",
});

const users = db.collection("users");
const projects = db.collection("projects");
const tasks = db.collection("tasks");

export function migrate() {
	// ...
}

// Users

export async function addUser(user: User): Promise<User> {
	return await users.insert(user);
}

export async function updateUser(user: User): Promise<User> {
	return await users.update({ id: user.id }, { $set: user });
}

export async function deleteUser(userId: string) {
	await users.deleteOne({ id: userId });
}

export async function findUser(userId: string): Promise<User> {
	return await users.findOne({ id: userId });
}

// Projects

export async function addProject(project: Project): Promise<Project> {
	return await projects.insert(project);
}

export async function updateProject(project: Project): Promise<Project> {
	return await projects.update({ id: project.id }, { $set: project });
}

export async function deleteProject(projectId: string) {
	await projects.deleteOne({ id: projectId });
}

export async function findProject(projectId: string): Promise<Project[]> {
	return await projects.find({ id: projectId });
}

// Tasks

export async function addTask(task: Task): Promise<Task> {
	return await tasks.insert(task);
}

export async function updateTask(task: Task): Promise<Task> {
	return await tasks.update({ id: task.id }, { $set: task });
}

export async function deleteTask(taskId: string) {
	await projects.deleteOne({ id: taskId });
}

export async function findTasks(): Promise<Task[]> {
	return await projects.find({});
}
