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

    // Resize vuông 512x512, cover, xuất .webp
    await sharp(inputPath)
      .resize(512, 512, { fit: 'cover', position: 'center' })
      .webp({ quality: 80 })
      .toFile(outputPath);

    // Xoá file gốc (jpg/png/avif) để tiết kiệm dung lượng
    if (inputPath !== outputPath && fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }

    // URL public (đã bật static /uploads)
    const publicUrl = `/uploads/avatars/${outputName}`;

    // Lưu vào DB cho user hiện tại
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
