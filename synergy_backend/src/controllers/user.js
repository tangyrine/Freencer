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
    const userEmail = req.user.email; 
    const { email, phone, name } = req.body;
  
    try {
      const userResult = await pool.query(`SELECT email, phone, name FROM "user" WHERE email = $1`, [userEmail]);
       if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }  
      const existingUser = userResult.rows[0];
      const updatedEmail = email || existingUser.email;
      const updatedPhone = phone || existingUser.phone;
      const updatedName = name || existingUser.name;
      const result = await pool.query(
        `UPDATE "user" SET email = $1, phone = $2, name = $3 WHERE email = $4 RETURNING *`,
        [updatedEmail, updatedPhone, updatedName, userEmail]
      );
  
      res.json({ message: "User updated successfully", user: result.rows[0] });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Server error" });
    }
  };

  
  export const deleteUser = async (req, res) => {
    const userEmail = req.user.email; 
    try {
      const result = await pool.query(`DELETE FROM "user" WHERE email = $1`, [userEmail]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Server error" });
    }
  };