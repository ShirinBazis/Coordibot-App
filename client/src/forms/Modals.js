import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios';
import Select from '../tags/Select';
import styles from "../css/select.module.css"



const levels = [
    { name: "0", val: 0 },
    { name: "1", val: 1 },
    { name: "2", val: 2 }
]

export function AdminModal() {
    const modalRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [currentLevel, setCurrentLevel] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const response = await axios.get('http://localhost:4000/users');
            const usersData = response.data;
            setUsers(usersData);
        } catch (error) {
            console.error('Error retrieving users:', error);
        }
    };

    const handleUserChange = (user) => {
        setSelectedUser(user);
        setCurrentLevel(user.level)
    };


    const handleLevelChange = (level) => {
        setSelectedLevel(level);
        console.log("set to", level.val)
    };

    const saveUserLevel = async () => {
        try {
            console.log(selectedUser.name, selectedLevel.val)
            await axios.post('http://localhost:4000/update-user-level', {
                username: selectedUser.name,
                newLevel: selectedLevel.val,
            });
            console.log('User level updated successfully');
        } catch (error) {
            console.error('Error updating user level:', error);
        }
    };

    return (
        <div ref={modalRef} className="modal fade" id="admin-modal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Give Permissions</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <Select
                            options={users.length > 0 ? users.map((user) => ({ name: user.username, val: user.username, level: user.level })) : []}
                            value={selectedUser} onChange={handleUserChange} label="Choose a user:" />

                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Current Level:</label>
                            <div className="col-sm-6">
                                <div className={styles.container}>
                                    <span
                                        id="current-level"
                                        className={styles.value}>
                                        {currentLevel}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Select options={levels} value={selectedLevel} onChange={handleLevelChange} label="Choose a level:" />
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" id="save" onClick={saveUserLevel} data-bs-dismiss="modal" aria-label="Close">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}