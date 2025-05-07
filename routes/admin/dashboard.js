import express from "express";
import { getWeeklySales, getMonthlySales, getSales } from "../../controllers/admin/dashboard.js";
const router = express.Router();

router.get('/weekly_sales', getWeeklySales);
router.get('/monthly_sales', getMonthlySales);
router.get('/sales', getSales);

export default router;