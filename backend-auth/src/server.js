require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { logActivity } = require('./middlewares/logActivity');

const app = express();

// ✅ Cấu hình CORS cho Vercel + localhost
const allowedOrigins = [
  'https://group2-project.vercel.app', // domain frontend trên Vercel
  'http://localhost:3000',             // domain frontend local
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Cho phép request không có origin (Postman, server)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log(`❌ Blocked by CORS: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(morgan('dev'));
app.set('trust proxy', true);

// ✅ Import routes an toàn
let authRoutes, userRoutes, profileRoutes, uploadRoutes, logRoutes;

try {
  authRoutes = require('./routes/auth.routes');
  console.log('✅ authRoutes imported');
} catch (err) {
  console.log('❌ Error importing authRoutes:', err.message);
}

try {
  userRoutes = require('./routes/user.routes');
  console.log('✅ userRoutes imported');
} catch (err) {
  console.log('❌ Error importing userRoutes:', err.message);
}

try {
  profileRoutes = require('./routes/profile.routes');
  console.log('✅ profileRoutes imported');
} catch (err) {
  console.log('❌ Error importing profileRoutes:', err.message);
}

try {
  uploadRoutes = require('./routes/upload.routes');
  console.log('✅ uploadRoutes imported');
} catch (err) {
  console.log('❌ Error importing uploadRoutes:', err.message);
}

try {
  logRoutes = require('./routes/log.routes');
  console.log('✅ logRoutes imported');
} catch (err) {
  console.log('❌ Error importing logRoutes:', err.message);
}

// ✅ Mount routes (bỏ điều kiện typeof === 'function')
if (authRoutes) {
  app.use('/api/auth', authRoutes);
  console.log('✅ Registered /api/auth');
}
if (userRoutes) {
  app.use('/api/users', userRoutes);
  console.log('✅ Registered /api/users');
}
if (profileRoutes) {
  app.use('/api/profile', profileRoutes);
  console.log('✅ Registered /api/profile');
}
if (uploadRoutes) {
  app.use('/api/upload', uploadRoutes);
  console.log('✅ Registered /api/upload');
}
if (logRoutes) {
  app.use('/api/logs', logRoutes);
  console.log('✅ Registered /api/logs');
}

app.use('/uploads', express.static('uploads'));

// ✅ Route test
app.get('/test', (req, res) => res.json({ message: 'Server works!' }));

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Group 2 Backend API 🚀',
    docs: '/api/auth, /api/users, /api/upload, /test'
  });
});

// ✅ Middleware log route không tìm thấy
app.use((req, res, next) => {
  console.log(`🔍 Route not found: ${req.method} ${req.url}`);
  next();
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    url: req.url
  });
});

// ✅ Kết nối DB và khởi động server
connectDB();
app.listen(process.env.PORT || 4000, () =>
  console.log(`🚀 Server running at http://localhost:${process.env.PORT || 4000}`)
);
