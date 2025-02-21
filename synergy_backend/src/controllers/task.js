import pool from "../../db.js";
import { authenticateToken } from "./jwt.js";
import { v4 as uuidv4 } from "uuid";

export const createTask = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const { project_id, task_name, task_description, estimated_no_of_hours, deadline } = req.body;

            if (!project_id || !task_name || !deadline) {
                return res.status(400).json({ error: "Project ID, Task Name, and Deadline are required" });
            }

            const task_id = uuidv4();
            const formattedDeadline = new Date(deadline);
            formattedDeadline.setHours(23, 59, 59, 999);
            const deadlineString = formattedDeadline.toISOString().slice(0, 19).replace("T", " ");
            const status = "pending"; // Default status

            const insertQuery = `
                INSERT INTO task (task_id, project_id, task_name, task_description, 
                    total_no_of_hours, estimated_no_of_hours, start_date, 
                    pause_date, complete_date, complete_task, deadline, status)
                VALUES ($1, $2, $3, $4, NULL, $5, NULL, NULL, NULL, NULL, $6, $7)
                RETURNING *;
            `;

            const insertValues = [task_id, project_id, task_name, task_description, estimated_no_of_hours, deadlineString, status];

            const taskResult = await pool.query(insertQuery, insertValues);
            console.log("Task created successfully:", taskResult.rows[0]);

            return res.status(201).json({ message: "Task created successfully", task: taskResult.rows[0] });
        });
    } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const editTask = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const { task_id, task_name, task_description, estimated_no_of_hours, deadline, status } = req.body;

            if (!task_id) {
                return res.status(400).json({ error: "Task ID is required" });
            }

            let updateFields = [];
            let updateValues = [];
            let index = 1;

            if (task_name !== undefined) {
                updateFields.push(`task_name = $${index}`);
                updateValues.push(task_name);
                index++;
            }
            if (task_description !== undefined) {
                updateFields.push(`task_description = $${index}`);
                updateValues.push(task_description);
                index++;
            }
            if (estimated_no_of_hours !== undefined) {
                updateFields.push(`estimated_no_of_hours = $${index}`);
                updateValues.push(estimated_no_of_hours);
                index++;
            }
            if (deadline !== undefined) {
                const formattedDeadline = new Date(deadline);
                formattedDeadline.setHours(23, 59, 59, 999);
                const deadlineString = formattedDeadline.toISOString().slice(0, 19).replace("T", " ");
                updateFields.push(`deadline = $${index}`);
                updateValues.push(deadlineString);
                index++;
            }

            if (updateFields.length === 0) {
                return res.status(400).json({ error: "No fields provided to update" });
            }

            const updateQuery = `
                UPDATE task
                SET ${updateFields.join(", ")}
                WHERE task_id = $${index}
                RETURNING *;
            `;
            updateValues.push(task_id);

            const updatedTask = await pool.query(updateQuery, updateValues);
            return res.status(200).json({ message: "Task updated successfully", task: updatedTask.rows[0] });
        });
    } catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const { task_id, status } = req.body;
            let updateQuery;
            let updateValues;

            if (status === "start") {
                updateQuery = `
                    UPDATE task 
                    SET start_date = NOW(), pause_date = NULL,
                        status = 'ongoing'
                    WHERE task_id = $1 
                    RETURNING *;
                `;
                updateValues = [task_id];

            } else if (status === "pause") {
                updateQuery = `
                    UPDATE task 
                    SET pause_date = NOW(), 
                        total_no_of_hours = COALESCE(total_no_of_hours, 0) + EXTRACT(EPOCH FROM (NOW() - start_date)) / 3600,
                        status = 'paused'
                    WHERE task_id = $1 
                    RETURNING *;
                `;
                updateValues = [task_id];

            } else if (status === "complete") {
                updateQuery = `
                    UPDATE task 
                    SET complete_date = NOW(), 
                        total_no_of_hours = COALESCE(total_no_of_hours, 0) + EXTRACT(EPOCH FROM (NOW() - start_date)) / 3600,
                        complete_task = TRUE,
                        status = 'completed'
                    WHERE task_id = $1 
                    RETURNING *;
                `;
                updateValues = [task_id];

            } else {
                return res.status(400).json({ error: "Invalid status" });
            }

            const updateResult = await pool.query(updateQuery, updateValues);

            if (updateResult.rows.length === 0) {
                return res.status(404).json({ error: "Task not found" });
            }

            console.log("Task status updated:", updateResult.rows[0]);
            return res.status(200).json({ message: "Task status updated", task: updateResult.rows[0] });
        });
    } catch (error) {
        console.error("Error updating task status:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const displayTask = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            console.log("Body:", req.body); 
            const { task_id } = req.body; 
            if (!task_id) {
                return res.status(400).json({ error: "Task ID is required" });
            }

            const query = `
                SELECT task_id, project_id, task_name, start_date, task_description, estimated_no_of_hours, pause_date, complete_task, deadline
                FROM task 
                WHERE task_id = $1;
            `;
            const values = [task_id];

            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Task not found" });
            }

            console.log("Task Details:", result.rows[0]);
            return res.status(200).json({ task: result.rows[0] });
        });
    } catch (error) {
        console.error("Error fetching task details:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteTask = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const { task_id } = req.body;

            if (!task_id) {
                return res.status(400).json({ error: "Task ID is required" });
            }

            const deleteQuery = "DELETE FROM task WHERE task_id = $1 RETURNING *;";
            const deleteResult = await pool.query(deleteQuery, [task_id]);

            if (deleteResult.rows.length === 0) {
                return res.status(404).json({ error: "Task not found" });
            }

            console.log("Task deleted:", deleteResult.rows[0]);
            return res.status(200).json({ message: "Task deleted successfully" });
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
