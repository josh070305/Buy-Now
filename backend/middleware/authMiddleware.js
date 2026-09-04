const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production';

const authenticate = (req, res, next) => {
  let token;
  
  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Get token from 'Bearer <token>'
      
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Attach user to request object
      req.user = {
        id: decoded.id,
        role: decoded.role
      };
      
      next();
    } catch (error) {
      res.status(401).json({ 
        success: false, 
        error: { message: 'Invalid or expired token', code: 'AUTH_ERROR' } 
      });
    }
  } else {
    res.status(401).json({ 
      success: false, 
      error: { message: 'No token provided', code: 'AUTH_ERROR' } 
    });
  }
};

// Optional: Authenticate but don't fail if no token (for public endpoints)
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = {
        id: decoded.id,
        role: decoded.role
      };
    } catch (error) {
      // Ignore invalid tokens for optional auth
    }
  }
  next();
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: { message: 'Insufficient permissions', code: 'FORBIDDEN' } 
      });
    }
    next();
  };
};

module.exports = { authenticate, optionalAuth, authorize };
