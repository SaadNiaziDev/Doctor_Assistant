const mongoose = require("mongoose");

const DrugSearchSchema = new mongoose.Schema({
	drugSearch: [
		{
			question: { type: String },
			answer: { type: String },
			_id: false,
		},
	],
	labAnalyzerReport: [
		{
			question: { type: String },
			answer: { type: String },
			_id: false,
		},
	],
	searcher: { type: String, unique: true },
});

DrugSearchSchema.methods.toJSON = function () {
	return {
		drugSearch: this.drugSearch,
		labAnalyzerReport: this.labAnalyzerReport,
	};
};

module.exports = mongoose.model("DrugSearch", DrugSearchSchema);
