// Import the Express framework - this gives us access to Express functionality
const express = require('express');

// Create a new router instance - this lets us define routes in a modular way
const router = express.Router();

// Import our database connection pool from database.js file in parent directory
// This lets us run SQL queries using the connection we configured
const pool = require('../database');

// Define a route handler for GET requests to '/assets'
// 'async' keyword lets us use await inside the function
router.get('/assets', async (req, res) => {
    // req: contains request data (headers, parameters, etc.)
    // res: used to send response back to client
    
    try {
        // Execute SQL query to select all records from employee table
        // 'await' pauses execution until query completes
        const result = await pool.query('SELECT * FROM asset ORDER BY asset_id');
        
        // Send query results back to client as JSON
        // result.rows contains the array of employee records
        res.json(result.rows);
        
    } catch (err) {
        // If any error occurs in the try block:
        
        // Log the error to server console for debugging
        console.error('Error fetching assets:', err);
        
        // Send error response to client
        // status(500): HTTP status code for internal server error
        // json(): sends the error message as JSON
        res.status(500).json({ error: 'Internal server error' });
    }
});

// New enhanced search route that handles all search types
router.get('/assets/search/:type/:value', async (req, res) => {
    try {
        const { type, value } = req.params;
        let query = `
            SELECT 
                asset.asset_id,
                asset.category,
                asset.purchase_year,
                asset.manufacture,
                asset.name,
                asset.model,
                asset.location,
                asset.service_tag
            FROM 
                asset
            WHERE `;

        let params = [];
        
        switch(type) {
            case 'asset_id':
                query += 'asset.asset_id = $1';
                params = [value];
                break;
            case 'service_tag':
                query += 'LOWER(asset.serice_tag) = LOWER($1)';
                params = [value];
                break;
            default:
                return res.status(400).json({ error: 'Invalid search type' });
        }

        query += ' ORDER BY asset.asset_id';
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error searching asset:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/assets', async(req, res)=> {
    try {
        const {asset_id, category, purchase_year, manufacture, name, model, location, service_tag}=req.body;

        const result=await pool.query(
            'INSERT INTO asset (asset_id, category, puchase_year, manufacture, name, model, location, service_tag) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [asset_id, category, purchase_year, manufacture, name, model, location, service_tag]
        );

        res.status(201).json(result.rows[0]);
    } catch(err) {
        console.error('Error adding asset:', err);
        res.status(500).json({error:'Internet server error'});
    }
});

// Delete asset
router.delete('/assets/:type/:value', async (req, res) => {
    try {
        const { type, value } = req.params;
        let result;

        if (type === 'asset_id') {
            result = await pool.query(
                'DELETE FROM asset WHERE asset_id = $1 RETURNING *',
                [value]
            );
        } else if (type === 'service_tag') {
            result = await pool.query(
                'DELETE FROM asset WHERE service_tag = $1 RETURNING *',
                [value]
            );
        }

        if (result.row.length === 0) {
            return res.status(404).json({ error: 'Asset not found' });
        }

        res.json({ message: 'Asset deleted successfully', asset: result.rows[0] });
    } catch (err) {
        console.error('Error deleting asset:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export the router so it can be imported in index.js
// This makes the routes available to the main application
module.exports = router;