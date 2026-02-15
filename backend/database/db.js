import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

pg.types.setTypeParser(1082, (val) => val);

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'postgres',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
});

const query = async (text, params) => {
  const result = await pool.query(text, params);
  return [result.rows, result.fields];
};

// Test connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL (Supabase) connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message);
    return false;
  }
};

// Export pool with wrapped query
export default { query, getConnection: () => pool.connect() };
