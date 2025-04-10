import express from "express";
import { getAllEquipment, home } from "../controllers/home.js";

const router = express.Router();

router.get("/", home);
router.get("/equipment", getAllEquipment);

export default router;