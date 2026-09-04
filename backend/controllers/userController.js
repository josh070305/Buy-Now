const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Please provide all required fields', code: 'VALIDATION_ERROR' } 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'User already exists with this email', code: 'DUPLICATE_ERROR' } 
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user' // Default role is 'user'
    });

    // Generate JWT token
    const token = user.getSignedJwtToken();

    res.status(201).json({ 
      success: true, 
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: { message: 'Server error during registration', code: 'INTERNAL_SERVER_ERROR' } 
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Please provide email and password', code: 'VALIDATION_ERROR' } 
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: { message: 'Invalid credentials', code: 'AUTH_ERROR' } 
      });
    }

    // Validate password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        error: { message: 'Invalid credentials', code: 'AUTH_ERROR' } 
      });
    }

    // Generate JWT token
    const token = user.getSignedJwtToken();

    res.json({ 
      success: true, 
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: { message: 'Server error during login', code: 'INTERNAL_SERVER_ERROR' } 
    });
  }
};
