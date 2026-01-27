const mongoose = require('mongoose');
const User = require('../Models/user');

const createUser = async (req, res) => {
    const body = req.body;

    if(!body.firstName || !body.Email || !body.username || !body.password) {
        return res.status(400).json({ error: "Required fields are missing" });
    }
    try {
        const newUser = new User({
            FirstName: body.firstName,
            LastName: body.lastName,
            Email: body.Email,
            Username: body.username,
            Password: body.password
        });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signInUser = async (req, res) => {
    const body = req.body;

    if(!body.credential || !body.password) {
        return res.status(400).json({ error: "Email/Username and password are required" });
    }
    try {
        // Find user by either username or email
        const user = await User.findOne({
            $or: [
                { Username: body.credential },
                { Email: body.credential }
            ]
        });

        if (!user) {
            return res.status(401).json({ error: "User does not exist" });
        }
        
        if (user.Password !== body.password) {
            return res.status(401).json({ error: "Incorrect password" });
        }
        
        res.status(200).json({ message: "Sign-in successful", user: { FirstName: user.FirstName, LastName: user.LastName, Email: user.Email, Username: user.Username } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    signInUser
};
