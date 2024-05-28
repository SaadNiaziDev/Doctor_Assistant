import { apiURL } from "../constants";

const saveTranscription = (Id, data) => {
	return fetch(apiURL + "/transcription/recording/" + Id, {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
			audio: data?.audio,
			transcription: data?.transcription,
		}),
	}).then((result) => result.json());
};

const regenerateSOAP = (token, ID, msg, instruction) => {
	return fetch(apiURL + "/transcription/generateSoap/" + ID, {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
		method: "POST",
		body: JSON.stringify({
			msg: msg,
			instruction: instruction,
		}),
	}).then((response) => response.json());
};

const TranscriptionService = {
	saveTranscription,
	regenerateSOAP,
};

export default TranscriptionService;
