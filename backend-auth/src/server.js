require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { logActivity } = require('./middlewares/logActivity');

// Import routes một cách an toàn
let authRoutes, userRoutes, profileRoutes, uploadRoutes, logRoutes;

try {
  authRoutes = require('./routes/auth.routes');
  console.log('✅ authRoutes imported:', typeof authRoutes);
} catch (err) {
  console.log('❌ Error importing authRoutes:', err.message);
}

try {
  userRoutes = require('./routes/user.routes');
  console.log('✅ userRoutes imported:', typeof userRoutes);
} catch (err) {
  console.log('❌ Error importing userRoutes:', err.message);
}

try {
  profileRoutes = require('./routes/profile.routes');
  console.log('✅ profileRoutes imported:', typeof profileRoutes);
} catch (err) {
  console.log('❌ Error importing profileRoutes:', err.message);
}

try {
  uploadRoutes = require('./routes/upload.routes');
  console.log('✅ uploadRoutes imported:', typeof uploadRoutes);
} catch (err) {
  console.log('❌ Error importing uploadRoutes:', err.message);
}

try {
  logRoutes = require('./routes/log.routes');
  console.log('✅ logRoutes imported:', typeof logRoutes);
} catch (err) {
  console.log('❌ Error importing logRoutes:', err.message);
}

const app = express();

// Middleware
const allowedOrigins = [
  'https://group2-project.vercel.app',
  'http://localhost:3000',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Trust proxy để lấy IP đúng
app.set('trust proxy', true);

// Routes - chỉ thêm routes đã import thành công
app.get('/test', (req, res) => res.json({ message: 'Server works!' }));
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Group 2 Backend API 🚀',
    docs: '/api/auth, /api/users, /api/upload, /test'
  });
});

if (authRoutes && typeof authRoutes === 'function') {
  app.use('/api/auth', authRoutes);
  console.log('✅ Registered /api/auth');
}
if (userRoutes && typeof userRoutes === 'function') {
  app.use('/api/users', userRoutes);
  console.log('✅ Registered /api/users');
}
if (profileRoutes && typeof profileRoutes === 'function') {
  app.use('/api/profile', profileRoutes);
  console.log('✅ Registered /api/profile');
}
if (uploadRoutes && typeof uploadRoutes === 'function') {
  app.use('/api/upload', uploadRoutes);
  console.log('✅ Registered /api/upload');
}
if (logRoutes && typeof logRoutes === 'function') {
  app.use('/api/logs', logRoutes);
  console.log('✅ Registered /api/logs');
} else {
  console.log('❌ Failed to register /api/logs, logRoutes type:', typeof logRoutes);
}
app.use('/uploads', express.static('uploads'));

// Debug middleware để log tất cả routes
app.use((req, res, next) => {
  console.log(`🔍 Route not found: ${req.method} ${req.url}`);
  next();
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    url: req.url 
  });
});


// Connect DB & Start server
connectDB();
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`)
);
