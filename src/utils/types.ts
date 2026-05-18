import type { NeboaDocument } from "neboa";

export type Permission = {
	userId: string;
	level: number;
};

export type Tag = {
	name: string;
	color: string;
};

export type Project = {
	_id?: string;
	icon: string;
	title: string;
	desc?: string;
	tags?: Tag[];
	status: string;
	tasksStatus: string[];
	createdAt: string;
	updatedAt: string;
	permissions: Permission[];
};
export type ProjectDocument = NeboaDocument<Project>;

export type TimeTrack = {
	userId: string;
	sessions: number[];
};

export type Task = {
	_id?: string;
	title: string;
	content?: string;
	projectId: string;
	assigneesId?: string[];
	tags?: Tag[];
	status: number;
	priority: number;
	timeTracking: TimeTrack[];
	createdAt: string;
	updatedAt: string;
	dueAt?: string;
	userId: string;
};
export type TaskDocument = NeboaDocument<Task>;

export type Note = {
	_id?: string;
	title: string;
	content: string;
	projectId: string;
	tags?: Tag[];
	createdAt: string;
	updatedAt: string;
};
export type NoteDocument = NeboaDocument<Note>;

export type User = {
	_id?: string;
	username: string;
	password: string;
	avatar: string;
	bio: string;
	createdAt: string;
	loggedAt: string;
	roles: string[];
};
export type UserDocument = NeboaDocument<User>;
