let router = require("express").Router();
let mongoose = require("mongoose");
let DrugSearch = mongoose.model("DrugSearch");
const auth = require("../auth");
let { OkResponse, BadRequestResponse } = require("express-http-response");

router.get("/get/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) return next(new OkResponse(""));
		let dSearch = await DrugSearch.findOne({ searcher: id });
		return next(new OkResponse(dSearch));
	} catch (error) {
		return next(new BadRequestResponse(null));
	}
});

router.post("/sds/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) throw new Error("No id provided");
		let foundSearch = await DrugSearch.findOne({ searcher: id });
		if (!foundSearch) {
			let newDrugSearch = await DrugSearch.create({
				drugSearch: [
					{
						question: req.body.question,
						answer: req.body.answer,
					},
				],
				labAnalyzerReport: [],
				searcher: id,
			});
			lumedSocket.emit(`${req.user._id}-patient-record-changed`);
			return next(new OkResponse(newDrugSearch));
		} else {
			foundSearch.drugSearch.push({
				question: req.body.question,
				answer: req.body.answer,
			});
			await foundSearch.save();
			lumedSocket.emit(`${req.user._id}-patient-record-changed`);
			return next(new OkResponse(foundSearch));
		}
	} catch (error) {
		return next(new BadRequestResponse(error));
	}
});

router.post("/lab-report/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) throw new Error("No id provided");
		let foundSearch = await DrugSearch.findOne({ searcher: id });
		if (!foundSearch) {
			let newDrugSearch = await DrugSearch.create({
				drugSearch: [],
				labAnalyzerReport: [
					{
						question: req.body.question,
						answer: req.body.answer,
					},
				],
				searcher: id,
			});
			lumedSocket.emit(`${req.user._id}-patient-record-changed`);
			return next(new OkResponse(newDrugSearch));
		} else {
			foundSearch.labAnalyzerReport.push({
				question: req.body.question,
				answer: req.body.answer,
			});
			await foundSearch.save();
			lumedSocket.emit(`${req.user._id}-patient-record-changed`);
			return next(new OkResponse(foundSearch));
		}
	} catch (error) {
		return next(new BadRequestResponse(error));
	}
});
module.exports = router;
