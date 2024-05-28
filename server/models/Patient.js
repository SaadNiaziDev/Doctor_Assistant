const mongoose = require("mongoose");
const uuidv4 = require("uuid");

const patientSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		patientID: { type: String },
		medicalHistory: { type: String, default: "" },
		portait: { type: String, default: "" },
		additionalNotes: { type: String, default: "" },
		doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

patientSchema.methods.generatePatientID = function () {
	let a = uuidv4.v4();
	this.patientID = a;
};

patientSchema.pre("validate", function (next) {
	if (!this.patientID) {
		this.generatePatientID();
	}
	next();
});

patientSchema.methods.toDateJSON = function () {
	return {
		name: this.name,
		patientID: this.patientID,
		medicalHistory: this.medicalHistory,
		portait: this.portait,
		additionalNotes: this.additionalNotes,
	};
};

module.exports = mongoose.model("Patient", patientSchema);
