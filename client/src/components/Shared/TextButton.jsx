import React, { useState } from 'react'

export const TextButton = ( { text, additionalClasses, children, disabled } ) => {
    const [ isClicked, setIsClicked ] = useState( false );

    const handleClick = () => {
        if ( !disabled ) {
            setIsClicked( true );

            setTimeout( () => {
                setIsClicked( false );
            }, 200 );
        }
    };
    return (
        <button
            className={`text-gradient ${additionalClasses} ${isClicked ? 'clicked' : ''}`}
            disabled={disabled}
            onClick={handleClick}>
            {children}
            {text}
        </button>
    )
}