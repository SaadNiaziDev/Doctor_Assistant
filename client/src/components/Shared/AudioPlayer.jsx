import React from 'react'

export const AudioPlayer = ( { isPlaying } ) => {
    return (
        <>
            {!isPlaying && <div className={`simple-opa d-flex gap-2`}>
                <div className="simple-sound">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                    <span className='d-md-inline-block d-none'></span>
                </div>
            </div>}
            {isPlaying && <div className={`animation-opa d-flex gap-2`}>
                <div className="sound-wave">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="sound-wave">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="sound-wave">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="sound-wave d-md-flex d-none">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="sound-wave d-md-flex d-none">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="sound-wave d-md-flex d-none">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="sound-wave d-md-flex d-none">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>}
        </>
    )
}
