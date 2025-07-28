const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Stop app if no DB connection
  }
};

module.exports = connectDB;
