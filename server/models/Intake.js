const mongoose = require("mongoose");

const intakeFormSchema = new mongoose.Schema({
	intake: [{}],
	intakeSummary: { type: String, default: "" },
	searcher: { type: String, unique: true },
});

intakeFormSchema.methods.toJSON = function () {
	return {
		intake: this.intake,
		intakeSummary: this.intakeSummary,
	};
};

module.exports = mongoose.model("Intake", intakeFormSchema);
