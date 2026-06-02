const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all products
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Produkt');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM Produkt WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Create product
router.post('/', async (req, res) => {
    try {
        const { navn, beskrivelse, pris, bilde } = req.body;
        const result = await pool.query(
            'INSERT INTO Produkt (navn, beskrivelse, pris, bilde) VALUES ($1, $2, $3, $4) RETURNING *',
            [navn, beskrivelse, pris, bilde]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { navn, beskrivelse, pris, bilde } = req.body;
        const result = await pool.query(
            'UPDATE Produkt SET navn = $1, beskrivelse = $2, pris = $3, bilde = $4 WHERE id = $5 RETURNING *',
            [navn, beskrivelse, pris, bilde, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Produkt WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted', product: result.rows[0] });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

module.exports = router;
