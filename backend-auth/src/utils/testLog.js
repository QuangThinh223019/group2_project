require('dotenv').config();
const mongoose = require('mongoose');

// Import model với tên file gốc
const Log = require('../models/Log');

async function main() {
  try {
    console.log('🔍 Model Log từ Log.js:', typeof Log);
    console.log('🔍 Model name:', Log.modelName);
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Đã kết nối MongoDB');

    if (typeof Log !== 'function') {
      console.log('❌ Log vẫn không phải function, fallback về cách cũ');
      throw new Error('Log không phải constructor');
    }

    console.log('✅ Log model type:', typeof Log);
    console.log('✅ Sẽ tạo document với model này...');

    const newLog = new Log({
      userId: null,
      action: 'Test log saving',
      ip: '127.0.0.1',
      userAgent: 'Postman/10.0.0',
    });

    const savedLog = await newLog.save();

    console.log('✅ Log đã lưu:', savedLog);
  } catch (err) {
    console.error('❌ Lỗi khi chạy testLog:', err);
  } finally {
    mongoose.connection.close();
  }
}

main();
