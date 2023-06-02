import User from '../models/User.js';
import bcrpyt from 'bcrypt';


export const getTasks = async(req,res) => {
    try {
        const taskList = await User.find();
        res.status(200).json(taskList);
    } catch(err) {
        res.status(403).json({message: err.message})
    }
}

export const addTask = async(req,res) => {
    try {
        const { title, description } = req.body;
        const newTask = {
            title: title,
            description: description
        }
        const task = new User(newTask);
        await task.save();
        res.status(201).json(task);
    } catch(err) {
        res.status(403).json({message: err.message})
    }
}

export const deleteTask = async(req,res) => {
    try {
        const {taskId} = req.body;
        const task = await User.findByIdAndDelete(taskId);
        res.status(200).json(task);
    } catch(err) {
        res.status(403).json({message: err.message})
    }
}

