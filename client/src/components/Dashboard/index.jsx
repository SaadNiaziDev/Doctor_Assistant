import React, { useEffect, useState } from 'react'
import PatientPanel from '../PatientPanel'
import DoctorPanel from '../DoctorPanel'
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { useLumedStore } from '../../store/lumedStore';
import { useSearchParams } from 'react-router-dom';
import { shallow } from 'zustand/shallow';


const Dashboard = ( { progress, setProgress } ) => {
    const [ getIntakeForm, getPatient, getDrugSearch, getGptService, getConsultation, getTranscription, resetState ] = useLumedStore( ( state ) => [ state.getIntakeForm, state.getPatient, state.getDrugSearch, state.getGptService, state.getConsultation, state.getTranscription, state.resetState ], shallow );

    const [ isLoading, setIsLoading ] = useState( false );
    let [ searchParams, setSearchParams ] = useSearchParams();


    const getPatientData = async ( id ) => {
        console.time( 'getPatientData' );
        console.timeLog( 'getPatientData' )
        setIsLoading( true )
        Promise.all( [
            getPatient( id ),
            getIntakeForm( id ),
            getDrugSearch( id ),
            getGptService( id ),
            getConsultation( id ),
            getTranscription( id )
        ] ).then( () => {
            setIsLoading( false );
            console.timeLog( 'getPatientData' )
            console.timeEnd( 'getPatientData' )
        } ).catch( () => {
            setIsLoading( false )
        } );

    };
    useEffect( () => {
        if ( searchParams.get( 'patientID' ) ) {
            getPatientData( searchParams.get( 'patientID' ) )
        } else {
            resetState()
        }
    }, [ searchParams ] )


    return (
        <>
            {!isLoading && <div className='main'>
                <Allotment proportionalLayout snap separator>
                    <Allotment.Pane preferredSize='40%' visible minSize={500}>
                        {/* <div className="col-lg-6"> */}
                        <PatientPanel progress={progress} setProgress={setProgress} />
                        {/* </div> */}
                    </Allotment.Pane>
                    {/* <Allotment.Pane preferredSize='1%'>
                        ||
                    </Allotment.Pane> */}
                    <Allotment.Pane preferredSize='50%' visible minSize={500}>
                        {/* <div className="col-lg-6"> */}
                        <DoctorPanel />
                        {/* </div> */}
                    </Allotment.Pane>
                </Allotment>

            </div>}
            {isLoading && <div className="bg-blur">
                <div class="spinner-grow" role="status">
                </div>
            </div>}
        </>
    )
}

export default Dashboard