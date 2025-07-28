const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel'); // adjust path as needed

require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const hashedPassword = await bcrypt.hash('01852237363', 10);

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created successfully!');

    mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createAdmin();
