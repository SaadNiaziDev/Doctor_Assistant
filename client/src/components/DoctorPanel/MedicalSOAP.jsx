import React, { useState } from 'react'
import { Button } from '../Shared';
import { Toast } from '../../constants';
import { Puff } from 'react-loader-spinner'
import { useLumedStore } from '../../store/lumedStore';
import TranscriptionService from '../../services/transcription.service';


export const MedicalSOAP = ( { patient, transcript, setSelectedText, setTranscription } ) => {
    const token = useLumedStore( ( state ) => state.token );
    const [ showTooltip, setShowTooltip ] = useState( false );
    const [ tooltipPosition, setTooltipPosition ] = useState( {} );
    const [ msg, setMsg ] = useState( '' );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ instruction, setInstruction ] = useState( '' );

    const regenerateText = () => {
        setIsLoading( true );
        TranscriptionService.regenerateSOAP( token, patient?.patientID, msg, instruction ).then( ( data ) => {
            if ( data.status === 200 ) {
                setTranscription( data.data )
                setIsLoading( false );
                handleDeselect();
            } else throw new Error( data.message );
        } ).catch( ( err ) => {
            Toast.fire( 'Error', err.message || 'Failed to regenerate text!', 'error' )
            console.log( err );
            setIsLoading( false );
        } )
    }


    const handleTextSelection = () => {
        const selection = window.getSelection();
        if ( !selection.rangeCount ) return;

        const range = selection.getRangeAt( 0 );
        const selectionRange = window.getSelection().getRangeAt( 0 ).getBoundingClientRect();
        const containerRect = document.getElementById( 'container' ).getBoundingClientRect();
        const selectedText = range.toString();
        setSelectedText( selectedText );
        setMsg( selectedText );
        if ( selectedText ) {
            setTooltipPosition( {
                top: selectionRange.top - containerRect.top - 30, // Adjust the value (e.g., 30) to position the tooltip properly
                left: selectionRange.left > 1150 ? 1150 : selectionRange.left < 970 ? 1000 : selectionRange.left + selectionRange.width / 2,
            } );
            // Remove the previous highlight
            const highlighted = document.querySelectorAll( '.highlight' );
            highlighted.forEach( ( el ) => {
                el.outerHTML = el.innerHTML;
            } );
        }

        if ( !selectedText ) {
            setSelectedText( "" );
            handleDeselect();
            return;
        };

        setShowTooltip( true );

        const newSpan = document.createElement( 'span' );
        newSpan.className = 'highlight';
        newSpan.style.backgroundColor = 'rgba(208, 221, 255, 1)';
        range.surroundContents( newSpan );

        range.deleteContents();
        range.insertNode( newSpan );
    };

    const handleDeselect = () => {
        setShowTooltip( false );
        setSelectedText( "" );
        setInstruction( "" );
        const highlighted = document.querySelectorAll( '.highlight' );

        highlighted.forEach( ( el ) => {
            el.outerHTML = el.innerHTML;
        } );
    }

    return (
        <>   {showTooltip && (
            <div style={{
                top: tooltipPosition.top - 5 + "px",
                left: tooltipPosition.left - 800 + "px",
            }}
                className="regenerate-box"
            >
                <div className="position-relative d-flex align-items-center w-100">
                    <button type='button' className='cross-generate' onClick={handleDeselect}><span class="iconify" data-icon="maki:cross"></span></button>

                    <div className="custom-input w-100">
                        <input type="text" placeholder="Comment" value={instruction} onChange={( e ) => setInstruction( e.target.value )} />
                    </div>
                    {!isLoading && <div onClick={() => regenerateText()}>
                        <Button additionalClasses={'gap-2'} >
                            Update <span className="iconify" data-icon="bi:stars"></span>
                        </Button>
                    </div>}
                    {isLoading && <div>
                        <Button additionalClasses={'gap-2'} >
                            Updating <Puff
                                height="20"
                                width="20"
                                radius={1}
                                color="#ffffff"
                                ariaLabel="puff-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true}
                            />
                        </Button>
                    </div>}
                </div>
            </div>
        )}

            <pre id='container' className='position-relative fs-14 fw-400 text-grey mb-3 soap-note' dangerouslySetInnerHTML={{ __html: transcript.soap }}
                onMouseUp={handleTextSelection} >
                { }
            </pre>

        </>
    )
}
