import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db.js"; // Ensure this file is correctly set up
import createuserRouter from './src/routes/create_userRoute.js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();


// Middleware
app.use(cors()); 
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // Allow frontend
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to Synergy Backend 🚀");
});

// Database Test Route
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Database connected!", time: result.rows[0] });
  } catch (err) {
    console.error("Database connection failed:", err);
    res.status(500).send("Database connection failed");
  }
});

// Routes
app.use("/auth", createuserRouter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
