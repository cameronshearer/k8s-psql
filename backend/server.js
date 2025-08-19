const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});
// A function to connect to the database and create the table
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    // Create the users table if it doesn't already exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables are created and ready.');
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error('Error connecting to the database or creating tables:', err.stack);
  }
}

// Route to create a new user
app.post('/api/users', async (req, res) => {
  // ... (rest of the code is the same as before)
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to get all users
app.get('/api/users', async (req, res) => {
  // ... (rest of the code is the same as before)
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
  initializeDatabase(); // Call the function to set up the tables
});