import express from 'express';
const router = express.Router();
import { updateUser, forgotPassword, listUser } from '../controllers/user.js'

router.patch('/update', updateUser);
router.patch('/forgotPassword', forgotPassword);
router.get('/list',listUser);

export default router;