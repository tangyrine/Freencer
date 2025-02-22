import express from "express";
import { createInvoice, changeInvoiceStatus , sendInvoiceReminders} from "../controllers/invoice.js";

const router = express.Router();

router.post("/create", createInvoice);
router.put("/status", changeInvoiceStatus);
router.get("/reminders", sendInvoiceReminders);

export default router;
