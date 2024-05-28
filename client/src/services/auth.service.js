import { apiURL } from "../constants";

const login = (body) => {
	return fetch(apiURL + "/user/login", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(body),
	}).then((res) => res.json());
};

const AuthService = {
	login,
};

export default AuthService;
