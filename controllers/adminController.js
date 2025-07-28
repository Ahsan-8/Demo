// /backend/createAdmin.js

const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

async function loginAdmin(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Admin with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await admin.save();

    res.status(201).json({
      message: '✅ Admin user created successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        gmail: admin.gmail,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { loginAdmin };
