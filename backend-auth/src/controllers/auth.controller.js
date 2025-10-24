const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const transporter = require('../config/mailer');
const { Resend } = require("resend");


const signAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '10m',
  });

const signRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email đã tồn tại' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({ user: user._id, token: refreshToken, expiresAt });

    res.status(201).json({
      message: 'Đăng ký thành công',
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Sai email hoặc mật khẩu' });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({ user: user._id, token: refreshToken, expiresAt });

    res.json({
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: 'Thiếu refresh token' });

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc)
      return res.status(403).json({ message: 'Refresh token không hợp lệ hoặc đã bị thu hồi' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Refresh token hết hạn hoặc sai' });

      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

      const newAccessToken = signAccessToken(user);
      const newRefreshToken = signRefreshToken(user);

      await RefreshToken.findOneAndDelete({ token: refreshToken });

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await RefreshToken.create({ user: user._id, token: newRefreshToken, expiresAt });

      res.json({
        message: 'Refresh token thành công',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ message: 'Lỗi server khi refresh token' });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: 'Thiếu refresh token' });

    await RefreshToken.findOneAndDelete({ token: refreshToken });
    res.json({ message: 'Đăng xuất thành công – Refresh token đã bị xóa' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Lỗi server khi đăng xuất' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại trong hệ thống!" });
    }

    // 🔑 Tạo token JWT 15 phút
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "15m",
    });

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // ⚙️ Gửi mail thật bằng Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Group2 App <onboarding@resend.dev>",
      to: user.email,
      subject: "Đặt lại mật khẩu của bạn",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6">
          <h2>Xin chào ${user.name || "bạn"}</h2>
          <p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>
          <p>hãy copy token bên dưới (hiệu lực trong 15 phút):</p>
          <p>${token}</p>
          <br/>
          <p>Trân trọng,<br/>Đội ngũ Group2 Project</p>
        </div>
      `,
    });

    console.log("✅ Resend: Email đặt lại mật khẩu đã được gửi tới", user.email);

    res.json({
      message: "Yêu cầu đặt lại mật khẩu đã được gửi! Kiểm tra hộp thư hoặc thư rác.",
    });

  } catch (err) {
    console.error("❌ Forgot password error:", err.message);
    res.status(500).json({ message: "Lỗi khi gửi email đặt lại mật khẩu." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: new Date() },
    }).select('+password');

    if (!user)
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExp = null;
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Lỗi khi đổi mật khẩu' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -resetToken -resetTokenExp');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(user);
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin người dùng' });
  }
};
