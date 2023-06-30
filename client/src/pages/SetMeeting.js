import React, { useState, useRef } from 'react';
import Input from '../tags/Input';
import Select from '../tags/Select';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { MAKE_MEETING_URL, ARRANGE_MEETING_URL, STATUS_URL, LEVEL_URL } from './consts';
import { AdminModal } from '../forms/Modals';
import ResetHidden from '../forms/ResetHidden';
import ShowHidden from '../forms/ShowHidden';
import ProgressBar from '../components/ProgressBar';
import Togglebtn from '../components/Togglebtn';



export const lecturers = [
  { name: "Talya Eden", val: 303 },
  { name: "Liam Roditty", val: 304 },
  { name: "Ester Ezra", val: 305 },
  { name: "Ely Porat", val: 306 },
  { name: "Arnold Filtser", val: 307 },
  { name: "Tsvi Kopelowitz", val: 308 },
  { name: "Amihood Amir", val: 310 },
  { name: "Sarit Kraus", val: 315 },
  { name: "David Sarne", val: 316 },
  { name: "Yoni Zohar", val: 319 },
  { name: "Noa Agmon", val: 320 },
  { name: "Gal Kaminka", val: 321 },
  { name: "Reuth Mirsky", val: 322 },
  { name: "Alex Shleyfman", val: 323 },
  { name: "Hana Weitman", val: 324 },
];

const rooms = [
  { name: "", val: 301 },
  { name: "", val: 302 },
  { name: "Talya Eden", val: 303 },
  { name: "Liam Roditty", val: 304 },
  { name: "Ester Ezra", val: 305 },
  { name: "Ely Porat", val: 306 },
  { name: "Arnold Filtser", val: 307 },
  { name: "Tsvi Kopelowitz", val: 308 },
  { name: "", val: 309 },
  { name: "Amihood Amir", val: 310 },
  { name: "", val: 311 },
  { name: "", val: 312 },
  { name: "", val: 313 },
  { name: "", val: 314 },
  { name: "Sarit Kraus", val: 315 },
  { name: "David Sarne", val: 316 },
  { name: "", val: 317 },
  { name: "", val: 318 },
  { name: "Yoni Zohar", val: 319 },
  { name: "Noa Agmon", val: 320 },
  { name: "Gal Kaminka", val: 321 },
  { name: "Reuth Mirsky", val: 322 },
  { name: "Alex Shleyfman", val: 323 },
  { name: "Hana Weitman", val: 324 },
  { name: "", val: 325 },
  { name: "", val: 327 },
  { name: "", val: 328 },
  { name: "", val: 329 },
  { name: "", val: 331 },
];


export default function SetMeeting({ optionalLecturers, setLecturers }) {
  let navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(false);
  const [didUserSetMeeting, setDidUserSetMeeting] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [levelError, setLevelError] = useState(false);
  const [userLevel , setUserLevel] = useState(0);
  const [optionalRooms, setRoom] = useState('');
  const isBusyMessage = isAvailable ? "" : ""
  const [isAdmin, setIsAdmin] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const intervalId = useRef(null);

  React.useEffect(() => {
    ResetHidden();
    const fetchUserAdminStatus = async () => {
      try {
        const response = await axios.post(LEVEL_URL, {
          username: currentUser,
        });
        const level = response.data;
        setIsAdmin(level === 2);
        setUserLevel(level);
      } catch (error) {
        console.error('Error retrieving user admin status:', error);
      }
    };

    fetchUserAdminStatus();
  }, [currentUser]); // Run the effect whenever the currentUser changes


  React.useEffect(() => {
    if (JSON.parse(localStorage.getItem('currentUser')) !== '') {
      setIsLogged(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = React.useCallback(async () => {
    if (isLogged) {
      try {
        const res = await axios.get(STATUS_URL);
        setIsAvailable(res.data.data.status === 'available');
      } catch (err) {
        setIsAvailable(false);
        console.error(err);
      }
    }
  }, [isLogged]);

  React.useEffect(() => {
    fetchData();
    intervalId.current = setInterval(fetchData, 10000);
    return () => {
      setIsLogged(false);
      //clearInterval(intervalId.current);
    };
  }, [fetchData, isLogged]);

  const logOut = () => {
    setIsLogged(false);
    localStorage.setItem('currentUser', JSON.stringify(''));
    clearInterval(intervalId.current);
    navigate("/login");
  }

  const handleSetMeeting = async () => {
    if (userLevel === 0) {
      setLevelError(true);
      return;
    }
    await fetchData();
    const MeetingTitle = document.getElementById('Meeting Title').value;
    const Description = document.getElementById('Description').value;
    const InvitedRooms = optionalLecturers.map(item => item.val);
    const LocationRoom = optionalRooms.val;
    if (ShowHidden(InvitedRooms, LocationRoom)) {
      // send request to the robot
      try {
        const response = await axios.post(ARRANGE_MEETING_URL, {
          "requester_id": currentUser,
          "title": MeetingTitle,
          "description": Description,
          "invited": InvitedRooms,
          "location": LocationRoom
        });
        setDidUserSetMeeting(true);
        let totalSeconds = response?.data?.data?.estimatedTime;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        alert("Estimated Time: " +
          (minutes > 0 ? minutes + " minute(s) " : "") +
          (seconds > 0 ? seconds + " second(s)" : ""));


      } catch (error) {
        console.error(error?.response?.data);
      }
    }
    setTimeout(() => {
      ResetHidden();
    }, 4000);
  }

  const handleStartMeeting = async () => {
    try {
      const response = await axios.post(MAKE_MEETING_URL, {
        "requester_id": currentUser,
      });
      navigate("/progress");
    } catch (error) {
      console.error(error?.response?.data);
    }
  }


  return (<div>
    <form id="myForm" className='cube meetings-form'>
      <h1 className='hello'>Hello {currentUser} !</h1>
      <h3>Please set a meeting</h3>
      {levelError && <div className="alert alert-danger">You don't have sufficient permissions </div>}
      <hr></hr>
      <div className='meetings'>
        <Input inputName="Meeting Title" inputType="text" text="Meeting Title" isRequired="yes" />
        <Input inputName="Description" inputType="text" text='Description' isRequired="yes" />
        <Select multiple options={lecturers} value={optionalLecturers} onChange={o => setLecturers(o)} label="Invited" isRequired="yes" />
        <Select options={rooms} value={optionalRooms} onChange={o => setRoom(o)} label="Location" isRequired="yes" />
        <div className="row mb-3">
          <label className="col-sm-4 col-form-label">Busy/Free:</label>
          <div className="col-sm-6">
            <div className="form-check form-switch">
              {/* without the word checked = busy */}
              {/* <input className="form-check-input" type="checkbox" role="switch"
                id="flexSwitchCheckCheckedDisabled" checked={isAvailable} disabled /> */}
              <Togglebtn isAvailable={isAvailable} />
              <label className="form-check-label"
                htmlFor="flexSwitchCheckCheckedDisabled">{isBusyMessage}</label>
            </div>
          </div>
        </div>
      </div>
      <div className='btns'>
        <button className='sendButton' onClick={e => {
          e.preventDefault();
          handleSetMeeting();
        }} disabled={!isAvailable}>
          <div className="svg-wrapper-1">
            <div className="svg-wrapper">
              <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                  fill="currentColor"></path>
              </svg>
            </div>
          </div>
          <span>Send</span>
        </button>
        <button className="startButton" onClick={e => {
          e.preventDefault();
          handleStartMeeting();
        }} disabled={!didUserSetMeeting}>Start
        </button>
      </div>
    </form>
    <br></br>
    <div className="extraBtns">
      <button className="logout" onClick={logOut}>
        <div className="sign">
          <svg viewBox="0 0 512 512">
            <path
              d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
          </svg>
        </div>
        <div className="text">Logout</div>
      </button>
      {isAdmin ? <div>
        <button className="admin" data-bs-toggle="modal" data-bs-target="#admin-modal">
          <div className="sign">
            <svg className="svg" viewBox="0 0 512 512">
              <path
                d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
            </svg>
          </div>
          <div className="text">Give Permissions</div>
        </button>
        <AdminModal />
      </div> : <div></div>}
    </div>
  </div>)
}