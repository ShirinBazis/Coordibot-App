import React, { useState } from 'react';
import Input from '../tags/Input';
import Select from '../tags/Select';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { MAKE_MEETING_URL, ARRANGE_MEETING_URL, ROBOT_STATUS_URL } from './consts';
import { AdminModal } from '../forms/Modals';



const lecturers = [
  { name: "Talya Eden", room: 303 },
  { name: "Liam Roditty", room: 304 },
  { name: "Ester Ezra", room: 305 },
  { name: "Ely Porat", room: 306 },
  { name: "Arnold Filtser", room: 307 },
  { name: "Tsvi Kopelowitz", room: 308 },
  { name: "Amihood Amir", room: 310 },
  { name: "Sarit Kraus", room: 315 },
  { name: "David Sarne", room: 316 },
  { name: "Yoni Zohar", room: 319 },
  { name: "Noa Agmon", room: 320 },
  { name: "Gal Kaminka", room: 321 },
  { name: "Reuth Mirsky", room: 322 },
  { name: "Alex Shleyfman", room: 323 },
  { name: "Hana Weitman", room: 324 },
];

const rooms = [
  { name: "", room: 301 },
  { name: "", room: 302 },
  { name: "Talya Eden", room: 303 },
  { name: "Liam Roditty", room: 304 },
  { name: "Ester Ezra", room: 305 },
  { name: "Ely Porat", room: 306 },
  { name: "Arnold Filtser", room: 307 },
  { name: "Tsvi Kopelowitz", room: 308 },
  { name: "", room: 309 },
  { name: "Amihood Amir", room: 310 },
  { name: "", room: 311 },
  { name: "", room: 312 },
  { name: "", room: 313 },
  { name: "", room: 314 },
  { name: "Sarit Kraus", room: 315 },
  { name: "David Sarne", room: 316 },
  { name: "", room: 317 },
  { name: "", room: 318 },
  { name: "Yoni Zohar", room: 319 },
  { name: "Noa Agmon", room: 320 },
  { name: "Gal Kaminka", room: 321 },
  { name: "Reuth Mirsky", room: 322 },
  { name: "Alex Shleyfman", room: 323 },
  { name: "Hana Weitman", room: 324 },
  { name: "", room: 325 },
  { name: "", room: 327 },
  { name: "", room: 328 },
  { name: "", room: 329 },
  { name: "", room: 331 },
];


export default function SetMeeting() {
  let navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);
  const [didUserSetMeeting, setDidUserSetMeeting] = useState(false);
  const [optionalLecturers, setLecturers] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [optionalRooms, setRoom] = useState('');
  const isBusyMessage = isBusy ? "The robot is busy right now" : "The robot is free right now!"
  const [isadmin, setIsAdmin] = useState(true);
//falseee

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  React.useEffect(() => {
    const fetchUserAdminStatus = async () => {
      try {
        console.log(currentUser)
        const response = await axios.post("http://localhost:4000/level", {
          username: currentUser,
        });
        const level = response.data;
        console.log("level", level)
        setIsAdmin(isadmin === 2);
      } catch (error) {
        console.error('Error retrieving user admin status:', error);
      }
    };

    fetchUserAdminStatus();
  }, [currentUser]); // Run the effect whenever the currentUser changes


  React.useEffect(() => {
    if (JSON.parse(localStorage.getItem('currentUser')) !== '') {
      setIsLogged(true);
    }
    else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = React.useCallback(async () => {
    if (isLogged) {
      try {
        const res = await axios.get(ROBOT_STATUS_URL);
        setIsBusy(res.data.data.status === 'busy');
      } catch (err) {
        console.error(err);
      }
    }
  }, [isLogged]);

  React.useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchData, isLogged]);

  const logOut = () => {
    localStorage.setItem('currentUser', JSON.stringify(''));
    navigate("/login");
  }

  const handleSetMeeting = async () => {
    fetchData();
    const MeetingTitle = document.getElementById('Meeting Title').value;
    const Description = document.getElementById('Description').value;
    const InvitedRooms = optionalLecturers.map(item => item.room);
    const LocationRoom = optionalRooms.room;
    if (InvitedRooms.length === 0) {
      console.error("Missing invited");
      return;
    }
    if (LocationRoom == null) {
      console.error("Missing location");
      return;
    }
    if (MeetingTitle === '') {
      console.error("Missing meeting title");
      return;
    }
    if (isBusy) {
      console.error("Robot is busy");
      return;
    }

    // send request to the robot
    try {
      const response = await axios.post(ARRANGE_MEETING_URL, {
        "requester_id": 303,
        "title": MeetingTitle,
        "description": Description,
        "invited": InvitedRooms,
        "location": LocationRoom
      });
      setDidUserSetMeeting(true);
      alert("Estimated Time: " + response?.data?.data?.estimatedTime.toFixed(2) + " minutes")
    } catch (error) {
      console.error(error?.response?.data);
    }
  }

  const handleStartMeeting = async () => {
    try {
      const response = await axios.post(MAKE_MEETING_URL, {
        "requester_id": 303,
      });
      alert(response?.data.data.msg)
    } catch (error) {
      console.error(error?.response?.data);
    }
  }

  return (
    <div>
      <form id="myForm" className='cube meetings-form'>
        <h1>Set a meeting</h1>
        <hr></hr>
        <div className='meetings'>
          <Input inputName="Meeting Title" inputType="text" text='Meeting Title' />
          <Input inputName="Description" inputType="text" text='Description' />
          <Select multiple options={lecturers} value={optionalLecturers} onChange={o => setLecturers(o)} label="Invited" />
          <Select options={rooms} value={optionalRooms} onChange={o => setRoom(o)} label="Location" />

          <div className="row mb-3">
            <label className="col-sm-4 col-form-label">Free/Busy:</label>
            <div className="col-sm-6">
              <div className="form-check form-switch">
                {/* without the word checked = busy */}
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckCheckedDisabled" checked={isBusy ? "" : "busy"} disabled />
                <label className="form-check-label" htmlFor="flexSwitchCheckCheckedDisabled">{isBusyMessage}</label>
              </div>
            </div>
          </div>
        </div>
        <div className='btns'>
          <button className='sendButton' onClick={e => {
                                    e.preventDefault()
                                    handleSetMeeting()
                                  }} disabled={isBusy}>
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" fill="currentColor"></path>
                </svg>
              </div>
            </div>
            <span>Send</span>
          </button>
          <button className="startButton" onClick={handleStartMeeting} disabled={!didUserSetMeeting}>Start</button>
        </div>
      </form>
      <br></br>
      <div className="extraBtns">
        <button className="logout" onClick={logOut}>
          <div className="sign">
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
          <div className="text">Logout</div>
        </button>
        {isadmin
          ?
          <div>
            <button className="admin" data-bs-toggle="modal" data-bs-target="#admin-modal">
              <div className="sign">
                <svg className="svg" viewBox="0 0 512 512">
                  <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg></div>
              <div className="text">Give Permissions</div>
            </button>
            <AdminModal />
          </div>
          : <div></div>
        }
      </div>
    </div>
  )
}
