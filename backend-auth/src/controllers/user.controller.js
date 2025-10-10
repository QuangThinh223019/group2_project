const User = require('../models/User');

exports.listUsers = async (req, res) => {
  const users = await User.find().select('name email role avatarUrl createdAt');
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== 'admin' && req.user.id !== id)
    return res.status(403).json({ message: 'Forbidden' });

  await User.findByIdAndDelete(id);
  res.json({ message: 'Đã xoá user' });
};

// === THÊM MỚI: tạo user (admin) ===
exports.createUser = async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, password là bắt buộc' });
  }
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email đã tồn tại' });

  // Nếu bạn muốn hash password tại đây, có thể dùng bcrypt như auth.controller:
  const bcrypt = require('bcrypt');
  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hash, role });
  return res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};

// === THÊM MỚI: cập nhật user (admin) ===
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, password } = req.body;

  const update = {};
  if (name) update.name = name;
  if (email) update.email = email;
  if (role) update.role = role;
  if (password) {
    const bcrypt = require('bcrypt');
    update.password = await bcrypt.hash(password, 10);
  }

  const user = await User.findByIdAndUpdate(id, update, { new: true });
  if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};

