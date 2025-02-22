import pool from "../../db.js";
import { authenticateToken } from "./jwt.js";
import { v4 as uuidv4 } from "uuid";

// Create a new expense
export const createExpense = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const { project_id, description, category = 'software and tools', amount } = req.body;
            const userEmail = req.user.email;

            // Validate required fields
            if (!project_id || !description || !amount) {
                return res.status(400).json({ error: "Project ID, description, and amount are required" });
            }

            // Get user ID from email
            const userQuery = `SELECT user_id FROM "user" WHERE email = $1`;
            const userResult = await pool.query(userQuery, [userEmail]);
            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            const user_id = userResult.rows[0].user_id;

            // Generate a new expense ID
            const expense_id = uuidv4();

            // Insert into expenses table
            const insertQuery = `
                INSERT INTO expenses (expense_id, user_id, project_id, description, category, amount)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
            const insertValues = [expense_id, user_id, project_id, description, category, amount];

            const expenseResult = await pool.query(insertQuery, insertValues);
            return res.status(201).json({ message: "Expense created successfully", expense: expenseResult.rows[0] });
        });
    } catch (error) {
        console.error("Error creating expense:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Edit an existing expense
export const editExpense = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const { expense_id, description, category, amount } = req.body;

            if (!expense_id) {
                return res.status(400).json({ error: "Expense ID is required" });
            }

            let updateFields = [];
            let updateValues = [];
            let index = 1;

            if (description !== undefined) {
                updateFields.push(`description = $${index}`);
                updateValues.push(description);
                index++;
            }
            if (category !== undefined) {
                updateFields.push(`category = $${index}`);
                updateValues.push(category);
                index++;
            }
            if (amount !== undefined) {
                updateFields.push(`amount = $${index}`);
                updateValues.push(amount);
                index++;
            }

            if (updateFields.length === 0) {
                return res.status(400).json({ error: "No fields provided to update" });
            }

            const updateQuery = `
                UPDATE expenses
                SET ${updateFields.join(", ")}
                WHERE expense_id = $${index}
                RETURNING *;
            `;
            updateValues.push(expense_id);

            const updatedExpense = await pool.query(updateQuery, updateValues);
            if (updatedExpense.rows.length === 0) {
                return res.status(404).json({ error: "Expense not found" });
            }

            return res.status(200).json({ message: "Expense updated successfully", expense: updatedExpense.rows[0] });
        });
    } catch (error) {
        console.error("Error updating expense:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Display a single expense by ID
export const displayExpense = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const { expense_id } = req.body;

            if (!expense_id) {
                return res.status(400).json({ error: "Expense ID is required" });
            }

            const query = `
                SELECT expense_id, user_id, project_id, description, category, amount
                FROM expenses
                WHERE expense_id = $1;
            `;
            const values = [expense_id];

            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Expense not found" });
            }

            return res.status(200).json({ expense: result.rows[0] });
        });
    } catch (error) {
        console.error("Error fetching expense details:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const { expense_id } = req.body;

            if (!expense_id) {
                return res.status(400).json({ error: "Expense ID is required" });
            }

            // Check if the expense exists
            const checkQuery = `SELECT * FROM expenses WHERE expense_id = $1`;
            const checkResult = await pool.query(checkQuery, [expense_id]);

            if (checkResult.rows.length === 0) {
                return res.status(404).json({ error: "Expense not found" });
            }

            // Delete the expense
            const deleteQuery = `DELETE FROM expenses WHERE expense_id = $1 RETURNING *;`;
            const deleteResult = await pool.query(deleteQuery, [expense_id]);

            return res.status(200).json({ message: "Expense deleted successfully", deletedExpense: deleteResult.rows[0] });
        });
    } catch (error) {
        console.error("Error deleting expense:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
