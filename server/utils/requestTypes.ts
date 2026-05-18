import type { RequestGenericInterface } from "fastify";

export interface RequestBody extends RequestGenericInterface {
	Body: string;
}

export interface RequestBodyAuth extends RequestGenericInterface {
	Body: string;
	Headers: { Authorization: string };
	auth?: { user: { permissions: string[] }; userUuid: string };
}

export interface RequestParamsAuth extends RequestBodyAuth {
	Params: {
		spaceId?: string;
	};
}

export interface RequestParamsName extends RequestGenericInterface {
	Params: {
		name: string;
	};
}
