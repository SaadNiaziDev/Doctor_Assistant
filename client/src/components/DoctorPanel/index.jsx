import React, { useEffect, useRef, useState, useMemo } from "react";
import { QrCode, WaveSurferPlayer, Button, ProgressBar } from "../Shared";
import Accordion from "react-bootstrap/Accordion";
import { Toast, baseURL } from "../../constants";
import { Option } from "./Option";
import { SummaryBox } from "./SummaryBox";
import { shallow } from "zustand/shallow";
import { MedicalSOAP } from "./MedicalSOAP";
import AccordionList from "./AccordionList";
import { io } from "socket.io-client";
import GPTService from "../../services/gpt.service";
import UploadService from "../../services/upload.service";
import OptionAccordions from "./OptionAccordions";
import { useLumedStore } from "../../store/lumedStore";
import TranscriptionService from "../../services/transcription.service";

const DoctorPanel = () => {
  const patient = useLumedStore( ( state ) => state.patient );
  const token = useLumedStore( ( state ) => state.token );
  const transcript = useLumedStore( ( state ) => state.transcript );
  const gptService = useLumedStore( ( state ) => state.gptService );
  const consult = useLumedStore( ( state ) => state.consult );
  const drugSearch = useLumedStore( ( state ) => state.drugSearch );
  const user = useLumedStore( ( state ) => state.user );


  const [ setPatient, setGptService, setConsultation, setDrugSearch, setTranscription ] = useLumedStore( ( state ) => [ state.setPatient, state.setGptService, state.setConsultation, state.setDrugSearch, state.setTranscription ], shallow );
  const [ startVisit, setStartVisit ] = useState( "panelInfo" );
  const [ openUpload, setOpenUpload ] = useState( false );
  const [ filename, setFilename ] = useState( "" );
  const [ summaryHide, setSummaryHide ] = useState( false );
  const [ selectedText, setSelectedText ] = useState( "" );
  const [ activeTab, setActiveTab ] = useState( '0' );
  const [ socket, setSocket ] = useState( null );

  const fileUpload = useRef( null );

  const handleAccordionChange = ( key ) => {
    setActiveTab( key );
  };

  const handleFileUpload = ( e ) => {
    const file = e.target.files[ 0 ];
    setFilename( file );
  };

  const waveSurferPlayer = useMemo( () => {
    if ( transcript?.audio ) {
      return (
        <div className="information-box mt-3">
          <WaveSurferPlayer height={40} waveColor="#44c2ad" barWidth={4} barGap={2} normalize={true} progressColor="#53a0cd" url={transcript?.audio} />
        </div>
      );
    }
    return null;
  }, [ transcript?.audio ] );

  const Hl7 = async () => {
    gptService.hl7 = '.';
    setActiveTab( '12' );
    GPTService.createHL7( token, patient?.patientID ).then( ( res ) => {
      if ( res.status === 200 ) {
        setGptService( res.data );
        console.log( "Success" )
      } else {
        console.log( "Error generating report!" )
      }
    } )
  }

  const generatePrescription = async () => {
    gptService.prescription = '.'
    setActiveTab( '13' );
    GPTService.createPrescription( token, patient?.patientID ).then( ( res ) => {
      if ( res.status === 200 ) {
        setGptService( res.data );
        console.log( "Success" )
      } else {
        console.log( "Error generating report!" )
      }
    } )
  }

  const sendFile = () => {
    if ( !filename ) {
      console.log( "Could not find file!" );
      return;
    }
    setStartVisit( "audioRecord" );
    const formData = new FormData();
    formData.append( "file", filename );
    UploadService.uploadFile( formData ).then( ( res ) => {
      if ( res.status === 200 ) {
        setTranscription( { soap: '.', audio: res.data.audio, transcription: res.data.transcription } );
        setStartVisit( "finishedRecording" );
        TranscriptionService.saveTranscription( patient?.patientID, res.data ).then( ( data ) => {
          setTranscription( data.data );
          Toast.fire( "success", "Recording has been saved successfully", "success" );
        } )
          .catch( ( error ) => {
            throw new Error( error );
          } );
      } else {
        throw new Error( res.message );
      }
    } )
      .catch( ( error ) => {
        Toast.fire( "error", "Failed", "error" );
        console.log( error );
      } );
  };


  useEffect( () => {
    console.log( gptService )
    if ( !transcript.audio ) setStartVisit( "panelInfo" )
    else setStartVisit( "finishedRecording" );
  }, [ transcript ] );

  useEffect( () => {
    const mainsocket = io.connect( baseURL );

    mainsocket.on( 'connect', ( e ) => {
      setSocket( mainsocket );
    } )

    mainsocket.on( `${user?._id}-hl7`, ( data ) => {
      document.getElementById( 'hl7' ).innerHTML = data;
    } )

    mainsocket.on( `${user?._id}-prescription`, ( data ) => {
      document.getElementById( 'prescription' ).innerHTML = data;
    } )

    mainsocket.on( `${user?._id}-soap`, ( data ) => {
      document.getElementById( 'container' ).innerHTML = data;
    } )
    return () => {
      setSocket( null );
      mainsocket.off();
    }
  }, [] )



  return (
    <div className="panel-box">
      <div className="w-100 h-100 position-relative">
        <div className="information-box">
          <div className="fs-20 fw-600 text-grey ">Appointment Panel</div>
          {startVisit === "panelInfo" && (
            <>
              <div className="fs-14 fw-400 text-grey my-4">
                Start the Visit with the button below to record the conversation with the patient on your laptop or mobile. The appointment will be recorded and available for later use together with
                its transcription.
              </div>
              {patient.patientID !== '' && (
                <div onClick={() => setStartVisit( "appointVisit" )}>
                  <Button disabled={!patient} text="Start Visit" additionalClasses=" gap-2 h-48">
                    <div className="fs-20 mb-1">
                      <span className="iconify" data-icon="icons8:plus"></span>
                    </div>
                  </Button>
                </div>
              )}
              {patient.patientID === '' && (
                <Button disabled={true} text="Start Visit" additionalClasses=" gap-2 h-48">
                  <div className="fs-20 mb-1">
                    <span className="iconify" data-icon="icons8:plus"></span>
                  </div>
                </Button>
              )}
            </>
          )}
        </div>
        {startVisit === "appointVisit" && (
          <>
            <div className="row mt-4">
              <div className="col-lg-6 h-100">
                <QrCode url={window.location.origin + "/recording/" + patient?.patientID} statement="Scan this QR code or copy this link to start recording on your phone/desktop." />
              </div>
              <div className="col-lg-6 h-100">
                <div className="qr-box h-100">
                  <div className="fs-14 fw-400 text-grey mb-3">Or you can upload an audio file that you have saved</div>
                  <div className="fs-14 fw-500 text-grey mb-1">Attach Document</div>
                  <div className="attachment-box mb-2">
                    <div className="fs-32 text-voilet mb-3">
                      <span className="iconify" data-icon="basil:file-upload-solid"></span>
                    </div>
                    <div className="fs-14 fw-500 text-voilet mb-3">
                      Drag and drop or <span className="text-gradient">browse file</span>
                    </div>
                    <div className="fs-12 fw-400 text-voilet">200MB maximum</div>
                    <input type="file" accept=".mp3, .wav, .webm, .mpeg" onChange={handleFileUpload} ref={fileUpload} />
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="fs-12 fw-400 text-voilet">Accepted Formats : MP3, WAV, FLAC, MPEG</div>
                  </div>
                  {filename && (
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="fs-12 fw-400 text-primary">Filename : {filename?.name}</div>
                      <span className="text-danger pointer" onClick={( e ) => {
                        setFilename( "" );
                        fileUpload.current.value = null
                      }}>
                        X
                      </span>
                    </div>
                  )}

                  <div onClick={() => sendFile()}>
                    <Button disabled={!filename} text="Upload Now" additionalClasses="w-100"></Button>
                  </div>
                  <div className="fs-16 fw-500 text-grey my-3 text-center">OR</div>
                  <a href={"/recording/" + patient?.patientID} target="_blank">
                    <Button text="Start Recording" additionalClasses="w-100"></Button>
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        {startVisit === "audioRecord" && (
          <>
            {filename && (
              <div className="information-box mt-3">
                <WaveSurferPlayer height={40} waveColor="#44c2ad" barWidth={4} barGap={2} normalize={true} progressColor="#53a0cd" url={URL.createObjectURL( filename )} />
              </div>
            )}
            <div className="d-flex align-items-center gap-3 mt-4">{startVisit === "audioRecord" && <div className="fs-12 fw-400 text-grey">Upload Successful! Transcription in Progress</div>}</div>

            <div className="information-box mt-4">
              <div className="fs-16 fw-600 text-grey mb-3">Generating Transcription</div>
              <ProgressBar />
            </div>

            <div className="information-box mt-4">
              <div className="fs-16 fw-600 text-grey mb-3">Generating Medical SOAP Note</div>
              <ProgressBar />
            </div>
          </>
        )}

        {startVisit === "finishedRecording" && (
          <>
            {transcript?.audio && (
              <div className="information-box mt-3">
                {waveSurferPlayer}
              </div>
            )}
            <Accordion defaultActiveKey="0" activeKey={activeTab} className="lumed-accordion " onSelect={handleAccordionChange}>

              {transcript && <div className="mt-4">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Transcription</Accordion.Header>
                  <Accordion.Body className="position-relative">
                    <div className="patient-textarea ">
                      {
                        transcript?.transcription.map( ( item ) => {
                          return (
                            <>
                              <div className="mb-3">
                                <div className="fw-600">Speaker {item?.Speaker}:</div>
                                <div>{item?.text}</div>
                              </div>
                            </>
                          );
                        } )}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </div>}
              {transcript.soap && (
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Medical SOAP Note</Accordion.Header>
                  <Accordion.Body className="position-relative">
                    <MedicalSOAP patient={patient} transcript={transcript} setSelectedText={setSelectedText} setTranscription={setTranscription} />
                  </Accordion.Body>
                </Accordion.Item>
              )}
              {!transcript.soap && (
                <div className="information-box mt-4">
                  <div className="fs-16 fw-600 text-grey mb-3">Generating Medical SOAP Note</div>
                  <ProgressBar />
                </div>
              )}

              {( gptService.hl7 ) && (
                <Accordion.Item eventKey="12">
                  <Accordion.Header>HL7 FHIR JSON</Accordion.Header>
                  <Accordion.Body className="position-relative">
                    <pre className="answer-scroll" id="hl7" dangerouslySetInnerHTML={{ __html: gptService.hl7 }}>
                    </pre>
                  </Accordion.Body>
                </Accordion.Item>
              )}

              {( gptService.prescription ) && (
                <Accordion.Item eventKey="13">
                  <Accordion.Header>Prescription</Accordion.Header>
                  <Accordion.Body className="position-relative">
                    <pre className="answer-scroll" id="prescription" dangerouslySetInnerHTML={{ __html: gptService.prescription }}>
                    </pre>
                  </Accordion.Body>
                </Accordion.Item>
              )}


              {/* TODO all accordions here */}
              <AccordionList drugSearch={drugSearch} consult={consult} handleAccordionChange={handleAccordionChange} />
              <OptionAccordions patient={patient} gptService={gptService} socket={socket} />
            </Accordion>


            {!summaryHide && (
              <SummaryBox
                openUpload={openUpload}
                setOpenUpload={setOpenUpload}
                token={token}
                patient={patient}
                selectedText={selectedText}
                hl7={() => Hl7()}
                generatePrescription={() => generatePrescription()}
                setActiveTab={setActiveTab}
                consult={consult}
                setConsultation={setConsultation}
                drugSearch={drugSearch}
                setDrugSearch={setDrugSearch}
              />
            )}
          </>
        )}
        {startVisit === "finishedRecording" && (
          <div>
            <Option openUpload={openUpload} setOpenUpload={setOpenUpload} summaryHide={summaryHide} setSummaryHide={setSummaryHide} token={token} patient={patient} setPatient={setPatient} handleAccordionChange={handleAccordionChange} gptService={gptService} setGptService={setGptService} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPanel;


