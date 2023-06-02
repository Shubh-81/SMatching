import bcrpyt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

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
            if(foundUser.isUser && foundUser.verified) {
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
                res.status(200).json(foundUser);
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
        if(!user.verified) {
            await User.deleteOne({email: email});
            return res.status(400).json({message: "User does not exsist"});
        }
        const isMatch = await bcrpyt.compare(password,user.password);
        if(!isMatch)    return res.status(400).json({message: "Invalid Credentials"});
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
        delete(user.password);
        return res.status(201).json({token,user,message: "Login Successful"});
    }   catch(err) {
        res.status(500).json({error: err.message});
    }
}

export const otpVerify = async (req,res) => {
    try {
        const {email} = req.body;
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.REACT_APP_EMAIL,
              pass: process.env.REACT_APP_EMAIL_PASS,
            },
          });
          const otp = Math.floor(100000 + Math.random() * 900000);
          let mailOptions = {
            from: process.env.REACT_APP_EMAIL,
            to: email,
            subject: `Otp for verification`,
            html: `Enter OTP ${otp} for verification`,
          };
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              res.status(400).json(err);
            } else {
              res.status(200).json({otp: otp,info: info});
            }
          });
    } catch (err) {
        console.log(err);
    }
}

export const verifyUser = async (req,res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if(!user)   res.status(400).json({message: "User does not exsist"});
        if(user.verified)   res.status(400).json({message: "User already verified"});
        user.verified = true;
        await user.save();
        res.status(200).json({message: "User verified"});
    } catch(err) {
        console.log(err);
    }
}

