let router = require("express").Router();
let mongoose = require("mongoose");
let Consultation = mongoose.model("Consultation");
const auth = require("../auth");
let { OkResponse, BadRequestResponse } = require("express-http-response");
const { docType } = require("../../utilities/switch");

router.get("/get/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) return next(new OkResponse(""));
		let intake = await Consultation.findOne({ searcher: id });
		return next(new OkResponse(intake));
	} catch (error) {
		return next(new BadRequestResponse(null));
	}
});

router.post("/search/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) return next(new BadRequestResponse("No id provided"));
		let consultation = await Consultation.findOne({ searcher: id });
		const newObject = {
			question: req.body.question,
			answer: req.body.answer,
		};
		if (!consultation) {
			let newConsultation = new Consultation();
			newConsultation = docType(req.body.type, newConsultation, newObject);
			await newConsultation.save();
			lumedSocket.emit(`${req.user._id}-patient-record-changed`);
			return next(new OkResponse(newConsultation));
		} else {
			consultation = docType(req.body.type, consultation, newObject);
			await consultation.save();
			lumedSocket.emit(`${req.user._id}-patient-record-changed`);
			return next(new OkResponse(consultation));
		}
	} catch (error) {}
});
module.exports = router;
