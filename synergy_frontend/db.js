/*import 'dotenv/config';
import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL (synergy database) ✅"))
  .catch(err => console.error("Connection error ❌", err));

export default pool;

import 'dotenv/config';
import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL (Supabase)"))
  .catch(err => console.error("❌ Database connection error:", err));

export default pool;
*/
import 'dotenv/config';
import pkg from 'pg';

const { Pool } = pkg;

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is missing in environment variables!");
}

// Create the database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase SSL
  },
});

// Test the database connection
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL");

    const result = await client.query("SELECT current_database();");
    console.log("📌 Connected to DB:", result.rows[0].current_database);

    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
})();

export default pool;
