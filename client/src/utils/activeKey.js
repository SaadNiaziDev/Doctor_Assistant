import React from "react";

export const activeKey = (type, question, consult, setConsultation, handleAccordionChange) => {
	switch (type) {
		case "cardio":
			consult.cardioSearch.push({
				question: question,
				anwser: "", // Corrected the typo here
			});
			handleAccordionChange("4");
			break;
		case "neuro":
			consult.neuroSearch.push({
				question: question,
				anwser: "", // Corrected the typo here
			});
			handleAccordionChange("5");
			break;
		case "onco":
			consult.oncoSearch.push({
				question: question,
				anwser: "", // Corrected the typo here
			});
			handleAccordionChange("6");
			break;
		case "endo":
			consult.endoSearch.push({
				question: question,
				anwser: "", // Corrected the typo here
			});
			handleAccordionChange("7");
			break;
		case "immu":
			consult.immuSearch.push({
				question: question,
				anwser: "", // Corrected the typo here
			});
			handleAccordionChange("8");
			break;
		case "nurse":
			consult.nurseSearch.push({
				question: question,
				anwser: "", // Corrected the typo here
			});
			handleAccordionChange("9");
			break;
		case "medgen":
			consult.medgenSearch.push({
				question: question,
				anwser: "", // Corrected the typo here
			});
			handleAccordionChange("10");
			break;
		case "gp":
			consult.gpSearch.push({
				question: question,
				anwser: "", // Corrected the typo here
			});
			handleAccordionChange("11");
			break;
		default:
			break;
	}

	setConsultation(consult);
};
