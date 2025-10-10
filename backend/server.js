require('dotenv').config(); // Đọc biến môi trường từ file .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const userRoutes = require('./routes/user');
app.use('/users', userRoutes);

// Lấy biến môi trường từ .env
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'groupDB';

// Kết nối MongoDB trước khi khởi động server
mongoose.connect(MONGO_URI, {
  dbName: DB_NAME,
  serverSelectionTimeoutMS: 10000,
})
  .then(() => {
    console.log('✅ Kết nối MongoDB thành công');
    app.listen(PORT, () => console.log(`🚀 Server chạy ở cổng ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
  });
