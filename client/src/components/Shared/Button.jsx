import React, { useState } from 'react'

export const Button = ( { text, additionalClasses, children, disabled } ) => {
    const [ isClicked, setIsClicked ] = useState( false );

    const handleClick = () => {
        if ( !disabled ) {
            setIsClicked( true );

            setTimeout( () => {
                setIsClicked( false );
            }, 500 );
        }
    };

    return (
        <button
            className={`btn-gradient ${additionalClasses} ${isClicked ? 'clicked' : ''}`}
            onClick={handleClick} disabled={disabled}>
            {children}
            {text}
        </button>
    )
}