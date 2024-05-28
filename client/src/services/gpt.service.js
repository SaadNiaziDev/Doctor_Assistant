import { apiURL } from "../constants";

const createHL7 = (token, Id) => {
	return fetch(apiURL + "/gpt-service/hl7/" + Id, {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
	}).then((response) => response.json());
};

const createPrescription = (token, Id) => {
	return fetch(apiURL + "/gpt-service/prescription/" + Id, {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
	}).then((response) => response.json());
};

const generateFeedback = (token, Id, type) => {
	return fetch(apiURL + "/gpt-service/template/" + Id, {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
		method: "POST",
		body: JSON.stringify({
			type: type,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.status === 200) return data;
			else return null;
		});
};

const getPromptFeedback = (token, Id, prompt) => {
	return fetch(apiURL + "/gpt-service/custom-prompt/" + Id, {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
		method: "POST",
		body: JSON.stringify({
			prompt: prompt,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.status === 200) return data;
			else return null;
		});
};

// const saveFeedBack = (token, Id, data) => {
// 	return fetch(apiURL + "/user/feedback/" + Id, {
// 		headers: {
// 			"Content-Type": "application/json",
// 			Authorization: "Bearer " + token,
// 		},
// 		method: "POST",
// 		body: JSON.stringify({
// 			feedback: data,
// 		}),
// 	}).then((result) => result.json());
// };

const GPTService = {
	createHL7,
	createPrescription,
	generateFeedback,
	getPromptFeedback,
};

export default GPTService;
