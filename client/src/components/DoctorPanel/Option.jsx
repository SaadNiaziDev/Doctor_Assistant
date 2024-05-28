import React, { useState } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { UploadModal, TextButton } from '../Shared';
import { Toast } from '../../constants';
import GPTService from '../../services/gpt.service';


export const Option = ( { openUpload, setOpenUpload, summaryHide, setSummaryHide, token, patient, handleAccordionChange, gptService, setGptService } ) => {
    const [ inProgress, setInProgress ] = useState( false );
    const [ prompt, setPrompt ] = useState( '' );
    const [ isInputEnable, setIsInputEnable ] = useState( false );
    const [ feedback, setFeedback ] = useState( '' );

    const openTextArea = () => setIsInputEnable( true );

    const gptFeedBack = ( type ) => {
        setInProgress( true );
        switch ( type ) {
            case 'email': {
                handleAccordionChange( '14' );
                gptService.email = '.';
                break;
            }
            case 'insurance': {
                handleAccordionChange( '15' );
                gptService.insurance = '.';
                break;
            }
            case 'ai': {
                handleAccordionChange( '16' );
                gptService.ai = '.';
                break;
            }
            default: break;
        }
        GPTService.generateFeedback( token, patient?.patientID, type ).then( ( res ) => {
            if ( res.status === 200 ) {
                setGptService( res.data );
                setInProgress( false );
                Toast.fire( 'Success', 'Operation performed successfully!', 'success' );
            } else throw new Error( res.message );
        } ).catch( ( err ) => {
            Toast.fire( 'Failed', err.message || 'Something went wrong!', 'error' );
            setInProgress( false );
            console.log( err );
        } );
    }

    // const storeFeedback = () => {
    //     setInProgress( true );
    //     DoctorService?.saveFeedBack( token, patient?._id, feedback ).then( ( res ) => {
    //         if ( res.status === 200 ) {
    //             setFeedback( '' )
    //             setInProgress( false );
    //             Toast.fire( 'Success', res.message, 'success' );
    //         } else throw new Error( res.message );
    //     } ).catch( ( err ) => {
    //         setInProgress( false );
    //         Toast.fire( 'Failed', err.message, 'error' );
    //     } )
    // }

    const propmtResponse = () => {
        setInProgress( true );
        handleAccordionChange( '17' );
        gptService.custom.push( {
            question: prompt,
            answer: '',
        } );
        setGptService( gptService );
        GPTService.getPromptFeedback( token, patient?.patientID, prompt ).then( ( res ) => {
            if ( res.status === 200 ) {
                setGptService( res.data )
                setInProgress( false );
                setPrompt( '' );
                Toast.fire( 'Success', 'Operation performed successfully!', 'success' );
            }
            else throw new Error( res.message );
        } ).catch( ( err ) => {
            Toast.fire( 'Failed', err.message || 'Something went wrong!', 'error' );
            setInProgress( false );
            console.log( err?.message );
            setPrompt( '' );
        } );
    }

    return (
        <Accordion className='absolute-accordion' >
            <Accordion.Item eventKey="2" >
                <Accordion.Header onClick={() => setSummaryHide( !summaryHide )}  >Options</Accordion.Header>
                <Accordion.Body >
                    {isInputEnable && <>
                        <div>
                            <textarea className='labtest-textarea' value={feedback} onChange={( e ) => setFeedback( e.target.value )} placeholder='Write feedback for doctor!'>
                            </textarea>
                        </div>
                        <div className="d-flex align-items-center justify-content-end gap-3 mt-2">
                            <button className='btn-border' onClick={() => setIsInputEnable( false )}>back</button>

                            <TextButton additionalClasses="border-0 bg-transparent fs-14 fw-500 d-flex align-items-center gap-1" disabled={inProgress}>
                                <div onClick={() => {
                                    console.log( "CLiked" )
                                }}>
                                    Send <img src="/assets/images/send.svg" className='default-img' alt="" />
                                    <img src="/assets/images/send-hover.svg" className='save-img' alt="" />
                                </div>
                            </TextButton>
                        </div>
                    </>}
                    {!isInputEnable && <>
                        <button type='button' disabled={inProgress} onClick={() => gptFeedBack( 'email' )} className='btn-border h-38 mb-3 w-100' >Email Summary for Patient</button>
                        <button type='button' disabled={inProgress} onClick={() => gptFeedBack( 'insurance' )} className='btn-border gap-2 h-38 mb-3 w-100'>Insurance Authorization Request <span className="iconify" data-icon="material-symbols:health-and-safety-outline"></span></button>
                        <button type='button' disabled={inProgress} onClick={() => gptFeedBack( 'ai' )} className='btn-border h-38 mb-3 w-100'>Get AI Feedback</button>
                        <button type='button' disabled={inProgress} onClick={() => openTextArea()} className='btn-border h-38 mb-3 w-100'>Give Feedback</button>
                        <div className="drop-panel mb-3"></div>
                        <div className="fs-10 fw-400 text-dark-grey mb-1">
                            Custom Prompt
                        </div>
                        <div className="custom-input">
                            <input type="text" value={prompt} onChange={( e ) => setPrompt( e.target.value )} placeholder="Example: Write a Referral Letter to Cardiologist" />
                        </div>
                        <div className="d-flex align-items-center justify-content-end gap-3 mt-2">
                            {/* <button type='button' onClick={() => setOpenUpload( !openUpload )} className='border-0 bg-transparent text-dark-grey fs-14 fw-400 d-flex align-items-center gap-1'>
                            Upload <div className="fs-18 text-dark-grey">
                                <span className="iconify" data-icon="eva:attach-fill"></span>
                            </div>
                        </button>
                        <div className="vertical-divider"></div> */}
                            <TextButton additionalClasses="border-0 bg-transparent fs-14 fw-500 d-flex align-items-center gap-1" disabled={inProgress}>
                                <div onClick={() => propmtResponse()}>
                                    Send <img src="/assets/images/send.svg" className='default-img' alt="" />
                                    <img src="/assets/images/send-hover.svg" className='save-img' alt="" />
                                </div>
                            </TextButton>
                        </div>
                    </>}
                    {openUpload && <UploadModal openUpload={openUpload} setOpenUpload={setOpenUpload} fileType=".pdf, .docx, .txt " />}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}
