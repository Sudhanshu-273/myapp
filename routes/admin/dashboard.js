import express from "express";
import { getSalesDetails, getUserDetails } from "../../controllers/admin/dashboard.js";

const router = express.Router();

// Combined endpoints
router.get('/getSalesDetail', getSalesDetails);
router.get('/getUsersDetail', getUserDetails);

export default router;
