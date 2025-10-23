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

    // Nếu là admin, không cho phép tự xóa chính mình
    if (req.user.role === 'admin' && req.user.id === id) {
      return res.status(403).json({ message: 'Admin không thể tự xoá chính mình' });
    }

    // Nếu không phải admin và không phải chính mình → không cho xóa
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ message: 'Không có quyền xoá user khác' });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Không tìm thấy user để xoá' });
    }

    res.json({ message: 'Đã xoá user thành công' });
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

    if (!['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Chỉ admin hoặc moderator mới được cập nhật user' });
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
