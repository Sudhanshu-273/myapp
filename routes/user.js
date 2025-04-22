import express from 'express';
const router = express.Router();
import { updateUser } from '../controllers/user.js'
router.patch('/update', updateUser);
export default router;