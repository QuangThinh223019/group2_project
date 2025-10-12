const User = require('../models/User');
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

    // Chặn admin tự xóa chính mình
    if (req.user.role === 'admin' && req.user.id === id) {
      return res.status(403).json({ message: 'Admin không thể xóa chính mình' });
    }

    // User bình thường chỉ xóa chính mình
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'Đã xoá user' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm user (hash password)
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Thiếu name/email/password' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email đã tồn tại' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role });
    res.status(201).json({
      id: user._id, name: user.name, email: user.email, role: user.role
    });
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
