import React, { useEffect, useState } from 'react'
import Accordion from "react-bootstrap/Accordion";

const OptionAccordions = ( { patient, gptService, socket } ) => {

    useEffect( () => {
        if ( !!socket ) {

            socket.on( patient.patientID + '-email', ( data ) => {
                let element = document.getElementById( 'email' );
                element.innerHTML = data;
                document.getElementById( 'email-view' ).scrollIntoView();
            } );
            socket.on( patient.patientID + '-insurance', ( data ) => {
                let element = document.getElementById( 'insurance' );
                element.innerHTML = data;
                document.getElementById( 'insurance-view' ).scrollIntoView();
            } );
            socket.on( patient.patientID + '-ai', ( data ) => {
                let element = document.getElementById( 'ai' );
                element.innerHTML = data;
                document.getElementById( 'ai-view' ).scrollIntoView();
            } );
            socket.on( patient.patientID + '-custom', ( data ) => {
                let element = document.getElementById( 'custom' );
                element.innerHTML = data;
                document.getElementById( 'custom-view' ).scrollIntoView();
            } );
        }

        return () => {
            socket?.off( patient.patientID + '-email', ( e ) => { console.log( "email socket off" ) } )
            socket?.off( patient.patientID + '-insurance', ( e ) => { console.log( "email socket off" ) } )
            socket?.off( patient.patientID + '-ai', ( e ) => { console.log( "email socket off" ) } )
            socket?.off( patient.patientID + '-custom', ( e ) => { console.log( "email socket off" ) } )
        }
    }, [ socket ] )



    return (
        <div>
            {( gptService?.email ) && (
                <Accordion.Item eventKey="14">
                    <Accordion.Header>Email Summary</Accordion.Header>
                    <Accordion.Body className="position-relative">
                        <div className="answer-scroll" id="email" dangerouslySetInnerHTML={{ __html: gptService?.email }}>
                            { }
                        </div>
                        <div className='w-100' id='email-view' style={{ height: 10 }}></div>
                    </Accordion.Body>
                </Accordion.Item>
            )}

            {( gptService?.insurance ) && (
                <Accordion.Item eventKey="15">
                    <Accordion.Header>Insurance Authorization Request</Accordion.Header>
                    <Accordion.Body className="position-relative">
                        <pre className="answer-scroll" id="insurance" dangerouslySetInnerHTML={{ __html: gptService?.insurance }}>
                            { }
                        </pre>
                        <div className='w-100' id='insurance-view' style={{ height: 10 }}></div>
                    </Accordion.Body>
                </Accordion.Item>
            )}

            {( gptService?.ai ) && (
                <Accordion.Item eventKey="16">
                    <Accordion.Header>AI Feedback</Accordion.Header>
                    <Accordion.Body className="position-relative">
                        <pre className="answer-scroll" id="ai" dangerouslySetInnerHTML={{ __html: gptService?.ai }}>
                            { }
                        </pre>
                        <div className='w-100' id='ai-view' style={{ height: 10 }}></div>
                    </Accordion.Body>
                </Accordion.Item>
            )}

            {( gptService?.custom.length > 0 ) && (
                <Accordion.Item eventKey="17">
                    <Accordion.Header>Custom Prompt Response</Accordion.Header>
                    <Accordion.Body className="position-relative">
                        <div className="answer-scroll">
                            {gptService?.custom.map( ( item, index ) => {
                                return (
                                    <div className="mb-3">
                                        <div className="fw-600">{item?.question}</div>
                                        {( index !== gptService?.custom.length - 1 ) && <div>{item?.answer}</div>}
                                        {( index === gptService?.custom.length - 1 ) && <div id='custom'>{item?.answer}</div>}
                                    </div>
                                );
                            } )}
                            <div className='w-100' id='custom-view' style={{ height: 10 }}></div>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            )}
        </div>
    )
}

export default OptionAccordions