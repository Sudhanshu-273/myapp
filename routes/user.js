import express from 'express';
const router = express.Router();
import { updateUser, forgotPassword, listUser, edituser } from '../controllers/user.js'

router.patch('/update', updateUser);
router.patch('/forgotPassword', forgotPassword);
router.get('/list',listUser);
router.patch('/edit', edituser);
export default router;