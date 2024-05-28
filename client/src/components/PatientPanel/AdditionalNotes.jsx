import React, { useEffect, useState } from 'react'
import { Accordion } from 'react-bootstrap';
import { UploadModal } from '../Shared';

export const AdditionalNotes = ( { patient, updatePatient, openUpload, setOpenUpload } ) => {
    const [ additionalNotes, setAdditionalNotes ] = useState( '' );

    useEffect( () => {
        setAdditionalNotes( '' );
    }, [ patient ] )


    return (
        <>
            <Accordion.Item eventKey="3">
                <Accordion.Header>Additional Notes</Accordion.Header>
                <Accordion.Body>
                    <>
                        <pre className="position-relative">{patient?.additionalNotes}</pre>
                        <div className="position-relative">
                            <div className="d-flex align-items-center gap-3">
                                <div className="additional-input position-relative w-100 flex-1">
                                    <input
                                        type="text"
                                        value={additionalNotes}
                                        onChange={( e ) => setAdditionalNotes( e.target.value )}
                                        onKeyDown={( e ) => {
                                            if ( e.key === "Enter" || e.key === "enter" ) {
                                                updatePatient( { additionalNotes: `${patient.additionalNotes ? patient.additionalNotes + '\n' + additionalNotes : additionalNotes}` }, setAdditionalNotes );
                                            }
                                        }}
                                    />
                                    <button className="upload-icon" onClick={() => setOpenUpload( true )}>
                                        <span className="iconify" data-icon="eva:attach-fill"></span>
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    className="send-btn"
                                    onClick={() => {
                                        updatePatient( { additionalNotes: additionalNotes }, setAdditionalNotes );
                                    }}
                                >
                                    <span className="iconify" data-icon="ion:send-sharp"></span>
                                </button>
                            </div>
                            <UploadModal openUpload={openUpload} setOpenUpload={setOpenUpload} fileType=".csv, .pdf, .docx, .txt" />
                        </div>
                    </>
                </Accordion.Body>
            </Accordion.Item>
        </>
    )
}
