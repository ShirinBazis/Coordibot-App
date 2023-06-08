import express from 'express';
import cors from 'cors';
import { validateLogin, usernameExists, addUser, getAllUsers } from './db.js';


const app = express();
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    let result = await validateLogin(username, password);
    if (result) {
        res.status(200).send("Login successful");
    }
    else {
        res.status(401).send("Login failed");
    }
});

app.post('/register', async (req, res) => {
    const { username,displayname, password, level } = req.body;
    if (!username || !password)
        return res.status(400).send("No username or password provided");
    else {
        let result = await addUser(username,displayname, password, level);
        if (result == 1) {
            res.status(201).send("User created successfully");
        }
        else if (result == 2) {
            res.status(409).send("Username already exists");
        }
        else {
            res.status(500).send("Internal server error");
        }
    }    
});

app.get('/users', async (req, res) => {
    // return all users
    const users = await getAllUsers();
    if (!users) {
        res.status(500).send("Internal server error");
    }
    res.status(200).send(users);
});
app.listen(4000);