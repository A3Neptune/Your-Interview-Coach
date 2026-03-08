import nodemailer from 'nodemailer';

let transporter = null;

// Lazy initialize transporter (after .env is loaded)
const getTransporter = () => {
  if (!transporter) {
    console.log('📧 Email Configuration:');
    console.log('  HOST:', process.env.EMAIL_HOST);
    console.log('  PORT:', process.env.EMAIL_PORT);
    console.log('  USER:', process.env.EMAIL_USER);
    console.log('  FROM:', process.env.EMAIL_FROM);
    console.log('  PASS:', process.env.EMAIL_PASS ? '****' + process.env.EMAIL_PASS.slice(-4) : 'MISSING');

    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true', // false for 587, true for 465
      auth: {
        user: process.env.EMAIL_USER || process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: false, // Disable debug to reduce noise
      logger: false,
    });

    // Verify once
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email transporter verification failed:', error.message);
      } else {
        console.log('✅ Email server is ready to send messages');
      }
    });
  }
  return transporter;
};

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const transport = getTransporter(); // Get transporter (lazy init)

    const mailOptions = {
      from: `"YourInterviewCoach" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    };

    const info = await transport.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', to);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

export { sendEmail };
export default { sendEmail };
