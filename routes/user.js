import express from 'express';
const router = express.Router();
import { updateUser, forgotPassword } from '../controllers/user.js'
router.patch('/update', updateUser);
router.patch('/forgotPassword', forgotPassword);

export default router;