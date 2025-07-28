const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // <-- import admin routes
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Simple logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

app.use('/api/users', userRoutes);   // user routes
app.use('/api/admin', adminRoutes);  // admin routes

app.use('/api/admin/dashboard', adminDashboardRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
