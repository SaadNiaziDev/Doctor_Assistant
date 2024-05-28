const mongoose = require("mongoose");

const transcriptionSchema = new mongoose.Schema({
	audio: { type: String },
	soap: { type: String },
	transcription: [
		{
			Speaker: { type: String },
			text: { type: String },
			_id: false,
		},
	],
	searcher: { type: String, unique: true },
});

transcriptionSchema.methods.toJSON = function () {
	return {
		audio: this.audio,
		soap: this.soap,
		transcription: this.transcription,
	};
};

module.exports = mongoose.model("Transcription", transcriptionSchema);
