import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Select from '../tags/Select';


export function AdminModal() {
    const modalRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState('');

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

    const handleUserChange = (event) => {
        const userId = event.target.value;
        console.log(userId)
        const selectedUser = users.find((user) => user.username === userId);
        console.log(selectedUser.username)
        setSelectedUser(selectedUser);
    };

    const handleLevelChange = (event) => {
        setSelectedLevel(event.target.value);
    };

    const saveUserLevel = async () => {
        try {
            await axios.post('http://localhost:4000/update-user-level', {
                username: selectedUser.username,
                newLevel: selectedLevel,
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
                        <div className="form-group">
                            <label htmlFor="user-select">Choose user:</label>
                            <select id="user-select" className="form-control" value={selectedUser?.id} onChange={handleUserChange}>
                                <option value="">Select a user</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedUser && (
                            <div className="form-group">
                                <label htmlFor="level-select">Level:</label>
                                <select
                                    id="level-select"
                                    className="form-control"
                                    value={selectedLevel}
                                    onChange={handleLevelChange}
                                >
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                </select>

                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={saveUserLevel}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export function ProfileImageModal({ sorce = "contactImage.webp" }) {
    document.addEventListener("change", () => {
        const img_input = document.getElementById("img_input");
        if (img_input) {
            var uploaded_image = "";
            img_input.addEventListener("change", function () {
                const reader = new FileReader();
                document.getElementById("post-img-btn").addEventListener("click", () => {
                    var profile = document.getElementById("profile");
                    profile.src = reader.result;
                })
                reader.addEventListener("load", () => {
                    uploaded_image = reader.result;
                    var previewPic = document.getElementById('preview-pic');
                    previewPic.src = uploaded_image;
                });
                reader.readAsDataURL(this.files[0]);
            })
        }
    })
    return (
        <div className="modal fade" id="addPicture-modal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Set profile picture</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className='preview-pic-div'>
                        <img src={sorce} id="preview-pic" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                        <input type="file" id="img_input" accept="image/*"></input>
                    </div>
                    <div className="modal-footer">
                        <button id="post-img-btn" type="button" className="btn btn-primary" data-bs-dismiss="modal">Done</button>
                    </div>
                </div>
            </div>
        </div>
    )
}