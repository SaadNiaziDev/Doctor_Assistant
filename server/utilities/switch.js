const { emailTemplate, insuranceTemplate, aiTemplate } = require("./gptTemplates");

const docType = (type, consult, obj) => {
	if (type === "cardio") {
		consult.cardioSearch.push(obj);
	} else if (type === "neuro") {
		consult.neuroSearch.push(obj);
	} else if (type === "onco") {
		consult.oncoSearch.push(obj);
	} else if (type === "endo") {
		consult.endoSearch.push(obj);
	} else if (type === "immu") {
		consult.immuSearch.push(obj);
	} else if (type === "nurse") {
		consult.nurseSearch.push(obj);
	} else if (type === "medgen") {
		consult.medgenSearch.push(obj);
	} else if (type === "gp") {
		consult.gpSearch.push(obj);
	}
	return consult;
};

const getChatHistory = (type, data) => {
	try {
		if (type === "sds") {
			return data.drugSearch;
		} else if (type === "cardio") {
			return data.consult.cardioSearch;
		} else if (type === "neuro") {
			return data.consult.neuroSearch;
		} else if (type === "onco") {
			return data.consult.oncoSearch;
		} else if (type === "endo") {
			return data.consult.endoSearch;
		} else if (type === "immu") {
			return data.consult.immuSearch;
		} else if (type === "nurse") {
			return data.consult.nurseSearch;
		} else if (type === "medgen") {
			return data.consult.medgenSearch;
		} else if (type === "ta") {
			return data.labAnalyzerReport;
		} else if (type === "gp") {
			return data.consult.gpSearch;
		}
	} catch (error) {
		return [];
	}
};

const getAiObj = (type, data, value) => {
	if (type === "email") {
		data.email = value;
	} else if (type === "insurance") {
		data.insurance = value;
	} else if (type === "ai") {
		data.ai = value;
	}
	return data;
};

const getTemplete = (type, data, doctor) => {
	if (type === "email") return emailTemplate(data?.soap, doctor);
	else if (type === "insurance") return insuranceTemplate(data?.soap);
	else if (type === "ai") return aiTemplate(data?.soap, data?.transcription);
	else return new Error("Provide a prompt!");
};

module.exports = {
	getAiObj,
	docType,
	getChatHistory,
	getTemplete,
};
