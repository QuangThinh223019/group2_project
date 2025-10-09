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
