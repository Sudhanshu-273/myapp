import express from 'express';
import { getCustomer } from '../controllers/customer.js';
const router = express.Router();

router.get('/get_customer',  getCustomer);
export default router;
