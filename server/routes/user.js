import express from "express";
import jwt from 'jsonwebtoken';
import { verifyToken } from "../middleware/auth.js";
import {
    getUser,
    getUserChoice,
    addRemoveChoice,
    addChoice
} from '../controllers/user.js';

const router = express.Router();

router.get('/:id',verifyToken,getUser);
router.get('/:id/choices',verifyToken,getUserChoice);
router.patch('/:id/:choiceId',addRemoveChoice);
router.post('/:id/addchoices',addChoice);

export default router;