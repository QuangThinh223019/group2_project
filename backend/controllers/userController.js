const mongoose = require('mongoose');
const User = require('../models/User');

// GET /users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
};

// POST /users
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Name, Email và Password là bắt buộc' });
    }

    // Kiểm tra email trùng
    const existing = await User.findOne({ email: email.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Tạo user mới (password sẽ tự được mã hóa trong schema)
    const user = await User.create({ name: name.trim(), email: email.trim(), password: password.trim() });
    res.status(201).json({ message: 'Tạo user thành công', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
};


// PUT /users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID không hợp liệu' });
    }

    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.email !== undefined) updates.email = req.body.email;

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'User không tồn tại' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'User không tồn tại' });

    res.json({ message: 'Đã xóa user', id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
};
