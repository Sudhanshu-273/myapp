import express from 'express';
import { addPurchase, getProduct } from '../../controllers/admin/purchases.js';

const router = express.Router();

router.post('/add', addPurchase);
router.get('/getProduct', getProduct);

export default router;