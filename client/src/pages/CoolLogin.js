import React from 'react'
import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Line from '../forms/Line';
import axios from 'axios';


function CoolLogin() {
    const [input, setInput] = useState("");
    const [arr, setArr] = useState([]);
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
            arr.push({ text: input, type: count.current === true ? "Username" : "Password" })
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
        await axios.post('http://localhost:4000/login', {
            username: arr[arr.length - 2].text,
            password: arr[arr.length - 1].text
        }).then((res) => {
            setArr((a) => [...a, { text: res.data, type: "success" }]);
            setTimeout(() => {
                navigate("/meetings");
            }, 800);
        }).catch((err) => {
            let type = "server_error";
            if (err.response?.status === 401) {
                type = "error";
            }
            setArr((a) => [...a, { text: "", type: type }]);
        })
    }
    const displayArr = arr.map((obj, key) => {
        return <Line key={key} type={obj.type} text={obj.text}></Line>
    })
    return (
        <div className="container_coolLogin">
            <div className="container_terminal"></div>
            <div className="terminal_toolbar">
                <div className="butt">
                    <button className="btn_coolLogin btn_1"></button>
                    <button className="btn_coolLogin btn_2"></button>
                    <button className="btn_coolLogin btn_3"></button>
                </div>
                <p className="user" style={{ paddingTop: '2.8%' }}>CoordiBot@Login: ~</p>
            </div>
            <div className="terminal_body">
                {displayArr}
                <input style={{ opacity: '0', position: 'absolute', width: '100%' }} value={input} autoFocus onKeyDown={handleKeyDown} onChange={(e) => setInput(e.target.value)}></input>
                <Line flag={1} type={count.current === true ? "Username" : "Password"} text={input}></Line>
            </div>
        </div>
    );
}

export default CoolLogin