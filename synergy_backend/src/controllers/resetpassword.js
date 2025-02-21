import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import pool from "../../db.js";
import readline from "readline";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });

  try {
    const { rows } = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found." });

    const resetLink = `http://localhost:5000/auth/reset-password?email=${encodeURIComponent(email)}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Link for FREENCER",
      text: `Click the link below to reset your password:\n\n${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset email sent." });

  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const resetPassword = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required." });

  try {
    const { rows } = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found." });

    console.log(`User with email ${email} requested a password reset.`);
    
    // Prompt user to enter a new password in the terminal
    rl.question("Enter new password: ", async (newPassword) => {
      if (!newPassword) {
        console.log("Error: New password is required.");
        rl.close();
        return;
      }

      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE "user" SET password = $1 WHERE email = $2', [hashedPassword, email]);

        console.log("✅ Password reset successfully.");
      } catch (error) {
        console.error("❌ Error resetting password:", error);
      } finally {
        rl.close();
      }
    });

    res.json({ message: "Check terminal to enter new password." });

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

