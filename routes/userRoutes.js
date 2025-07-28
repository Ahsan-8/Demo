const express = require('express');
const router = express.Router();



const {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');




// Log middleware
function logEndpoint(req, res, next) {
  console.log(`${req.method} ${req.originalUrl} endpoint hit`);
  next();
}

router.post('/register', logEndpoint, registerUser);
router.post('/login', logEndpoint, loginUser);
router.get('/profile', protect, logEndpoint, getUserProfile);
router.put('/profile', protect, logEndpoint, updateUserProfile); // ✅ NEW ROUTE

module.exports = router;