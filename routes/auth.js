import express from "express";
import { login, register, sendOtp, verifyOtp } from "../controllers/auth.js";

const router = express.Router();
router.post("/login", login);

router.post("/register", register);

router.post("/send_otp", sendOtp);
router.post("/verify_otp", verifyOtp);

export default router;
