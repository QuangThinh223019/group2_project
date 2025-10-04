require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
console.log("MONGO_URI =", process.env.MONGO_URI);

const app = express();
app.use(express.json());

// 1. Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// 2. Import routes
const userRoutes = require('./routes/user');
app.use('/users', userRoutes);

// 3. Lắng nghe server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
