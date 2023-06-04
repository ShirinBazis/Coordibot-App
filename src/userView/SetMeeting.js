import React, { useState } from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
// import { Eventcalendar, snackbar, setOptions, Popup, Button, Input, Textarea, Switch, Datepicker, SegmentedGroup, SegmentedItem } from '@mobiscroll/react';
import Input from '../form/Input';
import Select, { SelectOption } from '../form/Select';
import axios from 'axios';

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


export default function SetMeeting({ currentUser }) {
  const [optionalLecturers, setLecturers] = useState([]);
  const [optionalRooms, setRoom] = useState('');

  const isBusy = ""
  const isBusyMessage = isBusy==""? "The robot is free right now!" : "The robot is busy right now"

  const save = async () => {
    var MeetingTitle = document.getElementById('Meeting Title').value;
    var Description = document.getElementById('Description').value;
    var Creator = document.getElementById('Creator').value;
    var Invited = optionalLecturers;
    var Location = optionalRooms;
    try {
      const response = await axios.post('https://localhost:3000', {
        MeetingTitle,
        Description,
        Creator,
        Invited,
        Location
      });

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form id="myForm" className='cube center-form'>
      <h1>Set a meeting</h1>
      <hr></hr>
      <div className='meetings'>
        <Input inputName="Meeting Title" inputType="text" text='Meeting Title' />
        <Input inputName="Description" inputType="text" text='Description' />
        <Input inputName="Creator" inputType="text" text='Creator' />
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

      <input type="button" value="Save" className="btn" onClick={save}></input>
      </div>
    </form>
  )
}
