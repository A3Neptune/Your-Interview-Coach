// Professional email templates with enhanced design

const welcomeEmailTemplate = (userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #18181b;
          background: #fafafa;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 48px 32px;
          text-align: center;
        }
        .header h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .header p {
          font-size: 16px;
          font-weight: 300;
          opacity: 0.9;
        }
        .content {
          background: white;
          padding: 40px 32px;
        }
        .content h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #18181b;
        }
        .content p {
          font-size: 16px;
          color: #52525b;
          margin-bottom: 16px;
          line-height: 1.7;
        }
        .features {
          background: #f4f4f5;
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
        }
        .features ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .features li {
          padding: 12px 0;
          border-bottom: 1px solid #e4e4e7;
          display: flex;
          align-items: center;
          font-size: 15px;
          color: #3f3f46;
        }
        .features li:last-child {
          border-bottom: none;
        }
        .features li:before {
          content: "✓";
          display: inline-block;
          width: 24px;
          height: 24px;
          background: #10b981;
          color: white;
          border-radius: 50%;
          text-align: center;
          line-height: 24px;
          margin-right: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background: #10b981;
          color: white !important;
          text-decoration: none;
          border-radius: 8px;
          margin: 24px 0;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
        }
        .button:hover {
          background: #059669;
          box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.4);
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e4e4e7, transparent);
          margin: 32px 0;
        }
        .footer {
          background: #fafafa;
          text-align: center;
          padding: 32px;
          color: #71717a;
          font-size: 13px;
          line-height: 1.8;
        }
        .footer strong {
          color: #52525b;
        }
        @media only screen and (max-width: 600px) {
          .container { border-radius: 0; }
          .header { padding: 32px 24px; }
          .content { padding: 32px 24px; }
          .header h1 { font-size: 28px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome Aboard!</h1>
          <p>Your journey to interview success starts here</p>
        </div>
        <div class="content">
          <h2>Hi ${userName},</h2>
          <p>We're thrilled to have you join YourInterviewCoach! Your account has been successfully created, and you're now part of a community dedicated to helping you ace your interviews and advance your career.</p>

          <div class="features">
            <ul>
              <li>Connect with expert mentors from top companies</li>
              <li>Access personalized career guidance and feedback</li>
              <li>Join group discussions with peers</li>
              <li>Prepare for company-specific interviews</li>
              <li>Track your progress and improvement</li>
            </ul>
          </div>

          <center>
            <a href="${process.env.FRONTEND_URL || 'https://www.yourinterviewcoach.in'}/user-dashboard" class="button">Get Started →</a>
          </center>

          <div class="divider"></div>

          <p style="font-size: 14px;">Need help getting started? Our support team is here for you. Just reply to this email and we'll be happy to assist!</p>

          <p style="margin-top: 24px; font-weight: 500; color: #18181b;">Best regards,<br>The YourInterviewCoach Team</p>
        </div>
        <div class="footer">
          <p><strong>YourInterviewCoach</strong></p>
          <p>&copy; ${new Date().getFullYear()} YourInterviewCoach. All rights reserved.</p>
          <p style="margin-top: 12px;">You're receiving this email because you created an account with us.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const loginNotificationTemplate = (userName, loginTime, location, ipAddress, device) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #18181b;
          background: #fafafa;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
          background: linear-gradient(135deg, #18181b 0%, #3f3f46 100%);
          color: white;
          padding: 48px 32px;
          text-align: center;
        }
        .header h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .header p {
          font-size: 16px;
          font-weight: 300;
          opacity: 0.9;
        }
        .content {
          background: white;
          padding: 40px 32px;
        }
        .content h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #18181b;
        }
        .content p {
          font-size: 16px;
          color: #52525b;
          margin-bottom: 16px;
          line-height: 1.7;
        }
        .info-box {
          background: #f4f4f5;
          border-left: 4px solid #10b981;
          border-radius: 8px;
          padding: 24px;
          margin: 24px 0;
        }
        .info-row {
          display: flex;
          padding: 10px 0;
          border-bottom: 1px solid #e4e4e7;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #3f3f46;
          min-width: 120px;
          font-size: 14px;
        }
        .info-value {
          color: #52525b;
          font-size: 14px;
        }
        .warning-box {
          background: #fef2f2;
          border: 2px solid #fca5a5;
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
        }
        .warning-box p {
          color: #991b1b;
          margin: 0;
          font-weight: 500;
          font-size: 15px;
        }
        .warning-box .icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
        .safe-box {
          background: #f0fdf4;
          border: 2px solid #86efac;
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
          text-align: center;
        }
        .safe-box p {
          color: #166534;
          margin: 0;
          font-weight: 500;
          font-size: 15px;
        }
        .safe-box .icon {
          font-size: 32px;
          margin-bottom: 8px;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e4e4e7, transparent);
          margin: 32px 0;
        }
        .footer {
          background: #fafafa;
          text-align: center;
          padding: 32px;
          color: #71717a;
          font-size: 13px;
          line-height: 1.8;
        }
        .footer strong {
          color: #52525b;
        }
        @media only screen and (max-width: 600px) {
          .container { border-radius: 0; }
          .header { padding: 32px 24px; }
          .content { padding: 32px 24px; }
          .header h1 { font-size: 28px; }
          .info-row { flex-direction: column; }
          .info-label { margin-bottom: 4px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Security Alert</h1>
          <p>New login detected to your account</p>
        </div>
        <div class="content">
          <h2>Hi ${userName},</h2>
          <p>We detected a new login to your YourInterviewCoach account. Here are the details:</p>

          <div class="info-box">
            <div class="info-row">
              <span class="info-label">🕒 Time:</span>
              <span class="info-value">${loginTime}</span>
            </div>
            <div class="info-row">
              <span class="info-label">📍 Location:</span>
              <span class="info-value">${location || 'Unknown'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">💻 Device:</span>
              <span class="info-value">${device || 'Unknown device'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">🌐 IP Address:</span>
              <span class="info-value">${ipAddress || 'Hidden'}</span>
            </div>
          </div>

          <div class="safe-box">
            <div class="icon">✅</div>
            <p>If this was you, you can safely ignore this email.</p>
          </div>

          <div class="warning-box">
            <div class="icon">⚠️</div>
            <p><strong>If this wasn't you:</strong> Please secure your account immediately by changing your password and reviewing recent account activity.</p>
          </div>

          <div class="divider"></div>

          <p style="font-size: 14px; color: #71717a;">We send these notifications to help protect your account. If you have any concerns, please contact our support team.</p>

          <p style="margin-top: 24px; font-weight: 500; color: #18181b;">Best regards,<br>The YourInterviewCoach Security Team</p>
        </div>
        <div class="footer">
          <p><strong>YourInterviewCoach</strong></p>
          <p>&copy; ${new Date().getFullYear()} YourInterviewCoach. All rights reserved.</p>
          <p style="margin-top: 12px;">This is an automated security notification.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const forgotPasswordTemplate = (userName, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #18181b;
          background: #fafafa;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          padding: 48px 32px;
          text-align: center;
        }
        .header h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .header p {
          font-size: 16px;
          font-weight: 300;
          opacity: 0.9;
        }
        .content {
          background: white;
          padding: 40px 32px;
        }
        .content h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #18181b;
        }
        .content p {
          font-size: 16px;
          color: #52525b;
          margin-bottom: 16px;
          line-height: 1.7;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background: #3b82f6;
          color: white !important;
          text-decoration: none;
          border-radius: 8px;
          margin: 24px 0;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        }
        .button:hover {
          background: #2563eb;
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
        }
        .token-box {
          background: #f0f9ff;
          border: 2px dashed #3b82f6;
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
          text-align: center;
          word-break: break-all;
        }
        .token-box a {
          color: #2563eb;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }
        .warning-box {
          background: #fef2f2;
          border: 2px solid #fca5a5;
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
        }
        .warning-box .title {
          display: flex;
          align-items: center;
          font-weight: 600;
          color: #991b1b;
          margin-bottom: 12px;
          font-size: 16px;
        }
        .warning-box .icon {
          font-size: 24px;
          margin-right: 8px;
        }
        .warning-box ul {
          margin: 0;
          padding-left: 20px;
          color: #991b1b;
        }
        .warning-box li {
          margin: 8px 0;
          font-size: 14px;
        }
        .info-box {
          background: #f0fdf4;
          border-left: 4px solid #10b981;
          border-radius: 8px;
          padding: 16px;
          margin: 24px 0;
        }
        .info-box p {
          color: #166534;
          margin: 0;
          font-size: 14px;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e4e4e7, transparent);
          margin: 32px 0;
        }
        .footer {
          background: #fafafa;
          text-align: center;
          padding: 32px;
          color: #71717a;
          font-size: 13px;
          line-height: 1.8;
        }
        .footer strong {
          color: #52525b;
        }
        @media only screen and (max-width: 600px) {
          .container { border-radius: 0; }
          .header { padding: 32px 24px; }
          .content { padding: 32px 24px; }
          .header h1 { font-size: 28px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔑 Password Reset</h1>
          <p>Secure your account with a new password</p>
        </div>
        <div class="content">
          <h2>Hi ${userName},</h2>
          <p>We received a request to reset the password for your YourInterviewCoach account. No worries, we've got you covered!</p>

          <p>Click the button below to create a new password:</p>

          <center>
            <a href="${resetUrl}" class="button">Reset Your Password →</a>
          </center>

          <p style="font-size: 14px; color: #71717a; margin-top: 8px;">Button not working? Copy and paste this link into your browser:</p>

          <div class="token-box">
            <a href="${resetUrl}">${resetUrl}</a>
          </div>

          <div class="warning-box">
            <div class="title">
              <span class="icon">⚠️</span>
              <span>Important Security Information</span>
            </div>
            <ul>
              <li><strong>This link expires in 1 hour</strong> for your security</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Never share this link with anyone, including our support team</li>
              <li>Your current password remains active until you complete the reset</li>
            </ul>
          </div>

          <div class="info-box">
            <p>💡 <strong>Tip:</strong> Choose a strong password with at least 8 characters, including letters, numbers, and symbols.</p>
          </div>

          <div class="divider"></div>

          <p style="font-size: 14px; color: #71717a;">If you continue to have problems or didn't request this reset, please contact our support team immediately.</p>

          <p style="margin-top: 24px; font-weight: 500; color: #18181b;">Best regards,<br>The YourInterviewCoach Support Team</p>
        </div>
        <div class="footer">
          <p><strong>YourInterviewCoach</strong></p>
          <p>&copy; ${new Date().getFullYear()} YourInterviewCoach. All rights reserved.</p>
          <p style="margin-top: 12px;">This is an automated security email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const placementAcceleratorBookingTemplate = (userName, weekLabel) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #0f172a; background: #f8fafc; padding: 20px; }
        .wrap { max-width: 600px; margin: 0 auto; }

        /* HERO HEADER */
        .hero { background: #fff; border-radius: 20px 20px 0 0; padding: 0; overflow: hidden; border: 1px solid rgba(37,99,235,0.12); border-bottom: none; }
        .hero-top { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 44px 36px 36px; text-align: center; position: relative; overflow: hidden; }
        .hero-top::before { content: ''; position: absolute; top: -80px; right: -80px; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%); }
        .badge-pill { display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); border-radius: 99px; padding: 5px 14px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.9); margin-bottom: 18px; }
        .hero-top h1 { font-size: 36px; font-weight: 900; letter-spacing: -0.04em; line-height: 1.05; color: #fff; margin-bottom: 10px; }
        .hero-top h1 span { opacity: 0.55; font-weight: 300; display: block; }
        .hero-top p { font-size: 15px; color: rgba(255,255,255,0.78); font-weight: 400; line-height: 1.6; }

        /* STATS STRIP */
        .stats { display: table; width: 100%; background: #0f172a; }
        .stat { display: table-cell; text-align: center; padding: 18px 10px; border-right: 1px solid rgba(255,255,255,0.07); }
        .stat:last-child { border-right: none; }
        .stat-val { font-size: 22px; font-weight: 900; color: #2563eb; letter-spacing: -0.04em; line-height: 1; }
        .stat-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-top: 4px; }

        /* CONTENT */
        .content { background: #fff; padding: 36px; border: 1px solid rgba(37,99,235,0.12); border-top: none; border-bottom: none; }
        .content p { font-size: 15px; color: #475569; margin-bottom: 16px; line-height: 1.75; }

        /* BOOKING BOX */
        .booking-box { background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 10px; padding: 22px 24px; margin: 24px 0; }
        .booking-row { display: table; width: 100%; padding: 9px 0; border-bottom: 1px solid rgba(37,99,235,0.12); }
        .booking-row:last-child { border-bottom: none; padding-bottom: 0; }
        .booking-label { display: table-cell; font-size: 12px; font-weight: 700; color: #1e3a5f; width: 130px; vertical-align: middle; }
        .booking-value { display: table-cell; font-size: 13px; font-weight: 600; color: #1d4ed8; vertical-align: middle; }

        /* JOURNEY STRIP */
        .journey { background: #0f172a; padding: 18px 24px; text-align: center; }
        .journey-inner { display: inline-block; }
        .journey-step { display: inline-block; text-align: center; padding: 0 10px; }
        .journey-num { font-size: 11px; font-weight: 800; letter-spacing: -0.02em; }
        .journey-lbl { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-top: 2px; }
        .journey-arrow { display: inline-block; color: #374151; font-size: 14px; vertical-align: middle; padding: 0 4px; }

        /* MODULE CARDS */
        .modules-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 16px; margin-top: 8px; }
        .module { border-radius: 12px; padding: 18px 20px; margin-bottom: 10px; border: 1px solid; }
        .module-top { display: table; width: 100%; margin-bottom: 10px; }
        .module-left { display: table-cell; vertical-align: middle; }
        .module-right { display: table-cell; vertical-align: middle; text-align: right; width: 70px; }
        .module-num { font-size: 9px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 3px; }
        .module-name { font-size: 14px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; line-height: 1.2; }
        .module-dur { font-size: 10px; font-weight: 700; border-radius: 99px; padding: 3px 10px; }
        .module-obj { font-size: 12px; color: #64748b; line-height: 1.55; margin-bottom: 10px; }
        .module-outcomes { list-style: none; }
        .module-outcomes li { font-size: 11.5px; color: #475569; font-weight: 500; padding: 3px 0 3px 14px; position: relative; }
        .module-outcomes li::before { content: '✓'; position: absolute; left: 0; font-weight: 700; }

        /* DELIVERABLES */
        .deliverables { display: table; width: 100%; border-collapse: separate; border-spacing: 8px; margin: 4px -8px; }
        .deliv { display: table-cell; background: #f8fafc; border: 1px solid rgba(37,99,235,0.10); border-radius: 12px; padding: 16px 14px; text-align: center; width: 25%; vertical-align: top; }
        .deliv-icon { font-size: 22px; margin-bottom: 8px; }
        .deliv-label { font-size: 11px; font-weight: 700; color: #0f172a; line-height: 1.3; }
        .deliv-sub { font-size: 10px; color: #94a3b8; font-weight: 500; margin-top: 3px; }

        /* MENTOR */
        .mentor-box { background: #f8f7f4; border-radius: 14px; padding: 22px 24px; margin: 24px 0; display: table; width: 100%; }
        .mentor-left { display: table-cell; vertical-align: top; width: 52px; }
        .mentor-avatar { width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg,#dbeafe,#bfdbfe); display: flex; align-items: center; justify-content: center; font-size: 22px; }
        .mentor-right { display: table-cell; vertical-align: top; padding-left: 16px; }
        .mentor-name { font-size: 15px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; margin-bottom: 2px; }
        .mentor-sub { font-size: 11px; color: #64748b; font-weight: 500; margin-bottom: 8px; }
        .mentor-fact { font-size: 12px; color: #475569; line-height: 1.6; }
        .mentor-cred { display: inline-block; font-size: 10px; font-weight: 700; color: #2563eb; background: rgba(37,99,235,0.08); border: 1px solid rgba(37,99,235,0.15); border-radius: 99px; padding: 3px 10px; margin: 2px 3px 2px 0; }

        /* WHATSAPP */
        .whatsapp-box { background: #f0fdf4; border: 2px solid #86efac; border-radius: 14px; padding: 20px 22px; margin: 24px 0; text-align: center; }
        .whatsapp-box .wa-icon { font-size: 28px; margin-bottom: 8px; }
        .whatsapp-box p { font-size: 14px; color: #166534; font-weight: 500; margin: 0; line-height: 1.65; }

        /* CTA */
        .cta-wrap { text-align: center; padding: 8px 0 4px; }
        .button { display: inline-block; padding: 15px 36px; background: #2563eb; color: #fff !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; letter-spacing: -0.01em; box-shadow: 0 8px 24px rgba(37,99,235,0.28); }

        .divider { height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin: 28px 0; }
        .footer { background: #f8fafc; border-radius: 0 0 20px 20px; text-align: center; padding: 28px 32px; color: #94a3b8; font-size: 12px; line-height: 1.8; border: 1px solid rgba(37,99,235,0.08); border-top: none; }
        .footer strong { color: #64748b; }

        @media only screen and (max-width: 600px) {
          .hero-top h1 { font-size: 28px; }
          .content { padding: 24px 20px; }
          .stats .stat { display: block; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); padding: 12px; }
          .deliverables, .deliverables tr, .deliverables td { display: block; width: 100% !important; }
          .deliv { margin-bottom: 8px; text-align: left; display: flex; gap: 12px; align-items: center; }
          .booking-label, .booking-value { display: block; }
        }
      </style>
    </head>
    <body>
      <div class="wrap">
        <!-- HERO -->
        <div class="hero">
          <div class="hero-top">
            <div class="badge-pill">✦ Placement Accelerator Program</div>
            <h1>Your entire placement<br>journey.<span>In 5 hours.</span></h1>
            <p>Booking confirmed &amp; payment received — you're in.</p>
          </div>

          <!-- STATS STRIP -->
          <table class="stats" cellpadding="0" cellspacing="0" role="presentation" width="100%">
            <tr>
              <td class="stat"><div class="stat-val">4</div><div class="stat-label">Modules</div></td>
              <td class="stat"><div class="stat-val">5 hrs</div><div class="stat-label">Live Duration</div></td>
              <td class="stat"><div class="stat-val">1:1</div><div class="stat-label">Feedback</div></td>
              <td class="stat"><div class="stat-val">94%</div><div class="stat-label">Success Rate</div></td>
            </tr>
          </table>
        </div>

        <!-- CONTENT -->
        <div class="content">
          <p style="font-size:17px; font-weight:700; color:#0f172a; margin-bottom:6px;">Hi ${userName} 👋</p>
          <p>Great news — your <strong>Placement Accelerator</strong> seat is locked in. From a blank resume to a polished interview performance, you're about to go through 4 structured modules and personalised 1:1 feedback with Neel that gives you a clear edge over every other candidate in the room.</p>

          <!-- BOOKING DETAILS -->
          <div class="booking-box">
            <div class="booking-row">
              <span class="booking-label">📦 Programme</span>
              <span class="booking-value">Placement Accelerator</span>
            </div>
            <div class="booking-row">
              <span class="booking-label">📅 Your Week</span>
              <span class="booking-value">${weekLabel}</span>
            </div>
            <div class="booking-row">
              <span class="booking-label">⏱ Duration</span>
              <span class="booking-value">300 mins · 5 hours of live expert-led sessions</span>
            </div>
            <div class="booking-row">
              <span class="booking-label">🗓 Scheduling</span>
              <span class="booking-value">Confirmed via WhatsApp within 24 hrs</span>
            </div>
          </div>

          <!-- JOURNEY STRIP -->
          <div class="journey">
            <span class="journey-step"><div class="journey-num" style="color:#059669;">01</div><div class="journey-lbl">Resume</div></span>
            <span class="journey-arrow">→</span>
            <span class="journey-step"><div class="journey-num" style="color:#b45309;">02</div><div class="journey-lbl">GD</div></span>
            <span class="journey-arrow">→</span>
            <span class="journey-step"><div class="journey-num" style="color:#2563eb;">03</div><div class="journey-lbl">Interview</div></span>
            <span class="journey-arrow">→</span>
            <span class="journey-step"><div class="journey-num" style="color:#7c3aed;">04</div><div class="journey-lbl">Mock</div></span>
            <span class="journey-arrow">→</span>
            <span class="journey-step"><div class="journey-num" style="color:#f7c948; font-size:16px;">🏆</div><div class="journey-lbl">Offer</div></span>
          </div>

          <div style="height:24px;"></div>

          <!-- MODULES -->
          <p class="modules-title">The Curriculum — 4 modules · 1 complete transformation</p>

          <div class="module" style="background:rgba(5,150,105,0.04); border-color:rgba(5,150,105,0.2);">
            <div class="module-top">
              <div class="module-left">
                <div class="module-num" style="color:#059669;">Module 01 · Foundation</div>
                <div class="module-name">Resume Analysis &amp; Positioning</div>
              </div>
              <div class="module-right">
                <span class="module-dur" style="background:rgba(5,150,105,0.1); color:#059669;">60 mins</span>
              </div>
            </div>
            <p class="module-obj">Turn a basic resume into an interview-winning document.</p>
            <ul class="module-outcomes" style="--c:#059669">
              <li style="color:#047857;">Refined, recruiter-ready resume</li>
              <li style="color:#047857;">Clear positioning of your profile</li>
            </ul>
          </div>

          <div class="module" style="background:rgba(180,83,9,0.04); border-color:rgba(180,83,9,0.2);">
            <div class="module-top">
              <div class="module-left">
                <div class="module-num" style="color:#b45309;">Module 02 · Group Skill</div>
                <div class="module-name">Group Discussion Mastery</div>
              </div>
              <div class="module-right">
                <span class="module-dur" style="background:rgba(180,83,9,0.1); color:#b45309;">60 mins</span>
              </div>
            </div>
            <p class="module-obj">Stand out in GDs without over-speaking.</p>
            <ul class="module-outcomes">
              <li style="color:#92400e;">Structured thinking under pressure</li>
              <li style="color:#92400e;">Confident participation strategy + live GD simulation</li>
            </ul>
          </div>

          <div class="module" style="background:rgba(37,99,235,0.04); border-color:rgba(37,99,235,0.2);">
            <div class="module-top">
              <div class="module-left">
                <div class="module-num" style="color:#2563eb;">Module 03 · Core Module ★ Flagship</div>
                <div class="module-name">Interview Preparation – Core</div>
              </div>
              <div class="module-right">
                <span class="module-dur" style="background:rgba(37,99,235,0.1); color:#2563eb;">120 mins</span>
              </div>
            </div>
            <p class="module-obj">Build strong, structured, and confident responses.</p>
            <ul class="module-outcomes">
              <li style="color:#1d4ed8;">Finalized, polished interview introduction</li>
              <li style="color:#1d4ed8;">STAR-method answers to most-asked questions</li>
              <li style="color:#1d4ed8;">Improved articulation &amp; confidence</li>
            </ul>
          </div>

          <div class="module" style="background:rgba(124,58,237,0.04); border-color:rgba(124,58,237,0.2);">
            <div class="module-top">
              <div class="module-left">
                <div class="module-num" style="color:#7c3aed;">Module 04 · Capstone</div>
                <div class="module-name">Mock Interview + Feedback</div>
              </div>
              <div class="module-right">
                <span class="module-dur" style="background:rgba(124,58,237,0.1); color:#7c3aed;">60 mins</span>
              </div>
            </div>
            <p class="module-obj">Simulate real interview pressure and get actionable clarity.</p>
            <ul class="module-outcomes">
              <li style="color:#6d28d9;">Real interview experience under pressure</li>
              <li style="color:#6d28d9;">Clear action plan for improvement</li>
            </ul>
          </div>

          <div class="divider"></div>

          <!-- DELIVERABLES -->
          <p class="modules-title">You leave with everything</p>
          <table class="deliverables" cellpadding="0" cellspacing="8" role="presentation" width="100%">
            <tr>
              <td class="deliv"><div class="deliv-icon">📄</div><div class="deliv-label">Resume improvement suggestions</div><div class="deliv-sub">Documented &amp; actionable</div></td>
              <td class="deliv"><div class="deliv-icon">🎤</div><div class="deliv-label">Finalized interview introduction</div><div class="deliv-sub">Polished &amp; personalised</div></td>
              <td class="deliv"><div class="deliv-icon">💬</div><div class="deliv-label">GD performance feedback</div><div class="deliv-sub">Scored &amp; detailed</div></td>
              <td class="deliv"><div class="deliv-icon">🗺️</div><div class="deliv-label">30-day improvement roadmap</div><div class="deliv-sub">Your next steps planned</div></td>
            </tr>
          </table>

          <div class="divider"></div>

          <!-- MENTOR -->
          <div class="mentor-box">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:52px; vertical-align:top;">
                  <div style="width:48px; height:48px; border-radius:12px; background:linear-gradient(135deg,#dbeafe,#bfdbfe); text-align:center; line-height:48px; font-size:22px;">👨‍💼</div>
                </td>
                <td style="padding-left:16px; vertical-align:top;">
                  <div class="mentor-name">Neel Aashish Seru</div>
                  <div class="mentor-sub">12+ years · Both sides of the hiring table</div>
                  <div class="mentor-fact">He's sat on hiring panels at Tech Mahindra &amp; IndiaMART and coached 5,000+ candidates. He knows exactly what interviewers write down when they decide to pass — and he'll make sure they write something different about you.</div>
                  <div style="margin-top:10px;">
                    <span class="mentor-cred">12+ yrs experience</span>
                    <span class="mentor-cred">5,000+ candidates coached</span>
                    <span class="mentor-cred">94% placement success</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- WHATSAPP -->
          <div class="whatsapp-box">
            <div class="wa-icon">💬</div>
            <p><strong>What happens next?</strong><br>Our team will reach out to you on WhatsApp within 24 hours to confirm the exact session schedule for your preferred week — <strong>${weekLabel}</strong>.</p>
          </div>

          <div class="cta-wrap">
            <a href="${process.env.FRONTEND_URL || 'https://www.yourinterviewcoach.in'}/user-dashboard/bookings" class="button">View My Bookings →</a>
          </div>

          <div class="divider"></div>
          <p style="font-size:13px; color:#94a3b8;">Have questions? Just reply to this email — our team is happy to help.</p>
          <p style="margin-top:20px; font-weight:600; color:#0f172a; font-size:14px;">Best regards,<br>The YourInterviewCoach Team</p>
        </div>

        <!-- FOOTER -->
        <div class="footer">
          <p><strong>YourInterviewCoach</strong></p>
          <p>&copy; ${new Date().getFullYear()} YourInterviewCoach. All rights reserved.</p>
          <p style="margin-top:8px;">You're receiving this because you booked a session with us.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const verificationEmailTemplate = (userName, verificationToken) => {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #18181b;
          background: #fafafa;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
          background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%);
          color: white;
          padding: 48px 32px;
          text-align: center;
        }
        .header h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .header p {
          font-size: 16px;
          font-weight: 300;
          opacity: 0.9;
        }
        .content {
          background: white;
          padding: 40px 32px;
        }
        .content h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #18181b;
        }
        .content p {
          font-size: 16px;
          color: #52525b;
          margin-bottom: 16px;
          line-height: 1.7;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background: #1d4ed8;
          color: white !important;
          text-decoration: none;
          border-radius: 8px;
          margin: 24px 0;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(29, 78, 216, 0.3);
        }
        .button:hover {
          background: #1e3a8a;
          box-shadow: 0 10px 15px -3px rgba(29, 78, 216, 0.4);
        }
        .token-box {
          background: #f0f4ff;
          border: 2px dashed #1d4ed8;
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
          text-align: center;
          word-break: break-all;
        }
        .token-box a {
          color: #1d4ed8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }
        .warning-box {
          background: #fef2f2;
          border: 2px solid #fca5a5;
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
        }
        .warning-box .title {
          display: flex;
          align-items: center;
          font-weight: 600;
          color: #991b1b;
          margin-bottom: 12px;
          font-size: 16px;
        }
        .warning-box .icon {
          font-size: 24px;
          margin-right: 8px;
        }
        .warning-box ul {
          margin: 0;
          padding-left: 20px;
          color: #991b1b;
        }
        .warning-box li {
          margin: 8px 0;
          font-size: 14px;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e4e4e7, transparent);
          margin: 32px 0;
        }
        .footer {
          background: #fafafa;
          text-align: center;
          padding: 32px;
          color: #71717a;
          font-size: 13px;
          line-height: 1.8;
        }
        .footer strong {
          color: #52525b;
        }
        @media only screen and (max-width: 600px) {
          .container { border-radius: 0; }
          .header { padding: 32px 24px; }
          .content { padding: 32px 24px; }
          .header h1 { font-size: 28px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✉️ Verify Your Email</h1>
          <p>Please confirm your email address to activate your account</p>
        </div>
        <div class="content">
          <h2>Hi ${userName},</h2>
          <p>Thank you for signing up on YourInterviewCoach! To ensure your account is secure and that we can reach you with important updates, please verify your email address by clicking the button below:</p>

          <center>
            <a href="${verifyUrl}" class="button">Verify Email Address →</a>
          </center>

          <p style="font-size: 14px; color: #71717a; margin-top: 8px;">Button not working? Copy and paste this link into your browser:</p>

          <div class="token-box">
            <a href="${verifyUrl}">${verifyUrl}</a>
          </div>

          <div class="warning-box">
            <div class="title">
              <span class="icon">⚠️</span>
              <span>Important Information</span>
            </div>
            <ul>
              <li><strong>This link expires in 24 hours</strong> for security reasons</li>
              <li>If you did not sign up for an account, please disregard this email</li>
            </ul>
          </div>

          <div class="divider"></div>

          <p style="font-size: 14px; color: #71717a;">If you have any questions or did not receive this email intentionally, please contact our support team.</p>

          <p style="margin-top: 24px; font-weight: 500; color: #18181b;">Best regards,<br>The YourInterviewCoach Team</p>
        </div>
        <div class="footer">
          <p><strong>YourInterviewCoach</strong></p>
          <p>&copy; ${new Date().getFullYear()} YourInterviewCoach. All rights reserved.</p>
          <p style="margin-top: 12px;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const verificationEmailTemplate = (userName, verificationToken) => {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #18181b;
          background: #fafafa;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
          background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%);
          color: white;
          padding: 48px 32px;
          text-align: center;
        }
        .header h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .header p {
          font-size: 16px;
          font-weight: 300;
          opacity: 0.9;
        }
        .content {
          background: white;
          padding: 40px 32px;
        }
        .content h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #18181b;
        }
        .content p {
          font-size: 16px;
          color: #52525b;
          margin-bottom: 16px;
          line-height: 1.7;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background: #1d4ed8;
          color: white !important;
          text-decoration: none;
          border-radius: 8px;
          margin: 24px 0;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(29, 78, 216, 0.3);
        }
        .button:hover {
          background: #1e3a8a;
          box-shadow: 0 10px 15px -3px rgba(29, 78, 216, 0.4);
        }
        .token-box {
          background: #f0f4ff;
          border: 2px dashed #1d4ed8;
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
          text-align: center;
          word-break: break-all;
        }
        .token-box a {
          color: #1d4ed8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }
        .warning-box {
          background: #fef2f2;
          border: 2px solid #fca5a5;
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
        }
        .warning-box .title {
          display: flex;
          align-items: center;
          font-weight: 600;
          color: #991b1b;
          margin-bottom: 12px;
          font-size: 16px;
        }
        .warning-box .icon {
          font-size: 24px;
          margin-right: 8px;
        }
        .warning-box ul {
          margin: 0;
          padding-left: 20px;
          color: #991b1b;
        }
        .warning-box li {
          margin: 8px 0;
          font-size: 14px;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e4e4e7, transparent);
          margin: 32px 0;
        }
        .footer {
          background: #fafafa;
          text-align: center;
          padding: 32px;
          color: #71717a;
          font-size: 13px;
          line-height: 1.8;
        }
        .footer strong {
          color: #52525b;
        }
        @media only screen and (max-width: 600px) {
          .container { border-radius: 0; }
          .header { padding: 32px 24px; }
          .content { padding: 32px 24px; }
          .header h1 { font-size: 28px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✉️ Verify Your Email</h1>
          <p>Please confirm your email address to activate your account</p>
        </div>
        <div class="content">
          <h2>Hi ${userName},</h2>
          <p>Thank you for signing up on YourInterviewCoach! To ensure your account is secure and that we can reach you with important updates, please verify your email address by clicking the button below:</p>

          <center>
            <a href="${verifyUrl}" class="button">Verify Email Address →</a>
          </center>

          <p style="font-size: 14px; color: #71717a; margin-top: 8px;">Button not working? Copy and paste this link into your browser:</p>

          <div class="token-box">
            <a href="${verifyUrl}">${verifyUrl}</a>
          </div>

          <div class="warning-box">
            <div class="title">
              <span class="icon">⚠️</span>
              <span>Important Information</span>
            </div>
            <ul>
              <li><strong>This link expires in 24 hours</strong> for security reasons</li>
              <li>If you did not sign up for an account, please disregard this email</li>
            </ul>
          </div>

          <div class="divider"></div>

          <p style="font-size: 14px; color: #71717a;">If you have any questions or did not receive this email intentionally, please contact our support team.</p>

          <p style="margin-top: 24px; font-weight: 500; color: #18181b;">Best regards,<br>The YourInterviewCoach Team</p>
        </div>
        <div class="footer">
          <p><strong>YourInterviewCoach</strong></p>
          <p>&copy; ${new Date().getFullYear()} YourInterviewCoach. All rights reserved.</p>
          <p style="margin-top: 12px;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
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
