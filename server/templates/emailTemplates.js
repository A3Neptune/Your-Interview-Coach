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
            <a href="${process.env.CLIENT_URL}/dashboard" class="button">Get Started →</a>
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

export {
  welcomeEmailTemplate,
  loginNotificationTemplate,
  forgotPasswordTemplate,
};
export default {
  welcomeEmailTemplate,
  loginNotificationTemplate,
  forgotPasswordTemplate,
};
