const mongoose = require('mongoose')
// A schema is what defines the structure of the documents we store in the database
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type:String,
        required: true
    }, 
    lastName: {
        type:String,
        required: true
    }, 
    email: {
        type:String,
        required: true
    },
    phoneNumber: {
        type:String,
        required: true
    },
    state: {
        type:String,
        required: true
    },
    county: {
        type:String,
        required: true
    },
    wantsPhoneNotif: {
        type:String,
        required: false
    },
    wantsEmailNotif: {
        type:String,
        required: false
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;