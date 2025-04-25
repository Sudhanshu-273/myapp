import express from 'express';
import { addSale } from '../../controllers/admin/sales.js'

const router = express.Router();

router.post('/add', addSale);
export default router;