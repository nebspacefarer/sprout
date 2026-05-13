export type Permission = {
	id: string;
	userId: string;
	level: number;
};

export type Project = {
	id: string;
	title: string;
	desc: string;
	tags: string;
	status: string[];
	dueAt: string;
	createdAt: string;
	updatedAt: string;
	permissions: Permission[];
};

export type TimeTrack = {
	userId: string;
	sessions: number[];
};

export type Task = {
	id: string;
	title: string;
	content: string;
	projectId: string;
	assigneesId: string[];
	status: number;
	priority: number;
	timeTracking: TimeTrack[];
	createdAt: string;
	updatedAt: string;
	userId: string;
};

export type User = {
	id: string;
	username: string;
	password: string;
	avatar: string;
	bio: string;
	createdAt: string;
	loggedAt: string;
	roles: string[];
};
