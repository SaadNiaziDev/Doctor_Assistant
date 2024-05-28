import { apiURL } from "../constants";

const addPatient = (token, name) => {
	return fetch(apiURL + "/patient/addPatient", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
		body: JSON.stringify({ name: name }),
	}).then((response) => response.json());
};

const removePatient = (token, id) => {
	return fetch(apiURL + "/patient/delete/" + id, {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
	}).then((response) => response.json());
};

const updatePatient = (token, id, body) => {
	return fetch(apiURL + "/patient/updateRecord/" + id, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
		body: JSON.stringify(body),
	}).then((response) => response.json());
};

const redo = (token, id) => {
	return fetch(apiURL + "/patient/redo/" + id, {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		},
	}).then((response) => response.json());
};

const PatientService = {
	addPatient,
	removePatient,
	updatePatient,
	redo,
};

export default PatientService;
