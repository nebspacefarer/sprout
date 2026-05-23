import type { NeboaDocument } from "neboa";

export type Inbox = {
	_id?: string;
	title: string;
	content?: string;
	createdAt?: string;
	updatedAt?: string;
	userId: string;
};

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
	status: number;
	createdAt?: string;
	updatedAt?: string;
	permissions?: Permission[];
};
export type ProjectDocument = NeboaDocument<Project>;

export type ProjectData = {
	project: Project;
	tasks: Task[];
	notes: Note[];
};

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
	email: string;
	password: string;
	avatar?: string;
	bio?: string;
	createdAt: string;
	loggedAt?: string;
	roles: string[];
	token?: string;
};
export type UserDocument = NeboaDocument<User>;

export type PublicUser = {
	_id?: string;
	username: string;
	avatar?: string;
	bio?: string;
	createdAt: string;
	loggedAt?: string;
};

export type Status = {
	id: number;
	title: string;
	color: string;
};
