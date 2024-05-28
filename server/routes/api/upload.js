const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const multer = require("../../utilities/multer");
const { OkResponse, BadRequestResponse } = require("express-http-response");
const Ffmpeg = require("fluent-ffmpeg");
const FormData = require("form-data");
const { default: fetch } = require("node-fetch");
const { Deepgram } = require("@deepgram/sdk");
const backend = require("../../config/env/development").backend;
const cpUpload = multer.fields([{ name: "file", maxCount: 1 }]);
const deepgramApiKey = "c4701306de569c5acec4f144f8bf1ea4feeadcdf";
const basePath = path.join(process.cwd(), "server/public", "uploads");
const axios = require("axios");

router.post("/", cpUpload, async (req, res, next) => {
	try {
		let name = req.files["file"][0].filename.split(".")[0];
		const inputFile = `${backend}/uploads/${req.files["file"][0].filename}`; // Update with the actual path
		const outputFile = path.join(process.cwd(), "server/public", "uploads/mp3-") + `${name}.mp3`; // Update with the desired output path
		fs.writeFile(outputFile, "", (err) => {
			if (err) console.log(err);
		});
		Ffmpeg()
			.input(inputFile)
			.outputOptions("-c:v", "copy") // Copy video codec
			.audioCodec("libmp3lame") // Set audio codec to libmp3lame (MP3)
			.output(outputFile)
			.on("end", () => {
				fs.unlink(
					path.join(process.cwd(), "server/public", "uploads/") + `${req.files["file"][0].filename}`,
					async (err) => {
						if (err) console.log(err);
						const file = fs.createReadStream(outputFile);
						const formData = new FormData();
						formData.append("audio", file, {
							contentType: "audio/mpeg",
						});
						const response = await fetch("http://94.155.194.99:40155/diarize", {
							method: "POST",
							body: formData,
							headers: formData.getHeaders(),
						});
						const responseData = await response.json();
						responseData.data = responseData.data.replace("\n\n", "");
						return next(
							new OkResponse({ transcription: responseData?.data, audio: `${backend}/uploads/mp3-${name}.mp3` })
						);
					}
				);
			})
			.on("error", (err) => {
				console.error("Error:", err);
				throw new Error(err);
			})
			.run();
	} catch (error) {
		return next(new BadRequestResponse(error));
	}
});

router.post("/image", cpUpload, async (req, res, next) => {
	return next(new OkResponse({ url: `${backend}/uploads/${req.files["file"][0].filename}` }));
});

router.post("/delete", function (req, res, next) {
	if (req.body.url) {
		fs.unlink(path.join(process.cwd(), "server/public", req.body.url), function (err) {
			if (err) {
				return res.sendStatus(204);
			}
			return res.json({ status: 200, event: "File deleted Successfully" });
		});
	} else {
		if (!event) return res.sendStatus(204);
	}
});

// router.post("/deepgram", cpUpload, async (req, res, next) => {
// 	try {
// 		const deepgram = new Deepgram(deepgramApiKey);
// 		const audio = fs.readFileSync(basePath + `/${req.files["file"][0].filename}`);

// 		source = {
// 			buffer: audio,
// 			mimetype: "audio/mp3",
// 		};

// 		deepgram.transcription
// 			.preRecorded(source, {
// 				diarize: true,
// 				smart_format: true,
// 				model: "conversationalai",
// 			})
// 			.then((data) => {
// 				return next(
// 					new OkResponse({
// 						transcription: data.results.channels[0].alternatives[0].paragraphs.transcript,
// 						audio: `${backend}/uploads/` + `${req.files["file"][0].filename}`,
// 					})
// 				);
// 			})
// 			.catch((err) => {
// 				console.log(err);
// 				throw new Error(err);
// 			});
// 	} catch (error) {
// 		return res.json(error).sendStatus(404);
// 	}
// });

router.post("/assemble", cpUpload, async (req, res, next) => {
	try {
		const baseUrl = "https://api.assemblyai.com/v2";

		const headers = {
			authorization: "5b6716f5031d4e9ba4025ae08357726a",
			"Content-Type": "application/json",
		};

		const audioData = fs.readFileSync(basePath + `/${req.files["file"][0].filename}`);

		const uploadResponse = await axios.post(`${baseUrl}/upload`, audioData, {
			headers,
		});
		const uploadUrl = uploadResponse.data.upload_url;

		const data = {
			audio_url: uploadUrl,
			speaker_labels: true,
		};

		const url = `${baseUrl}/transcript`;
		const response = await axios.post(url, data, { headers: headers });

		const transcriptId = response.data.id;
		const pollingEndpoint = `${baseUrl}/transcript/${transcriptId}`;

		while (true) {
			const pollingResponse = await axios.get(pollingEndpoint, {
				headers: headers,
			});
			const transcriptionResult = pollingResponse.data;

			if (transcriptionResult.status === "completed") {
				const utterances = transcriptionResult.utterances;
				const transcriptionArray = [];

				for (const utterance of utterances) {
					const speaker = utterance.speaker;
					const text = utterance.text;
					const transcriptionObject = {
						Speaker: speaker,
						text: text,
					};
					transcriptionArray.push(transcriptionObject);
				}

				return next(
					new OkResponse({
						transcription: transcriptionArray,
						audio: `${backend}/uploads/` + `${req.files["file"][0].filename}`,
					})
				);

				break;
			} else if (transcriptionResult.status === "error") {
				throw new Error(`Transcription failed: ${transcriptionResult.error}`);
			} else {
				await new Promise((resolve) => setTimeout(resolve, 3000));
			}
		}
	} catch (error) {
		return res.json(error).sendStatus(404);
	}
});

module.exports = router;
