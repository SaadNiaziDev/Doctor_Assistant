"use strict";
module.exports = {
	backend: "http://localhost:8000",
	frontend: "http://localhost:3000",
	publicPics: "http://localhost:8000/uploads/publicPics",
	// backend: "https://app.lumed.ai",
	// frontend: "https://app.lumed.ai",
	// publicPics: "/uploads/publicPics",
	PORT: 8000,
	MONGODB_URI: "mongodb://0.0.0.0:27017/lumed+",
	secret: "secret",
	host: "",
	smtpAuth: {
		user: "ganjtony@gmail.com",
		pass: "dgtofpkwpsfjmqjp",
	},
	// keys for google oauth and openai
	allowedOrigins: [
		"http://localhost:3000",
		"http://localhost:4173",
		"http://localhost:5000",
		"http://localhost:8000",
		"127.0.0.1:3000",
		"https://app.lumed.ai",
		"wss://app.lumed.ai:3002",
		"wss://app.lumed.ai",
	],
};
