import pool from "../../db.js";
import { authenticateToken } from "../controllers/jwt.js";

export const getUserReminders = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const userEmail = req.user.email;

            // Get user ID from email
            const userQuery = `SELECT user_id FROM "user" WHERE email = $1`;
            const userResult = await pool.query(userQuery, [userEmail]);

            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            const user_id = userResult.rows[0].user_id;

            // Fetch project reminders
            const projectQuery = `
                SELECT project_name, status 
                FROM project WHERE user_id = $1;
            `;
            const projectResult = await pool.query(projectQuery, [user_id]);

            // Fetch task reminders
            const taskQuery = `
                SELECT t.task_name, t.status, p.project_name 
                FROM task t
                JOIN project p ON t.project_id = p.project_id
                WHERE p.user_id = $1;
            `;
            const taskResult = await pool.query(taskQuery, [user_id]);

            // Fetch invoice reminders
            const invoiceQuery = `
                SELECT i.status, i.client_name 
                FROM invoice i 
                WHERE i.user_id = $1;
            `;
            const invoiceResult = await pool.query(invoiceQuery, [user_id]);

            // Prepare reminders array
            let reminders = [];

            // Project Reminders
            projectResult.rows.forEach(row => {
                reminders.push({
                    type: "project",
                    message: `Project "${row.project_name}" is ${row.status}.`
                });
            });

            // Task Reminders
            taskResult.rows.forEach(row => {
                reminders.push({
                    type: "task",
                    message: `Task "${row.task_name}" in project "${row.project_name}" is ${row.status}.`
                });
            });

            // Invoice Reminders
            invoiceResult.rows.forEach(row => {
                reminders.push({
                    type: "invoice",
                    message: `Invoice for client "${row.client_name}" is ${row.status}.`
                });
            });

            return res.status(200).json({ reminders });
        });
    } catch (error) {
        console.error("Error fetching reminders:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
