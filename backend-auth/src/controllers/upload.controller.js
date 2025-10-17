const sharp = require('sharp');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');

exports.uploadAvatarCloudinary = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' });

    // 1) Chuẩn hoá ảnh (vuông 512, webp) ngay trong RAM
    const processed = await sharp(req.file.buffer)
      .resize(512, 512, { fit: 'cover', position: 'center' })
      .webp({ quality: 80 })
      .toBuffer();

    // 2) Upload lên Cloudinary bằng upload_stream
    const folder = process.env.CLOUDINARY_FOLDER || 'avatars';

    const upload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            format: 'webp', // đảm bảo đuôi webp
            overwrite: true,
            transformation: [] // đã resize bằng sharp; để trống cho nhanh
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(processed);
      });

    const result = await upload(); // { secure_url, public_id, ... }

    // 3) Lưu URL + public_id vào DB user
    let user = null;
    if (req.user?.id) {
      user = await User.findByIdAndUpdate(
        req.user.id,
        {
          avatarUrl: result.secure_url,
          avatarPublicId: result.public_id // gợi ý thêm field này để sau xoá/thay
        },
        { new: true, select: '-password -resetToken -resetTokenExp' }
      );
    }

    return res.json({
      message: 'Upload avatar thành công (Cloudinary)',
      url: result.secure_url,
      public_id: result.public_id,
      user
    });
  } catch (err) {
    console.error('Upload avatar (cloudinary) error:', err);
    return res.status(500).json({ message: 'Lỗi upload avatar (Cloudinary)' });
  }
};