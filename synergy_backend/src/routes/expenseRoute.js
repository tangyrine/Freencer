import express from "express";
import { createExpense, displayExpense, editExpense, deleteExpense} from "../controllers/expense.js";

const router = express.Router();

router.post("/create", createExpense);
router.patch("/edit", editExpense);
router.get("/display", displayExpense);
router.delete("/delete", deleteExpense);
export default router;