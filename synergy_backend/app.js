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
dotenv.config();
const app = express();
app.use(cors()); 
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // Allow frontend
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("Welcome to Synergy Backend 🚀");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Database connected!", time: result.rows[0] });
  } catch (err) {
    console.error("Database connection failed:", err);
    res.status(500).send("Database connection failed");
  }
});
app.use("/auth", resetRouter);
app.use("/auth", createuserRouter);
app.use("/auth", loginRouter);
app.use("/project", projectRouter);
app.use("/task", taskRouter);
app.use("/user", userRouter);
app.use("/expense", expenseRouter);
app.use("/invoice", invoiceRouter);
app.use("/reminder", reminderRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
