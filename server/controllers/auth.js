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
            mobileNo,
            picturePath,
            insta_id
        } = req.body;
        let query = []
        if(email!='')   query.push({email: email});
        if(mobileNo!='')    query.push({mobileNo: mobileNo});
        if(insta_id!='')    query.push({insta_id: insta_id});
        const foundUser = await User.findOne({$or: query});
        if(!foundUser) {
            const salt = await bcrpyt.genSalt();
            const passwordHash = await bcrpyt.hash(password,salt);
            const newUser = new User({
                firstName,
                lastName,
                email,
                mobileNo,
                password: passwordHash,
                picturePath,
                insta_id,
            });
            const savedUser = await newUser.save();
            res.status(200).json(savedUser);
        }
        else {
            if(foundUser.isUser) {
                res.status(400).json({message: "User with one of unique entries already exsists"});
            } else {
                const salt = await bcrpyt.genSalt();
                const passwordHash = await bcrpyt.hash(password,salt);
                const saved = await foundUser.updateOne(
                    {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        mobileNo: mobileNo,
                        password: passwordHash,
                        picturePath: picturePath,
                        insta_id: insta_id,
                        isUser: true
                    });
                res.status(200).json(saved);
            }
        }
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