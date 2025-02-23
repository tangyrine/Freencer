import pool from "../../db.js";
import { authenticateToken } from "./jwt.js";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import cron from "node-cron";

export const createProject = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const userEmail = req.user.email;
            const userQuery = 'SELECT user_id FROM "user" WHERE email = $1';
            const userResult = await pool.query(userQuery, [userEmail]);

            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            const user_id = userResult.rows[0].user_id;
            const { project_name, description, estimated_total_hours, github_repository_link, requirements, deadline, budget_estimated, clientperhourpay } = req.body;

            if (!deadline) {
                return res.status(400).json({ error: "Deadline is required" });
            }

            const project_id = uuidv4();
            const status = "pending";
            const formattedDeadline = new Date(deadline).toISOString().slice(0, 19).replace("T", " ");

            const insertQuery = `
                INSERT INTO project (
                    project_id, user_id, project_name, description, estimated_total_hours, 
                    github_repository_link, requirements, deadline, status, budget_estimated, clientperhourpay
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
                RETURNING *;
            `;

            const insertValues = [
                project_id, user_id, project_name, description, estimated_total_hours,
                github_repository_link, requirements, formattedDeadline, status, budget_estimated, clientperhourpay
            ];

            const projectResult = await pool.query(insertQuery, insertValues);
            return res.status(201).json({ message: "Project created successfully", project: projectResult.rows[0] });
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const editProject = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const { project_id, project_name, description, estimated_total_hours, github_repository_link, requirements, deadline, status, budget_estimated, clientperhourpay } = req.body;

            if (!project_id) {
                return res.status(400).json({ error: "Project ID is required" });
            }

            let updateFields = [];
            let updateValues = [];
            let index = 1;

            if (project_name) {
                updateFields.push(`project_name = $${index}`);
                updateValues.push(project_name);
                index++;
            }
            if (description) {
                updateFields.push(`description = $${index}`);
                updateValues.push(description);
                index++;
            }
            if (estimated_total_hours) {
                updateFields.push(`estimated_total_hours = $${index}`);
                updateValues.push(estimated_total_hours);
                index++;
            }
            if (github_repository_link) {
                updateFields.push(`github_repository_link = $${index}`);
                updateValues.push(github_repository_link);
                index++;
            }
            if (requirements) {
                updateFields.push(`requirements = $${index}`);
                updateValues.push(requirements);
                index++;
            }
            if (deadline) {
                const formattedDeadline = new Date(deadline).toISOString().slice(0, 19).replace("T", " ");
                updateFields.push(`deadline = $${index}`);
                updateValues.push(formattedDeadline);
                index++;
            }
            if (status) {
                updateFields.push(`status = $${index}`);
                updateValues.push(status);
                index++;
            }
            if (budget_estimated !== undefined) {
                updateFields.push(`budget_estimated = $${index}`);
                updateValues.push(budget_estimated);
                index++;
            }
            if (clientperhourpay !== undefined) {
                updateFields.push(`clientperhourpay = $${index}`);
                updateValues.push(clientperhourpay);
                index++;
            }
            if (updateFields.length === 0) {
                return res.status(400).json({ error: "No fields provided to update" });
            }

            const updateQuery = `UPDATE project SET ${updateFields.join(", ")} WHERE project_id = $${index} RETURNING *;`;
            updateValues.push(project_id);

            const updatedProject = await pool.query(updateQuery, updateValues);
            if (updatedProject.rows.length === 0) {
                return res.status(404).json({ error: "Project not found" });
            }

            return res.status(200).json({ message: "Project updated successfully", project: updatedProject.rows[0] });
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const displayProject = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const { project_id } = req.body;
            if (!project_id) {
                return res.status(400).json({ error: "Project ID is required" });
            }

            const query = `
                SELECT project_id, user_id, project_name, description, estimated_total_hours, 
                       github_repository_link, requirements, deadline, status, budget_estimated, clientperhourpay
                FROM project 
                WHERE project_id = $1;
            `;
            const values = [project_id];

            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: "Project not found" });
            }

            return res.status(200).json({ project: result.rows[0] });
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const dashboard = async (req, res) => {
    try {
        authenticateToken(req, res, async () => {
            const userEmail = req.user.email; // Get email from token
            
            // Fetch user_id using email
            const userQuery = `SELECT user_id FROM "user" WHERE email = $1;`;
            const userResult = await pool.query(userQuery, [userEmail]);

            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            const userId = userResult.rows[0].user_id;

            // Fetch projects for the user
            const projectQuery = `
                SELECT project_name, deadline, status
                FROM project 
                WHERE user_id = $1;
            `;
            const projectResult = await pool.query(projectQuery, [userId]);

            return res.status(200).json({ projects: projectResult.rows });
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
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


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendProjectDeadlineReminders = async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      
      const tomorrowEnd = new Date(tomorrow);
      tomorrowEnd.setUTCHours(23, 59, 59, 999);
  
      const query = `
        SELECT project_id, user_id, project_name, deadline 
        FROM project 
        WHERE deadline BETWEEN $1 AND $2 
        AND status IN ('pending', 'ongoing', 'paused')
      `;
  
      const { rows: projects } = await pool.query(query, [
        tomorrow.toISOString(),
        tomorrowEnd.toISOString(),
      ]);
  
      if (projects.length === 0) {
        console.warn("⚠️ No projects due tomorrow.");
        return;
      }
  
      for (const project of projects) {
        const userQuery = `SELECT email FROM "user" WHERE user_id = $1`;
        const { rows: users } = await pool.query(userQuery, [project.user_id]);
  
        if (users.length === 0 || !users[0].email) {
          console.warn(`⚠️ No email found for user of project: ${project.project_name}`);
          continue;
        }
  
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: users[0].email,
          subject: "Project Deadline Reminder",
          text: `🚀 Stay on track! Your project "${project.project_name}" is due tomorrow. 
  Make the final touches and wrap it up for success! 💪`,
        };
  
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${users[0].email} for project: ${project.project_name}`);
      }
    } catch (error) {
      console.error("❌ Error in sendProjectDeadlineReminders:", error);
    }
  };

  cron.schedule("0 9 * * *", () => {
    console.log("⏳ Running scheduled project reminders...");
    sendProjectDeadlineReminders();
  });
  