const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all inventory items
router.get('/', (req, res) => {
  db.query('SELECT * FROM inventory', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add inventory item
router.post('/', (req, res) => {
  const { item_type, brand, model, assigned_to } = req.body;
  db.query('INSERT INTO inventory SET ?', { item_type, brand, model, assigned_to }, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, item_type, brand, model, assigned_to });
  });
});

// Update inventory item 
router.put('/:id', (req, res) => {
  const { item_type, brand, model, assigned_to } = req.body;
  db.query('UPDATE inventory SET ? WHERE id = ?', [{ item_type, brand, model, assigned_to }, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Inventory item updated' });
  });
});

// Delete inventory item 
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM inventory WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Inventory item deleted' });
  });
});

module.exports = router;
