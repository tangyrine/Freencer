import pool from "../../db.js";

export const displayUser = async (req, res) => {
    const userEmail = req.user.email;
    try {
      const result = await pool.query(
        `SELECT email, phone, name FROM "user" WHERE email = $1`,
        [userEmail]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  
  export const editUser = async (req, res) => {
    try {
      if (!req.user || !req.user.email) {
        return res.status(401).json({ error: "Unauthorized: No user data" });
      }
  
      const userEmail = req.user.email; // Email cannot be changed
      const { phone, name } = req.body;
  
      const userResult = await pool.query(
        `SELECT phone, name FROM "user" WHERE email = $1`,
        [userEmail]
      );
  
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const existingUser = userResult.rows[0];
      const updatedPhone = phone || existingUser.phone;
      const updatedName = name || existingUser.name;
  
      const result = await pool.query(
        `UPDATE "user" SET phone = $1, name = $2 WHERE email = $3 RETURNING phone, name, email`,
        [updatedPhone, updatedName, userEmail]
      );
  
      res.json({ message: "User updated successfully", user: result.rows[0] });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  
  export const deleteUser = async (req, res) => {
    try {
      const { email } = req.body; // Email is now passed from the frontend
  
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
  
      const result = await pool.query(
        `DELETE FROM "user" WHERE email = $1 RETURNING *`,
        [email]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json({ message: "User deleted successfully", user: result.rows[0] });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  