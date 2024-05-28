const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
	cardioSearch: [
		{
			question: { type: String },
			answer: { type: String },
			_id: false,
		},
	],
	neuroSearch: [
		{
			question: { type: String },
			answer: { type: String },
			_id: false,
		},
	],
	oncoSearch: [
		{
			question: { type: String },
			answer: { type: String },
			_id: false,
		},
	],
	endoSearch: [
		{
			question: { type: String },
			answer: { type: String },
			_id: false,
		},
	],
	immuSearch: [
		{
			question: { type: String },
			answer: { type: String },
			_id: false,
		},
	],
	nurseSearch: [
		{
			question: { type: String },
			answer: { type: String },
			_id: false,
		},
	],
	medgenSearch: [
		{
			question: { type: String },
			answer: { type: String },
			_id: false,
		},
	],
	gpSearch: [
		{
			question: { type: String },
			answer: { type: String },
			_id: false,
		},
	],
	searcher: { type: String, unique: true },
});

consultationSchema.methods.toJSON = function () {
	return {
		cardioSearch: this.cardioSearch,
		neuroSearch: this.neuroSearch,
		oncoSearch: this.oncoSearch,
		endoSearch: this.endoSearch,
		immuSearch: this.immuSearch,
		nurseSearch: this.nurseSearch,
		medgenSearch: this.medgenSearch,
		gpSearch: this.gpSearch,
	};
};

module.exports = mongoose.model("Consultation", consultationSchema);
