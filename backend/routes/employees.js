
// Import the Express framework - this gives us access to Express functionality
const express = require('express');

// Create a new router instance - this lets us define routes in a modular way
const router = express.Router();

// Import our database connection pool from database.js file in parent directory
// This lets us run SQL queries using the connection we configured
const pool = require('../database');

// Define a route handler for GET requests to '/employees'
// 'async' keyword lets us use await inside the function
router.get('/employees', async (req, res) => {
    // req: contains request data (headers, parameters, etc.)
    // res: used to send response back to client
    
    try {
        // Execute SQL query to select all records from employee table
        // 'await' pauses execution until query completes
        const result = await pool.query('SELECT * FROM employee');
        
        // Send query results back to client as JSON
        // result.rows contains the array of employee records
        res.json(result.rows);
        
    } catch (err) {
        // If any error occurs in the try block:
        
        // Log the error to server console for debugging
        console.error('Error fetching employees:', err);
        
        // Send error response to client
        // status(500): HTTP status code for internal server error
        // json(): sends the error message as JSON
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export the router so it can be imported in index.js
// This makes the routes available to the main application
module.exports = router;