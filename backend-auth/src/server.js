require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const profileRoutes = require('./routes/profile.routes');
const uploadRoutes = require('./routes/upload.routes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/upload', uploadRoutes);  
app.use('/uploads', express.static('uploads'));


// Connect DB & Start server
connectDB();
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`)
);
