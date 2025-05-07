import express from "express";
import { getWeeklySales, getMonthlySales, getSales, getMonthlyUser, getWeeklyUser, getUser } from "../../controllers/admin/dashboard.js";
const router = express.Router();
// for sales
router.get('/weekly_sales', getWeeklySales);
router.get('/monthly_sales', getMonthlySales);
router.get('/get_percent', getSales);

// for user

router.get('/weekly_user', getWeeklyUser);
router.get('/monthly_user', getMonthlyUser);
router.get('/get_percent', getUser)
export default router;