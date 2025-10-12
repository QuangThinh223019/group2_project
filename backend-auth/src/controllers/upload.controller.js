// src/controllers/upload.controller.js
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const User = require('../models/User');

exports.uploadAvatarLocal = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' });

    const inputPath = req.file.path; // file do multer tạo ra (tạm thời)
    // Tên file đích: .webp, vuông 512px
    const baseName = path.basename(inputPath, path.extname(inputPath));
    const outputName = `${baseName}.webp`;
    const outputPath = path.join(path.dirname(inputPath), outputName);

    // Resize/crop về vuông 512 và chuyển WEBP để nhẹ & đồng nhất
    await sharp(inputPath)
      .resize(512, 512, { fit: 'cover' })
      .toFormat('webp')
      .toFile(outputPath);

    // Xoá file gốc (không còn cần thiết)
    if (outputPath !== inputPath && fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }

    // Tạo URL public: /uploads/avatars/<file.webp>
    const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 4000}`;
    const publicUrl = `${serverUrl}/uploads/avatars/${outputName}`;

    // Lưu avatarUrl vào DB (nếu có auth -> req.user.id)
    let user = null;
    if (req.user?.id) {
      user = await User.findByIdAndUpdate(
        req.user.id,
        { avatarUrl: publicUrl },
        { new: true, select: '-password -resetToken -resetTokenExp' }
      );
    }

    return res.json({
      message: 'Upload avatar thành công (local)',
      url: publicUrl,
      user
    });
  } catch (err) {
    console.error('Upload avatar (local) error:', err);
    return res.status(500).json({ message: 'Lỗi upload avatar (local)' });
  }
};
