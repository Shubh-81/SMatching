import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {timestamps: true});

const User = mongoose.model('User',UserSchema);
export default User;