const express = require('express');
const path = require('path');
require('dotenv').config();
const pool = require('./db');
const produkterRouter = require('./routes/produkter');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// API routes
app.use('/produkter', produkterRouter);

// Admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'adminpanel.html'));
});

// Health and root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'brukervisning.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Database connected to:', process.env.DB_HOST, process.env.DB_NAME);
});
