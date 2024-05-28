import { apiURL } from "../constants";

const drugSearch = (key, type, question, chatHistory) => {
	return fetch("https://api.lumed.ai/bot/drug-search", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
			key: key,
			type: type,
			question: question,
			chat_history: chatHistory,
		}),
	}).then((res) => res.json());
};

const saveDrugSearch = (token, Id, question, answer) => {
	return fetch(apiURL + "/drugSearch/sds/" + Id, {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
		method: "POST",
		body: JSON.stringify({
			question: question,
			answer: answer,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.status === 200) return data;
			else return null;
		});
};

const generateLabReport = (token, Id, question, answer) => {
	return fetch(apiURL + "/drugSearch/lab-report/" + Id, {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
		method: "POST",
		body: JSON.stringify({
			question: question,
			answer: answer,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.status === 200) return data;
			else return null;
		});
};

const DrugService = {
	drugSearch,
	saveDrugSearch,
	generateLabReport,
};

export default DrugService;
