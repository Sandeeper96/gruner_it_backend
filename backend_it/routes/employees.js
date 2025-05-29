const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all employees
router.get('/', (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) return res.status(500).json(err);
    console.log("results",results);
    
    res.json(results);
  });
});

// Add new employee
router.post('/', (req, res) => {
  const { name, email, position } = req.body;
  db.query('INSERT INTO employees SET ?', { name, email, position }, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, name, email, position });
  });
});

// Update employee
router.put('/:id', (req, res) => {
  const { name, email, position } = req.body;
  db.query('UPDATE employees SET ? WHERE id = ?', [{ name, email, position }, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Employee updated' });
  });
});

// Delete employee
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM employees WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Employee deleted' });
  });
});

module.exports = router;
