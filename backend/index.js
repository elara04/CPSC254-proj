// Import required packages - ADD THESE LINES AT THE TOP
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create an instance of express application
// This is our main server application
const app = express();

// Set up middleware
// Middleware functions process requests before they reach route handlers

// Enable CORS for all routes
// This allows requests from your frontend (or any other origin)
app.use(cors());

// Parse JSON bodies in incoming requests
// Converts JSON payloads in requests to JavaScript objects
app.use(express.json());

// Import the employee routes from the routes folder
// This contains all the endpoint definitions for employee, courses, and assest operations
const employeeRoutes = require('./routes/employees');
const assetRoutes = require('./routes/assets'); 
const courseRoutes = require('./routes/courses'); 

// Mount the employee routes on the '/api' path
// All employee routes will be prefixed with '/api'
// Example: '/api/employees' will use the routes defined in employeeRoutes
app.use('/api', employeeRoutes);
app.use('/api', assetRoutes);    // Mount asset routes alongside employee routes
app.use('/api', courseRoutes);

// Set the port number
// Use PORT from environment variables if available, otherwise use 3000
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming requests
// The callback function runs once the server starts successfully
app.listen(PORT, () => {
    // Log a message to show the server is running
    //console.log(`Server running on port ${PORT}`);
});
