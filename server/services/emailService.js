import nodemailer from 'nodemailer';

let transporter = null;

// Lazy initialize transporter (after .env is loaded)
const getTransporter = () => {
  if (!transporter) {
    console.log('📧 Email Configuration (Google SMTP Service):');
    console.log('  USER:', process.env.EMAIL_USER);
    console.log('  FROM:', process.env.EMAIL_FROM);
    console.log('  PASS:', process.env.EMAIL_PASS ? '****' + process.env.EMAIL_PASS.slice(-4) : 'MISSING');

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify once
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Google Email transporter verification failed:', error.message);
      } else {
        console.log('✅ Google Email server is ready to send messages');
      }
    });
  }
  return transporter;
};

// Send email function
const sendEmail = async (to, subject, html) => {
  console.log(`📤 [EMAIL] Attempting → to: ${to} | subject: "${subject}"`);
  try {
    const transport = getTransporter();
    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    const mailOptions = {
      from: `"YourInterviewCoach" <${fromAddress}>`,
      to,
      subject,
      html,
    };

    const info = await transport.sendMail(mailOptions);
    console.log(`✅ [EMAIL] Sent     → to: ${to} | subject: "${subject}" | messageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [EMAIL] Failed   → to: ${to} | subject: "${subject}" | error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

export { sendEmail };
export default { sendEmail };
