import React, {useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import ResetHidden from '../forms/ResetHidden';
import ShowHidden from '../forms/ShowHidden';
import Input from '../tags/Input';
import axios from 'axios';


export default function Register() {
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    let navigate = useNavigate();
    const register = async (event) => {
        event.preventDefault();
        ResetHidden();
        if (ShowHidden()) {
            const res = await newRegister();
            if (res === 1) {
                navigate("/login");
            } else {
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
            }
        };
        setTimeout(() => {
            ResetHidden();
        }, 4000);
    }


    /*adds a new user to the list of all the users*/
    const newRegister = async () => {
        var registerUser = document.getElementById("Username").value;
        var registerNickname = document.getElementById("Nickname").value;
        var registerPassword = document.getElementById("Password").value;
        var registerPasswordVerification = document.getElementById("Password Verification").value;

        // show the errors in the invalid cases
        if (registerPassword.length < 4 || registerPassword.length > 20) {
            setError('passwordLength');
            setShowError(true)
            return 0;
        }
        if (registerPassword !== registerPasswordVerification) {
            setError('differentPasswords');
            setShowError(true)
            return 0;
        }
        let regExpNumbers = /[0-9]/g;
        if (!regExpNumbers.test(registerPassword)) {
            setError('numbers');
            setShowError(true)
            return 0;
        }
        let regExpLetters = /[a-zA-Z]/g;
        if (!regExpLetters.test(registerPassword)) {
            setError('lettersP');
            setShowError(true)
            return 0;
        }
        regExpLetters = /[a-zA-Z]/g;
        if (!regExpLetters.test(registerUser)) {
            setError('lettersU');
            setShowError(true)
            return 0;
        }
        regExpLetters = /[a-zA-Z]/g;
        if (!regExpLetters.test(registerNickname)) {
            setError('lettersN');
            setShowError(true)
            return 0;
        }
        const res = await axios(
            {
                method: 'post',
                url: 'http://localhost:4000/register',
                headers: {
                    'content-Type': 'application/json',
                },
                data:
                    {
                        username: registerUser,
                        displayname: registerNickname,
                        password: registerPassword,
                        level: 0
                    }
            }).catch(res => {
            setShowError(true)
            //check if the server isn't connected
            if (res.response?.status === 409) {
                setError('existedUsername');
            } else if (res.response?.status === 401) {
                setError('wrong');
            } else {
                setError('network');
            }
            return 2;
        });
        if (res === 2) {
            return 0;
        }
        return 1;
    }

    return (
        <>
            <form action="" className='cube center-form'>
                <h1>Register Now!</h1>
                <hr></hr>
                {showError && (
                    <>
                        {error === "existedUsername" ? (
                            <div className="alert alert-danger">This username is already in use, please choose other
                                name</div>
                        ) : null}
                        {error === "wrong" ? (
                            <div className="alert alert-danger">Can't register</div>
                        ) : null}
                        {error === "network" ? (
                            <div className="alert alert-danger">Can't reach server</div>
                        ) : null}
                        {error === "passwordLength" ? (
                            <div className="alert alert-danger">This password is too short, please choose password
                                includes at least 4 character and not more than 20</div>
                        ) : null}
                        {error === "numbers" ? (
                            <div className="alert alert-danger">The password and the varification password don't
                                match</div>
                        ) : null}
                        {error === "differentPasswords" ? (
                            <div className="alert alert-danger">The password should contain numbers too</div>
                        ) : null}
                        {error === "lettersP" ? (
                            <div className="alert alert-danger">The password should contain letters too</div>
                        ) : null}
                        {error === "lettersU" ? (
                            <div className="alert alert-danger">The username should contain letters too</div>
                        ) : null}
                        {error === "lettersN" ? (
                            <div className="alert alert-danger">The nickname should contain letters too</div>
                        ) : null}
                    </>
                )}
                <div className='register'>
                    <Input inputName="Username" inputType="text" text='Username'/>
                    <Input inputName="Nickname" inputType="text" text='Nickname'/>
                    <Input inputName="Password" inputType="password" text='Password'/>
                    <Input inputName="Password Verification" inputType="password" text='Password Verification'/>
                </div>
                <div className='register-submit'>
                    <input type="submit" value="Register" className="btn" onClick={register}></input>
                    <div className='toregister'>
                        Already registered? <Link to="/login">Click Here</Link> to login
                    </div>
                </div>
            </form>
        </>
    )
}