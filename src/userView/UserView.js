import React, { useState } from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
// import { Eventcalendar, snackbar, setOptions, Popup, Button, Input, Textarea, Switch, Datepicker, SegmentedGroup, SegmentedItem } from '@mobiscroll/react';
import Input from '../form/Input';
import axios from 'axios';



export default function UserView({ currentUser }) {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Robert Johnson' },
  ]);
  const [selectedContacts, setSelectedContacts] = useState('');
  
  const handleContactChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedContacts((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedContacts((prevSelected) =>
        prevSelected.filter((contact) => contact !== value)
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
      {/* {(error === 'wrong') ? (<div className="alert alert-danger">Wrong password or username</div>) : ""}
            {(error === 'network') ? (<div className="alert alert-danger">Can't reach server</div>) : ""}
             */}
      <div className='meetings'>
        <Input inputName="Meeting Title" inputType="text" text='Meeting Title' />
        <Input inputName="Description" inputType="text" text='Description' />
        <Input inputName="Creator" inputType="text" text='Creator' />
        {/* <Input inputName="Invited" inputType="text" text='Invited' /> */}
        <div className="row mb-3">
          <label className="col-sm-4 col-form-label" htmlFor="Invited">
            Invited
          </label>
        <div className="col-sm-6">
        {/* <select className="form-control" id="Invited" value={selectedContacts} onChange={handleContactChange} multiple>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.name}>
                  {contact.name}
                </option>
              ))}
            </select> */}
            {contacts.map((contact) => (
              <div key={contact.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`contact-${contact.id}`}
                  value={contact.name}
                  checked={selectedContacts.includes(contact.name)}
                  onChange={handleContactChange}
                />
                <label
                  className="form-check-label"
                  htmlFor={`contact-${contact.id}`}
                >
                  {contact.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <Input inputName="Location" inputType="text" text='Location' />

      </div>
      <div>
        <input type="button" value="Save" className="btn" onClick={save}></input>
      </div>
    </form>
  )
}
