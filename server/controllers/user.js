import User from '../models/User.js';
import bcrpyt from 'bcrypt';

export const getUser = async (req,res)=>{
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch(err) {
        res.status(403).json({message: err.message});
    }
}

export const getUserFromEmail = async (req,res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(user)    res.status(200).json(user);
        else {
            res.status(404).json({message: "User not found"});
        }
    } catch(err) {
        res.status(403).json({message: err.message});
    }
}

export const getUserChoice = async (req,res)=> {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        const choices = await Promise.all(user.choices.map((id)=> User.findById(id)));
        const formattedChoices = choices.map(({_id,firstName,lastName,picturePath})=>{
            return {_id,firstName,lastName,picturePath};
        });
        res.status(200).json(formattedChoices);
    } catch(err) {
        res.status(403).json({message: err.message});
    }
}

export const addRemoveChoice = async (req,res) => {
    try {
        const {id,choiceId} = req.params;
        const user = await User.findById(id);
        const choice = await User.findById(choiceId);
        if(user.choices.includes(choiceId)) {
            user.choices = user.choices.filter((id)=>id!=choiceId);
            const updatVal = choice.numberOfHits - 1;
            await choice.updateOne({numberOfHits: updatVal});
        }
        else {
            return res.status(404).json({message: "Choice does not exsist"})
        }
        const savedU = await user.updateOne({choices: user.choices})
        const choices = await Promise.all(user.choices.map((id)=> User.findById(id)));
        const formattedChoices = choices.map(({_id,firstName,lastName,picturePath})=>{
            return {_id,firstName,lastName,picturePath};
        });
        res.status(200).json({userChoices: formattedChoices}); 
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const addChoice = async (req,res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        const {firstName, lastName, insta_id, mobileNo, email} = req.body;
        if(insta_id=="" && mobileNo=="" && email=="") {
            res.status(400).json({message:"Please enter atleast one feild"})
        } else {
            let query = [];
            if (insta_id!="") query.push({insta_id: insta_id});
            if (mobileNo!="") query.push({mobileNo: mobileNo});
            if (email!="") query.push({email: email})
            const choice = await User.findOne({$or: query});
            if(choice) {
                if(user.choices.includes(choice._id)) {
                    res.status(200).json({message: "Choice already exsists"}); 
                } else if(userId==choice._id) {
                    res.status(200).json({message: "Cannot Set Yourself as your choice"});
                } 
                else {
                    user.choices.push(choice._id) 
                    const updateVal = choice.numberOfHits + 1;
                    await choice.updateOne({numberOfHits: updateVal});
                    const savedU = await user.updateOne({choices: user.choices})
                    res.status(200).json({message: "Success"}); 
                }
            }
            else {
                const newUser = new User({
                    firstName,
                    lastName,
                    insta_id,
                    mobileNo,
                    email,
                    numberOfHits: 1,
                    isUser: false
                });
                const savedUser = await newUser.save();
                user.choices.push(savedUser._id);
                const savedU = await user.updateOne({choices: user.choices})
                res.status(200).json({message: "Success"}); 
            }
        }
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const getTopUser = async (req,res) => {
    try {
        const topTenHits = await User.find().sort({numberOfHits: -1}).limit(5);
        res.status(200).json({topHits: topTenHits});
    } catch (err) {
        res.status(500).json({message: err});
    }
}

export const editChoice = async (req,res) => {
    try {
        const userId =  req.params.id;
        const {updatedChoices} = req.body;
        const user = await User.findById(userId);
        if(!user)   return res.status(404).json({message: "User does not exsist"});
        else {
            user.choices = updatedChoices;
            await user.save();
            res.status(200).json({message: "Success"});
        }
    } catch (err) {
        res.status(500).json({error: err});
    }
}

export const resetPassword = async (req,res) => {
    try {
        const {userId} = req.body;
        const {password} = req.body;
        const user = await User.findById(userId);
        if(!user)   return res.status(404).json({message: "User does not exsist"});
        else {
            const salt = await bcrpyt.genSalt();
            const passwordHash = await bcrpyt.hash(password,salt);
            user.password = passwordHash;
            await user.save();
            res.status(200).json({message: "Success"});
        }
    } catch (err) {
        res.status(500).json({error: err});
    }
}