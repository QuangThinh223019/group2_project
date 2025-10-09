const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email đã tồn tại' });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  const token = signToken(user);
  res.status(201).json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

  const token = signToken(user);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl } });
};

exports.logout = async (_req, res) => {
  // Client tự xoá token; backend chỉ trả OK
  res.json({ message: 'Đăng xuất thành công (xóa token ở client)' });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: 'Nếu email tồn tại, token đã được tạo' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExp = new Date(Date.now() + 1000 * 60 * 15); // 15 phút
  await user.save();

  // TODO: gửi email thực tế – hiện trả token để test nhanh
  res.json({ message: 'Token tạo thành công', token });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({ resetToken: token, resetTokenExp: { $gt: new Date() } }).select('+password');
  if (!user) return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = null;
  user.resetTokenExp = null;
  await user.save();

  res.json({ message: 'Đổi mật khẩu thành công' });
};
