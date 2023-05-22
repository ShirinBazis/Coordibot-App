import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Register from "./form/Register";
import Login from "./form/Login";
import UserView from "./userView/UserView"
import './App.css';

export default function App() {
    const [currentUser, setCurrentUser] = useState("default user");
    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
    }, [currentUser])

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login setCurrentUser={setCurrentUser} />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/meetings" element={<UserView currentUser={currentUser} />}></Route>
            </Routes>
        </Router>
    );
}