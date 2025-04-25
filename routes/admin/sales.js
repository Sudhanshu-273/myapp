import express from "express";
import { addSale } from "../../controllers/member/sales.js";

const router = express.Router();

router.post("/add", addSale);
export default router;
