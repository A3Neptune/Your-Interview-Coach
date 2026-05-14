import express from 'express';
import { sendEmail } from '../services/emailService.js';

const router = express.Router();

// Basic rate limit: 5 submissions per IP per 10 minutes
const ipMap = new Map();
const LIMIT = 5;
const WINDOW = 10 * 60 * 1000;

function rateLimit(req, res, next) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
  const now = Date.now();
  const entry = ipMap.get(ip) || { count: 0, resetAt: now + WINDOW };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + WINDOW; }
  entry.count += 1;
  ipMap.set(ip, entry);
  if (entry.count > LIMIT) return res.status(429).json({ success: false, error: 'Too many submissions. Please try again later.' });
  next();
}

router.post('/', rateLimit, async (req, res) => {
  const { name, email, topic, message } = req.body || {};

  if (!name?.trim() || !email?.trim() || !topic?.trim() || !message?.trim()) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }

  const mentorEmail = process.env.EMAIL_USER || process.env.EMAIL_FROM;

  // Notify mentor
  await sendEmail(
    mentorEmail,
    `Contact Form: ${topic} — ${name}`,
    `
    <div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#f8faff;border-radius:12px;">
      <div style="background:#2563eb;border-radius:8px 8px 0 0;padding:18px 24px;">
        <p style="margin:0;font-size:18px;font-weight:700;color:#fff;">New Contact Form Submission</p>
      </div>
      <div style="background:#fff;border:1px solid rgba(37,99,235,0.12);border-top:none;border-radius:0 0 8px 8px;padding:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;font-size:13px;color:#64748b;font-weight:600;width:100px;">Name</td><td style="padding:8px 0;font-size:13px;color:#0f172a;font-weight:500;">${name}</td></tr>
          <tr><td style="padding:8px 0;font-size:13px;color:#64748b;font-weight:600;">Email</td><td style="padding:8px 0;font-size:13px;color:#0f172a;"><a href="mailto:${email}" style="color:#2563eb;">${email}</a></td></tr>
          <tr><td style="padding:8px 0;font-size:13px;color:#64748b;font-weight:600;">Topic</td><td style="padding:8px 0;font-size:13px;color:#0f172a;">${topic}</td></tr>
        </table>
        <hr style="border:none;border-top:1px solid rgba(37,99,235,0.1);margin:16px 0;" />
        <p style="font-size:13px;color:#64748b;font-weight:600;margin:0 0 8px;">Message</p>
        <p style="font-size:14px;color:#0f172a;line-height:1.65;margin:0;white-space:pre-wrap;">${message}</p>
        <div style="margin-top:20px;padding:12px 16px;background:#f0f7ff;border-radius:8px;border:1px solid rgba(37,99,235,0.15);">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(topic)}" style="font-size:13px;font-weight:700;color:#2563eb;text-decoration:none;">→ Reply to ${name}</a>
        </div>
      </div>
      <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:16px;">YourInterviewCoach · Contact Form</p>
    </div>
    `
  );

  // Confirmation to user
  await sendEmail(
    email,
    `We got your message — YourInterviewCoach`,
    `
    <div style="font-family:'DM Sans',system-ui,sans-serif;max-width:540px;margin:0 auto;padding:32px 24px;background:#f8faff;border-radius:12px;">
      <div style="background:linear-gradient(135deg,#1e40af,#2563eb);border-radius:8px 8px 0 0;padding:24px;">
        <p style="margin:0;font-size:20px;font-weight:800;color:#fff;">Your message is with us ✓</p>
      </div>
      <div style="background:#fff;border:1px solid rgba(37,99,235,0.12);border-top:none;border-radius:0 0 8px 8px;padding:28px;">
        <p style="font-size:15px;color:#0f172a;font-weight:600;margin:0 0 10px;">Hi ${name},</p>
        <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 16px;">Thanks for reaching out! We received your message about <strong>${topic}</strong> and will get back to you within <strong>2 hours</strong>.</p>
        <div style="background:#f0f7ff;border-left:3px solid #2563eb;border-radius:4px;padding:12px 16px;margin-bottom:20px;">
          <p style="font-size:13px;color:#374151;font-style:italic;margin:0;line-height:1.6;">"${message.slice(0, 160)}${message.length > 160 ? '…' : ''}"</p>
        </div>
        <p style="font-size:13px;color:#64748b;margin:0;">While you wait, explore our <a href="https://www.yourinterviewcoach.in/services" style="color:#2563eb;font-weight:600;">services</a> or check out the <a href="https://www.yourinterviewcoach.in/placement-prep" style="color:#2563eb;font-weight:600;">Placement Accelerator</a>.</p>
      </div>
      <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:16px;">© ${new Date().getFullYear()} YourInterviewCoach · Designed &amp; engineered by A3 Neptune · Bengaluru</p>
    </div>
    `
  );

  res.json({ success: true });
});

export default router;
