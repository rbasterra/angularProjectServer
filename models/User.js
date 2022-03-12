const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: {type:String, required:true},
    name: {type:String, required: true},
    lastname: {type:String, required:true},
    email: {type:String, required: true},
    password: {type:String, required: true},
    phoneNumer: {type:String},
    birthDate: {type:Date},
    address: {type:String},
    city: {type:String},
    postal_code: {type:Number},
    province: {type:String}

}, {timestamps:true});

const User = mongoose.model('User', userSchema);

module.exports = User;