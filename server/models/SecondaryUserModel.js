const mongoose = require('mongoose');

/**
 * secondary user model keeps track of  a secondary authentication under the primary authentication
 */
const schema = mongoose.Schema({
      /**the email of the parent this belongs to */
      primaryUserEmail: String,
    
    email: String,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: String,
    isLoggedIn: Boolean,
    accessToken: String,
})

const model = mongoose.model('secondary-user', schema);

module.exports = model;
