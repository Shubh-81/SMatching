import User from '../models/User.js';

export const getUser = async (req,res)=>{
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
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
        res.status(200).json({user: user}); 
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
            let query = {firstName: firstName, lastName: lastName};
            if (insta_id!="") query.insta_id = insta_id;
            if (mobileNo!="") query.mobileNo = mobileNo;
            if (email!="") query.email = email;
            const choice = await User.findOne(query);
            if(choice) {
                if(user.choices.includes(choice._id)) {
                    res.status(200).json({message: "Choice already exsists"}); 
                } else {
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
        const topTenHits = await User.find().sort({numberOfHits: -1}).limit(10);
        res.status(200).json({topHits: topTenHits});
    } catch (err) {
        res.status(500).json({message: err});
    }
}