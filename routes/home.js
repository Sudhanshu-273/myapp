import express from "express";
import { getAllEquipment, home, accountTypes } from "../controllers/home.js";

const router = express.Router();

router.get("/", home);
router.get("/equipment", getAllEquipment);
router.get("/account_types", accountTypes);

export default router;