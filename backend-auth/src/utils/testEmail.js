require('dotenv').config({ path: __dirname + '/../../.env' });

require('dotenv').config();
const { sendEmail } = require('./email');

(async () => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ loaded" : "❌ missing");

  await sendEmail(
    'your_test_email@gmail.com',
    'Test gửi email từ hệ thống User Management',
    '<h2>Xin chào!</h2><p>Bạn đã nhận được email thật từ Nodemailer ✅</p>'
  );
})();
