require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.set('trust proxy', true);

// Kiểm tra route test
app.get('/test', (req, res) => res.json({ message: 'Server works!' }));

// Import routes
try {
  app.use('/api/auth', require('./routes/auth.routes'));
  app.use('/api/users', require('./routes/user.routes'));
  app.use('/api/profile', require('./routes/profile.routes'));
  app.use('/api/upload', require('./routes/upload.routes'));
  app.use('/api/logs', require('./routes/log.routes'));
} catch (err) {
  console.error('❌ Lỗi import routes:', err.message);
}

app.use('/uploads', express.static('uploads'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    url: req.url,
  });
});

// Connect DB & start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
