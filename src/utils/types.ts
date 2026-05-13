export type Permission = {
	userId: string;
	level: number;
};

export type Tag = {
	name: string;
	color: string;
};

export type Project = {
	id?: string;
	icon: string;
	title: string;
	desc: string;
	tags: Tag[];
	status: string;
	tasksStatus: string[];
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
	tags: Tag[];
	status: number;
	priority: number;
	timeTracking: TimeTrack[];
	createdAt: string;
	updatedAt: string;
	dueAt: string;
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
