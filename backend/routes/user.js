const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Login user and get token
// @access  Public
router.post('/login', loginUser);

module.exports = router;
