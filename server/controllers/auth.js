import bcrpyt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req,res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            choices
        } = req.body;

        const salt = await bcrpyt.genSalt();
        const passwordHash = await bcrpyt.hash(password,salt);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            choices
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }   catch(err) {
        res.status(500).json({error: err.message}); 
    }
};

export const login = async (req,res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email:email});
        if(!user)   return res.status(400).json({message: "User does not exsist"});
        const isMatch = await bcrpyt.compare(password,user.password);
        if(!isMatch)    return res.status(400).json({message: "Invalid Credentials"});
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
        delete(user.password);
        return res.status(201).json({token,user,message: "Login Successful"});
    }   catch(err) {
        res.status(500).json({error: err.message});
    }
}