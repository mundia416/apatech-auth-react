const mongoose = require('mongoose');

const schema = mongoose.Schema({
    email: String,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: String,
    isLoggedIn: Boolean,
    accessToken: String,
})

const model = mongoose.model('user', schema);

module.exports = model;
