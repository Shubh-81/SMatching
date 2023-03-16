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
        const choice = await User.findById(choice);
        if(user.choices.includes(choice)) {
            user.choices = user.choices.filter((id)=>id!=choiceId);
        }
        else {
            user.choices.push(choiceId);
        }
        const choices = await Promise.all(user.choices.map((id)=> User.findById(id)));
        const formattedChoices = choices.map(({_id,firstName,lastName,picturePath})=>{
            return {_id,firstName,lastName,picturePath};
        });
        res.status(200).json(formattedChoices); 
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}