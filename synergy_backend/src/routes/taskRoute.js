import express from "express";
import { createTask, displayTask, editTask, deleteTask, updateTaskStatus, sendTaskDeadlineReminders, getInvoices } from "../controllers/task.js";
import { authenticateToken } from "../controllers/jwt.js";
const router = express.Router();

router.post("/create", createTask);
router.patch("/edit", editTask);
router.delete("/delete", deleteTask);
router.patch("/change-status", updateTaskStatus);
router.get("/display", displayTask);
router.get("/reminder",sendTaskDeadlineReminders)
router.get("/invoice",authenticateToken,getInvoices)
export default router;
