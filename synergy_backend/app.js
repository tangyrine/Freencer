import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./db.js"; 

import createuserRouter from './src/routes/create_userRoute.js';
import loginRouter from './src/routes/loginRoute.js';
import resetRouter from './src/routes/resetpasswordRoute.js';
import projectRouter from "./src/routes/projectRoute.js";
import taskRouter from "./src/routes/taskRoute.js";
import userRouter from "./src/routes/userRoute.js";
import expenseRouter from "./src/routes/expenseRoute.js";
import invoiceRouter from "./src/routes/invoiceRoute.js";
import reminderRouter from "./src/routes/reminderRoute.js";

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS for both local and Vercel frontend
app.use(cors({
  origin: [process.env.CLIENT_URL, "http://localhost:3000"], // Allow multiple origins
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// Middleware
app.use(express.json());

// Test API
app.get("/", (req, res) => {
  res.send("Welcome to Synergy Backend 🚀");
});

// Database test
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
app.use("/auth/reset", resetRouter);
app.use("/auth/create", createuserRouter);
app.use("/auth/login", loginRouter);
app.use("/project", projectRouter);
app.use("/task", taskRouter);
app.use("/user", userRouter);
app.use("/expense", expenseRouter);
app.use("/invoice", invoiceRouter);
app.use("/reminder", reminderRouter);

// Use dynamic PORT for Vercel
const PORT = process.env.PORT || 5000;

// Prevent running the server twice on Vercel
if (process.env.NODE_ENV !== "vercel") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Export app for Vercel (MUST HAVE THIS!)
export default app;
