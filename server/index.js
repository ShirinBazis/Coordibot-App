import express from 'express';
import axios from 'axios';
import cors from 'cors';
import {validateLogin, addUser, getAllUsers, getLevel, updateUserLevel} from './db.js';
import {MAKE_MEETING_URL, ARRANGE_MEETING_URL, ROBOT_STATUS_URL, ROBOT_PROGRESS_URL, ROBOT_NOTIFIED_URL} from './consts.js';


const app = express();
app.use(express.json());
app.use(cors());


app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    let result = await validateLogin(username, password);
    if (result) {
        res.status(200).send("Login successful");
    } else {
        res.status(401).send("Login failed");
    }
});

app.post('/register', async (req, res) => {
    const {username, displayname, password, level} = req.body;
    if (!username || !password)
        return res.status(400).send("No username or password provided");
    else {
        let result = await addUser(username, displayname, password, level);
        if (result === 1) {
            res.status(201).send("User created successfully");
        } else if (result === 2) {
            res.status(409).send("Username already exists");
        } else {
            res.status(500).send("Internal server error");
        }
    }
});

app.post('/arrangeMeeting', async (req, res) => {
    const {requester_id, title, description, invited, location} = req.body;
    try {
        const response = await axios.post(ARRANGE_MEETING_URL, {
            "requester_id": requester_id,
            "title": title,
            "invited": invited
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(error?.response?.status ?? 500).json({msg: error?.response?.data?.data?.msg ?? 'Internal Server Error'});
    }
});

app.post('/makeMeeting', async (req, res) => {
    const {requester_id} = req.body;
    try {
        const response = await axios.post(MAKE_MEETING_URL, {"requester_id": requester_id}, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.response?.status ?? 500).json({msg: error.response?.data?.data?.msg ?? 'Internal Server Error'});
    }
});

app.get('/users', async (req, res) => {
    // return all users
    try {
        const users = await getAllUsers();
        if (!users) {
            res.status(500).send("Internal server error");
        }
        res.status(200).send(users);
    } catch (error) {
        console.error(error)
    }
});

app.post('/level', async (req, res) => {
    // return a level
    try {
        const {username} = req.body;
        const level = await getLevel(username);
        if (level === undefined) {
            res.status(500).send("Internal server error");
        }
        res.status(200).json(level);
    } catch (error) {
        console.error(error)
    }
});

app.post('/update-user-level', async (req, res) => {
    const {username, newLevel} = req.body;
    await updateUserLevel(username, newLevel);
});

app.get('/status', async (req, res) => {
    try {
        const response = await axios.get(ROBOT_STATUS_URL);
        const status = response.data;
        res.status(200).json(status);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.get('/notified', async (req, res) => {
    try {
        const response = await axios.get(ROBOT_NOTIFIED_URL);
        const notified = response.data;
        res.status(200).json(notified);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


app.get('/progress', async (req, res) => {
    try {
        const response = await axios.get(ROBOT_PROGRESS_URL);
        const status = response.data;
        res.status(200).json(status);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.listen(4000);