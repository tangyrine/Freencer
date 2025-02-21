import pool from "../../db.js";
import { authenticateToken } from "./jwt.js";
import { v4 as uuidv4 } from "uuid";

export const createProject = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const userEmail = req.user.email;
            console.log("User email from token:", userEmail);

            const userQuery = 'SELECT user_id FROM "user" WHERE email = $1';
            const userResult = await pool.query(userQuery, [userEmail]);

            if (userResult.rows.length === 0) {
                console.error("User not found in database");
                return res.status(404).json({ error: "User not found" });
            }

            const user_id = userResult.rows[0].user_id;
            console.log("Fetched user_id:", user_id);

            const { project_name, description, estimated_total_hours, github_repository_link, requirements, deadline } = req.body;

            if (!deadline) {
                return res.status(400).json({ error: "Deadline is required" });
            }

            const project_id = uuidv4();
            const start_date = null;
            const total_hours = null;
            const complete_date = null;
            const complete_project = null;
            const status = "pending"; // Default status

            const formattedDeadline = new Date(deadline);
            formattedDeadline.setHours(23, 59, 59, 999);
            const deadlineString = formattedDeadline.toISOString().slice(0, 19).replace("T", " ");

            const insertQuery = `
                INSERT INTO project (
                    project_id, user_id, project_name, start_date, description, 
                    total_hours, estimated_total_hours, github_repository_link, 
                    requirements, complete_date, complete_project, deadline, status
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
                RETURNING *;
            `;

            const insertValues = [
                project_id, user_id, project_name, start_date, description,
                total_hours, estimated_total_hours, github_repository_link,
                requirements, complete_date, complete_project, deadlineString, status
            ];

            const projectResult = await pool.query(insertQuery, insertValues);
            console.log("Project created successfully:", projectResult.rows[0]);

            return res.status(201).json({ message: "Project created successfully", project: projectResult.rows[0] });
        });
    } catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteProject = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const { project_id } = req.body;

            const deleteQuery = "DELETE FROM project WHERE project_id = $1 RETURNING *;";
            const deleteResult = await pool.query(deleteQuery, [project_id]);

            if (deleteResult.rows.length === 0) {
                return res.status(404).json({ error: "Project not found" });
            }

            console.log("Project deleted:", deleteResult.rows[0]);
            return res.status(200).json({ message: "Project deleted successfully" });
        });
    } catch (error) {
        console.error("Error deleting project:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const editProject = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const { project_id, project_name, description, estimated_total_hours, github_repository_link, requirements, deadline, status } = req.body;

            if (!project_id) {
                return res.status(400).json({ error: "Project ID is required" });
            }

            let updateFields = [];
            let updateValues = [];
            let index = 1;

            if (project_name !== undefined) {
                updateFields.push(`project_name = $${index}`);
                updateValues.push(project_name);
                index++;
            }
            if (description !== undefined) {
                updateFields.push(`description = $${index}`);
                updateValues.push(description);
                index++;
            }
            if (estimated_total_hours !== undefined) {
                updateFields.push(`estimated_total_hours = $${index}`);
                updateValues.push(estimated_total_hours);
                index++;
            }
            if (github_repository_link !== undefined) {
                updateFields.push(`github_repository_link = $${index}`);
                updateValues.push(github_repository_link);
                index++;
            }
            if (requirements !== undefined) {
                updateFields.push(`requirements = $${index}`);
                updateValues.push(requirements);
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
                UPDATE project
                SET ${updateFields.join(", ")}
                WHERE project_id = $${index}
                RETURNING *;
            `;
            updateValues.push(project_id);

            const updatedProject = await pool.query(updateQuery, updateValues);

            if (updatedProject.rows.length === 0) {
                return res.status(404).json({ error: "Project not found" });
            }

            return res.status(200).json({ message: "Project updated successfully", project: updatedProject.rows[0] });
        });
    } catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateProjectStatus = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const { project_id, status } = req.body;
            let updateQuery;
            let updateValues;

            if (status === "start") {
                updateQuery = `
                    UPDATE project 
                    SET start_date = NOW(), pause_date = NULL, complete_date = NULL,
                        status = 'ongoing'
                    WHERE project_id = $1 
                    RETURNING *;
                `;
                updateValues = [project_id];

            } else if (status === "pause") {
                updateQuery = `
                    UPDATE project 
                    SET pause_date = NOW(), 
                        total_hours = COALESCE(total_hours, 0) + EXTRACT(EPOCH FROM (NOW() - start_date)) / 3600,
                        status = 'paused'
                    WHERE project_id = $1 
                    RETURNING *;
                `;
                updateValues = [project_id];

            } else if (status === "complete") {
                updateQuery = `
                    UPDATE project 
                    SET complete_date = NOW(), 
                        total_hours = COALESCE(total_hours, 0) + EXTRACT(EPOCH FROM (NOW() - start_date)) / 3600,
                        complete_project = true,
                        status = 'completed'
                    WHERE project_id = $1 
                    RETURNING *;
                `;
                updateValues = [project_id];

            } else {
                return res.status(400).json({ error: "Invalid status" });
            }

            const updateResult = await pool.query(updateQuery, updateValues);

            if (updateResult.rows.length === 0) {
                return res.status(404).json({ error: "Project not found" });
            }

            console.log("Project status updated:", updateResult.rows[0]);
            return res.status(200).json({ message: "Project status updated", project: updateResult.rows[0] });
        });
    } catch (error) {
        console.error("Error updating project status:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



export const displayProject = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            console.log("Body:", req.body); 
            const { project_id } = req.body; 
            if (!project_id) {
                return res.status(400).json({ error: "Project ID is required" });
            }

            const query = `
                SELECT project_id, user_id, project_name, start_date,
                       description, total_hours, github_repository_link, 
                       requirements, pause_date, estimated_total_hours, deadline
                FROM project 
                WHERE project_id = $1;
            `;
            const values = [project_id];

            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Project not found" });
            }

            console.log("Project Details:", result.rows[0]);
            return res.status(200).json({ project: result.rows[0] });
        });
    } catch (error) {
        console.error("Error fetching project details:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
