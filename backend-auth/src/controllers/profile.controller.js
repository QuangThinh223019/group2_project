const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password -resetToken -resetTokenExp');
  res.json(user);
};

exports.updateMe = async (req, res) => {
  const { name, avatarUrl, currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

  if (name !== undefined) user.name = name;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

  if (newPassword) {
    if (!currentPassword) return res.status(400).json({ message: 'Cần currentPassword' });
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    user.password = await bcrypt.hash(newPassword, 10);
  }

  await user.save();
  res.json({ message: 'Cập nhật thành công' });
};
