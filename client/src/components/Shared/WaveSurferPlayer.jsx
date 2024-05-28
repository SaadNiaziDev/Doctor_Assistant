import { useWavesurfer } from "../../hooks/useWaveSurfer"

import { useRef, useState, useEffect, useCallback } from 'react'


export const WaveSurferPlayer = ( props ) => {
    const containerRef = useRef()
    const [ isPlaying, setIsPlaying ] = useState( false )
    const [ currentTime, setCurrentTime ] = useState( 0 )
    const wavesurfer = useWavesurfer( containerRef, props )

    // On play button click
    const onPlayClick = useCallback( () => {
        wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
    }, [ wavesurfer ] );

    const msToTime = ( duration ) => {
        if ( duration > 0 ) {

            let seconds = Math.floor( duration % 60 );
            let minutes = Math.floor( ( duration % 3600 ) / 60 );

            minutes = minutes.toString().padStart( 2, '0' );
            seconds = seconds.toString().padStart( 2, '0' );

            return minutes + ':' + seconds
        } else {
            return '00:00'
        }
    }

    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect( () => {
        if ( !wavesurfer ) return

        setCurrentTime( 0 )
        setIsPlaying( false )
        const subscriptions = [
            wavesurfer.on( 'play', () => setIsPlaying( true ) ),
            wavesurfer.on( 'pause', () => setIsPlaying( false ) ),
            wavesurfer.on( 'timeupdate', ( currentTime ) => setCurrentTime( currentTime ) ),
        ]

        return () => {
            subscriptions.forEach( ( unsub ) => unsub() )
        }
    }, [ wavesurfer ] )

    return (
        <>
            <div className="d-flex gap-2 justify-content-center align-items-center">
                {!isPlaying &&
                    <div onClick={onPlayClick} className="fs-22">
                        <span className="iconify " data-icon="ph:play-fill" style={{ color: '#44c2ad' }}></span>
                    </div>}
                {isPlaying && <div onClick={onPlayClick} className="fs-22">
                    <span className="iconify " data-icon="material-symbols:pause" style={{ color: '#44c2ad' }}></span>
                </div>
                }
                <div ref={containerRef} style={{ width: '100%' }} />
                <span>{msToTime( currentTime )}</span>
            </div>
        </>
    )
}
