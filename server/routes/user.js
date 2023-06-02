import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
    getUser,
    getUserFromEmail,
    getUserChoice,
    addRemoveChoice,
    addChoice,
    editChoice,
    resetPassword
} from '../controllers/user.js';

const router = express.Router();

router.get('/:id',verifyToken,getUser);
router.get('/:id/choices',verifyToken,getUserChoice);
router.patch('/:id/:choiceId',addRemoveChoice);
router.post('/:id/addchoices',addChoice);
router.post('/:id/editchoices',editChoice);
router.post('/useremail',getUserFromEmail);
router.post('/resetpassword',resetPassword)

export default router;