const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
    },
    following: {
        type:[mongoose.Schema.Types.ObjectId],
        ref:"user"
    },
    followers: {
        type:[mongoose.Schema.Types.ObjectId],
        ref:"user" 
    },
    cover: {
        type: String,
    },
    isBlock: {
        type: Boolean,
        default:false
    },
    reports:{
        type:[mongoose.Schema.Types.ObjectId],
    },
    verified: Boolean

}, { timestamps: true })
const user = mongoose.model('user', userSchema)
module.exports = user