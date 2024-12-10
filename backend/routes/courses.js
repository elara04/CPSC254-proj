// Import the Express framework - this gives us access to Express functionality
const express = require('express');

// Create a new router instance - this lets us define routes in a modular way
const router = express.Router();

// Import our database connection pool from database.js file in parent directory
// This lets us run SQL queries using the connection we configured
const pool = require('../database');

// Define a route handler for GET requests to '/courses'
// 'async' keyword lets us use await inside the function
router.get('/courses', async (req, res) => {
    // req: contains request data (headers, parameters, etc.)
    // res: used to send response back to client
    
    try {
        // Execute SQL query to select all records from course table
        // 'await' pauses execution until query completes
        const result = await pool.query('SELECT Course.section_number, Course.deptcode, Employee.name AS instructor, Course.capacity, Course.enrolled, Course.room, Course.time FROM Course JOIN Employee ON Course.inst_id = Employee.cwid ORDER BY Course.section_number');

        // Send query results back to client as JSON
        // result.rows contains the array of employee records
        res.json(result.rows);

    } catch (err) {
        // If any error occurs in the try block:

        // Log the error to server console for debugging
        console.error('Error fetching courses:', err);

        // Send error response to client
        // status(500): HTTP status code for internal server error
        // json(): sends the error message as JSON
        res.status(500).json({ error: 'Internal server error' });
    }
});

// New enhanced search route that handles all search types
router.get('/courses/search/:type/:value', async (req, res) => {
    try {
        const { type, value } = req.params;
        let query = `
            SELECT 
                Course.section_number,
                Course.deptcode,
                Employee.name AS instructor,
                Course.capacity,
                Course.enrolled,
                Course.room,
                Course.time
            FROM 
                Course
            JOIN 
                Employee ON Course.inst_id = Employee.cwid
            WHERE `;

        let params = [];
        
        switch(type) {
            case 'section':
                query += 'Course.section_number = $1';
                params = [value];
                break;
            case 'department':
                query += 'LOWER(Course.deptcode) = LOWER($1)';
                params = [value];
                break;
            case 'instructor':
                query += 'LOWER(Employee.name) LIKE LOWER($1)';
                params = [`%${value}%`];
                break;
            default:
                return res.status(400).json({ error: 'Invalid search type' });
        }

        query += ' ORDER BY Course.section_number';
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error searching courses:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST route for creating courses
router.post('/courses', async (req, res) => {
    try {
        const { section_number, inst_id, deptcode, capacity, enrolled, room, time } = req.body;
        const result = await pool.query(
            'INSERT INTO course (section_number, inst_id, deptcode, capacity, enrolled, room, time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [section_number, inst_id, deptcode, capacity, enrolled, room, time]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE route for removing courses (by section number only)
router.delete('/courses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM course WHERE section_number = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json({ message: 'Course deleted successfully', course: result.rows[0] });
    } catch (err) {
        console.error('Error deleting course:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export the router so it can be imported in index.js
// This makes the routes available to the main application
module.exports = router;
