import { apiURL } from "../constants";

const uploadFile = (formData) => {
	return fetch(apiURL + "/upload/assemble", {
		method: "POST",
		body: formData,
	}).then((res) => res.json());
};

const UploadService = {
	uploadFile,
};

export default UploadService;
