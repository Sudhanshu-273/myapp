import express from 'express';
import { getCustomer, addSubscriber } from '../../controllers/member/customer.js';
const router = express.Router();

router.get('/get_customer',  getCustomer);
router.post('/add_subscriber',  addSubscriber);
export default router;
