import React from 'react'
import {useState, useRef} from 'react';
import {useNavigate} from "react-router-dom";
import Line from '../forms/Line';
import axios from 'axios';
import {LOGIN_URL} from './consts';


function CoolLogin() {
    const [input, setInput] = useState("");
    const [array, setArray] = useState([]);
    const count = useRef(true);
    const username = useRef("");
    const password = useRef("");
    let navigate = useNavigate();


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (count.current === true) {
                username.current = input;
            } else if (count.current == false) {
                password.current = input;
            }
            array.push({text: input, type: count.current === true ? "Username" : "Password"})
            if (count.current === false) {
                authenticate().then(() => {
                    setInput("")
                })
            } else
                setInput("")
            count.current = !count.current
        }
    };

    const authenticate = async () => {
        await axios.post(LOGIN_URL, {
            username: array[array.length - 2].text,
            password: array[array.length - 1].text
        }).then((res) => {
            setArray((a) => [...a, {text: res.data, type: "success"}]);
            localStorage.setItem("currentUser", JSON.stringify(array[array.length - 2].text));
            setTimeout(() => {
                navigate("/meetings");
            }, 800);
        }).catch((err) => {
            let type = "server_error";
            if (err.response?.status === 401) {
                type = "error";
            }
            setArray((a) => [...a, {text: "", type: type}]);
        })
    }
    const displayArr = array.map((obj, key) => {
        return <Line key={key} type={obj.type} text={obj.text}></Line>
    })
    return (
        <div>
            <div className="container_coolLogin">
                <div className="container_terminal"></div>
                <div className="terminal_toolbar">
                    <div className="butt">
                        <button className="btn_coolLogin btn_1"></button>
                        <button className="btn_coolLogin btn_2"></button>
                        <button className="btn_coolLogin btn_3"></button>
                    </div>
                    <p className="user" style={{paddingTop: '2.8%'}}>CoordiBot@Login: ~</p>
                </div>
                <div className="terminal_body">
                    {displayArr}
                    <input style={{opacity: '0%', position: 'absolute', width: '600px'}} value={input} autoFocus
                           onKeyDown={handleKeyDown} onChange={(e) => setInput(e.target.value)}></input>
                    <Line flag={1} type={count.current === true ? "Username" : "Password"} text={input}></Line>
                </div>
            </div>
            <br></br>
            <button className="backbutton" onClick={(e) => navigate('/login')}>
                <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
                    <path
                        d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"
                        fill="#FFFFFF"></path>
                </svg>
                <span>Back to regular Login</span>
            </button>
        </div>

    );
}

export default CoolLogin