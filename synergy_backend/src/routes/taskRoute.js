import express from "express";
import { createTask, displayTask, editTask, deleteTask, updateTaskStatus } from "../controllers/task.js";

const router = express.Router();

router.post("/create", createTask);
router.patch("/edit", editTask);
router.delete("/delete", deleteTask);
router.patch("/change-status", updateTaskStatus);
router.get("/display", displayTask);

export default router;
