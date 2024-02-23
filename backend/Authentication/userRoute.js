const express = require('express');
const router = express.Router();
const User = require('../dbModel/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

router.post('/signup', async (req, res) => {
    const { userId, password } = req.body;
    if (!userId || !password) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    try {
        const user = await User.findOne({ userId });
        if (user) {
            return res.status(422).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userId,
            password: hashedPassword
        });
        await newUser.save();
        newUser.password = undefined;
        res.status(201).json({ message: "User created successfully", user: newUser, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/login', async (req, res) => {
    const { userId, password } = req.body;
    if (!userId || !password) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    try {
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(422).json({ error: "Invalid User" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(422).json({ error: "Invalid User" });
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET);
        res.status(200).json({ token, user, success: true, message: "User logged in successfully , You can start the quiz" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// get user details by token 
router.post('/user', async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { _id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized not found" });
        }
        user.password = undefined;
        res.status(200).json({ user, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;