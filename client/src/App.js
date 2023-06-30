import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import React, {useState, useEffect} from 'react';
import Register from "./pages/Register";
import Login from "./pages/Login";
import SetMeeting from "./pages/SetMeeting"
import CoolLogin from "./pages/CoolLogin";
import ProgressBar from "./pages/progressBar"
import './css/App.css';
import './css/CoolLogin.css'
import './css/Togglebtn.css'
import './css/List.css'

export default function App() {
    const [currentUser, setCurrentUser] = useState('');
    const [optionalLecturers, setLecturers] = useState([]);
    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
    }, [currentUser])

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login"/>}></Route>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/cool-login" element={<CoolLogin/>}></Route>
                <Route path="/register" element={<Register/>}></Route>
                <Route path="/meetings" element={<SetMeeting optionalLecturers={optionalLecturers} setLecturers={setLecturers}/>}></Route>
                <Route path="/progress" element={<ProgressBar optionalLecturers={optionalLecturers} />}></Route>
            </Routes>
        </Router>
    );
}