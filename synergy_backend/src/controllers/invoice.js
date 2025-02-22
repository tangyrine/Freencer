import pool from "../../db.js";
import { authenticateToken } from "./jwt.js";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import fs from "fs";
import cron from "node-cron";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const createInvoice = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const { project_id, client_name, bank_info } = req.body;
            const userEmail = req.user.email;

            // Get user ID from email
            const userQuery = `SELECT user_id FROM "user" WHERE email = $1`;
            const userResult = await pool.query(userQuery, [userEmail]);
            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            const user_id = userResult.rows[0].user_id;

            // Get project details
            const projectQuery = `SELECT deadline, clientperhourpay FROM project WHERE project_id = $1`;
            const projectResult = await pool.query(projectQuery, [project_id]);
            if (projectResult.rows.length === 0) {
                return res.status(404).json({ error: "Project not found" });
            }
            const { deadline, clientperhourpay } = projectResult.rows[0];

            // Get total hours worked
            const taskQuery = `SELECT SUM(total_no_of_hours) AS total_hours FROM task WHERE project_id = $1`;
            const taskResult = await pool.query(taskQuery, [project_id]);
            const total_hours = parseFloat(taskResult.rows[0].total_hours) || 0;

            // Get all expenses for the project
            const expenseQuery = `SELECT description, amount FROM expenses WHERE project_id = $1;`;
            const expenseResult = await pool.query(expenseQuery, [project_id]);
            const expenses = expenseResult.rows;
            const total_expenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

            // Calculate total amount
            const total_amount = total_hours * clientperhourpay + total_expenses;
            const invoice_id = uuidv4();
            const creation_date = new Date().toISOString().split("T")[0];

            // Insert invoice into database
            const insertQuery = `
                INSERT INTO invoice (invoice_id, user_id, project_id, client_name, creation_date, bank_info, deadline, total_hours, total_amount, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
                RETURNING *;
            `;
            const insertValues = [invoice_id, user_id, project_id, client_name, creation_date, bank_info, deadline, total_hours, total_amount];
            const invoiceResult = await pool.query(insertQuery, insertValues);

            // Generate PDF Invoice
            const doc = new PDFDocument({ margin: 50 });
            let pdfBuffer = [];

            doc.on("data", (chunk) => pdfBuffer.push(chunk));
            doc.on("end", async () => {
                const pdfData = Buffer.concat(pdfBuffer);

                // Send invoice via email
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: userEmail,
                    subject: "Your Invoice is Ready",
                    text: `Hello ${client_name},\n\nPlease find attached your invoice.\n\nBest Regards,\nYour Company`,
                    attachments: [
                        {
                            filename: `invoice_${invoice_id}.pdf`,
                            content: pdfData,
                            contentType: "application/pdf",
                        },
                    ],
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`📧 Invoice sent to ${userEmail}`);
                    return res.status(201).json({
                        message: "Invoice created and emailed successfully",
                        invoice: invoiceResult.rows[0],
                    });
                } catch (emailError) {
                    console.error("Error sending email:", emailError);
                    return res.status(500).json({ error: "Failed to send email" });
                }
            });

            // **Header**
            doc.fillColor("#006400").fontSize(26).text("INVOICE", { align: "center", bold: true });
            doc.moveDown();

            // **Invoice Details**
            doc.fontSize(12).fillColor("black");
            doc.text(`Invoice No: ${invoice_id}`);
            doc.text(`Date: ${creation_date}`);
            doc.moveDown();

            // **Client & Payment Details**
            doc.fillColor("#006400").fontSize(14).text("Billed To", { bold: true }).fillColor("black");
            doc.text(`${client_name}`);
            doc.text(`Bank Info: ${bank_info}`);
            doc.moveDown();

            // **Project Details**
            doc.fillColor("#006400").fontSize(14).text("Project Details", { bold: true }).fillColor("black");
            doc.text(`Project ID: ${project_id}`);
            doc.text(`Deadline: ${new Date(deadline).toLocaleString()}`);
            doc.moveDown();

            // **Work Summary**
            doc.fillColor("#006400").fontSize(14).text("Work Summary", { bold: true }).fillColor("black");
            doc.text(`Total Hours Worked: ${total_hours.toFixed(2)}`);
            doc.text(`Hourly Rate: $${clientperhourpay.toFixed(2)}`);
            doc.text(`Total Earnings: $${(total_hours * clientperhourpay).toFixed(2)}`);
            doc.moveDown();

            // **Expenses Breakdown**
            doc.fillColor("#006400").fontSize(14).text("Expense Summary", { bold: true }).fillColor("black");
            if (expenses.length > 0) {
                expenses.forEach((exp, index) => {
                    doc.text(`${index + 1}. ${exp.description}: Rs${parseFloat(exp.amount).toFixed(2)}`);
                });
            } else {
                doc.text("No expenses recorded.");
            }
            doc.moveDown();

            // **Total Amount**
            doc.fillColor("#006400").fontSize(14).text("Total Amount Due", { bold: true }).fillColor("black");
            doc.text(`Total: Rs${total_amount.toFixed(2)}`, { align: "right", bold: true });
            doc.moveDown();

            doc.end();
        });
    } catch (error) {
        console.error("Error creating invoice:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const changeInvoiceStatus = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const { invoice_id, status } = req.body;
            if (!invoice_id || !["pending", "paid"].includes(status)) {
                return res.status(400).json({ error: "Invalid status or missing invoice ID" });
            }

            const updateQuery = `UPDATE invoice SET status = $1 WHERE invoice_id = $2 RETURNING *;`;
            const updateResult = await pool.query(updateQuery, [status, invoice_id]);

            if (updateResult.rows.length === 0) {
                return res.status(404).json({ error: "Invoice not found" });
            }

            return res.status(200).json({ message: "Invoice status updated", invoice: updateResult.rows[0] });
        });
    } catch (error) {
        console.error("Error updating invoice status:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const sendInvoiceReminders = async () => {
    try {
        const query = `SELECT invoice_id, user_id, client_name, total_amount FROM invoice WHERE status = 'pending'`;
        const { rows: invoices } = await pool.query(query);

        if (invoices.length === 0) {
            console.warn("⚠️ No pending invoices.");
            return;
        }

        for (const invoice of invoices) {
            const userQuery = `SELECT email FROM "user" WHERE user_id = $1`;
            const { rows: users } = await pool.query(userQuery, [invoice.user_id]);

            if (users.length === 0 || !users[0].email) {
                console.warn(`⚠️ No email found for user associated with invoice: ${invoice.invoice_id}`);
                continue;
            }

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: users[0].email,
                subject: "Invoice Payment Reminder",
                text: `📢 Reminder: Invoice #${invoice.invoice_id} for client ${invoice.client_name} of $${invoice.total_amount} is still pending. if the payment is already made update the status.`
            };

            await transporter.sendMail(mailOptions);
            console.log(`✅ Email reminder sent for invoice: ${invoice.invoice_id}`);
        }
    } catch (error) {
        console.error("❌ Error in sendInvoiceReminders:", error);
    }
};

cron.schedule("0 9 * * *", () => {
    console.log("⏳ Running scheduled invoice payment reminders...");
    sendInvoiceReminders();
});
