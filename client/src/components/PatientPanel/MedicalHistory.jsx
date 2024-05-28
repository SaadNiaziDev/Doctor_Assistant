import React, { useEffect, useState } from 'react'
import { UploadModal, TextButton } from '../Shared';
import { Accordion } from 'react-bootstrap';

export const MedicalHistory = ( { patient, setPatient, openUpload, setOpenUpload, updatePatient } ) => {
    const [ medicalHistory, setMedicalHistory ] = useState( patient?.medicalHistory || '' );
    const [ isEditMode, setIsEditMode ] = useState( false );

    useEffect( () => {
        setMedicalHistory( patient?.medicalHistory || '' )
    }, [ patient ] )

    return (
        <>
            <Accordion.Item eventKey="2">
                <Accordion.Header>Patient Medical History</Accordion.Header>
                <Accordion.Body>
                    <div className="position-relative">
                        {!isEditMode && patient?.medicalHistory && (
                            <div className="text-scroll">
                                {patient?.medicalHistory}
                                <button type="button" className="edit-btn border-0 bg-transparent text-grey fs-20" onClick={() => setIsEditMode( true )}>
                                    <span className="iconify" data-icon="iconamoon:edit-light"></span>
                                </button>
                            </div>
                        )}
                        {( isEditMode || !patient?.medicalHistory ) && (
                            <>
                                <div className="patient-textarea">
                                    <textarea value={medicalHistory} onChange={( e ) => setMedicalHistory( e.target.value )} />
                                </div>
                                <div className="d-flex align-items-center justify-content-end gap-3 mt-2">
                                    <button type="button" className="border-0 bg-transparent text-dark-grey fs-14 fw-400 d-flex align-items-center gap-1" onClick={() => setOpenUpload( true )}>
                                        Upload{" "}
                                        <div className="fs-18 text-dark-grey">
                                            <span className="iconify" data-icon="eva:attach-fill"></span>
                                        </div>
                                    </button>
                                    <div className="vertical-divider"></div>
                                    <div onClick={() => {
                                        updatePatient( { medicalHistory: medicalHistory }, setMedicalHistory )
                                        setIsEditMode( false );
                                    }}>
                                        <TextButton additionalClasses="border-0 bg-transparent fs-14 fw-500 d-flex align-items-center gap-1" disabled={false}>
                                            {patient.medicalHistory ? "Update" : "Send"}  <img src="/assets/images/send.svg" className="default-img" alt="" />
                                            <img src="/assets/images/send-hover.svg" className="save-img" alt="" />
                                        </TextButton>
                                    </div>
                                </div>
                                <UploadModal openUpload={openUpload} setOpenUpload={setOpenUpload} fileType=".csv, .pdf, .docx, .txt" />
                            </>
                        )}
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </>
    )
}
