let router = require("express").Router();
let mongoose = require("mongoose");
let Patient = mongoose.model("Patient");
let GPTService = mongoose.model("GPTService");
let Transcription = mongoose.model("Transcription");
const auth = require("../auth");
let { OkResponse, BadRequestResponse } = require("express-http-response");
const { hl7 } = require("../../utilities/gptTemplates");
const { getTemplete, getAiObj } = require("../../utilities/switch");
const openai = require("../../utilities/openGpt");

router.get("/get/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) return next(new OkResponse(""));
		let gpt = await GPTService.findOne({ searcher: id });
		return next(new OkResponse(gpt));
	} catch (error) {
		return next(new BadRequestResponse(null));
	}
});

router.get("/hl7/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) return next(new BadRequestResponse("No id provided"));
		let foundPatient = await Patient.findOne({ patientID: id });
		let transcript = await Transcription.findOne({ searcher: id });
		const stream = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "user",
					content: `Create HL7 FHIR. Stricly follow this template : ${hl7} . Here is data of patient : ${foundPatient} .Doctor's Data : ${req.user} . SOAP :${transcript.soap}`,
				},
			],
			stream: true,
		});
		let response = "";
		for await (const part of stream) {
			response = response.concat(part.choices[0]?.delta?.content || "");
			lumedSocket.emit(`${req.user._id}-hl7`, response);
		}
		const startIndex = response.indexOf("{");

		// Find the index where the JSON data ends
		const endIndex = response.lastIndexOf("}");

		// Extract the JSON data
		const jsonData = response.slice(startIndex, endIndex + 1);
		let gptTask = await GPTService.findOne({ searcher: id });
		if (!gptTask) {
			let newGptTask = await GPTService.create({
				hl7: jsonData,
				searcher: id,
			});
			console.log("If block", newGptTask);
			return next(new OkResponse(newGptTask));
		} else {
			gptTask.hl7 = jsonData;
			await gptTask.save();
			console.log("If block", gptTask);
			return next(new OkResponse(gptTask));
		}
	} catch (error) {
		console.log(error);
		return next(new BadRequestResponse(error));
	}
});

router.get("/prescription/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) return next(new BadRequestResponse("No id provided"));
		let transcript = await Transcription.findOne({ searcher: id });

		const stream = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "user",
					content: `generate comprehensive prescription with dosage for this SOAP of patient. SOAP :${transcript.soap}`,
				},
			],
			stream: true,
		});
		let response = "";
		for await (const part of stream) {
			response = response.concat(part.choices[0]?.delta?.content || "");
			lumedSocket.emit(`${req.user._id}-prescription`, response);
		}
		let gptTask = await GPTService.findOne({ searcher: id });
		if (!gptTask) {
			let newGptTask = await GPTService.create({
				prescription: response,
				searcher: id,
			});
			return next(new OkResponse(newGptTask));
		} else {
			gptTask.prescription = response;
			await gptTask.save();
			return next(new OkResponse(gptTask));
		}
	} catch (error) {
		console.log(error);
		return next(new BadRequestResponse(error));
	}
});

router.post("/custom-prompt/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) return next(new BadRequestResponse("No id provided"));
		let transcript = await Transcription.findOne({ searcher: id });

		const completion = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "user",
					content: `Given the clinical SOAP note, ${req.body.prompt}. SOAP Note: ${transcript.soap}`,
				},
			],
			stream: true,
		});
		let response = "";
		for await (const part of completion) {
			response = response.concat(part.choices[0]?.delta?.content || "");
			lumedSocket.emit(req.user._id + "-custom", part.choices[0]?.delta?.content || "");
		}
		let gptTask = await GPTService.findOne({ searcher: id });
		if (!gptTask) {
			let newGptTask = await GPTService.create({
				custom: [
					{
						question: req.body.prompt,
						answer: response,
					},
				],
				searcher: id,
			});
			return next(new OkResponse(newGptTask));
		} else {
			gptTask.custom.push({
				question: req.body.prompt,
				answer: response,
			});
			await gptTask.save();
			return next(new OkResponse(gptTask));
		}
	} catch (error) {
		console.log(error);
		return next(new BadRequestResponse(error));
	}
});

router.post("/template/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) return next(new BadRequestResponse("No id provided"));
		let transcript = await Transcription.findOne({ searcher: id });
		const templete = getTemplete(req.body.type, transcript, req.user);
		const completion = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "user",
					content: templete,
				},
			],
			stream: true,
		});
		let response = "";
		for await (const part of completion) {
			response = response.concat(part.choices[0]?.delta?.content || "");
			lumedSocket.emit(id + "-" + req.body.type, response);
		}
		let gptTask = await GPTService.findOne({ searcher: id });
		if (!gptTask) {
			let newGptTask = new GPTService();
			newGptTask = getAiObj(req.body.type, newGptTask, response);
			newGptTask.searcher = id;
			await newGptTask.save();
			return next(new OkResponse(newGptTask));
		} else {
			gptTask = getAiObj(req.body.type, gptTask, response);
			await gptTask.save();
			return next(new OkResponse(gptTask));
		}
	} catch (error) {
		console.log(error);
		return next(new BadRequestResponse(error));
	}
});

module.exports = router;
