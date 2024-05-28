import React, { useState } from 'react'
import PatientService from '../../services/patient.service';
import Swal from 'sweetalert2';
import { useSearchParams } from 'react-router-dom';
import { TextButton } from '../Shared';
import { Toast } from '../../constants';

export const Actions = ( { token, patient, setPatient, progress, setProgress, updatePatient } ) => {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ name, setName ] = useState( '' );

    const addPatient = () => {
        PatientService.addPatient( token, name ).then( ( data ) => {
            if ( data.status === 200 ) {
                setSearchParams( { patientID: data.data.patientID } );
                setPatient( data.data );
                setProgress( "nameAdded" );
            } else throw new Error( 'Could not add patient!' )
        } )
            .catch( ( err ) => {
                console.error( err );
                Toast.fire( 'Falure', err.message, 'error' );
            } );
    };

    const removePatient = () => {
        Swal.fire( {
            icon: "warning",
            title: "Confirmation",
            text: "Are you sure you want to delete this record!",
            showCancelButton: true,
        } ).then( ( result ) => {
            if ( result.isConfirmed ) {
                PatientService.removePatient( token, patient?.patientID ).then( ( data ) => {
                    if ( data.status === 200 ) {
                        setSearchParams( {} );
                        setProgress( "start" );
                        setPatient( {
                            name: "",
                            medicalHistory: "",
                            portait: "",
                            additionalNotes: "",
                            patientID: ""
                        } );
                        setName( '' );
                    } else throw new Error( "failed to remove patient" )
                } )
                    .catch( ( err ) => {
                        console.error( err );
                        Toast.fire( 'Failed', err.message, 'error' )
                    } );
            }
        } );
    };

    const handleFunction = () => {
        if ( patient.patientID ) {
            updatePatient( { name: name }, setName );
        } else {
            addPatient();
        }
    };

    const redo = () => {
        Swal.fire( {
            icon: "question",
            title: "Confirmation",
            text: "Are you sure you want to redo this operation!",
            showCancelButton: true,
        } ).then( ( result ) => {
            if ( result.isConfirmed ) {
                PatientService.redo( token, patient?.patientID ).then( ( data ) => {
                    if ( data.status === 200 ) setPatient( data.data );
                    else throw new Error( 'Failed to perform action' )
                } )
                    .catch( ( err ) => {
                        console.error( err );
                        Toast.fire( 'Failed', err.message, 'error' )
                    } );
            } else {
                console.log( "cancelled" );
                return;
            }
        } );
    };

    return (
        <div>
            {progress === "name" && (
                <div className="information-box px-0">
                    <div className="fs-20 fw-600 text-grey mb-4 px-4">Patient Information</div>
                    <div className="drop-divider"></div>
                    <div className="d-flex justify-content-between align-items-center mt-4 pe-4">
                        <div className="name-input w-100">
                            <input type="text" placeholder="Enter Name" value={name} onChange={( e ) => setName( e.target.value )} className="w-100" onKeyDown={( e ) => ( e.key === "Enter" ? handleFunction() : "" )} autoFocus />
                        </div>

                        <div onClick={() => handleFunction()}>
                            <TextButton additionalClasses="border-0 bg-transparent  d-flex align-items-center gap-2">
                                Save <img src="/assets/images/save.svg" className="default-img" alt="" />
                                <img src="/assets/images/save-hover.svg" className="save-img" alt="" />
                            </TextButton>
                        </div>
                    </div>
                </div>
            )}
            {progress !== "name" && progress !== "start" && (
                <div className="information-box px-0 ">
                    <div className="fs-20 fw-600 text-grey mb-4 px-4">Patient Information</div>
                    <div className="drop-divider"></div>
                    <div className="d-flex justify-content-between align-items-center mt-4 px-4">
                        <div className="fs-20 fw-500 text-purple">{patient?.name}</div>
                        <div className="d-flex align-items-center gap-1">
                            <div className="position-relative hover-show">
                                <button type="button" className="border-0 bg-transparent text-light-grey fs-20">
                                    <span className="iconify" data-icon="ri:share-line"></span>
                                </button>
                                <div className="tooltip-patient">Share</div>
                            </div>
                            <div className="position-relative  hover-show">
                                <button type="button" className="border-0 bg-transparent text-light-grey fs-20" onClick={() => setProgress( "name" )}>
                                    <span className="iconify" data-icon="iconamoon:edit-light"></span>
                                </button>
                                <div className="tooltip-patient">Rename</div>
                            </div>
                            <div className="position-relative  hover-show">
                                <button type="button" className="border-0 bg-transparent text-light-grey fs-20">
                                    <span className="iconify" data-icon="octicon:download-24"></span>
                                </button>
                                <div className="tooltip-patient">Download</div>
                            </div>
                            <div className="position-relative  hover-show">
                                <button type="button" className="border-0 bg-transparent text-light-grey fs-20" onClick={() => redo()}>
                                    <span className="iconify" data-icon="jam:refresh"></span>
                                </button>
                                <div className="tooltip-patient">Restart</div>
                            </div>
                            <div className="position-relative  hover-show">
                                <button
                                    type="button"
                                    className="border-0 bg-transparent text-light-grey fs-20"
                                    onClick={() => {
                                        removePatient();
                                    }}
                                >
                                    <span className="iconify" data-icon="ant-design:delete-outlined"></span>
                                </button>
                                <div className="tooltip-patient">Delete</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

