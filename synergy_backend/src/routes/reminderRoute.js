import express from "express";
import { getUserReminders} from "../controllers/reminder.js";
const router = express.Router();

router.get("/create",  getUserReminders);

export default router;