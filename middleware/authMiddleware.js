const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;
    console.log('Auth Header:', req.headers.authorization); // Log header

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {

            token = req.headers.authorization.split(' ')[1];
            console.log('Token:', token); // Log token

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded JWT:', decoded); // Log decoded payload

            req.user = await User.findById(decoded.id).select('-password');
            console.log('User found:', req.user); // Log user document

            next();

        } catch (error) {
            console.error('JWT verification failed:', error.message);
            return res.status(403).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.log('No token provided in authorization header');
        return res.status(403).json({ message: 'Not authorized, no token' });
    }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};

module.exports = { protect , adminOnly };
