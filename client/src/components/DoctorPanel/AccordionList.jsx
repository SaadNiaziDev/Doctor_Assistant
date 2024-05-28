import React, { useEffect, useRef, useState } from 'react'
import { QA } from '../Shared'
import { io } from 'socket.io-client'

const AccordionList = ( { drugSearch, consult, handleAccordionChange } ) => {

    const socketRef = useRef( null )
    const [ socketIns, setSocketIns ] = useState( null )

    useEffect( () => {
        const socket = io.connect( "https://api.lumed.ai/", {
            transports: [ "websocket" ],
            upgrade: false,
        } );

        socket.on( 'connect', () => {
            console.log( "Connected to api.lumed server" );
        } )

        socketRef.current = socket;
        setSocketIns( socket )
        return () => {
            setSocketIns( null )
            socket.off()
            socketRef.current.value = '';
        }
    }, [] )




    return (
        <>
            {drugSearch?.drugSearch?.length > 0 && (
                <QA
                    accordKey="2"
                    title="Sementic Drug Search History"
                    questions={drugSearch?.drugSearch}
                    type='sds'
                    socket={socketIns}
                    handleAccordionChange={handleAccordionChange}
                />
            )}
            {drugSearch?.labAnalyzerReport.length > 0 && (
                <QA
                    accordKey="3"
                    title="Lab Test Analyzer History"
                    questions={drugSearch?.labAnalyzerReport}
                    type='ta'
                    socket={socketIns}
                    handleAccordionChange={handleAccordionChange}
                />
            )}
            {consult?.cardioSearch.length > 0 && (
                <QA
                    accordKey="4"
                    title="Cardiology Consultation History"
                    questions={consult?.cardioSearch}
                    type='cardio'
                    socket={socketIns}
                    handleAccordionChange={handleAccordionChange}
                />
            )}

            {consult?.neuroSearch.length > 0 && (
                <QA
                    accordKey="5"
                    title="Neurology Consultation History"
                    questions={consult?.neuroSearch}
                    type='neuro'
                    socket={socketIns}
                    handleAccordionChange={handleAccordionChange}
                />
            )}

            {consult?.oncoSearch.length > 0 && (
                <QA
                    accordKey="6"
                    title="Oncology Consultation History"
                    questions={consult?.oncoSearch}
                    type='onco'
                    socket={socketIns}
                    handleAccordionChange={handleAccordionChange}
                />
            )}

            {consult?.endoSearch.length > 0 && (
                <QA
                    accordKey="7"
                    title="Endocrinology Consultation History"
                    questions={consult?.endoSearch}
                    type='endo'
                    socket={socketIns}
                    handleAccordionChange={handleAccordionChange}
                />
            )}

            {consult?.immuSearch.length > 0 && (
                <QA
                    accordKey="8"
                    title="Immununology Consultation History"
                    questions={consult?.immuSearch}
                    type='immu'
                    socket={socketIns}
                    handleAccordionChange={handleAccordionChange}
                />
            )}

            {consult?.nurseSearch.length > 0 && (
                <QA
                    accordKey="9"
                    title="Nurse Consultation History"
                    questions={consult?.nurseSearch}
                    type='nurse'
                    socket={socketIns}
                    handleAccordionChange={handleAccordionChange}
                />
            )}

            {consult?.medgenSearch.length > 0 && (
                <QA
                    accordKey="10"
                    title="Medical Genetics Consultation History"
                    questions={consult?.medgenSearch}
                    type='medgen'
                    socket={socketIns}
                    handleAccordionChange={handleAccordionChange}
                />
            )}
            {consult?.gpSearch.length > 0 && (
                <QA
                    accordKey="11"
                    title="General Practice Consultation History"
                    questions={consult?.gpSearch}
                    type='gp'
                    socket={socketIns}
                    handleAccordionChange={handleAccordionChange}
                />
            )}

        </>
    )
}

export default AccordionList