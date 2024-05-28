const router = require("express").Router();
let mongoose = require("mongoose");
const auth = require("../auth");
let { OkResponse, BadRequestResponse } = require("express-http-response");
const Patient = mongoose.model("Patient");
const moment = require("moment");

router.get("/get-all", auth.isToken, async (req, res, next) => {
	try {
		const allPatients = await Patient.find({ doctor: req.user._id }).sort({ createdAt: -1 });

		const recordsByDate = {};
		allPatients.forEach((patient) => {
			const createdAt = moment(patient.createdAt);
			const now = moment();

			let key;
			if (createdAt.isSame(now, "day")) {
				key = "Today";
			} else if (createdAt.isSame(now.clone().subtract(1, "day"), "day")) {
				key = "Yesterday";
			} else {
				key = createdAt.format("D MMM");
			}

			if (!recordsByDate.hasOwnProperty(key)) {
				recordsByDate[key] = [];
			}

			recordsByDate[key].push(patient);
		});

		const groupedRecords = Object.entries(recordsByDate).map(([key, patients]) => ({
			date: key,
			patients,
		}));

		return next(new OkResponse(groupedRecords));
	} catch (error) {
		return next(new BadRequestResponse(error));
	}
});

router.post("/addPatient", auth.isToken, async (req, res, next) => {
	try {
		const { name } = req.body;
		let patient = await Patient.create({
			name: name,
			doctor: req.user.id,
		});
		lumedSocket.emit(`${req.user._id}-patient-record-changed`);
		next(new OkResponse(patient));
	} catch (error) {
		next(new BadRequestResponse(error));
	}
});

router.get("/getPatient/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) throw new Error("Invalid Patient ID");
		let foundPatient = await Patient.findOne({ patientID: id });
		if (foundPatient) return next(new OkResponse(foundPatient.toDateJSON()));
		throw new Error("Patient record not found!");
	} catch (error) {
		next(new BadRequestResponse(error));
	}
});

router.post("/updateRecord/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) return next(new BadRequestResponse("Invalid Patient ID"));
		let updateRecord = await Patient.findOneAndUpdate({ patientID: id }, req.body, { new: true });
		if (updateRecord) {
			lumedSocket.emit(`${req.user._id}-patient-record-changed`);
			return next(new OkResponse(updateRecord));
		}
		throw new Error("Patient record was not updated!");
	} catch (error) {
		return next(new BadRequestResponse(error));
	}
});

router.get("/delete/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) throw new Error("No id provided");
		Patient.findOneAndRemove({ patientID: id })
			.then((result) => {
				if (result) {
					lumedSocket.emit(`${req.user._id}-patient-record-changed`);
					return next(new OkResponse("Deleted"));
				}
			})
			.catch((err) => new Error(err));
	} catch (error) {
		return next(new BadRequestResponse(error));
	}
});

router.get("/redo/:id", auth.isToken, async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) throw new Error("No id provided");
		const patientFound = await Patient.findOne({ patientID: id });
		if (!patientFound) throw new Error("Record Not Found");

		patientFound.medicalHistory = "";
		patientFound.portait = "";
		patientFound.additionalNotes = "";

		patientFound
			.save()
			.then((data) => {
				lumedSocket.emit(`${req.user.id}-patient-record-changed`);
				return next(new OkResponse(data));
			})
			.catch((err) => new Error("Fail to redo operation"));
	} catch (error) {
		return next(new BadRequestResponse(error));
	}
});

module.exports = router;
