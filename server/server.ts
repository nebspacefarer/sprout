import cors from "@fastify/cors";
import Fastify from "fastify";
import db from "./plugins/db";
import health from "./routes/health";
import projects from "./routes/projects";

const fastify = Fastify({});

fastify.register(cors, {
	origin: (_origin, cb) => {
		cb(null, true);
	},
});

fastify.register(db);

fastify.register(health);
fastify.register(projects);

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
