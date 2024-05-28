const soap = `SOAP Note Request Template
<b><strong>Patient Information:</strong></b>
- <b>Patient Name:</b> [patient name]
- <b>Date of Encounter:</b> [Convert this timestamp to a suitable date format. ${Date.now()}]

<b><strong>Subjective:</strong></b>
- <b>Chief Complaint:</b> [Describe the main reason for the patient's visit or what they are complaining about]
- <b>History of Present Illness:</b> [Provide a brief narrative of the patient's current health issue, including when it started, its progression, and any relevant details. Include information on symptoms, their severity, and any factors that exacerbate or alleviate them.]

<b><strong>Objective:</strong></b>
- <b>Vital Signs:</b> [Include measurements such as blood pressure, heart rate, respiratory rate, temperature]
- <b>Physical Examination Findings:</b> [Summarize the results of the physical examination, including any notable observations, such as appearance, vital signs, general physical condition, and specific findings related to the chief complaint.]

<b><strong>Assessment:</strong></b>
- <b>Diagnosis:</b> [Based on the information provided, offer a preliminary diagnosis or differential diagnoses if appropriate.]
- <b>Current Medications:</b> [List any medications the patient is currently taking, including dosages and frequency.]

<b><strong>Plan:</strong></b>
- <b>Treatment Plan:</b> [Outline the recommended treatment plan, including any medications, therapies, or procedures. Specify dosages, frequencies, and duration if applicable.]
- <b>Follow-up:</b> [Indicate any follow-up appointments or tests that are scheduled.]
- <b>Patient Education:</b> [Briefly describe any instructions given to the patient regarding their condition, treatment, or self-care.]

<b>Additional Notes or Comments:</b> [Include any additional information or comments that may be relevant to the patient's care.]`;

const hl7 = `{
	resourceType: "Composition",
	id: "[Unique ID for this patient.]",
	status: "final",
	type: {
		coding: [
			{
				system: "http://loinc.org",
                code: "60591-5",
				display: "[Provide Patient Summary Note here]",
			},
		],
	},
	subject: {
		reference: "[Place patient ID here]",
	},
	date: "${new Date().toLocaleString()}",
	author: [
		{
			reference: "[Doctor's Name here. If not available, the use doctor's ID]",
		},
	],
	title: "Clinical Report",
	section: [
		{
			title: "Subjective",
            text:
            {
                status: "generated",
                div: "[provide required data in form of div tags here]"
            }
		},
		{
			title: "Objective",
            text: 
            {
                status: "generated",
                div: "[provide required data in form of div tags here]"
            }
		},
		{
			title: "Assessment",
            text:
            {
                status: "generated",
                div: "[provide required data in form of div tags here]"
            }
		},
		{
			title: "Plan",
            text:
            {
                status: "generated",
                div: "[provide required data in form of div tags here]"
            }
		},
	],
}`;

// const emailTemplate = (soap) => `Given the SOAP note, write a Clinical Encounter Summary Email in easy-to-read
// language for the patient in below format.

// SOAP Note: ${soap}

// Email Format:
// “Dear [Patient Name],

// - <b>Date of Encounter:</b> [Date]
// - <b>Clinician:</b> [Name and Title]
// - <b>Location:</b> [Clinic/Hospital Name and Department]

// - <b>Presenting Issue(s):</b> [Brief description of the patient's primary concern or reason
// for the visit.]
// <i>Physical Examination:</i>
// - <b>Vital Signs:</b> [Blood pressure, pulse, temperature, respiratory rate, and oxygen
// saturation.]
// - <b>General Appearance:</b> [Observations about the patient's overall appearance, level
// of distress, etc.]
// - <b>Systematic Examination:</b> [Findings from the head-to-toe examination, organized
// by body system.]
// <i>Investigations:</i>
// -[Details about any diagnostic tests ordered or reviewed, such as labs, imaging, etc.]
// <i>Assessment:</i>
// - <b>Diagnosis:</b> [Including the primary diagnosis and any secondary diagnoses.]
// - <b>Differential Diagnosis:</b> [Other possible diagnoses considered.]
// <i>Plan:</i>
// - <b>Management Plan:</b> [Detailed strategy for managing the patient's condition,
// including any prescribed medications, therapies, or interventions.]
// Follow-up:</b> [Instructions for follow-up care, additional tests, or return visits.]
// <i>Provider's Notes:</i>
// -[Any additional notes or considerations regarding the encounter.]
// <i>Patient Education and Understanding:</i>
// -[Brief summary of the information given to the patient, including their understanding
// and any questions.]”`;

const emailTemplate = (
	soap,
	doctor
) => `Given the SOAP note and doctor details, write a Clinical Encounter Summary Email in easy-to-read
language for the patient in below format. Leave the feild if data is not available.

SOAP Note: ${soap}
Doctor : ${doctor}

  Dear <strong>[Patient Name]</strong>,
  During your recent visit, we discussed your health and I wanted to provide you with a summary of our encounter:
  <ul>
    <li><strong>Date of Encounter:</strong> [Date]</li>
    <li><strong>Clinician:</strong> [Name and Title]</li>
    <li><strong>Location:</strong> [Clinic/Hospital Name and Department]</li>
  </ul>
  Here's what we covered:
  <ul>
    <li><strong>Presenting Issue(s):</strong> You came in with [Brief description of your primary concern or reason for the visit.]</li>
  </ul>
  <strong>Physical Examination:</strong>
  <ul>
    <li><strong>Vital Signs:</strong> Blood pressure, pulse, temperature, respiratory rate, and oxygen saturation.</li>
    <li><strong>General Appearance:</strong> We observed your overall appearance and any signs of distress.</li>
    <li><strong>Systematic Examination:</strong> We examined you from head to toe, looking at different parts of your body.</li>
  </ul>
  <strong>Investigations:</strong>
  <ul>
    <li>[Details about any diagnostic tests such as labs or imaging.]</li>
  </ul>
  <strong>Assessment:</strong>
  <ul>
    <li><strong>Diagnosis:</strong> Your primary diagnosis is [Include the primary diagnosis].</li>
    <li><strong>Differential Diagnosis:</strong> We also considered [Any secondary diagnoses or other possibilities].</li>
  </ul>
  <strong>Plan:</strong>
  <ul>
    <li><strong>Management Plan:</strong> We've outlined a detailed strategy, which may include medications, therapies, or other interventions.</li>
    <li><strong>Follow-up:</strong> Please follow these instructions for any follow-up care, additional tests, or return visits.</li>
  </ul>
  <strong>Provider's Notes:</strong>
  <ul>
    <li>[Any additional information or insights from our discussion.]</li>
  </ul>
  <strong>Patient Education and Understanding:</strong>
  <ul>
    <li>[Briefly summarize the information shared during our visit and any questions you may have.]</li>
  </ul>
  If you have any further questions or concerns, please don't hesitate to reach out. Your health and well-being are our top priorities.
  
  Sincerely,
  <strong>[Your Clinician's Name]</strong>
  <em>[Your Clinician's Title]</em>
  `;

const insuranceTemplate = (
	soap
) => `Based on SOAP Note provided draft a Prior Authorization Request to the insurance company. Fill only the details provided, whenever the detail isn’t provided, leave the field blank. Strictly follow provided format.

SOAP Note: ${soap}
Prior Authorization Format:

<i>Provider Information:</i>

- <b>Name:</b> [Provider Full Name]
- <b>Title:</b> [Provider Title]
- <b>NPI Number:</b> [National Provider Identifier]
- <b>Contact Information:</b> [Phone, Email]
<i>Patient Information:</i>
- <b>Name:</b> [Patient Full Name]
- <b>DOB:</b> [Date of Birth]
- <b>Insurance ID:</b> [Insurance Identification Number]
- <b>Contact Information:</b> [Patient Phone, Email]
<i>Encounter Summary:</i>
- <b>Date:</b> [Date of Encounter]
- <b>Location:</b> [Location of Service]
- <b>Primary Diagnosis:</b> [ICD-10 Code and Description]
- <b>Secondary Diagnosis:</b> [ICD-10 Code and Description, if applicable]
<i>Medication/Treatment Requiring Authorization:</i>
- <b>Name:</b> [Name of Medication/Treatment]
- <b>Dosage/Form:</b> [Dosage and Formulation Details]
- <b>Duration:</b> [Expected Duration of Treatment]
- <b>ICD-10 Code:</b> [Corresponding ICD-10 Code]
<i>Clinical Rationale:</i>
1. <b>Subjective:</b> [Summarize the patient's reported symptoms, pain levels, and
experiences that substantiate the need for the proposed treatment. Include any
relevant history.]
2. <b>Objective:</b> [Summarize objective clinical findings, including vital signs, lab results,
and physical exam findings that validate the necessity of the proposed treatment.]
3. <b>Assessment:</b> [Summarize the healthcare provider’s clinical judgment about the
patient’s condition and the need for the proposed treatment.]
4. <b>Plan:</b> [Summarize the proposed treatment plan and explain why alternative
treatments are not appropriate. Describe the expected benefits of the proposed
Extra Options Prompts 4
treatment.]
<i>Documentation and Supporting Materials:</i>
-[Include or attach any relevant documentation, like lab results, imaging studies, and
previous treatment records, that support the necessity of the requested treatment.]
<i>Provider Attestation:</i>
-[Include a statement affirming the accuracy and truthfulness of the provided
information, as well as compliance with relevant legal and ethical guidelines.]`;

const aiTemplate = (
	soap,
	transciption
) => `Given the SOAP note and the transcription of the clinical encounter,Please provide
feedback to the clinician. Example provided at the end.
Fill only the details provided, whenever the detail isn’t provided, leave the field blank

SOAP Note: ${soap}
Transcription Summary: ${transciption}
Please provide feedback on the following aspects in format give below.:
<b>1. Completeness of Documentation:</b>
-<i>Subjective:</i> [Are the patient's complaints and history documented thoroughly?]
-<i>Objective:</i> [Are all relevant objective findings from the physical examination and
investigations noted?]
-<i>Assessment:</i> [Is the diagnosis and differential diagnosis clearly stated?]
-<i>Plan:</i> [Are the management plan and follow-up instructions documented in a
detailed manner?]
<b>2. Clarity and Organization:</b>
-[Are the notes clear, concise, and easy to comprehend for other healthcare
providers?]
-[Is the information logically organized and easy to follow?]
<b>3. Relevance and Pertinence:</b>
-[Is all documented information relevant and pertinent to the current clinical
scenario?]
-[Are there any unnecessary details, or is any crucial information omitted?]
<b>4. Patient-Centered Care and Shared Decision-Making:</b>
-[Is there evidence of shared decision-making and patient involvement in the care
process documented?]
<b>5. Clinical Reasoning and Justification:</b>
-[Is the clinical reasoning and justification for the chosen management plan clear
and sound?]
-[Are the relevant guidelines or protocols being followed and documented?]
<b>6. Legal and Ethical Compliance:</b>
-[Is there adherence to legal and ethical guidelines, including patient
confidentiality and informed consent?]
<b>7. Patient Education and Communication:</b>
-[Is patient education, understanding, and communication documented
adequately?]

Based on the above aspects, please provide specific feedback points, considering both
strengths and areas for improvement in the documentation.

Example Feedback:
[Strengths:]
-The Subjective section thoroughly documents the patient’s complaints, including the
onset and progression of symptoms.
-The Assessment section provides a clear diagnosis based on the presented
symptoms and examination findings.
Extra Options Prompts 6
[Areas for Improvement:]
-Consider providing more detail in the Plan section about the rationale behind
choosing specific treatments or interventions.
-Ensure all prescribed medications are documented with dosage, route, and frequency in the Plan section.`;

module.exports = {
	soap,
	hl7,
	emailTemplate,
	insuranceTemplate,
	aiTemplate,
};
