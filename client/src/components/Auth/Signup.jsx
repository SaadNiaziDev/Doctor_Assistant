import React, { useState } from 'react'
import { Button } from '../Shared'
import { Toast, apiURL } from '../../constants'
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../../store/Auth';
import { shallow } from 'zustand/shallow';


const Signup = () => {
    const [ body, setBody ] = useState( {
        name: '',
        email: '',
        password: '',
        confirm: '',
    } );
    const [ showPass, setShowPass ] = useState( {
        pass: false,
        confirmPass: false
    } )
    const navigate = useNavigate();
    const [ setUser, setToken ] = useAuthStore( ( state ) => [ state.setUser, state.setToken ], shallow );

    const handleSubmit = ( e ) => {
        e.preventDefault();

        fetch( apiURL + '/user/signup', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify( body )
        } ).then( ( res ) => res.json() ).then( ( data ) => {
            if ( data.status === 200 ) {
                setBody( {
                    name: '',
                    email: '',
                    password: '',
                    confirm: '',
                } )
                Toast.fire( 'Success', data.data, 'success' )
            } else {
                Toast.fire( 'Failed', data.message, 'error' )

            }
        } ).catch( ( err ) => Toast.fire( 'Failed', err.message, 'error' ) );
    }

    const onSuccessfulLogin = ( data ) => {
        setUser( data.user );
        setToken( data.token );
        navigate( "/" );
    };

    const connectGoogle = () => {
        window.open(
            apiURL + `/user/google`,
            "Login",
            "location=1,status=1,scrollbars=1, width=400,height=400"
        );
        window.addEventListener( "message", ( message ) => {
            if ( message.data.user ) onSuccessfulLogin( message.data );
            else if ( message.data.err ) {
                Toast.fire( 'error', message.data.err, 'error' )
            };
        } );
    };

    return (
        <div className='auth-bg sign-up position-relative'>
            <div className="form">

                <form action="" onSubmit={handleSubmit}>
                    <div className="fs-48 fw-500 text-center mb-4">
                        Create an Account
                    </div>
                    <div className="mb-4">
                        <label className='fs-14 fw-500 text-label mb-1'>Name</label>
                        <div className="form-input position-relative">
                            <input type="text" value={body.name} onChange={( e ) => setBody( { ...body, name: e.target.value } )} autoFocus required />
                            <div className="icon-input">
                                <span className="iconify" data-icon="material-symbols:person"></span>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className='fs-14 fw-500 text-label mb-1'>Email</label>
                        <div className="form-input position-relative">
                            <input type="email" value={body.email} onChange={( e ) => setBody( { ...body, email: e.target.value } )} required />
                            <div className="icon-input">
                                <span className="iconify" data-icon="material-symbols:mail"></span>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className='fs-14 fw-500 text-label mb-1'>Password</label>

                        <div className="form-input password-input position-relative">
                            <input type={showPass?.pass ? "text" : "password"} value={body.password} onChange={( e ) => setBody( { ...body, password: e.target.value } )} required />
                            <div className="icon-input">
                                <span className="iconify" data-icon="material-symbols:lock"></span>
                            </div>
                            {!showPass.pass && <button type='button' className='eye-icon' onClick={() => setShowPass( { ...showPass, pass: true } )}>
                                <span className="iconify" data-icon="nimbus:eye-off"></span>
                            </button>}
                            {showPass.pass && <button type='button' className='eye-icon' onClick={() => setShowPass( { ...showPass, pass: false } )}>
                                <span className="iconify" data-icon="nimbus:eye"></span>
                            </button>}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className='fs-14 fw-500 text-label mb-1'>Confirm Password</label>

                        <div className="form-input password-input position-relative">
                            <input type={showPass?.confirmPass ? "text" : "password"} value={body.confirm} onChange={( e ) => setBody( { ...body, confirm: e.target.value } )} required />
                            <div className="icon-input">
                                <span className="iconify" data-icon="material-symbols:lock"></span>
                            </div>
                            {!showPass.confirmPass && <button type='button' className='eye-icon' onClick={() => setShowPass( { ...showPass, confirmPass: true } )} >
                                <span className="iconify" data-icon="nimbus:eye-off"></span>
                            </button>}
                            {showPass.confirmPass && <button type='button' className='eye-icon' onClick={() => setShowPass( { ...showPass, confirmPass: false } )} >
                                <span className="iconify" data-icon="nimbus:eye"></span>
                            </button>}
                        </div>
                    </div>
                    <Button disabled={body.name === " " || body.email === "" || body.password === "" || body.confirm === ""} text="Create Account" additionalClasses="w-100 h-48" >

                    </Button>

                    <div className="or">
                        or
                    </div>
                </form>
                <button className='btn-border h-48 w-100 mb-5 gap-3' onClick={() => connectGoogle()}>
                    <img src="/assets/images/google.svg" alt="" />
                    Create Account With Google
                </button>
                <div className="fs-14 fw-500 text-label text-center mb-3">
                    Don’t have an account?
                </div>

                <button type='button' onClick={() => navigate( '/login' )} className='gradeint-border'>
                    <div className="bg-gradient">
                        <div className="text">
                            Sign in
                        </div>
                    </div>
                </button>
            </div>
            <div className="banner-lines">
                <img src="/assets/images/banner-lines.png" alt="" />
            </div>
            <div className="banner-dots">
                <img src="/assets/images/banner-dots.png" alt="" />
            </div>
        </div >
    )
}

export default Signup