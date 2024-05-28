let mongoose = require("mongoose");
let router = require("express").Router();
let passport = require("passport");
let auth = require("../auth");
let User = mongoose.model("User");
let { OkResponse, BadRequestResponse } = require("express-http-response");
// let { sendEmail } = require("../../utilities/mailer");
const { backend } = require("../../config/env/development");
// let Feedback = mongoose.model("Feedback");

//--------------For Auth ----------------------
const htmlPage =
	'<html><head><title>Main</title></head><body></body><script defer >res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';

const successResponse = (res, user) => {
	let responseHTML = htmlPage.replace("%value%", JSON.stringify({ user: user, token: user.generateJWT() }));
	return res.status(200).send(responseHTML);
};

const errorResponse = (res, err) => {
	let responseHTML = htmlPage.replace("%value%", JSON.stringify({ err }));
	return res.status(400).send(responseHTML);
};

//--------------For Auth ----------------------

router.use(passport.initialize());
router.use(passport.session());

router.get("/context", auth.isToken, (req, res, next) => {
	return next(new OkResponse(req.user));
});

router.get("/logout", (req, res, next) => {
	try {
		req.logout((err) => {
			if (err) return next(new BadRequestResponse(err));
			req.session.destroy();
			return next(new OkResponse("Ok"));
		});
	} catch (error) {
		return next(new BadRequestResponse(error));
	}
});

router.post("/login", (req, res, next) => {
	passport.authenticate("local", async (err, user) => {
		if (err) return next(new BadRequestResponse(err.message));
		if (!user) return next(new BadRequestResponse(`Either incorrect username/password or user does not exist.`, 423));
		return next(new OkResponse({ user: user, token: user.generateJWT() }));
	})(req, res, next);
});

router.post("/signup", async (req, res, next) => {
	if (!req.body.email || !req.body.password) return next(new BadRequestResponse("Incomplete credentials!"));
	if (req.body.password !== req.body.confirm) return next(new BadRequestResponse("You need to re-enter your password"));
	let record = await User.findOne({ email: req.body.email });
	if (record) {
		return next(new BadRequestResponse("This email is already in taken"));
	} else {
		let newDoctor = new User({
			name: req.body.name,
			email: req.body.email,
		});
		newDoctor.setPassword(req.body.password);
		newDoctor.generateMailToken();
		newDoctor
			.save()
			.then((response) => {
				// sendEmail(response, "Email Verification", { verifyEmail: true });
				return next(new OkResponse("SignedUp successfully. Please login to continue!"));
			})
			.catch((err) => {
				console.log(err);
				return next(new BadRequestResponse("Something went wrong!"));
			});
	}
});

router.get("/google/failure", (req, res) => {
	return errorResponse(res, ErrorMessages.generalMessage);
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
	"/google/callback",
	passport.authenticate("google", {
		session: false,
		failureRedirect: backend + "/api/user/google/failure",
	}),
	async function (req, res, next) {
		let foundUser = await User.findOne({ googleId: req.user.id });
		if (foundUser) return successResponse(res, foundUser);
		else {
			let newUser = new User({
				email: req.user.emails[0].value,
				googleId: req.user.id,
				name: req.user.displayName,
			});
			newUser.generateMailToken();
			newUser
				.save()
				.then((user) => {
					return successResponse(res, user);
				})
				.catch((err) => {
					return errorResponse(res, err.message);
				});
		}
	}
);

// router.post("/feedback/:id", auth.isToken, async (req, res, next) => {
// 	try {
// 		const { id } = req.params;
// 		const feedback = await Feedback.create({
// 			doctor: req.user._id,
// 			patient: id,
// 			feedback: req.body.feedback,
// 		});
// 		console.log(feedback);
// 		next(new OkResponse("Feedback Recorded Successfully"));
// 	} catch (error) {
// 		next(new BadRequestResponse("Failed to create feedback!"));
// 		console.log(error);
// 	}
// });
module.exports = router;
