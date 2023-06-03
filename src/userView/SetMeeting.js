import React, { useState } from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
// import { Eventcalendar, snackbar, setOptions, Popup, Button, Input, Textarea, Switch, Datepicker, SegmentedGroup, SegmentedItem } from '@mobiscroll/react';
import Input from '../form/Input';
import Select from '../form/Select';
import axios from 'axios';



export default function SetMeeting({ currentUser }) {

  const isBusy = ""
  const isBusyMessage = isBusy==""? "The robot is free right now!" : "The robot is busy right now"

  const options = [
    { label: "First", value: 1 },
    { label: "Second", value: 2 },
    { label: "Third", value: 3 },
    { label: "Fourth", value: 4 },
    { label: "Fifth", value: 5 },
  ];

  const [value1, setValue1] = useState([]);
  const [value2, setValue2] = useState('');



  const [lecturers, setLecturers] = useState([
    { room: 1, name: 'John Doe' },
    { room: 2, name: 'Jane Smith' },
    { room: 3, name: 'Robert Johnson' },
  ]);
  const [selectedLecturers, setSelectedLecturers] = useState('');

  const handleLecturersChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedLecturers((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedLecturers((prevSelected) =>
        prevSelected.filter((lecturer) => lecturer !== value)
      );
    }
  };


  const save = async () => {
    var MeetingTitle = document.getElementById('Meeting Title').value;
    var Description = document.getElementById('Description').value;
    var Creator = document.getElementById('Creator').value;
    var Invited = document.getElementById('Invited').value;
    var Location = document.getElementById('Location').value;

    try {
      const response = await axios.post('https://localhost:3000', {
        MeetingTitle,
        Description,
        Creator,
        Invited,
        Location
      });

      console.log(response.data); // Log the response if needed
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
        <Select multiple options={options} value={value1} onChange={o => setValue1(o)} label="Invited" />
        <Select options={options} value={value2} onChange={o => setValue2(o)} label="Location" />
        {/* <Select multiple="" value={selectedContacts} onChange={handleContactChange} /> */}

        {/* <select className="form-control" id="Invited" value={selectedContacts} onChange={handleContactChange} multiple>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.name}>
                  {contact.name}
                </option>
              ))}
            </select> */}

        {/* </div>
        </div> */}
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
