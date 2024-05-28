let router = require("express").Router();
let mongoose = require("mongoose");
let Patient = mongoose.model("Patient");
let Transcription = mongoose.model("Transcription");
const auth = require("../auth");
let { OkResponse, BadRequestResponse } = require("express-http-response");
const openai = require("../../utilities/openGpt");
const { soap } = require("../../utilities/gptTemplates");

router.get("/get/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) return next(new OkResponse(""));
		let transcript = await Transcription.findOne({ searcher: id });
		return next(new OkResponse(transcript));
	} catch (error) {
		return next(new BadRequestResponse(null));
	}
});

router.post("/recording/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id || id === "") throw new Error("Invalid ID");
		let foundUser = await Patient.findOne({ patientID: id });
		if (!foundUser) throw new Error("Patient not Found");

		const formattedTranscription = req.body.transcription
			.map((item) => {
				return `Speaker ${item.Speaker}: ${item.text}`;
			})
			.join(" ");

		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: "user",
					content: `analyze this patient data , transciption and return answer in form of this template ${soap}. Data : ${foundUser} , Transcription: ${formattedTranscription}`,
				},
			],
			model: "gpt-4",
			stream: true,
		});
		let response = "";

		for await (const part of completion) {
			response = response.concat(part.choices[0]?.delta?.content || "");
			lumedSocket.emit(`${foundUser.doctor}-soap`, response);
		}
		let transcript = await Transcription.findOne({ searcher: id });
		if (transcript) {
			transcript.audio = req.body.audio;
			transcript.soap = response;
			transcript.transcription = req.body.transcription;
			await transcript.save();
			lumedSocket.emit(`${foundUser.doctor}-soap`, transcript);
			return next(new OkResponse(transcript));
		} else {
			let newTranscript = await Transcription.create({
				audio: req.body.audio,
				soap: response,
				transcription: req.body.transcription,
				searcher: id,
			});
			lumedSocket.emit(`${foundUser.doctor}-soap`, newTranscript);
			return next(new OkResponse(newTranscript));
		}
	} catch (error) {
		next(new BadRequestResponse(error));
	}
});

router.post("/generateSoap/:id", auth.isToken, async (req, res, next) => {
	const { id } = req.params;
	if (!id || !req.body.msg) return next(new BadRequestResponse("No id provided"));
	let foundTranscript = await Transcription.findOne({ searcher: id });
	if (!foundTranscript) return next(new BadRequestResponse("No patient found"));
	let content = req.body.instruction
		? `Follow these instruction provided below on this data . Data : ${req.body.msg} , instruction : ${req.body.instruction}`
		: `Regenerate the following text. Text should be in context of the medical field and concise
					${req.body.msg}`;

	try {
		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: "user",
					content: content,
				},
			],
			model: "gpt-3.5-turbo",
		});

		foundTranscript.soap = foundTranscript.soap.replace(
			req.body.msg,
			completion?.choices[0]?.message?.content.replace(/\n/g, "<br />")
		);
		foundTranscript
			.save()
			.then((data) => {
				return next(new OkResponse(data));
			})
			.catch((error) => new Error(error));
	} catch (error) {
		next(new BadRequestResponse(error));
	}
});

module.exports = router;
