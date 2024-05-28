const mongoose = require("mongoose");

const askGptSchema = new mongoose.Schema({
	hl7: {
		type: String,
		default: "",
	},
	prescription: {
		type: String,
		default: "",
	},
	email: {
		type: String,
		default: "",
	},
	insurance: {
		type: String,
		default: "",
	},
	ai: {
		type: String,
		default: "",
	},
	custom: [
		{
			question: { type: String },
			answer: { type: String },
			_id: false,
		},
	],
	searcher: { type: String, unique: true },
});

askGptSchema.methods.toJSON = function () {
	return {
		hl7: this.hl7,
		prescription: this.prescription,
		email: this.email,
		insurance: this.insurance,
		ai: this.ai,
		custom: this.custom,
	};
};

module.exports = mongoose.model("GPTService", askGptSchema);
