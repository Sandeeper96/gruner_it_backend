const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const conn = require('../db');
const router = express.Router();

// 🔐 Sign Up Route
router.post('/signup', async (req, res) => {
  const { name, mobile, email, dob, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (name, mobile, email, dob, password) VALUES (?, ?, ?, ?, ?)`;
    conn.query(query, [name, mobile, email, dob, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ message: 'User already exists or DB error' });
      res.json({ message: 'User registered successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  conn.query(query, [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  });
});

module.exports = router;
