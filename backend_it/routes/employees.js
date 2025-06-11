const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all employees
router.get('/', (req, res) => {
  db.query('SELECT * FROM employees_all_data', (err, results) => {
    if (err) return res.status(500).json(err);
    console.log("results",results);
    
    res.json(results);
  });
});

// Add new employee
// router.post('/', (req, res) => {
//   const { name, email, position } = req.body;
//   db.query('INSERT INTO employees SET ?', { name, email, position }, (err, result) => {
//     if (err) return res.status(500).json(err);
//     res.json({ id: result.insertId, name, email, position });
//   });

// Add new employee
router.post('/', (req, res) => {
  const {
    employeeCode,
    employeeName,
    department,
    designation,
    location,
    email
  } = req.body;

  // Validate required fields
  if (!employeeCode || !employeeName || !department || !designation || !location || !email) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Step 1: Check if employeeCode already exists
  const checkSql = 'SELECT 1 FROM employees_all_data WHERE employeeCode = ?';
  db.query(checkSql, [employeeCode], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error while checking employeeCode.' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'Employee code already exists.' });
    }

    // Step 2: Insert new employee
    const insertSql = 'INSERT INTO employees_all_data SET ?';
    const newEmployee = {
      employeeCode,
      employeeName,
      department,
      designation,
      location,
      email
    };

    db.query(insertSql, newEmployee, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error while inserting employee.' });
      }

      // Return the newly created employee with generated n_number
      res.status(201).json({ n_number: result.insertId, ...newEmployee });
    });
  });
});



router.put('/:employeeCode', (req, res) => {
  const { employeeName, email, department, designation, location } = req.body;

  const updateData = { employeeName, email, department, designation, location };

  db.query(
    'UPDATE employees_all_data SET ? WHERE employeeCode = ?',
    [updateData, req.params.employeeCode],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Employee updated' });
    }
  );
});





// Delete employee
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM employees_all_data WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Employee deleted' });
  });
});

module.exports = router;
