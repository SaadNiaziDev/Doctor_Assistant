import { apiURL } from "../constants";

const consultAI = (token, Id, question, type, answer) => {
	return fetch(apiURL + "/consultation/search/" + Id, {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
		method: "POST",
		body: JSON.stringify({
			type: type,
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

const ConsultService = {
	consultAI,
};

export default ConsultService;
