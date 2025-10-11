const cloudinary = require('../config/cloudinary');
exports.uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' });
  const b64 = req.file.buffer.toString('base64');
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;
  const result = await cloudinary.uploader.upload(dataURI, { folder: 'avatars' });
  res.json({ url: result.secure_url });
};