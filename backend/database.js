// Destructure Pool from 'pg' (PostgreSQL) package
// Pool manages a collection of database connections for better performance
const { Pool } = require('pg');

// Import dotenv package to handle environment variables
const dotenv = require('dotenv');

// Load environment variables from .env file into process.env
// This makes your environment variables available to use
dotenv.config();

// Create a new connection pool with configuration from environment variables
const pool = new Pool({
    // Database username from .env file
    user: process.env.DB_USER,
    
    // Database host (usually 'localhost' for local development)
    host: process.env.DB_HOST,
    
    // Name of the database to connect to
    database: process.env.DB_NAME,
    
    // Database password from .env file
    password: process.env.DB_PASSWORD,
    
    // Port number the database is running on (default: 5432)
    port: process.env.DB_PORT,
});

// Test the database connection
// 'SELECT NOW()' is a simple query that returns the current timestamp
pool.query('SELECT NOW()', (err, res) => {
    // Callback function receives two parameters:
    // err: any error that occurred during the query
    // res: the query result
    
    if (err) {
        // If there's an error, log it to the console
        console.error('Database connection error:', err);
    } else {
        // If successful, log success message
        console.log('Database connected successfully');
    }
});

// Export the pool instance so other files can use it
// This allows us to reuse the same connection pool throughout the application
module.exports = pool;