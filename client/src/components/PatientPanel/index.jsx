import React, { useEffect, useState } from "react";
import { QrCode, Button } from "../Shared";
import Accordion from "react-bootstrap/Accordion";
import { PatientPortrait } from "./PatientPortrait";
import { shallow } from "zustand/shallow";
import { Intake } from "./Intake";
import { MedicalHistory } from "./MedicalHistory";
import { AdditionalNotes } from "./AdditionalNotes";
import { Actions } from './Actions';
import PatientService from "../../services/patient.service";
import { useLumedStore } from "../../store/lumedStore";

const PatientPanel = ( { progress, setProgress } ) => {
  const token = useLumedStore( ( state ) => state.token );
  const patient = useLumedStore( ( state ) => state.patient );
  const intakeForm = useLumedStore( ( state ) => state.intakeForm );
  const [ setPatient ] = useLumedStore( ( state ) => [ state.setPatient ], shallow );
  const [ openUpload, setOpenUpload ] = useState( false );

  const updatePatient = ( body, setState ) => {
    PatientService.updatePatient( token, patient?.patientID, body ).then( ( data ) => {
      if ( data.status === 200 ) {
        setPatient( data.data );
        setState( '' );
      } else throw new Error( 'Failed to update patient' )
    } )
      .catch( ( err ) => {
        console.error( err );
        Toast.fire( 'Failed', err.message, 'error' )
      } );
  };

  useEffect( () => {
    if ( patient.patientID === '' ) setProgress( "start" );
    else if ( patient?.medicalHistory ) setProgress( "medical" );
    else if ( patient?.potrait ) setProgress( "potrait" );
    else setProgress( "nameAdded" );
  }, [ patient ] );





  return (
    <div className="panel-box">
      {patient.patientID === '' && progress === "start" && (
        <div className="information-box">
          <div className="fs-20 fw-600 text-grey mb-4">Patient Information</div>
          <div className="fs-14 fw-400 text-grey mb-4">
            Generating a Patient Portrait is optional but helpful for optimal treatment planning. The process starts with an intake form to be filled by your patient. Next, you will be able to submit
            descriptions, files, and notes to generate a holistic summary of the medical history of your patient.
          </div>

          <div onClick={() => setProgress( "name" )}>
            <Button disabled={false} text="New Patient Information" additionalClasses=" gap-2">
              <div className="fs-20 mb-1">
                <span className="iconify" data-icon="icons8:plus"></span>
              </div>
            </Button>
          </div>
        </div>
      )}

      {progress !== 'potrait' && <Actions token={token} patient={patient} setPatient={setPatient} progress={progress} setProgress={setProgress} updatePatient={updatePatient} />}
      {patient.name !== '' && (
        <>
          {progress !== "potrait" && <div className="scroll-patient">
            {progress === "medical" && <div className="information-box mt-4">
              <div className="fs-16 fw-600 text-grey mb-3">Generating Patient Portrait</div>
              <div className="progress-patient">
                <div className="gradient-progress"></div>
              </div>
            </div>}
            {( progress === "nameAdded" || progress === "name" || progress !== "potrait" ) && <div className="row mt-4">
              <div className="col-lg-6">
                <QrCode url={window.location.origin + "/intake/" + patient?.patientID} statement="Share this link or scan the QR code to collect patient intake information." />
              </div>
            </div>}

            <div className="mt-4">
              <Accordion defaultActiveKey="0" className="lumed-accordion">
                {progress !== "potrait" && <Intake intake={intakeForm} />}
                {progress !== "potrait" && <MedicalHistory patient={patient} setPatient={setPatient} openUpload={openUpload} setOpenUpload={setOpenUpload} updatePatient={updatePatient} />}
                {progress === "medical" && <AdditionalNotes patient={patient} updatePatient={updatePatient} openUpload={openUpload} setOpenUpload={setOpenUpload} />
                }
              </Accordion>
            </div>
          </div>}
          {progress === "potrait" && <PatientPortrait patient={patient} />}

          {progress !== "potrait" && progress !== "start" && (
            <div onClick={() => setProgress( "potrait" )}>
              <Button disabled={false} text="Generate Paitent Portrait" additionalClasses="w-100 mt-4"></Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PatientPanel;
