let http = require("http");
path = require("path");
express = require("express");
bodyParser = require("body-parser");
session = require("express-session");
cors = require("cors");
passport = require("passport");
errorhandler = require("errorhandler");
mongoose = require("mongoose");
secret = require("./config").secret;
createLocaleMiddleware = require("express-locale");
compression = require("compression");
httpResponse = require("express-http-response");

const { MONGODB_URI, allowedOrigins } = require("./config");

let isProduction = process.env.NODE_ENV === "production";

module.exports = async (app) => {
	app.use(
		cors({
			credentials: true,
			origin: function (origin, callback) {
				// allow requests with no origin
				// (like mobile apps or curl requests)
				// console.log("ORIGIN", origin);
				if (!origin) return callback(null, true);
				if (allowedOrigins.indexOf(origin) === -1) {
					var msg = "The CORS policy for this site does not " + "allow access from the specified Origin.";
					return callback(new Error(msg), false);
				}
				return callback(null, true);
			},
		})
	);
	app.use(compression());
	// Normal express config defaults
	app.use(require("morgan")("dev"));
	app.use(bodyParser.urlencoded({ extended: false, limit: "500mb" }));
	app.use(bodyParser.json({ limit: "500mb" }));
	// Get the user's locale, and set a default in case there's none
	app.use(
		createLocaleMiddleware({
			priority: ["accept-language", "default"],
			default: "en_US", // ko_KR
		})
	);

	app.use(require("method-override")());
	app.use(express.static(path.join(__dirname, "/public")));

	app.use(session({ secret: secret, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

	if (!isProduction) {
		app.use(errorhandler());
	}

	if (isProduction) {
		mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	} else {
		mongodb: mongoose
			.connect(`${MONGODB_URI}?retryWrites=false`, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.catch((err) => {
				console.log(err);
			})
			.then(() => {
				console.log("connected to db in development environment");
			});
		mongoose.set("debug", true);
		mongoose.set("strictQuery", true);
	}

	require("./models/User");
	require("./models/Patient");
	// require("./models/Appointment");
	require("./models/Consultation");
	require("./models/DrugSearch");
	require("./models/GptService");
	require("./models/Intake");
	require("./models/Transcription");
	// require("./models/Feedback");
	require("./utilities/passport");
	require("./socket").default;
	require("./utilities/openGpt");
	app.use(require("./routes"));

	if (isProduction) {
		app.use("/", express.static(path.join(__dirname, "dist")));
		app.use((req, res, next) => {
			res.sendFile(path.join(__dirname, "dist", "index.html"));
		});
	}

	app.use(function (req, res, next) {
		let err = new Error("Not Found");
		err.status = 404;
		next(err);
	});
	app.use(httpResponse.Middleware);
	if (!isProduction) {
		app.use(function (err, req, res, next) {
			res.status(err.status || 500);

			res.json({
				errors: {
					message: err.message,
					error: err,
				},
			});
		});
	}

	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.json({
			errors: {
				message: err.message,
				error: {},
			},
		});
	});
};
