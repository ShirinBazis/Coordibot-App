import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const username = 'avi711'
const password = '9bHsvbIXH0JhLlHh'
const dbName = 'CoordiBot'
const url = `mongodb+srv://${username}:${password}@cluster0.csiw8un.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    displayname: {type: String, required: true},
    password: {type: String, required: true},
    level: {type: Number, required: true},
});

const User = mongoose.model('User', userSchema, 'users');

async function connectToServer() {
    try {
        await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error(err);
    }
}

async function disconnectFromServer() {
    try {
        await mongoose.connection.close();
        console.log("Disconnected from MongoDB");
    } catch (err) {
        console.error(err);
    }
}

export async function validateLogin(username, password) {
    try {
        await connectToServer();
        const user = await User.findOne({username: username});
        if (user) {
            return await bcrypt.compare(password, user.password);
        }
        return false;
    } catch (err) {
        console.error(err);
    } finally {
        await disconnectFromServer();
    }
}


export async function addUser(username, displayname, password, level) {
    try {
        await connectToServer();
        if (await User.exists({username})) {
            console.log("User already exists");
            return 2;
        }
        if (username === "admin") {
            level = 2
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({username, displayname, password: hashedPassword, level});
        await user.save();
        console.log("User added successfully");
        return 1;
    } catch (err) {
        console.error(err);
        return 0;
    } finally {
        await disconnectFromServer();
    }
}

export async function usernameExists(username) {
    try {
        await connectToServer();
        const user = await User.findOne({username});
        return user ? true : false;
    } catch (err) {
        console.error(err);
    } finally {
        await disconnectFromServer();
    }
}


export async function updateUserLevel(username, newLevel) {
    try {
        await connectToServer();
        const result = await User.updateOne({username}, {level: newLevel});
        if (result.modifiedCount === 1) {
            console.log("User level updated successfully");
        } else {
            console.log("User not found or level was already at the desired value");
        }
    } catch (err) {
        console.error(err);
    } finally {
        await disconnectFromServer();
    }
}


export async function getAllUsers() {
    try {
        await connectToServer();
        const users = await User.find({});
        return users;
    } catch (err) {
        console.error(err);
    } finally {
        await disconnectFromServer();
    }
}

export async function getLevel(username) {
    try {
        await connectToServer();
        const user = await User.findOne({username});
        return user.level;
    } catch (err) {
        console.error(err);
    } finally {
        await disconnectFromServer();
    }
}

