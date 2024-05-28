import React, { useEffect, useState } from 'react'
import Accordion from "react-bootstrap/Accordion";
import { useAuthStore } from '../../store/Auth';
import { activeKey } from '../../utils/activeKey';
import { shallow } from 'zustand/shallow';
import DrugService from '../../services/drugSearch.service';


export const QA = ( { accordKey, title, questions, type, socket, handleAccordionChange } ) => {
    const [ searchText, setSearchText ] = useState( '' );
    const [ streamText, setStreamText ] = useState( '' );
    const user = useAuthStore( ( state ) => state.user );
    const patient = useAuthStore( ( state ) => state.patient );
    const token = useAuthStore( ( state ) => state.token );
    const [ setPatient ] = useAuthStore( ( state ) => [ state.setPatient ], shallow );


    const handleInputChange = ( e ) => {
        setSearchText( e.target.value );
    };

    const search = () => {
        activeKey( type, searchText, patient, setPatient, handleAccordionChange )
        setSearchText( '' );
        let chat_History = questions.slice( 0, -1 );
        const element = document.getElementById( "view" );
        element.scrollIntoView();
        DrugService.drugSearch( `${user._id}-${type}`, type, searchText, chat_History ).then( ( data ) => {
            DrugService.saveRecord( token, patient.patientID, searchText, type, data[ 0 ].answer ).then( ( data ) => {
                setPatient( data.data )
                setSearchText( '' )
            } ).catch( ( err ) => new Error( err.message ) );
        } ).catch( ( error ) => {
            setSearchText( '' );
            console.log( error );
        } )
    };

    useEffect( () => {
        if ( !!socket ) {
            socket.on( user._id + '-' + type, ( data ) => {
                setStreamText( data );
                const element = document.getElementById( "view" );
                element.scrollIntoView();
            } )
        }
    }, [ socket ] )


    return <Accordion.Item eventKey={accordKey}>
        <Accordion.Header>{title}</Accordion.Header>
        <Accordion.Body className="position-relative">
            <div className="answer-scroll">
                {questions?.map( ( item, index ) => {
                    return (
                        <>
                            <p style={{ fontWeight: 700 }}>{item?.question}</p>
                            {( questions.length - 1 !== index ) && <p className=" fs-16 p-0 border-0">{item?.answer} </p>}
                            {( questions.length - 1 === index ) && <p className=" fs-16 p-0 border-0">{streamText || item?.answer} </p>}
                        </>
                    );
                } )}
                <div id='view' style={{ width: '100%', height: '10px' }}></div>
            </div>

            <div className="form-input position-relative">
                <input type="text" className="px-3" value={searchText} onChange={handleInputChange} placeholder="How can I help?" />
            </div>
            <div className="text-center">
                <button type="button" disabled={searchText == ""} className="border-0 bg-transparent text-gradient fs-14 fw-500 gap-1" onClick={() => search( searchText, type )}>
                    Send <img src="/assets/images/send.svg" className="default-img" />
                    <img src="/assets/images/send-hover.svg" className="save-img" />
                </button>
            </div>
        </Accordion.Body>
    </Accordion.Item>;
}