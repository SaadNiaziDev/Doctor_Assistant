import React, { useState, useEffect } from "react";
import { Toast, apiURL } from "../../constants";
import { useNavigate, useParams } from "react-router-dom";
import { AudioPlayer } from "../Shared";
import { useAudioRecorder } from "react-audio-voice-recorder";
import UploadService from "../../services/upload.service";
import TranscriptionService from "../../services/transcription.service";

const Recording = () => {
  const { startRecording, stopRecording, togglePauseResume, recordingBlob, isRecording, isPaused, recordingTime, mediaRecorder } = useAudioRecorder();
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [ text, setText ] = useState( "" );
  const [ isFetching, setIsFetching ] = useState( false );

  const msToTime = ( duration ) => {
    if ( duration > 0 ) {
      let seconds = Math.floor( duration % 60 );
      let minutes = Math.floor( ( duration % 3600 ) / 60 );

      minutes = minutes.toString().padStart( 2, "0" );
      seconds = seconds.toString().padStart( 2, "0" );

      return minutes + ":" + seconds;
    } else {
      return "00:00";
    }
  };

  const handleAction = ( file ) => {
    if ( !file ) {
      console.log( "Could not find file!" );
      return;
    }
    setIsFetching( true );
    const formData = new FormData();
    formData.append( "file", file, "recording.webm" );
    UploadService.uploadFile( formData ).then( ( res ) => {
      if ( res.status === 200 ) {
        TranscriptionService.saveTranscription( patientId, res.body )
          .then( () => {
            Toast.fire( "success", "Recording has been saved successfully", "success" );
            setIsFetching( false );
          } )
          .catch( ( error ) => {
            throw new Error( error );
          } );
      } else {
        throw new Error( res.message );
      }
    } )
      .catch( ( error ) => {
        console.log( error );
        setIsFetching( false );
      } );
  };

  useEffect( () => {
    if ( !recordingBlob ) return;
    if ( recordingBlob ) handleAction( recordingBlob );
    // recordingBlob will be present at this point after 'stopRecording' has been called
  }, [ recordingBlob ] );

  return (
    <>
      {isFetching && !text && (
        <div className="bg-blur">
          <div class="spinner-grow" role="status"></div>
        </div>
      )}
      <div className="h-100vh d-flex align-items-center">
        <div className="container">
          <div className="text-center">
            <div className="text-center mt-5 mb-5">
              <div className="audio-waves d-inline-flex align-items-center gap-4 ">
                {( !isRecording || isPaused ) && <AudioPlayer isPlaying={false} />}
                {isRecording && !isPaused && <AudioPlayer isPlaying={true} />}
                <span>{msToTime( recordingTime )}</span>
              </div>
            </div>
            {!isRecording && (
              <div>
                <div className="fs-20 fw-500 text-theme mb-5">Tap the button to start recording</div>
                <button
                  className="start-recording"
                  onClick={() => {
                    localStorage.removeItem( "text" );
                    setText( "" );
                    startRecording();
                  }}
                >
                  <span className="circle-start"></span>
                </button>
              </div>
            )}

            {/* if recording Start */}
            {isRecording && (
              <>
                <div className="fs-20 fw-500 text-theme mb-2">Recording</div>
                <div className="fs-14 fw-400 text-grey mb-5">
                  The conversation is being recorded. <br className="d-md-block d-none" />A transcription will appear on your Lumed interface.
                  {/* The conversation is being recorded <br className='d-md-block d-none' /> and our AI will summarize it on the  Lumed+ App */}
                </div>
              </>
            )}

            {/* processing recording */}
            {isFetching && (
              <>
                <div className="fs-20 fw-500 text-theme mb-2">Processing...</div>
                <div className="fs-14 fw-400 text-grey mb-5">
                  The conversation is in been process of analyzing. <br className="d-md-block d-none" /> Our AI will summarize it on the Lumed+ App
                </div>
              </>
            )}
          </div>

          {isRecording && (
            <div className="recording-box">
              <div className="d-flex align-items-center gap-5">
                <button
                  className={`play-buttons ${isPaused ? "active" : ""}`}
                  disabled={!isPaused}
                  onClick={() => {
                    togglePauseResume();
                  }}
                >
                  <span className="iconify" data-icon="ph:play-fill"></span>
                </button>
                <button
                  className={`play-buttons ${!isPaused ? " active" : ""}`}
                  disabled={isPaused}
                  onClick={() => {
                    togglePauseResume();
                  }}
                >
                  <span className="iconify" data-icon="ic:outline-pause"></span>
                </button>
                <button
                  className="play-buttons"
                  onClick={() => {
                    stopRecording();
                  }}
                >
                  <span className="iconify" data-icon="ic:round-stop"></span>
                </button>
              </div>
            </div>
          )}
          <br />
          {/* finished recodringf */}
          {text && (
            <>
              <div className="fs-20 fw-500 text-theme mb-2 text-center">Recording has finished</div>
              <div className="fs-14 fw-400 text-grey mb-5 text-center">Please see your Lumed+ to view the transcribed conversation.</div>
              <u>
                <h6 className="text-center d-block" style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate( "/" )}>
                  Close and go to Lumed+
                </h6>
              </u>
            </>
          )}

          {/* Place loader here  */}
        </div>
      </div>

    </>
  );
};

export default Recording;
