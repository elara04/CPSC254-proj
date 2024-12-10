const express = require('express');
const router = express.Router();
const pool = require('../database');

// GET all employees route
router.get('/employees', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM employee ORDER BY cwid');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search by CWID route
router.get('/employees/cwid/:cwid', async (req, res) => {
    try {
        const { cwid } = req.params;
        const result = await pool.query('SELECT * FROM employee WHERE cwid = $1', [cwid]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search by name route
router.get('/employees/name/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const result = await pool.query(
            'SELECT * FROM employee WHERE LOWER(name) LIKE LOWER($1)',
            [`%${name}%`]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST route for creating employees
router.post('/employees', async (req, res) => {
    try {
        const { cwid, name, title, office } = req.body;
        const result = await pool.query(
            'INSERT INTO employee (cwid, name, title, office) VALUES ($1, $2, $3, $4) RETURNING *',
            [cwid, name, title, office]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE route for removing employees
router.delete('/employees/:type/:value', async (req, res) => {
    try {
        const { type, value } = req.params;
        let result;
        
        if (type === 'cwid') {
            result = await pool.query(
                'DELETE FROM employee WHERE cwid = $1 RETURNING *',
                [value]
            );
        } else if (type === 'name') {
            result = await pool.query(
                'DELETE FROM employee WHERE name = $1 RETURNING *',
                [value]
            );
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted successfully', employee: result.rows[0] });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;