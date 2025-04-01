import bcrypt from "bcrypt";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";
import pool from "../../db.js";
import { generateToken } from "./jwt.js";

export async function create_user(req, res) {
  try {
    const { email, phone, name, password } = req.body;
    console.log("📝 Received user creation request:", { email, phone, name });

    if (!email || !phone || !name || !password) {
      console.log("⚠️ Missing required fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      console.log("⚠️ Invalid email format");
      return res.status(400).json({ error: "Invalid Email" });
    }

    if (!validator.isMobilePhone(phone, "en-IN")) {
      console.log("⚠️ Invalid phone number format");
      return res.status(400).json({ error: "Invalid Phone Number" });
    }

    if (password.length < 6) {
      console.log("⚠️ Password too short");
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    console.log("🔍 Checking for existing user with email:", email);
    const existingUser = await pool.query(
      'SELECT * FROM "user" WHERE email = $1',
      [email]
    );
    if (existingUser.rows.length > 0) {
      console.log("❌ Email already in use");
      return res.status(409).json({ error: "Email already in use" });
    }

    console.log("🔐 Hashing password");
    const hashedPassword = await bcrypt.hash(password, 10);
    const user_id = uuidv4();
    console.log("🆔 Generated user ID:", user_id);

    console.log("📝 Inserting new user into database");
    const newUser = await pool.query(
      'INSERT INTO "user" (user_id, email, phone, name, password) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, email, phone, name',
      [user_id, email, phone, name, hashedPassword]
    );

    console.log("✅ User created successfully:", newUser.rows[0]);

    console.log("🔑 Generating JWT token");
    const token = generateToken(newUser.rows[0]);
    console.log("🛡️ Token generated successfully");

    return res.status(201).json({
      message: "User created successfully",
      user: newUser.rows[0],
      token,
    });
  } catch (error) {
    console.error("❌ Error in create_user:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
}
