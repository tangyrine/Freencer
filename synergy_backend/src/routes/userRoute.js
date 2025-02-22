import express from "express";
import { displayUser, editUser, deleteUser } from "../controllers/user.js";
import { authenticateToken } from "../controllers/jwt.js";

const router = express.Router();

router.get("/display_user", authenticateToken, displayUser);
router.patch("/edit_user", authenticateToken, editUser);
router.delete("/delete_user", authenticateToken, deleteUser);

export default router;
