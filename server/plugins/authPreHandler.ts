import type { DecodePayloadType, JWT } from "@fastify/jwt";
import type {
    FastifyReply,
    FastifyRequest,
    HookHandlerDoneFunction,
} from "fastify";

declare module "fastify" {
    interface FastifyInstance {
        validateToken: (
            authHeader: string | undefined,
        ) => Promise<{ userId: JWT | null }>;
    }

    interface FastifyRequest {
        auth?: { _id: string; roles: string[] };
        fastify: FastifyInstance | null;
    }
}

export const authPreHandler = async (
    request: FastifyRequest,
    reply: FastifyReply,
    _done: HookHandlerDoneFunction,
) => {
    try {
        const decoded = (await request.jwtDecode()) as DecodePayloadType & {
            id: string;
            roles: string[];
        };

        request.auth = {
            _id: decoded.id,
            roles: decoded.roles,
        };

        await request.jwtVerify({
            onlyCookie: true,
        });
    } catch (err) {
        return reply.code(401).send({
            err: err,
        });
    }
};
