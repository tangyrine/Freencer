import bcrypt from 'bcrypt';
import validator from 'validator';
import { v4 as uuidv4 } from 'uuid';
import pool from '../../db.js';
import { generateToken } from './jwt.js';

export async function create_user(req, res) {
    try {
        const { email, phone, name, password } = req.body;

        if (!email || !phone || !name || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid Email" });
        }

        if (!validator.isMobilePhone(phone, 'en-IN')) {
            return res.status(400).json({ error: "Invalid Phone Number" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const existingUser = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user_id = uuidv4();

        const newUser = await pool.query(
            'INSERT INTO "user" (user_id, email, phone, name, password) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, email, phone, name',
            [user_id, email, phone, name, hashedPassword]
        );

        const token = generateToken(newUser.rows[0]);

        return res.status(201).json({
            message: "User created successfully",
            user: newUser.rows[0],
            token
        });

    } catch (error) {
        console.error("❌ Error in create_user:", error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
}
