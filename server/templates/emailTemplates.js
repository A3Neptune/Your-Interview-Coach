// Professional email templates — YourInterviewCoach brand theme
// Font: DM Sans | Primary: #2563eb | Ink: #0f172a

const BASE_URL = process.env.FRONTEND_URL || 'https://www.yourinterviewcoach.in';

/* ─────────────────────────────────────────────────────────────
   SHARED PARTIALS
───────────────────────────────────────────────────────────── */
const fontLink = `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap" rel="stylesheet">`;

const baseStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f1f5f9; color: #0f172a; -webkit-font-smoothing: antialiased; padding: 32px 16px; }
  .wrap { max-width: 600px; margin: 0 auto; }
  .card { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.05); }
  .content { padding: 40px 44px; }
  p.body { font-size: 15px; color: #475569; line-height: 1.78; margin-bottom: 16px; }
  .divider { height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin: 32px 0; }
  .btn { display: inline-block; padding: 15px 36px; background: #2563eb; color: #fff !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; letter-spacing: -0.01em; box-shadow: 0 6px 20px rgba(37,99,235,0.30); font-family: 'DM Sans', sans-serif; }

  /* FOOTER */
  .footer-area { background: #0f172a; padding: 32px 40px 28px; text-align: center; position: relative; overflow: hidden; }
  .footer-area::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 60px; height: 3px; background: linear-gradient(90deg, transparent, #2563eb, transparent); }
  .footer-brand { font-size: 16px; font-weight: 800; color: #f8fafc; letter-spacing: -0.02em; margin-bottom: 4px; }
  .footer-tagline { font-size: 11px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px; }
  .footer-links { font-size: 12px; color: #64748b; margin-bottom: 16px; line-height: 1.7; }
  .footer-links a { color: #94a3b8; text-decoration: none; font-weight: 500; }
  .footer-links a:hover { color: #cbd5e1; }
  .footer-copy { font-size: 11px; color: #475569; line-height: 1.7; }
  .footer-craft { display: inline-block; margin-top: 18px; padding-top: 18px; border-top: 1px solid rgba(148,163,184,0.10); font-size: 10px; font-weight: 600; color: #64748b; letter-spacing: 0.05em; }
  .footer-craft a { color: #94a3b8; text-decoration: none; font-weight: 700; }
  .footer-craft .a3-mark { display: inline-block; padding: 2px 8px; border-radius: 6px; background: rgba(37,99,235,0.10); color: #93c5fd; font-weight: 800; letter-spacing: 0.02em; margin: 0 2px; }

  @media only screen and (max-width: 600px) {
    body { padding: 16px 8px; }
    .content { padding: 28px 24px; }
    .footer-area { padding: 28px 20px 24px; }
  }
`;

const footer = (note = "You're receiving this because you have an account with YourInterviewCoach.") => `
  <div class="footer-area">
    <p class="footer-brand">YourInterviewCoach</p>
    <p class="footer-tagline">Where preparation meets placement</p>
    <p class="footer-links">
      <a href="${BASE_URL}">Visit Website</a> &nbsp;·&nbsp;
      <a href="${BASE_URL}/user-dashboard">Dashboard</a> &nbsp;·&nbsp;
      <a href="${BASE_URL}/contact">Contact</a>
    </p>
    <p class="footer-copy">&copy; ${new Date().getFullYear()} YourInterviewCoach. All rights reserved.<br>${note}</p>
    <p class="footer-craft">
      Designed &amp; engineered by <span class="a3-mark">A3 Neptune</span> &nbsp;·&nbsp; Bengaluru
    </p>
  </div>
`;

/* ─────────────────────────────────────────────────────────────
   1. WELCOME EMAIL
───────────────────────────────────────────────────────────── */
const welcomeEmailTemplate = (userName) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${fontLink}
  <style>
    ${baseStyles}
    .hero { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 52px 40px 44px; text-align: center; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; top: -100px; right: -80px; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%); pointer-events: none; }
    .hero::after { content: ''; position: absolute; bottom: -60px; left: -60px; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%); pointer-events: none; }
    .hero-badge { display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); border-radius: 99px; padding: 5px 16px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.88); margin-bottom: 20px; }
    .hero h1 { font-size: 38px; font-weight: 900; letter-spacing: -0.04em; line-height: 1.05; color: #fff; margin-bottom: 12px; }
    .hero h1 span { display: block; font-weight: 300; opacity: 0.6; font-size: 28px; }
    .hero p { font-size: 15px; color: rgba(255,255,255,0.76); line-height: 1.65; max-width: 380px; margin: 0 auto; }
    .feature-list { background: #f8fafc; border-radius: 14px; border: 1px solid rgba(37,99,235,0.10); padding: 8px 0; margin: 24px 0; }
    .feature-item { display: table; width: 100%; padding: 13px 20px; border-bottom: 1px solid rgba(37,99,235,0.07); }
    .feature-item:last-child { border-bottom: none; }
    .feature-check { display: table-cell; width: 28px; vertical-align: middle; }
    .check-dot { width: 22px; height: 22px; border-radius: 6px; background: rgba(37,99,235,0.10); border: 1px solid rgba(37,99,235,0.2); text-align: center; line-height: 22px; font-size: 11px; color: #2563eb; font-weight: 700; }
    .feature-text { display: table-cell; vertical-align: middle; font-size: 14px; color: #334155; font-weight: 500; padding-left: 12px; }
    .cta-area { text-align: center; padding: 8px 0 4px; }
    .greeting { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 12px; letter-spacing: -0.02em; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="hero">
      <div class="hero-badge">✦ Welcome Aboard</div>
      <h1>Your journey to<span>interview success.</span></h1>
      <p>You're now part of a community that turns preparation into placement.</p>
    </div>

    <div class="content">
      <p class="greeting">Hi ${userName} 👋</p>
      <p class="body">We're thrilled to have you join <strong>YourInterviewCoach</strong>. Your account is all set — and everything you need to ace your interviews and advance your career is right here.</p>

      <div class="feature-list">
        <div class="feature-item"><div class="feature-check"><div class="check-dot">✓</div></div><div class="feature-text">Connect with expert mentors from top companies</div></div>
        <div class="feature-item"><div class="feature-check"><div class="check-dot">✓</div></div><div class="feature-text">Get personalised 1:1 career guidance &amp; feedback</div></div>
        <div class="feature-item"><div class="feature-check"><div class="check-dot">✓</div></div><div class="feature-text">Practice with live group discussions &amp; mock interviews</div></div>
        <div class="feature-item"><div class="feature-check"><div class="check-dot">✓</div></div><div class="feature-text">Resume analysis &amp; positioning for your target roles</div></div>
        <div class="feature-item"><div class="feature-check"><div class="check-dot">✓</div></div><div class="feature-text">Track your progress and improvement over time</div></div>
      </div>

      <div class="cta-area">
        <a href="${BASE_URL}/user-dashboard" class="btn">Get Started →</a>
      </div>

      <div class="divider"></div>
      <p class="body" style="font-size:13px; color:#94a3b8;">Need help getting started? Just reply to this email — our team is always happy to help.</p>
      <p style="margin-top:20px; font-size:14px; font-weight:600; color:#0f172a;">Best regards,<br>The YourInterviewCoach Team</p>
    </div>

    ${footer("You're receiving this because you created an account with YourInterviewCoach.")}
  </div>
</div>
</body>
</html>`;
};

/* ─────────────────────────────────────────────────────────────
   2. LOGIN NOTIFICATION
───────────────────────────────────────────────────────────── */
const loginNotificationTemplate = (userName, loginTime, location, ipAddress, device) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${fontLink}
  <style>
    ${baseStyles}
    .hero { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 48px 40px 40px; text-align: center; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; top: -80px; right: -60px; width: 240px; height: 240px; border-radius: 50%; background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%); pointer-events: none; }
    .hero-badge { display: inline-block; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); border-radius: 99px; padding: 5px 16px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #fca5a5; margin-bottom: 18px; }
    .hero h1 { font-size: 34px; font-weight: 900; letter-spacing: -0.04em; color: #f8fafc; margin-bottom: 10px; }
    .hero p { font-size: 14px; color: rgba(248,250,252,0.55); }
    .details-box { background: #f8fafc; border: 1px solid rgba(37,99,235,0.10); border-left: 4px solid #2563eb; border-radius: 10px; padding: 0; margin: 24px 0; overflow: hidden; }
    .detail-row { display: table; width: 100%; padding: 12px 18px; border-bottom: 1px solid #e2e8f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { display: table-cell; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; width: 110px; vertical-align: middle; }
    .detail-value { display: table-cell; font-size: 13px; font-weight: 600; color: #1e293b; vertical-align: middle; padding-left: 8px; }
    .safe-box { background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 18px 20px; margin: 20px 0; display: table; width: 100%; }
    .safe-icon { display: table-cell; width: 36px; vertical-align: middle; font-size: 20px; }
    .safe-text { display: table-cell; font-size: 14px; font-weight: 600; color: #166534; vertical-align: middle; line-height: 1.5; }
    .warn-box { background: #fff7ed; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 18px 20px; margin: 20px 0; display: table; width: 100%; }
    .warn-icon { display: table-cell; width: 36px; vertical-align: middle; font-size: 20px; }
    .warn-text { display: table-cell; font-size: 14px; font-weight: 600; color: #9a3412; vertical-align: middle; line-height: 1.6; }
    .greeting { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 12px; letter-spacing: -0.02em; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="hero">
      <div class="hero-badge">⚡ Security Alert</div>
      <h1>New Sign-In Detected</h1>
      <p>We noticed a new login to your account</p>
    </div>

    <div class="content">
      <p class="greeting">Hi ${userName},</p>
      <p class="body">We detected a new login to your <strong>YourInterviewCoach</strong> account. Here are the details:</p>

      <div class="details-box">
        <div class="detail-row"><span class="detail-label">🕒 Time</span><span class="detail-value">${loginTime}</span></div>
        <div class="detail-row"><span class="detail-label">📍 Location</span><span class="detail-value">${location || 'Unknown'}</span></div>
        <div class="detail-row"><span class="detail-label">💻 Device</span><span class="detail-value">${device || 'Unknown device'}</span></div>
        <div class="detail-row"><span class="detail-label">🌐 IP Address</span><span class="detail-value">${ipAddress || 'Hidden'}</span></div>
      </div>

      <div class="safe-box">
        <div class="safe-icon">✅</div>
        <div class="safe-text">If this was you, no action is needed — you can safely ignore this email.</div>
      </div>

      <div class="warn-box">
        <div class="warn-icon">⚠️</div>
        <div class="warn-text"><strong>Wasn't you?</strong> Secure your account immediately by changing your password and reviewing recent activity.</div>
      </div>

      <div class="divider"></div>
      <p class="body" style="font-size:13px; color:#94a3b8;">We send these alerts to help protect your account. If you have concerns, contact our support team.</p>
      <p style="margin-top:20px; font-size:14px; font-weight:600; color:#0f172a;">Best regards,<br>The YourInterviewCoach Security Team</p>
    </div>

    ${footer("This is an automated security notification.")}
  </div>
</div>
</body>
</html>`;
};

/* ─────────────────────────────────────────────────────────────
   3. FORGOT PASSWORD
───────────────────────────────────────────────────────────── */
const forgotPasswordTemplate = (userName, resetToken) => {
  const resetUrl = `${BASE_URL}/reset-password?token=${resetToken}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${fontLink}
  <style>
    ${baseStyles}
    .hero { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 52px 40px 44px; text-align: center; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; top: -80px; right: -80px; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%); pointer-events: none; }
    .hero-badge { display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); border-radius: 99px; padding: 5px 16px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.88); margin-bottom: 18px; }
    .hero h1 { font-size: 36px; font-weight: 900; letter-spacing: -0.04em; color: #fff; margin-bottom: 10px; }
    .hero p { font-size: 14px; color: rgba(255,255,255,0.68); }
    .link-box { background: #f8fafc; border: 1.5px dashed rgba(37,99,235,0.35); border-radius: 12px; padding: 18px 20px; margin: 20px 0; word-break: break-all; text-align: center; }
    .link-box a { color: #2563eb; font-size: 12px; font-weight: 500; text-decoration: none; line-height: 1.6; }
    .warn-list { background: #fff7ed; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 18px 20px; margin: 20px 0; }
    .warn-list-title { font-size: 13px; font-weight: 700; color: #9a3412; margin-bottom: 10px; }
    .warn-list ul { padding-left: 18px; }
    .warn-list li { font-size: 13px; color: #9a3412; margin: 6px 0; line-height: 1.5; }
    .tip-box { background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 8px; padding: 14px 18px; margin: 20px 0; }
    .tip-box p { font-size: 13px; color: #1e40af; margin: 0; line-height: 1.55; }
    .cta-area { text-align: center; padding: 8px 0 4px; }
    .greeting { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 12px; letter-spacing: -0.02em; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="hero">
      <div class="hero-badge">🔑 Password Reset</div>
      <h1>Reset Your Password</h1>
      <p>Secure your account with a new password</p>
    </div>

    <div class="content">
      <p class="greeting">Hi ${userName},</p>
      <p class="body">We received a request to reset the password for your <strong>YourInterviewCoach</strong> account. No worries — click the button below and you'll be back in within seconds.</p>

      <div class="cta-area">
        <a href="${resetUrl}" class="btn">Reset My Password →</a>
      </div>

      <p class="body" style="font-size:13px; color:#94a3b8; margin-top:16px;">Button not working? Copy and paste this link into your browser:</p>
      <div class="link-box"><a href="${resetUrl}">${resetUrl}</a></div>

      <div class="warn-list">
        <p class="warn-list-title">⚠️ Important Security Information</p>
        <ul>
          <li><strong>This link expires in 1 hour</strong> for your security</li>
          <li>If you didn't request this reset, you can safely ignore this email</li>
          <li>Never share this link with anyone, including our support team</li>
          <li>Your current password stays active until you complete the reset</li>
        </ul>
      </div>

      <div class="tip-box">
        <p>💡 <strong>Tip:</strong> Choose a strong password with at least 8 characters, mixing letters, numbers, and symbols.</p>
      </div>

      <div class="divider"></div>
      <p class="body" style="font-size:13px; color:#94a3b8;">Still having trouble? Contact our support team and we'll sort it out.</p>
      <p style="margin-top:20px; font-size:14px; font-weight:600; color:#0f172a;">Best regards,<br>The YourInterviewCoach Team</p>
    </div>

    ${footer("This is an automated security email. Please do not reply.")}
  </div>
</div>
</body>
</html>`;
};

/* ─────────────────────────────────────────────────────────────
   4. PLACEMENT ACCELERATOR BOOKING CONFIRMATION
───────────────────────────────────────────────────────────── */
const placementAcceleratorBookingTemplate = (userName, weekLabel) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${fontLink}
  <style>
    ${baseStyles}
    /* HERO */
    .hero { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 48px 40px 0; text-align: center; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; top: -100px; right: -80px; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%); pointer-events: none; }
    .hero::after { content: ''; position: absolute; bottom: -60px; left: -60px; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%); pointer-events: none; }
    .hero-badge { display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); border-radius: 99px; padding: 5px 16px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.9); margin-bottom: 18px; }
    .hero h1 { font-size: 40px; font-weight: 900; letter-spacing: -0.04em; line-height: 1.0; color: #fff; margin-bottom: 10px; }
    .hero h1 span { display: block; font-weight: 300; font-size: 26px; opacity: 0.55; }
    .hero p { font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 0; }
    /* STATS STRIP */
    .stats { width: 100%; background: #0f172a; border-collapse: collapse; }
    .stat-cell { text-align: center; padding: 16px 10px; border-right: 1px solid rgba(255,255,255,0.06); }
    .stat-cell:last-child { border-right: none; }
    .stat-val { font-size: 22px; font-weight: 900; color: #2563eb; letter-spacing: -0.04em; line-height: 1; display: block; }
    .stat-lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #475569; display: block; margin-top: 4px; }
    /* BOOKING BOX */
    .booking-box { background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 10px; margin: 24px 0; overflow: hidden; }
    .brow { display: table; width: 100%; padding: 11px 18px; border-bottom: 1px solid rgba(37,99,235,0.10); }
    .brow:last-child { border-bottom: none; }
    .blabel { display: table-cell; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #64748b; width: 120px; vertical-align: middle; }
    .bvalue { display: table-cell; font-size: 13px; font-weight: 600; color: #1d4ed8; vertical-align: middle; padding-left: 8px; }
    /* JOURNEY */
    .journey { background: #0f172a; padding: 18px 24px; text-align: center; }
    .jstep { display: inline-block; text-align: center; padding: 0 8px; vertical-align: middle; }
    .jnum { font-size: 12px; font-weight: 800; letter-spacing: -0.02em; display: block; }
    .jlbl { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; display: block; margin-top: 2px; }
    .jarrow { display: inline-block; color: #374151; font-size: 14px; vertical-align: middle; padding: 0 2px; }
    /* MODULE CARDS */
    .sec-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #94a3b8; margin: 28px 0 12px; }
    .mod { border-radius: 12px; padding: 17px 18px; margin-bottom: 10px; border-width: 1px; border-style: solid; }
    .mod-header { display: table; width: 100%; margin-bottom: 8px; }
    .mod-left { display: table-cell; vertical-align: middle; }
    .mod-right { display: table-cell; vertical-align: middle; text-align: right; width: 68px; }
    .mod-tag { font-size: 9px; font-weight: 800; letter-spacing: 0.10em; text-transform: uppercase; margin-bottom: 3px; display: block; }
    .mod-name { font-size: 14px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; line-height: 1.2; }
    .mod-dur { font-size: 10px; font-weight: 700; border-radius: 99px; padding: 3px 10px; display: inline-block; }
    .mod-obj { font-size: 12px; color: #64748b; line-height: 1.55; margin-bottom: 9px; }
    .mod-outcomes { list-style: none; padding: 0; }
    .mod-outcomes li { font-size: 11.5px; font-weight: 500; padding: 2px 0 2px 16px; position: relative; line-height: 1.5; }
    .mod-outcomes li::before { content: '✓'; position: absolute; left: 0; font-weight: 800; }
    /* DELIVERABLES */
    .deliv-table { width: 100%; border-collapse: separate; border-spacing: 8px; margin: 4px -8px; table-layout: fixed; }
    .deliv-cell { background: #f8fafc; border: 1px solid rgba(37,99,235,0.09); border-radius: 12px; padding: 16px 12px; text-align: center; vertical-align: top; }
    .deliv-icon { font-size: 22px; display: block; margin-bottom: 8px; }
    .deliv-name { font-size: 11px; font-weight: 700; color: #0f172a; line-height: 1.35; display: block; }
    .deliv-sub { font-size: 10px; color: #94a3b8; font-weight: 500; display: block; margin-top: 3px; }
    /* MENTOR */
    .mentor-box { background: #f8f7f4; border-radius: 14px; padding: 20px 22px; margin: 20px 0; }
    .mentor-name { font-size: 16px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; margin-bottom: 2px; }
    .mentor-sub { font-size: 11px; color: #64748b; font-weight: 500; margin-bottom: 8px; }
    .mentor-bio { font-size: 13px; color: #475569; line-height: 1.65; margin-bottom: 10px; }
    .cred { display: inline-block; font-size: 10px; font-weight: 700; color: #2563eb; background: rgba(37,99,235,0.08); border: 1px solid rgba(37,99,235,0.15); border-radius: 99px; padding: 3px 10px; margin: 2px 3px 2px 0; }
    /* WHATSAPP */
    .wa-box { background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 14px; padding: 20px 22px; margin: 20px 0; text-align: center; }
    .wa-icon { font-size: 26px; display: block; margin-bottom: 8px; }
    .wa-text { font-size: 14px; font-weight: 500; color: #166534; line-height: 1.65; }
    .cta-area { text-align: center; padding: 10px 0 4px; }
    .greeting { font-size: 19px; font-weight: 800; color: #0f172a; margin-bottom: 10px; letter-spacing: -0.02em; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <!-- HERO -->
    <div class="hero">
      <div class="hero-badge">✦ Placement Accelerator Program</div>
      <h1>Your entire placement<br>journey.<span>In 5 hours.</span></h1>
      <p style="margin-bottom:36px;">Booking confirmed &amp; payment received — you're in.</p>
    </div>

    <!-- STATS STRIP -->
    <table class="stats" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td class="stat-cell"><span class="stat-val">4</span><span class="stat-lbl">Modules</span></td>
        <td class="stat-cell"><span class="stat-val">5 hrs</span><span class="stat-lbl">Live Duration</span></td>
        <td class="stat-cell"><span class="stat-val">1:1</span><span class="stat-lbl">Feedback</span></td>
        <td class="stat-cell"><span class="stat-val">94%</span><span class="stat-lbl">Success Rate</span></td>
      </tr>
    </table>

    <div class="content">
      <p class="greeting">Hi ${userName} 👋</p>
      <p class="body">Your <strong>Placement Accelerator</strong> seat is locked in. From a blank resume to a polished interview performance — 4 structured modules, live practice, and 1:1 feedback from Neel that gives you a clear edge over every other candidate in the room.</p>

      <!-- BOOKING DETAILS -->
      <div class="booking-box">
        <div class="brow"><span class="blabel">📦 Programme</span><span class="bvalue">Placement Accelerator</span></div>
        <div class="brow"><span class="blabel">📅 Your Week</span><span class="bvalue">${weekLabel}</span></div>
        <div class="brow"><span class="blabel">⏱ Duration</span><span class="bvalue">300 mins · 5 hours of live expert-led sessions</span></div>
        <div class="brow"><span class="blabel">🗓 Scheduling</span><span class="bvalue">Confirmed via WhatsApp within 24 hrs</span></div>
      </div>

      <!-- JOURNEY STRIP -->
      <div class="journey">
        <span class="jstep"><span class="jnum" style="color:#059669;">01</span><span class="jlbl">Resume</span></span>
        <span class="jarrow">→</span>
        <span class="jstep"><span class="jnum" style="color:#b45309;">02</span><span class="jlbl">GD</span></span>
        <span class="jarrow">→</span>
        <span class="jstep"><span class="jnum" style="color:#2563eb;">03</span><span class="jlbl">Interview</span></span>
        <span class="jarrow">→</span>
        <span class="jstep"><span class="jnum" style="color:#7c3aed;">04</span><span class="jlbl">Mock</span></span>
        <span class="jarrow">→</span>
        <span class="jstep"><span class="jnum" style="color:#f7c948; font-size:16px;">🏆</span><span class="jlbl">Offer</span></span>
      </div>

      <!-- MODULES -->
      <p class="sec-label">The Curriculum — 4 modules · 1 complete transformation</p>

      <div class="mod" style="background:rgba(5,150,105,0.04); border-color:rgba(5,150,105,0.2);">
        <div class="mod-header">
          <div class="mod-left"><span class="mod-tag" style="color:#059669;">Module 01 · Foundation</span><span class="mod-name">Resume Analysis &amp; Positioning</span></div>
          <div class="mod-right"><span class="mod-dur" style="background:rgba(5,150,105,0.1); color:#059669;">60 mins</span></div>
        </div>
        <p class="mod-obj">Turn a basic resume into an interview-winning document.</p>
        <ul class="mod-outcomes">
          <li style="color:#047857;">Refined, recruiter-ready resume</li>
          <li style="color:#047857;">Clear positioning of your profile</li>
        </ul>
      </div>

      <div class="mod" style="background:rgba(180,83,9,0.04); border-color:rgba(180,83,9,0.2);">
        <div class="mod-header">
          <div class="mod-left"><span class="mod-tag" style="color:#b45309;">Module 02 · Group Skill</span><span class="mod-name">Group Discussion Mastery</span></div>
          <div class="mod-right"><span class="mod-dur" style="background:rgba(180,83,9,0.1); color:#b45309;">60 mins</span></div>
        </div>
        <p class="mod-obj">Stand out in GDs without over-speaking.</p>
        <ul class="mod-outcomes">
          <li style="color:#92400e;">Structured thinking under pressure</li>
          <li style="color:#92400e;">Confident participation strategy + live GD simulation</li>
        </ul>
      </div>

      <div class="mod" style="background:rgba(37,99,235,0.04); border-color:rgba(37,99,235,0.2);">
        <div class="mod-header">
          <div class="mod-left"><span class="mod-tag" style="color:#2563eb;">Module 03 · Core Module ★ Flagship</span><span class="mod-name">Interview Preparation – Core</span></div>
          <div class="mod-right"><span class="mod-dur" style="background:rgba(37,99,235,0.1); color:#2563eb;">120 mins</span></div>
        </div>
        <p class="mod-obj">Build strong, structured, and confident responses.</p>
        <ul class="mod-outcomes">
          <li style="color:#1d4ed8;">Finalized, polished interview introduction</li>
          <li style="color:#1d4ed8;">STAR-method answers to most-asked questions</li>
          <li style="color:#1d4ed8;">Improved articulation &amp; confidence</li>
        </ul>
      </div>

      <div class="mod" style="background:rgba(124,58,237,0.04); border-color:rgba(124,58,237,0.2);">
        <div class="mod-header">
          <div class="mod-left"><span class="mod-tag" style="color:#7c3aed;">Module 04 · Capstone</span><span class="mod-name">Mock Interview + Feedback</span></div>
          <div class="mod-right"><span class="mod-dur" style="background:rgba(124,58,237,0.1); color:#7c3aed;">60 mins</span></div>
        </div>
        <p class="mod-obj">Simulate real interview pressure and get actionable clarity.</p>
        <ul class="mod-outcomes">
          <li style="color:#6d28d9;">Real interview experience under pressure</li>
          <li style="color:#6d28d9;">Clear action plan for improvement</li>
        </ul>
      </div>

      <div class="divider"></div>

      <!-- DELIVERABLES -->
      <p class="sec-label">You leave with everything</p>
      <table class="deliv-table" cellpadding="0" cellspacing="8" role="presentation">
        <tr>
          <td class="deliv-cell"><span class="deliv-icon">📄</span><span class="deliv-name">Resume improvement suggestions</span><span class="deliv-sub">Documented &amp; actionable</span></td>
          <td class="deliv-cell"><span class="deliv-icon">🎤</span><span class="deliv-name">Finalized interview introduction</span><span class="deliv-sub">Polished &amp; personalised</span></td>
          <td class="deliv-cell"><span class="deliv-icon">💬</span><span class="deliv-name">GD performance feedback</span><span class="deliv-sub">Scored &amp; detailed</span></td>
          <td class="deliv-cell"><span class="deliv-icon">🗺️</span><span class="deliv-name">30-day improvement roadmap</span><span class="deliv-sub">Your next steps planned</span></td>
        </tr>
      </table>

      <div class="divider"></div>

      <!-- MENTOR -->
      <div class="mentor-box">
        <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
          <tr>
            <td style="width:50px; vertical-align:top;">
              <div style="width:44px; height:44px; border-radius:12px; background:linear-gradient(135deg,#dbeafe,#bfdbfe); text-align:center; line-height:44px; font-size:20px;">👨‍💼</div>
            </td>
            <td style="padding-left:14px; vertical-align:top;">
              <p class="mentor-name">Neel Aashish Seru</p>
              <p class="mentor-sub">12+ years · Both sides of the hiring table</p>
              <p class="mentor-bio">He's sat on hiring panels at Tech Mahindra &amp; IndiaMART and coached 5,000+ candidates. He knows exactly what interviewers write when they decide to pass — and he'll make sure they write something different about you.</p>
              <span class="cred">12+ yrs experience</span>
              <span class="cred">5,000+ candidates coached</span>
              <span class="cred">94% placement success</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- WHATSAPP -->
      <div class="wa-box">
        <span class="wa-icon">💬</span>
        <p class="wa-text"><strong>What happens next?</strong><br>Our team will reach out to you on WhatsApp within 24 hours to confirm the exact session schedule for your preferred week — <strong>${weekLabel}</strong>.</p>
      </div>

      <div class="cta-area">
        <a href="${BASE_URL}/user-dashboard/bookings" class="btn">View My Bookings →</a>
      </div>

      <div class="divider"></div>
      <p class="body" style="font-size:13px; color:#94a3b8;">Have questions? Just reply to this email — our team is happy to help.</p>
      <p style="margin-top:20px; font-size:14px; font-weight:600; color:#0f172a;">Best regards,<br>The YourInterviewCoach Team</p>
    </div>

    ${footer("You're receiving this because you booked a Placement Accelerator session.")}
  </div>
</div>
</body>
</html>`;
};

/* ─────────────────────────────────────────────────────────────
   5. EMAIL VERIFICATION
───────────────────────────────────────────────────────────── */
const verificationEmailTemplate = (userName, verificationToken) => {
  const verifyUrl = `${BASE_URL}/verify-email?token=${verificationToken}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${fontLink}
  <style>
    ${baseStyles}
    .hero { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 52px 40px 44px; text-align: center; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; top: -80px; right: -80px; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%); pointer-events: none; }
    .hero-badge { display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); border-radius: 99px; padding: 5px 16px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.88); margin-bottom: 18px; }
    .hero h1 { font-size: 36px; font-weight: 900; letter-spacing: -0.04em; color: #fff; margin-bottom: 10px; }
    .hero p { font-size: 14px; color: rgba(255,255,255,0.68); }
    .verify-highlight { background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1.5px solid rgba(37,99,235,0.25); border-radius: 14px; padding: 28px 24px; margin: 24px 0; text-align: center; }
    .verify-icon { font-size: 40px; display: block; margin-bottom: 10px; }
    .verify-title { font-size: 16px; font-weight: 800; color: #1e3a8a; letter-spacing: -0.02em; margin-bottom: 6px; }
    .verify-sub { font-size: 13px; color: #3b82f6; font-weight: 500; }
    .link-box { background: #f8fafc; border: 1.5px dashed rgba(37,99,235,0.30); border-radius: 12px; padding: 16px 18px; margin: 16px 0; word-break: break-all; text-align: center; }
    .link-box a { color: #2563eb; font-size: 12px; font-weight: 500; text-decoration: none; line-height: 1.6; }
    .warn-list { background: #fff7ed; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 16px 20px; margin: 20px 0; }
    .warn-list-title { font-size: 13px; font-weight: 700; color: #9a3412; margin-bottom: 8px; }
    .warn-list ul { padding-left: 18px; }
    .warn-list li { font-size: 13px; color: #9a3412; margin: 5px 0; line-height: 1.5; }
    .cta-area { text-align: center; padding: 8px 0 4px; }
    .greeting { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 12px; letter-spacing: -0.02em; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="hero">
      <div class="hero-badge">✉️ Email Verification</div>
      <h1>Verify Your Email</h1>
      <p>One quick step to activate your account</p>
    </div>

    <div class="content">
      <p class="greeting">Hi ${userName},</p>
      <p class="body">Thank you for signing up with <strong>YourInterviewCoach</strong>! Please confirm your email address to activate your account and get full access to everything we offer.</p>

      <div class="verify-highlight">
        <span class="verify-icon">📧</span>
        <p class="verify-title">Confirm your email address</p>
        <p class="verify-sub">Click the button below — it only takes a second.</p>
      </div>

      <div class="cta-area">
        <a href="${verifyUrl}" class="btn">Verify Email Address →</a>
      </div>

      <p class="body" style="font-size:13px; color:#94a3b8; margin-top:16px;">Button not working? Copy and paste this link into your browser:</p>
      <div class="link-box"><a href="${verifyUrl}">${verifyUrl}</a></div>

      <div class="warn-list">
        <p class="warn-list-title">⚠️ Please Note</p>
        <ul>
          <li><strong>This link expires in 24 hours</strong> for your security</li>
          <li>If you did not sign up for an account, please disregard this email</li>
        </ul>
      </div>

      <div class="divider"></div>
      <p class="body" style="font-size:13px; color:#94a3b8;">Questions or didn't mean to sign up? Contact our support team and we'll help right away.</p>
      <p style="margin-top:20px; font-size:14px; font-weight:600; color:#0f172a;">Best regards,<br>The YourInterviewCoach Team</p>
    </div>

    ${footer("This is an automated email. Please do not reply.")}
  </div>
</div>
</body>
</html>`;
};

export {
  welcomeEmailTemplate,
  loginNotificationTemplate,
  forgotPasswordTemplate,
  placementAcceleratorBookingTemplate,
  verificationEmailTemplate,
};
export default {
  welcomeEmailTemplate,
  loginNotificationTemplate,
  forgotPasswordTemplate,
  placementAcceleratorBookingTemplate,
  verificationEmailTemplate,
};
