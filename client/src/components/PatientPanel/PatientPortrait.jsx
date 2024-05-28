import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";

export const PatientPortrait = ( { patient } ) => {
  const [ show, setShow ] = useState();
  const [ showAcc, setShowAcc ] = useState( {
    basicInfo: false,
    appointmentHistory: false,
    medicationHistory: false,
    medicalHistory: false,
    socialHistory: false,
    LatestExams: false,
    other: false,
  } );

  const handleShow = () => {
    setShow( true );
  };

  const handleClose = () => {
    setShow( false );
  };

  useEffect( () => {
    return () => handleClose();
  }, [] );
  return (
    <Accordion defaultActiveKey="0" className="lumed-accordion portrait-accordion potrait-scroll">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Patient Portrait</Accordion.Header>
        <Accordion.Body className="p-0">
          <div className="padding-box pb-3">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="fs-16 fw-500 text-grey">Basic Information</div>
              {!showAcc?.basicInfo && (
                <a href="javascript:void(0)" className="fs-12 fw-400 text-gradient" onClick={() => setShowAcc( { ...showAcc, basicInfo: true } )}>
                  View Details
                </a>
              )}
              {showAcc?.basicInfo && (
                <a href="javascript:void(0)" className="fs-12 fw-400 text-gradient" onClick={() => setShowAcc( { ...showAcc, basicInfo: false } )}>
                  View Less
                </a>
              )}
            </div>
            {showAcc.basicInfo == false && (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="fs-14 fw-400 text-grey">Name</th>
                      <th className="fs-14 fw-400 text-grey">Age</th>
                      <th className="fs-14 fw-400 text-grey">Gender</th>
                      <th className="fs-14 fw-400 text-grey">Date of Birth</th>
                      <th className="fs-14 fw-400 text-grey">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fs-14 fw-500 text-grey">Andy Robertson</td>
                      <td className="fs-14 fw-500 text-grey">33 years old</td>
                      <td className="fs-14 fw-500 text-grey">Male</td>
                      <td className="fs-14 fw-500 text-grey">May 24, 1980</td>
                      <td className="fs-14 fw-500 text-grey">158 lb</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {showAcc.basicInfo == true && (
              <>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Adam Smooth | June 17, 2023 | Endocrinologist</span> | Key Notes: Regular checkup for Type 2 Diabetes, decided to continue with current Metformin
                  dosage as blood glucose levels were within the target range.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Nick Jones | June 9, 2023 | General Practitioner</span> | Key Notes: Routine follow-up, adjusted hypertension medication due to slightly elevated blood
                  pressure.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Rita Aurelio | June 2, 2023 | Psychiatrist</span> | Key Notes: Follow-up for anxiety and panic attacks, no changes in frequency or intensity, decided
                  to continue with cognitive behavioral therapy.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Adam Smooth | May 18, 2023 | Endocrinologist </span> | Key Notes: Regular diabetes check-up, adjustment in Metformin dosage due to elevated HbA1c
                  levels.
                </div>
                <div className="fs-14 fw-400 text-grey">
                  <span className="fw-700">Dr. Nick Jones | April 20, 2023 | General Practitioner</span> | Key Notes: Flu vaccine administered, routine physical examination conducted, blood pressure
                  within acceptable range.
                </div>
              </>
            )}
          </div>
          <div className="drop-panel"></div>
          <div className="padding-box pb-3">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="fs-16 fw-500 text-grey">Appointment History</div>
              {!showAcc?.appointmentHistory && (
                <a href="javascript:void(0)" className="fs-12 fw-400 text-gradient" onClick={() => setShowAcc( { ...showAcc, appointmentHistory: true } )}>
                  View Details
                </a>
              )}
              {showAcc?.appointmentHistory && (
                <a href="javascript:void(0)" className="fs-12 fw-400 text-gradient" onClick={() => setShowAcc( { ...showAcc, appointmentHistory: false } )}>
                  View Less
                </a>
              )}
            </div>
            {showAcc.appointmentHistory == false && (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="fs-14 fw-500 text-grey">Doctor Name</th>
                      <th className="fs-14 fw-500 text-grey">Date</th>
                      <th className="fs-14 fw-500 text-grey">Examination Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fs-14 fw-400 text-grey">Dr. Adam Smooth</td>
                      <td className="fs-14 fw-400 text-grey">May 24, 2023</td>
                      <td className="fs-14 fw-400 text-grey">Cardiologist</td>
                    </tr>
                    <tr>
                      <td className="fs-14 fw-400 text-grey">Dr. John Stone</td>
                      <td className="fs-14 fw-400 text-grey">Jun 01, 2023</td>
                      <td className="fs-14 fw-400 text-grey">Psychiatrist</td>
                    </tr>
                    <tr>
                      <td className="fs-14 fw-400 text-grey">Dr. Nick Jones</td>
                      <td className="fs-14 fw-400 text-grey">Jun 08, 2023</td>
                      <td className="fs-14 fw-400 text-grey">General Practictioner</td>
                    </tr>
                    <tr>
                      <td className="fs-14 fw-400 text-grey">Dr. Rita Aurelio</td>
                      <td className="fs-14 fw-400 text-grey">Jun 17, 2023</td>
                      <td className="fs-14 fw-400 text-grey">Psychiatrist</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {showAcc.appointmentHistory == true && (
              <>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Adam Smooth | June 17, 2023 | Endocrinologist</span> | Key Notes: Regular checkup for Type 2 Diabetes, decided to continue with current Metformin
                  dosage as blood glucose levels were within the target range.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Nick Jones | June 9, 2023 | General Practitioner</span> | Key Notes: Routine follow-up, adjusted hypertension medication due to slightly elevated blood
                  pressure.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Rita Aurelio | June 2, 2023 | Psychiatrist</span> | Key Notes: Follow-up for anxiety and panic attacks, no changes in frequency or intensity, decided
                  to continue with cognitive behavioral therapy.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Adam Smooth | May 18, 2023 | Endocrinologist </span> | Key Notes: Regular diabetes check-up, adjustment in Metformin dosage due to elevated HbA1c
                  levels.
                </div>
                <div className="fs-14 fw-400 text-grey">
                  <span className="fw-700">Dr. Nick Jones | April 20, 2023 | General Practitioner</span> | Key Notes: Flu vaccine administered, routine physical examination conducted, blood pressure
                  within acceptable range.
                </div>
              </>
            )}
          </div>
          <div className="drop-panel"></div>
          <div className="padding-box pb-3">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="fs-16 fw-500 text-grey">Medication History</div>
              {!showAcc?.medicationHistory && (
                <a href="javascript:void(0)" className="fs-12 fw-400 text-gradient" onClick={() => setShowAcc( { ...showAcc, medicationHistory: true } )}>
                  View Details
                </a>
              )}
              {showAcc?.medicationHistory && (
                <a href="javascript:void(0)" className="fs-12 fw-400 text-gradient" onClick={() => setShowAcc( { ...showAcc, medicationHistory: false } )}>
                  View Less
                </a>
              )}
            </div>
            {showAcc.medicationHistory == false && (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="fs-14 fw-500 text-grey">Doctor Name</th>
                      <th className="fs-14 fw-500 text-grey">Last Prescribed</th>
                      <th className="fs-14 fw-500 text-grey">Medicine Name</th>
                      <th className="fs-14 fw-500 text-grey">Strength</th>
                      <th className="fs-14 fw-500 text-grey">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fs-14 fw-400 text-grey">Dr. Adam Smooth</td>
                      <td className="fs-14 fw-400 text-grey">May 24, 2023</td>
                      <td className="fs-14 fw-400 text-grey">Adderall</td>
                      <td className="fs-14 fw-400 text-grey">100 mg</td>
                      <td className="fs-14 fw-400 text-grey">1 tab</td>
                    </tr>
                    <tr>
                      <td className="fs-14 fw-400 text-grey">Dr. John Stone</td>
                      <td className="fs-14 fw-400 text-grey">Jun 01, 2023</td>
                      <td className="fs-14 fw-400 text-grey">Zolpidem</td>
                      <td className="fs-14 fw-400 text-grey">25 mg</td>
                      <td className="fs-14 fw-400 text-grey">3 tab</td>
                    </tr>
                    <tr>
                      <td className="fs-14 fw-400 text-grey">Dr. Nick Jones</td>
                      <td className="fs-14 fw-400 text-grey">Jun 08, 2023</td>
                      <td className="fs-14 fw-400 text-grey">Azithromycin</td>
                      <td className="fs-14 fw-400 text-grey">50 mg</td>
                      <td className="fs-14 fw-400 text-grey">1 tab</td>
                    </tr>
                    <tr>
                      <td className="fs-14 fw-400 text-grey">Dr. Rita Aurelio</td>
                      <td className="fs-14 fw-400 text-grey">Jun 17, 2023</td>
                      <td className="fs-14 fw-400 text-grey">Gilenya</td>
                      <td className="fs-14 fw-400 text-grey">150 mg</td>
                      <td className="fs-14 fw-400 text-grey">1 tab</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {showAcc.medicationHistory == true && (
              <>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Adam Smooth | June 17, 2023 | Endocrinologist</span> | Key Notes: Regular checkup for Type 2 Diabetes, decided to continue with current Metformin
                  dosage as blood glucose levels were within the target range.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Nick Jones | June 9, 2023 | General Practitioner</span> | Key Notes: Routine follow-up, adjusted hypertension medication due to slightly elevated blood
                  pressure.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Rita Aurelio | June 2, 2023 | Psychiatrist</span> | Key Notes: Follow-up for anxiety and panic attacks, no changes in frequency or intensity, decided
                  to continue with cognitive behavioral therapy.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Adam Smooth | May 18, 2023 | Endocrinologist </span> | Key Notes: Regular diabetes check-up, adjustment in Metformin dosage due to elevated HbA1c
                  levels.
                </div>
                <div className="fs-14 fw-400 text-grey">
                  <span className="fw-700">Dr. Nick Jones | April 20, 2023 | General Practitioner</span> | Key Notes: Flu vaccine administered, routine physical examination conducted, blood pressure
                  within acceptable range.
                </div>
              </>
            )}
          </div>
          <div className="drop-panel"></div>
          <div className="padding-box pb-3">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="fs-16 fw-500 text-grey">Medical History</div>
              {!showAcc?.medicalHistory && (
                <a href="javascript:void(0)" className="fs-12 fw-400 text-gradient" onClick={() => setShowAcc( { ...showAcc, medicalHistory: true } )}>
                  View Details
                </a>
              )}
              {showAcc?.medicalHistory && (
                <a href="javascript:void(0)" className="fs-12 fw-400 text-gradient" onClick={() => setShowAcc( { ...showAcc, medicalHistory: false } )}>
                  View Less
                </a>
              )}
            </div>
            {showAcc.medicalHistory == false && (
              <>
                <ul className="m-0 py-0 px-3">
                  <li className="fs-14 fw-400 text-grey">Type 2 Diabetes, diagnosed 2017, on Metformin.</li>
                  <li className="fs-14 fw-400 text-grey">CHypertension, diagnosed 2020, on Lisinopril.</li>
                  <li className="fs-14 fw-400 text-grey">Occasional Panic Attacks past 5 years, usually triggered by stress. Managed through lifestyle modifications and mindfulness techniques.</li>
                </ul>
                Allergies:
                <ul className="m-0 py-0 px-3">
                  <li className="fs-14 fw-400 text-grey">No known drug allergies.</li>
                </ul>
                Immunizations:
                <ul className="m-0 py-0 px-3">
                  <li className="fs-14 fw-400 text-grey">Up-to-date with all recommended adult vaccines including annual flu shots, pneumococcal vaccine, and shingles vaccine.</li>
                </ul>
                Previous Surgeries:
                <ul className="m-0 py-0 px-3">
                  <li className="fs-14 fw-400 text-grey">Underwent gallbladder removal (cholecystectomy) 7 years ago. Right knee arthroscopy 5 years ago due to a sports injury.</li>
                </ul>
                Hospitalizations:
                <ul className="m-0 py-0 px-3">
                  <li className="fs-14 fw-400 text-grey">Admitted for 3 days for the gallbladder surgery in March 2017.</li>
                </ul>
                Family History:
                <ul className="m-0 py-0 px-3">
                  <li className="fs-14 fw-400 text-grey">
                    Father had Type 2 Diabetes and Hypertension, passed away from a heart attack at the age of 65. Mother is alive and well at 85, with a history of osteoporosis. Siblings: One older
                    brother with a history of hypertension.
                  </li>
                </ul>
              </>
            )}
            {showAcc.medicalHistory == true && (
              <>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Adam Smooth | June 17, 2023 | Endocrinologist</span> | Key Notes: Regular checkup for Type 2 Diabetes, decided to continue with current Metformin
                  dosage as blood glucose levels were within the target range.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Nick Jones | June 9, 2023 | General Practitioner</span> | Key Notes: Routine follow-up, adjusted hypertension medication due to slightly elevated blood
                  pressure.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Rita Aurelio | June 2, 2023 | Psychiatrist</span> | Key Notes: Follow-up for anxiety and panic attacks, no changes in frequency or intensity, decided
                  to continue with cognitive behavioral therapy.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Adam Smooth | May 18, 2023 | Endocrinologist </span> | Key Notes: Regular diabetes check-up, adjustment in Metformin dosage due to elevated HbA1c
                  levels.
                </div>
                <div className="fs-14 fw-400 text-grey">
                  <span className="fw-700">Dr. Nick Jones | April 20, 2023 | General Practitioner</span> | Key Notes: Flu vaccine administered, routine physical examination conducted, blood pressure
                  within acceptable range.
                </div>
              </>
            )}
          </div>
          <div className="drop-panel"></div>
          <div className="padding-box pb-3">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="fs-16 fw-500 text-grey">Social History</div>
              {!showAcc?.socialHistory && (
                <a href="javascript:void(0)" className="fs-12 fw-400 text-gradient" onClick={() => setShowAcc( { ...showAcc, socialHistory: true } )}>
                  View Details
                </a>
              )}
              {showAcc?.socialHistory && (
                <a href="javascript:void(0)" className="fs-12 fw-400 text-gradient" onClick={() => setShowAcc( { ...showAcc, socialHistory: false } )}>
                  View Less
                </a>
              )}
            </div>
            {showAcc.socialHistory == false && (
              <ul className="m-0 py-0 px-3">
                <li className="fs-14 fw-400 text-grey">Occupation: Retired mechanical engineer.</li>
                <li className="fs-14 fw-400 text-grey">Marital status: Married, lives with wife.</li>
                <li className="fs-14 fw-400 text-grey">Children: Two adult children, living out of state.</li>
                <li className="fs-14 fw-400 text-grey">Tobacco use: Smoked a pack a day for 20 years but quit 10 years ago.</li>
                <li className="fs-14 fw-400 text-grey">Alcohol use: Enjoys a glass of wine with dinner occasionally.</li>
                <li className="fs-14 fw-400 text-grey">Recreational drug use: Denies any use of recreational drugs.</li>
                <li className="fs-14 fw-400 text-grey">Diet: Follows a balanced diet but struggles with portion control.</li>
                <li className="fs-14 fw-400 text-grey">Exercise: Tries to stay active through daily walks and yard work.</li>
                <li className="fs-14 fw-400 text-grey">Living Environment: Lives in a single-story house with a backyard; states the house is well-maintained.</li>
                <li className="fs-14 fw-400 text-grey">Social Activities: Enjoys reading, watching sports, and doing puzzles in his spare time. Attends a local book club bi-weekly.</li>
              </ul>
            )}
            {showAcc.socialHistory == true && (
              <>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Adam Smooth | June 17, 2023 | Endocrinologist</span> | Key Notes: Regular checkup for Type 2 Diabetes, decided to continue with current Metformin
                  dosage as blood glucose levels were within the target range.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Nick Jones | June 9, 2023 | General Practitioner</span> | Key Notes: Routine follow-up, adjusted hypertension medication due to slightly elevated blood
                  pressure.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Rita Aurelio | June 2, 2023 | Psychiatrist</span> | Key Notes: Follow-up for anxiety and panic attacks, no changes in frequency or intensity, decided
                  to continue with cognitive behavioral therapy.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Adam Smooth | May 18, 2023 | Endocrinologist </span> | Key Notes: Regular diabetes check-up, adjustment in Metformin dosage due to elevated HbA1c
                  levels.
                </div>
                <div className="fs-14 fw-400 text-grey">
                  <span className="fw-700">Dr. Nick Jones | April 20, 2023 | General Practitioner</span> | Key Notes: Flu vaccine administered, routine physical examination conducted, blood pressure
                  within acceptable range.
                </div>
              </>
            )}
          </div>
          <div className="drop-panel"></div>
          <div className="padding-box pb-3">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="fs-16 fw-500 text-grey">Latest Physical Exams</div>
              {!showAcc?.LatestExams && (
                <a href="javascript:void(0)" className="fs-12 fw-400 text-gradient" onClick={() => setShowAcc( { ...showAcc, LatestExams: true } )}>
                  View Details
                </a>
              )}
              {showAcc?.LatestExams && (
                <a href="javascript:void(0)" className="fs-12 fw-400 text-gradient" onClick={() => setShowAcc( { ...showAcc, LatestExams: false } )}>
                  View Less
                </a>
              )}
            </div>
            {showAcc.LatestExams == false && (
              <>
                <ul className="m-0 py-0 px-3">
                  <li className="fs-14 fw-400 text-grey">Vital signs: Normal</li>
                  <li className="fs-14 fw-400 text-grey">Oxygenation: Normal</li>
                  <li className="fs-14 fw-400 text-grey">Lungs: Slight crackles at bases</li>
                  <li className="fs-14 fw-400 text-grey">Heart: 2/6 systolic ejection murmur (stable)</li>
                  <li className="fs-14 fw-400 text-grey">Lower extremities: No swelling</li>
                  <li className="fs-14 fw-400 text-grey">Blood Pressure: 130/80 mmHg</li>
                </ul>
                Diagnostic Tests:
                <ul className="m-0 py-0 px-3">
                  <li className="fs-14 fw-400 text-grey">Chest X-Ray: Normal</li>
                  <li className="fs-14 fw-400 text-grey">EKG: Normal</li>
                </ul>
              </>
            )}
            {showAcc.LatestExams == true && (
              <>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Adam Smooth | June 17, 2023 | Endocrinologist</span> | Key Notes: Regular checkup for Type 2 Diabetes, decided to continue with current Metformin
                  dosage as blood glucose levels were within the target range.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Nick Jones | June 9, 2023 | General Practitioner</span> | Key Notes: Routine follow-up, adjusted hypertension medication due to slightly elevated blood
                  pressure.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Rita Aurelio | June 2, 2023 | Psychiatrist</span> | Key Notes: Follow-up for anxiety and panic attacks, no changes in frequency or intensity, decided
                  to continue with cognitive behavioral therapy.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Adam Smooth | May 18, 2023 | Endocrinologist </span> | Key Notes: Regular diabetes check-up, adjustment in Metformin dosage due to elevated HbA1c
                  levels.
                </div>
                <div className="fs-14 fw-400 text-grey">
                  <span className="fw-700">Dr. Nick Jones | April 20, 2023 | General Practitioner</span> | Key Notes: Flu vaccine administered, routine physical examination conducted, blood pressure
                  within acceptable range.
                </div>
              </>
            )}
          </div>
          <div className="drop-panel"></div>
          <div className="padding-box pb-3">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="fs-16 fw-500 text-grey">Other</div>
              {!showAcc?.other && (
                <a href="javascript:void(0)" className="fs-12 fw-400 text-gradient" onClick={() => setShowAcc( { ...showAcc, other: true } )}>
                  View Details
                </a>
              )}
              {showAcc?.other && (
                <a href="javascript:void(0)" className="fs-12 fw-400 text-gradient" onClick={() => setShowAcc( { ...showAcc, other: false } )}>
                  View Less
                </a>
              )}
            </div>
            {showAcc.other == false && (
              <ul className="m-0 py-0 px-3">
                <li className="fs-14 fw-400 text-grey">Family History: Not mentioned Travel</li>
                <li className="fs-14 fw-400 text-grey">History: No recent travels</li>
                <li className="fs-14 fw-400 text-grey">Pet History: Has one pet dog.</li>
                <li className="fs-14 fw-400 text-grey">Safety Measures: Uses seat belts when driving or riding in a car; has smoke detectors in the house that are tested regularly.</li>
                <li className="fs-14 fw-400 text-grey">Stress Levels: Moderate, mostly related to health concerns.</li>
                <li className="fs-14 fw-400 text-grey">Psychiatric History: Occasional panic attacks, not under medication. Sees a therapist for cognitive behavioral therapy.</li>
              </ul>
            )}
            {showAcc.other == true && (
              <>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Adam Smooth | June 17, 2023 | Endocrinologist</span> | Key Notes: Regular checkup for Type 2 Diabetes, decided to continue with current Metformin
                  dosage as blood glucose levels were within the target range.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Nick Jones | June 9, 2023 | General Practitioner</span> | Key Notes: Routine follow-up, adjusted hypertension medication due to slightly elevated blood
                  pressure.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Rita Aurelio | June 2, 2023 | Psychiatrist</span> | Key Notes: Follow-up for anxiety and panic attacks, no changes in frequency or intensity, decided
                  to continue with cognitive behavioral therapy.
                </div>
                <div className="fs-14 fw-400 text-grey mb-2">
                  <span className="fw-700">Dr. Adam Smooth | May 18, 2023 | Endocrinologist </span> | Key Notes: Regular diabetes check-up, adjustment in Metformin dosage due to elevated HbA1c
                  levels.
                </div>
                <div className="fs-14 fw-400 text-grey">
                  <span className="fw-700">Dr. Nick Jones | April 20, 2023 | General Practitioner</span> | Key Notes: Flu vaccine administered, routine physical examination conducted, blood pressure
                  within acceptable range.
                </div>
              </>
            )}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
