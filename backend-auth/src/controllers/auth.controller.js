const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Hàm tạo JWT
const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

// ======= Đăng ký =======
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email trùng
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email đã tồn tại' });

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu DB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Tạo token
    const token = createToken(newUser);

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: { id: newUser._id, name, email, role: newUser.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======= Đăng nhập =======
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

    const token = createToken(user);

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: { id: user._id, name: user.name, email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======= Đăng xuất =======
// Ở backend, chỉ trả thông báo — token sẽ xóa ở client
exports.logout = (req, res) => {
  res.json({ message: 'Đăng xuất thành công (xóa token ở client)' });
};
