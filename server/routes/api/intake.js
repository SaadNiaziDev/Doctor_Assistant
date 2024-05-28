let router = require("express").Router();
let mongoose = require("mongoose");
let Patient = mongoose.model("Patient");
let Intake = mongoose.model("Intake");
let { OkResponse, BadRequestResponse } = require("express-http-response");
const openai = require("../../utilities/openGpt");
const auth = require("./../auth");

router.get("/get/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) return next(new OkResponse(""));
		let intake = await Intake.findOne({ searcher: id });
		return next(new OkResponse(intake));
	} catch (error) {
		return next(new BadRequestResponse(null));
	}
});

router.post("/add/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) throw new Error("Invalid ID");
		if (!req.body.intake) throw new Error("Intake is required");

		lumedSocket.emit(`${id}-intake`, {
			intake: req.body.intake,
			intakeSummary: "",
		});
		const intake = req.body.intake;

		const prompts = [];
		let currentHeading = null;

		intake.forEach((question) => {
			if (question.Heading !== currentHeading) {
				currentHeading = question.Heading;
				prompts.push(`Generate a summary for the heading: ${currentHeading}`);
			}
			prompts.push(`Q: ${question.question}\nA: ${question.answer}`);
		});

		const prompt = prompts.join("\n");

		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: "system",
					content: "You are a chatbot that generates summaries.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			model: "gpt-4",
		});
		let foundIntake = await Intake.findOne({ searcher: id });
		if (foundIntake) {
			foundIntake.intake = req.body.intake;
			foundIntake.intakeSummary = completion?.choices[0]?.message?.content;
			await foundIntake.save();
			lumedSocket.emit(`${id}-intake`, foundIntake);
		} else {
			let intakeForm = await Intake.create({
				intake: req.body.intake,
				intakeSummary: completion?.choices[0]?.message?.content,
				searcher: id,
			});
			lumedSocket.emit(`${id}-intake`, intakeForm);
		}
		return next(new OkResponse("Success!"));
	} catch (e) {
		console.log(e);
		return next(new BadRequestResponse(e));
	}
});

module.exports = router;
