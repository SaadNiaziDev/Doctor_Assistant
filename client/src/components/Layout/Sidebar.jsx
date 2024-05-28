import React, { useEffect, useState } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { Button } from '../Shared'
import { shallow } from 'zustand/shallow'
import moment from 'moment/moment'
import Dropdown from 'react-bootstrap/Dropdown';
import { apiURL, baseURL } from '../../constants'
import { io } from 'socket.io-client'
import { useLumedStore } from '../../store/lumedStore'

const Sidebar = ( { progress, setProgress } ) => {
    const user = useLumedStore( ( state ) => state.user );
    const token = useLumedStore( ( state ) => state.token );
    const patient = useLumedStore( ( state ) => state.patient );
    const [ logout, setPatient, setIntakeForm ] = useLumedStore( ( state ) => [ state.reset, state.setPatient, state.setIntakeForm ], shallow );
    const [ fullSide, setFullSide ] = useState( true );
    const [ patients, setPatients ] = useState( [] );
    let [ searchParams, setSearchParams ] = useSearchParams();

    const splitName = ( name ) => {
        if ( name ) {
            let initials = name
                .split( ' ' )
                .map( subname => subname.trim() )
                .reduce( ( acc, subname ) => subname[ 0 ] ? acc + subname[ 0 ] : acc, '' );
            return initials;
        } else {
            return 'XY';
        }
    };


    const getData = async () => {
        fetch( apiURL + "/patient/get-all", {
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        } ).then( ( res ) => res.json() ).then( ( data ) => {
            if ( data.status === 200 ) {
                setPatients( data.data );
            }
        } ).catch( ( err ) => {
            console.log( err )
        } )
    }

    const trim = ( date ) => {
        if ( date === 'a few seconds' ) return "<1 minute"
        let split = date.split( " " );
        if ( split[ 1 ] === 'mins' || split[ 1 ] === 'min' || split[ 1 ] === 'minutes' || split[ 1 ] === 'minute' ) return split[ 0 ] === 'a' ? '1' + ' min' : split[ 0 ] + ' min'
        else if ( split[ 1 ] === 'hours' || split[ 1 ] === 'hour' ) return split[ 0 ] === 'an' ? '1' + ' h' : split[ 0 ] + ' h'
        else if ( split[ 1 ] === 'day' || split[ 1 ] === 'days' ) return split[ 0 ] === 'a' ? '1' + ' d' : split[ 0 ] + ' d'
        else if ( split[ 1 ] === 'month' || split[ 1 ] === 'months' ) return split[ 0 ] === 'a' ? '1' + ' mon' : split[ 0 ] + ' mon'
        else if ( split[ 1 ] === 'year' || split[ 1 ] === 'years' ) return split[ 0 ] === 'a' ? '1' + ' y' : split[ 0 ] + ' y'
        else return date;
    }


    useEffect( () => {
        getData();
        const socket = io.connect( baseURL );
        socket.on( `${user._id}-patient-record-changed`, () => {
            getData();
        } )
        socket.on( `${patient.patientID}-intake`, ( data ) => {
            setIntakeForm( data )
        } );

        return () => {
            socket.off( 'message' )
        }
    }, [] )

    return (
        <>
            <div className="layout py-4 px-3 ps-0">
                <div className="container-fluid ps-0">
                    <div className="d-flex">
                        <div className={fullSide ? "sidebar" : "min-sidebar"}>
                            <div className="padding-box">
                                <div className="d-flex sidebar-head align-items-center mb-4 justify-content-between">
                                    <a href="/" className='logo'>
                                        <img src="/assets/images/logo.svg" alt="" />
                                    </a>
                                    <button type='button' className='border-0 bg-transparent btn-grid fs-22 text-light-grey' onClick={() => setFullSide( !fullSide )}>
                                        <span className="iconify" data-icon="mingcute:layout-line"></span>
                                    </button>
                                </div>
                                <div onClick={() => {
                                    setProgress( "name" )
                                    setPatient( {
                                        name: "",
                                        medicalHistory: "",
                                        portait: "",
                                        additionalNotes: "",
                                        patientID: ""
                                    } );
                                    setSearchParams( {} );
                                }}>
                                    <Button disabled={false} additionalClasses="w-100 gap-2" >
                                        <div className="fs-20 mb-1">
                                            <span className="iconify" data-icon="icons8:plus"></span>
                                        </div>
                                        <div className="text">
                                            New Patient
                                        </div>
                                    </Button>
                                </div>
                            </div>
                            <div className="drop-divider"></div>
                            <div className="scroll-side">
                                <div className="padding-box">
                                    {
                                        patients?.map( ( item, i ) => {
                                            return (
                                                <div key={i}>
                                                    <div className="fs-12 fw-500 text-light-grey mb-3" key={i}>
                                                        {item?.date}
                                                    </div>
                                                    {item?.patients.map( ( rec, index ) => {
                                                        return (
                                                            <div className="d-flex pateint-list justify-content-between align-items-center mb-4 position-relative pointer" key={index} onClick={() => setSearchParams( { patientID: rec.patientID } )}
                                                            >
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <div className={`profile-img ${( patient?.patientID == rec?.patientID ) ? 'selected' : ''}`}>
                                                                        {splitName( rec?.name )}
                                                                    </div>
                                                                    <div className="fs-14 fw-500 text-grey patient-name">
                                                                        {rec.name}
                                                                    </div>
                                                                </div>
                                                                <div className="fs-12 fw-500 text-light-grey time " style={{ position: 'absolute', right: '3px' }}>
                                                                    {trim( moment( rec.createdAt ).fromNow( true ) )}
                                                                </div>
                                                            </div>
                                                        )
                                                    } )}
                                                </div>
                                            )

                                        } )}
                                </div>
                            </div>
                            <div className="drop-divider"></div>
                            <div className="padding-box">
                                <div className="fs-12 text-grey fw-500 mb-3">
                                    My Account
                                </div>

                                <Dropdown>
                                    <Dropdown.Toggle id="dropdown-basic" className='bg-transparent border-0 p-0'>
                                        <div className="d-flex align-items-center gap-2 account-info">
                                            <div className="account-img">
                                                <span className="iconify" data-icon="carbon:user"></span>
                                            </div>
                                            <div className="fs-14 fw-500 text-grey account-name break-all flex-1">
                                                {user.email}
                                            </div>
                                        </div>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="javascript:void(0)" className='d-flex align-items-center gap-2'>
                                            <div className="fs-20 mb-1">
                                                <span class="iconify" data-icon="solar:settings-broken"></span>
                                            </div>
                                            <div className="text">
                                                Settings
                                            </div>
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => logout()} href="javascript:void(0)" className='d-flex align-items-center gap-2'>
                                            <div className="fs-20 mb-1">
                                                <span class="iconify" data-icon="uiw:logout"></span>
                                            </div>
                                            <div className="text">
                                                Logout
                                            </div>
                                        </Dropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown>

                            </div>
                        </div>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>

    )
}

export default Sidebar