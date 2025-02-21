import bcrypt from 'bcrypt';
import pool from '../../db.js';
import { generateToken } from './jwt.js';

export async function login_user(req, res) {
    try {
        const { email, password } = req.body;
        console.log("📩 Received login request for:", email, "with password:", password);

        if (!email || !password) {
            console.log("⚠️ Missing email or password in request.");
            return res.status(400).json({ error: "Email and password are required" });
        }

        console.log("🔍 Checking database for user with email:", email);
        const user = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
        console.log("📊 Database query result:", user.rows);

        if (user.rows.length === 0) {
            console.log("❌ No user found for email:", email);
            return res.status(404).json({ error: "User not found" });
        }

        console.log("🔑 User found! Checking password...");
        console.log("📌 Stored hashed password:", user.rows[0].password);

        const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
        console.log("🔐 Password match result:", isPasswordValid);

        if (!isPasswordValid) {
            console.log("❌ Password mismatch for user:", email);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("✅ Password verified. Generating token...");
        const token = generateToken(user.rows[0]);
        console.log("🛡️ Token generated:", token);

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                user_id: user.rows[0].user_id,
                email: user.rows[0].email,
                name: user.rows[0].name,
                phone: user.rows[0].phone
            },
        });

    } catch (error) {
        console.error("❌ ERROR in login_user function:", error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
}
