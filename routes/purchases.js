import express from 'express';
import { addPurchase } from '../controllers/purchases.js';

const router = express.Router();

router.post('/add', addPurchase);

export default router;