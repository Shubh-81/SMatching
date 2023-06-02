import express from "express";
import {
    getTasks,
    addTask,
    deleteTask
} from '../controllers/user.js';

const router = express.Router();

router.post('/addtask',addTask);
router.get('/gettasks',getTasks);
router.post('/deletetask',deleteTask)

export default router;