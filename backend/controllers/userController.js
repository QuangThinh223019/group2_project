const mongoose = require('mongoose');
const User = require('../models/User');

// 📌 GET /users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
};

// 📌 POST /users
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Name, Email và Password là bắt buộc' });
    }

    // Kiểm tra email trùng
    const existing = await User.findOne({ email: email.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Nếu có role gửi lên và là "admin"
    // if (role === "admin") {
    //   // ✅ Chỉ admin mới được phép tạo admin
    //   if (!req.user || req.user.role !== "admin") {
    //     return res.status(403).json({ message: "Bạn không có quyền tạo tài khoản admin" });
    //   }
    // }

    // Tạo user mới (mặc định role = user nếu không gửi)
    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role: role === "admin" ? "admin" : "user",
    });

    res.status(201).json({ message: 'Tạo user thành công', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
};

// 📌 PUT /users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.email !== undefined) updates.email = req.body.email;
    if (req.body.role !== undefined) {
      // Chỉ admin mới được chỉnh role người khác
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Bạn không có quyền thay đổi vai trò người dùng" });
      }
      updates.role = req.body.role;
    }

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

// 📌 DELETE /users/:id
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

exports.uploadAvatar = async (req, res) => {
  try {
    const file = req.file.path;
    const result = await cloudinary.uploader.upload(file);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: result.secure_url },
      { new: true }
    );
    res.json({ message: "Upload thành công", avatarUrl: user.avatar });
  } catch (error) {
    res.status(500).json({ message: "Lỗi upload", error });
  }
};