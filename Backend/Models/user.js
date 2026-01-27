const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    FirstName: { type: String, required: true },
    LastName: { type: String},
    Email: { type: String, required: true, unique: true },
    Username: { type: String, required: true, unique: true },
    Password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;