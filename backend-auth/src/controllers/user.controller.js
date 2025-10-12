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

    const userId = req.user.id; // từ middleware auth
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars',
      transformation: [{ width: 512, height: 512, crop: 'limit' }],
    });

    // Xóa file tạm local
    fs.unlinkSync(req.file.path);

    // Cập nhật DB
    user.avatarUrl = result.secure_url;
    user.avatarPublicId = result.public_id;
    await user.save();

    res.json({
      message: 'Cập nhật avatar thành công',
      avatarUrl: user.avatarUrl,
    });
  } catch (err) {
    console.error('uploadAvatar error:', err);
    res.status(500).json({ message: 'Lỗi upload avatar' });
  }
};