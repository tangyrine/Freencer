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
*/
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
