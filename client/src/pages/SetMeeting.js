import React, { useState } from 'react';
import Input from '../tags/Input';
import Select from '../tags/Select';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { MAKE_MEETING_URL, ARRANGE_MEETING_URL, ROBOT_STATUS_URL } from './consts';


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
      alert("Estimated Time: " + response.data.data.estimatedTime.toFixed(2) + " minutes")
    } catch (error) {
      console.error(error.response.data);
    }
  }

  const handleStartMeeting = async () => {
    try {
      const response = await axios.post(MAKE_MEETING_URL, {
        "requester_id": 303,
      });
      alert(response.data.data.msg)
    } catch (error) {
      console.error(error.response.data);
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
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckCheckedDisabled" checked={isBusy} disabled />
                <label className="form-check-label" htmlFor="flexSwitchCheckCheckedDisabled">{isBusyMessage}</label>
              </div>
            </div>
          </div>
        </div>
        <div>
          <input type="button" value="Save" className="btn" onClick={handleSetMeeting} disabled={isBusy}></input>
          <input type="button" value="Start" className="btn" onClick={handleStartMeeting} disabled={!didUserSetMeeting}></input>
        </div>
      </form>
      <br></br>
      <button className="logout" onClick={logOut}>
        <div className="sign"><svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg></div>
        <div className="text">Logout</div>
      </button>
    </div>
  )
}
