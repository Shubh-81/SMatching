import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min:2,
        max:50
    },
    lastName: {
        type: String,
        required: true,
        min:2,
        max:50
    },
    email: {
        type: String,
        min:2,
    },
    mobileNo: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        min: 5
    },
    picturePath: {
        type: String,
    },
    choices: {
        type: Array,
        default: [] 
    },
    hits: {
        type: Array,
        default: []
    },
    commited: {
        type: Boolean,
        default: false
    },
    insta_id: {
        type: String,
        default: ""
    },
    snap_id: {
        type: String,
        default: ""
    },
    numberOfHits: {
        type: Number,
        default: 0
    },
    isUser: {
        type: Boolean,
        default: true
    }

}, {timestamps: true});

const User = mongoose.model('User',UserSchema);
export default User;