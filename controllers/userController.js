const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔐 Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// 📝 Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    if (user) {
        const token = generateToken(user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// 🔓 Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
    });
};

// 🔐 Get User Profile (Protected)
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// ✏️ Update User Profile (Protected)
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
};
