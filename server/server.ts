import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import Fastify from "fastify";
import db from "./plugins/db";
import auth from "./routes/auth";
import health from "./routes/health";
import notes from "./routes/notes";
import projects from "./routes/projects";
import tasks from "./routes/tasks";
import users from "./routes/users";
import "dotenv/config";

const fastify = Fastify({});

fastify.register(cors, {
	origin: (_origin, cb) => {
		cb(null, true);
	},
	credentials: true,
});

fastify.register(db);

fastify.register(jwt, {
	secret: process.env.TOKEN_SECRET as string,
	cookie: {
		cookieName: "token",
		signed: false,
	},
});

fastify.register(cookie, {
	secret: process.env.COOKIE_SECRET,
});

fastify.register(health);
fastify.register(users);
fastify.register(auth);
fastify.register(projects);
fastify.register(tasks);
fastify.register(notes);

// Decorate Reply with default Content-Type
fastify.addHook("onSend", (_request, reply, _payload, done) => {
	reply
		.header("Content-Type", "application/json; charset=utf-8")
		.header("Access-Control-Allow-Methods", "*");
	done();
});

fastify.listen({ port: 3536, host: "localhost" }, (err, _address) => {
	if (err) {
		fastify.log.error(err);
	}

	console.log("Server running!");
});
