const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password -resetToken -resetTokenExp');
  res.json(user);
};

exports.updateMe = async (req, res) => {
  const { name, avatarUrl: avatarUrlFromBody, currentPassword, newPassword } = req.body;
  const fileAvatarUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  const user = await User.findById(req.user.id).select('+password');
  if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

  if (typeof name === 'string') user.name = name.trim();

  // Ưu tiên file nếu có; nếu không có file thì dùng avatarUrl trong body; nếu cả hai đều undefined thì giữ nguyên
  if (fileAvatarUrl) user.avatarUrl = fileAvatarUrl;
  else if (typeof avatarUrlFromBody === 'string') user.avatarUrl = avatarUrlFromBody.trim();

  if (newPassword) {
    if (!currentPassword) return res.status(400).json({ message: 'Cần currentPassword' });
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    user.password = await bcrypt.hash(newPassword, 10);
  }

  await user.save();
  res.json({ message: 'Cập nhật thành công' });
};
