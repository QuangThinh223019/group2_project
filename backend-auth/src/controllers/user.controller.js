const fs = require('fs');
const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');
const bcrypt = require('bcrypt');

// Danh sách user
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email role avatarUrl createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin' && req.user.id !== id)
      return res.status(403).json({ message: 'Forbidden' });

    await User.findByIdAndDelete(id);
    res.json({ message: 'Đã xoá user' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm user (hash password)
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10); // hash password
    const newUser = new User({ name, email, password: hash, role });
    await newUser.save();
    res.json({ id: newUser._id, name, email, role });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật user (chỉ admin)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Chỉ admin mới được cập nhật user' });
    }

    const updateData = { name, email, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//upload avt
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Thiếu file avatar' });

    // 1) Nén/resize trong RAM (rất nhanh)
    const buffer = await sharp(req.file.buffer)
      .rotate()                         // auto rotate theo EXIF
      .resize(512, 512, { fit: 'inside' })
      .toFormat('webp', { quality: 80 }) // giảm kích thước mạnh
      .toBuffer();

    // 2) Stream thẳng lên Cloudinary (không ghi file tạm)
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'avatars',
          resource_type: 'image'
          // Đừng eager transform lúc upload để khỏi chậm:
          // eager: [{ width: 256, crop: 'limit' }], eager_async: true
        },
        (err, resUpload) => (err ? reject(err) : resolve(resUpload))
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });

    // 3) Lưu URL vào DB
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });

    // (tuỳ chọn) Xoá ảnh cũ trên Cloudinary
    if (user.avatarPublicId) {
      cloudinary.uploader.destroy(user.avatarPublicId).catch(()=>{});
    }

    user.avatarUrl = result.secure_url;
    user.avatarPublicId = result.public_id;
    await user.save();

    res.json({ message: 'Cập nhật avatar thành công', avatarUrl: user.avatarUrl });
  } catch (e) {
    console.error('uploadAvatar error:', e);
    res.status(500).json({ message: 'Lỗi upload avatar' });
  }
};