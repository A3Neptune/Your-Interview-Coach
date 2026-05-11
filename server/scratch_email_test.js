import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Testing Email configuration with Port 587...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'FOUND' : 'MISSING');

// Using Port 587 for STARTTLS (Highly bypasses ISP blocking)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // must be false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    console.log('Verifying transporter...');
    await transporter.verify();
    console.log('✅ SMTP Server Connection Verified!');

    console.log('Sending test email to aniketshraff@gmail.com...');
    const info = await transporter.sendMail({
      from: `"YourInterviewCoach" <${process.env.EMAIL_USER}>`,
      to: 'aniketshraff@gmail.com',
      subject: 'Test Email (Port 587) from YourInterviewCoach',
      html: '<h1>Success!</h1><p>If you see this, email sending on port 587 works perfectly!</p>',
    });

    console.log('✅ Email sent successfully! Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ Email Test Failed!');
    console.error(err);
  }
}

run();
