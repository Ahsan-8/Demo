const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, adminOnly, (req, res) => {
  res.json({ message: 'Welcome to admin dashboard!', admin: req.user });
});

module.exports = router;