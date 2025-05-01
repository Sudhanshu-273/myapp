import express from 'express';
import { getCustomer, add_subscription, getDurations, getPlanTypes } from '../../controllers/member/customer.js';
const router = express.Router();

router.get('/get_customer',  getCustomer);
router.post('/add_subscription',  add_subscription);
router.get('/plans/durations', getDurations);
router.get('/plans/types', getPlanTypes);
export default router;
