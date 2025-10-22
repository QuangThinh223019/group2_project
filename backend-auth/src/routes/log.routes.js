const express = require('express');
const router = express.Router();

console.log('🔍 log.routes.js loading...');

// Import model với error handling
let Log;
try {
  Log = require('../models/Log');
  console.log('✅ Log model imported in routes:', typeof Log);
} catch (err) {
  console.log('❌ Error importing Log model in routes:', err.message);
}

// [GET] /api/logs → Lấy danh sách log
router.get('/', async (req, res) => {
  try {
    if (!Log || typeof Log !== 'function') {
      return res.status(500).json({
        success: false,
        message: 'Log model not available',
        modelType: typeof Log
      });
    }

    const logs = await Log.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

console.log('✅ log.routes.js loaded, exporting router:', typeof router);
module.exports = router;
