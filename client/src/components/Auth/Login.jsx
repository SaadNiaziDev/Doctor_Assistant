import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Toast, apiURL } from '../../constants';
import { shallow } from "zustand/shallow";
import AuthService from '../../services/auth.service';
import { Button } from '../Shared';
import { useLumedStore } from '../../store/lumedStore';

const Login = () => {
    const navigate = useNavigate();
    const [ setUser, setToken ] = useLumedStore( ( state ) => [ state.setUser, state.setToken ], shallow );
    const [ body, setBody ] = useState( {
        email: '',
        password: ''
    } )
    const [ showPassword, setShowPassword ] = useState( false );

    const handleSubmit = ( e ) => {
        e.preventDefault();
        AuthService.login( body ).then( ( data ) => {
            if ( data.status === 200 ) {
                setBody( {
                    email: '',
                    password: ''
                } )
                setUser( data.data.user );
                setToken( data.data.token );
                navigate( '/' )
            } else throw new Error( data.message );
        } ).catch( ( err ) => Toast.fire( 'Error', err.message, 'error' ) )
    };

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
            else if ( message.data.err ) console.log( message.data.err );
        } );
    };

    return (
        <div className='auth-bg'>
            <div className="form">
                <form action="" onSubmit={handleSubmit}>
                    <div className="fs-48 fw-500 text-center">
                        Sign In
                    </div>
                    <div className="mb-4">
                        <label className='fs-14 fw-500 text-label mb-1'>Email</label>
                        <div className="form-input position-relative">
                            <input type="email" value={body.email} onChange={( e ) => setBody( { ...body, email: e.target.value } )} required autoFocus />
                            <div className="icon-input">
                                <span className="iconify" data-icon="material-symbols:mail"></span>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="d-flex align-items-cetner justify-content-between mb-1">
                            <label className='fs-14 fw-500 text-label '>Password</label>
                            <a href="javascript:void(0)" className='text-green fs-14 fw-500 text-decoration-underline'>Forgot Password?</a>
                        </div>
                        <div className="form-input password-input position-relative">
                            <input type={showPassword ? "text" : "password"} value={body.password} onChange={( e ) => setBody( { ...body, password: e.target.value } )} required />
                            <div className="icon-input">
                                <span className="iconify" data-icon="material-symbols:lock"></span>
                            </div>
                            {!showPassword && <div onClick={() => setShowPassword( true )} className='eye-icon'>
                                <span className="iconify" data-icon="nimbus:eye-off"></span>
                            </div>}
                            {showPassword && <div onClick={() => setShowPassword( false )} className='eye-icon'>
                                <span class="iconify" data-icon="nimbus:eye"></span>
                            </div>}
                        </div>
                    </div>
                    <Button disabled={body.email === "" || body.password === ""} text="Sign In" additionalClasses="w-100 h-48" >

                    </Button>

                    <div className="or">
                        or
                    </div>
                </form>
                <button className='btn-border h-48 w-100 mb-5 gap-3' onClick={() => connectGoogle()}>
                    <img src="/assets/images/google.svg" alt="" />
                    Login with Google
                </button>
                <div className="fs-14 fw-500 text-label text-center mb-3">
                    Don’t have an account?
                </div>

                <button type='button' onClick={() => navigate( '/signup' )} className='gradeint-border'>
                    <div className="bg-gradient">
                        <div className="text">
                            Create an Account
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
        </div>
    )
}

export default Login