import express from "express";
import { createProject, displayProject, editProject, deleteProject, updateProjectStatus , sendProjectDeadlineReminders, dashboard} from "../controllers/project.js";

const router = express.Router();

router.post("/create", createProject);
router.patch("/edit", editProject);
router.delete("/delete", deleteProject);
router.patch("/change-status", updateProjectStatus);
router.get("/display", displayProject);
router.get("/reminder",sendProjectDeadlineReminders)
router.get("/dashboard", dashboard)
export default router;
