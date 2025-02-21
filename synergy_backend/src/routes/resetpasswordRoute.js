import express from "express";
import { sendResetEmail, resetPassword } from "../controllers/resetpassword.js";

const router = express.Router();

router.post("/send-reset-email", sendResetEmail);
router.get("/reset-password", resetPassword);

export default router;
