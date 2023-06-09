import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Input from '../tags/Input';
import axios from 'axios';
import ResetHidden from '../forms/ResetHidden';
import ShowHidden from '../forms/ShowHidden';

export default function Login() {

    const [error, setError] = useState("");
    let navigate = useNavigate();
    const login = async () => {
        ResetHidden();
        if (ShowHidden()) {
            var userName = document.getElementById('Username').value;
            var userPassword = document.getElementById('Password').value;
            const res = await axios(
                {
                    method: 'post',
                    url: 'http://localhost:4000/login',
                    headers: {
                        'content-Type': 'application/json',
                    },
                    data:
                    {
                        username: userName,
                        password: userPassword
                    }
                }).then((res) => {
                    setTimeout(() => {
                        navigate("/meetings");
                    }, 800);
                }).catch(res => {
                    //check if the server isn't connected
                    if (res == "Error: Network Error" || res.response?.status === 401) {
                        setError('network');
                    }
                    else {
                        setError('wrong');
                    }
                });
            document.getElementById("myForm").reset();
        }
    }

    return (
        <form id="myForm" className='cube center-form'>
            <h1>Welcome To Coordibot App</h1>
            <hr></hr>
            {(error === 'wrong') ? (<div className="alert alert-danger">Wrong password or username</div>) : ""}
            {(error === 'network') ? (<div className="alert alert-danger">Can't reach server</div>) : ""}

            <Input className="Username" inputName="Username" inputType="text" text='Username' />
            <Input className="Password" inputName="Password" inputType="password" text='Password' />
            <div>
                <input type="button" value="Login" className="btn" onClick={login}></input>
                <span className='toregister'>
                Not registered? <Link to="/register">Click here</Link> to register
                </span>
                <br></br>
                <br></br>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button className="cssbuttons-io-button" onClick={(e) => navigate('/cool-login')}> Login for geeks
                        <div className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>
                        </div>
                    </button>
                </div>
            </div>
        </form>
    )
}