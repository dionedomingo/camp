import { CamperEmailData } from './types';
import { QRCodeResult } from './qr';

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

/**
 * Capitalizes a role string nicely (e.g. 'counselor' -> 'Camp Counselor')
 */
function formatRole(role?: string): string {
  switch ((role || '').toLowerCase()) {
    case 'counselor':
      return 'Counselor / Mentor';
    case 'staff':
      return 'Camp Logistics Staff';
    case 'pastor':
      return 'Pastor / Delegation Head';
    case 'worship':
      return 'Praise & Worship Team';
    case 'medical':
      return 'Camp Medical First Responder';
    case 'first_timer':
      return 'First-Timer Camper';
    case 'camper':
    default:
      return 'Delegate Camper';
  }
}

/**
 * Escapes HTML characters to prevent XSS in email bodies
 */
function escapeHtml(str?: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Renders the responsive HTML Camper Passport and plaintext version for VLC 2027
 */
export function renderCamperPassportEmail(
  camper: CamperEmailData,
  qr: QRCodeResult,
  options?: {
    campName?: string;
    campTheme?: string;
    campDates?: string;
    campLocation?: string;
  }
): EmailContent {
  const campName = options?.campName || 'VLC 2027';
  const campTheme = options?.campTheme || 'Arise & Shine (Isaiah 60:1)';
  const campDates = options?.campDates || 'July 2027';
  const campLocation = options?.campLocation || 'Bambang, Nueva Vizcaya, Philippines';

  const nickname = escapeHtml(camper.nickname || camper.full_name.split(' ')[0]);
  const fullName = escapeHtml(camper.full_name);
  const churchName = escapeHtml(camper.church_name || 'Christian Congregation Delegation');
  const province = escapeHtml(camper.province || 'Philippines');
  const roleTitle = formatRole(camper.role);
  const passCode = escapeHtml(camper.activation_code);
  const dietaryNeeds = camper.dietary_needs && camper.dietary_needs.toLowerCase() !== 'none'
    ? escapeHtml(camper.dietary_needs)
    : null;

  const emergencyName = escapeHtml(camper.emergency_name || 'Guardian on File');
  const emergencyPhone = escapeHtml(camper.emergency_phone || camper.phone);
  const emergencyRelation = escapeHtml(camper.emergency_relation || 'Emergency Contact');

  const subject = `🎫 Your VLC 2027 Camper Passport & Pass Code: ${passCode} (${nickname})`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(subject)}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
    img {
      border: 0;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f1f5f9;
      padding: 24px 0 32px 0;
    }
    .main {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    .badge-card {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%);
      color: #ffffff;
      border-radius: 12px;
      padding: 24px;
      margin: 20px;
      text-align: center;
    }
    .btn-primary {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 8px;
      letter-spacing: 0.3px;
    }
    @media only screen and (max-width: 600px) {
      .main {
        width: 100% !important;
        border-radius: 0 !important;
      }
      .badge-card {
        margin: 12px !important;
        padding: 16px !important;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <center>
      <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        
        <!-- Header Banner -->
        <tr>
          <td style="background-color: #0f172a; padding: 28px 24px; text-align: center; color: #ffffff;">
            <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #60a5fa; margin-bottom: 6px;">
              Pentecostal Churches of Christ, Inc.
            </div>
            <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
              ${escapeHtml(campName)}
            </h1>
            <div style="font-size: 14px; color: #94a3b8; margin-top: 4px; font-style: italic;">
              "${escapeHtml(campTheme)}"
            </div>
            <div style="font-size: 12px; color: #cbd5e1; margin-top: 8px; font-weight: 500;">
              📍 ${escapeHtml(campLocation)} &nbsp;|&nbsp; 🗓️ ${escapeHtml(campDates)}
            </div>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding: 24px 24px 12px 24px;">
            <h2 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 700; color: #0f172a;">
              Praise God, ${nickname}! 🙌
            </h2>
            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #475569;">
              Your delegate registration for <strong>${escapeHtml(campName)}</strong> has been successfully received. Below is your official <strong>Digital Camper Passport</strong>. Please save this email or take a screenshot of your pass code for on-site arrival check-in.
            </p>
          </td>
        </tr>

        <!-- Camper Passport Card (Boarding Pass) -->
        <tr>
          <td>
            <div class="badge-card">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="text-align: left; vertical-align: top;">
                    <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #ffffff;">
                      ${escapeHtml(roleTitle)}
                    </span>
                    <h3 style="margin: 10px 0 2px 0; font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                      ${nickname}
                    </h3>
                    <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 6px;">
                      ${fullName}
                    </div>
                    <div style="font-size: 12px; color: #93c5fd; font-weight: 600;">
                      ⛪ ${churchName}
                    </div>
                    <div style="font-size: 11px; color: #cbd5e1; margin-top: 2px;">
                      📍 ${province}
                    </div>
                  </td>
                </tr>

                <!-- QR Code & Activation Code Box -->
                <tr>
                  <td style="text-align: center; padding-top: 20px;">
                    <div style="background-color: #ffffff; padding: 16px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                      ${qr.dataUrl ? `<img src="${qr.dataUrl}" alt="Camper Pass QR Code" width="180" height="180" style="display: block; margin: 0 auto; border-radius: 6px;" />` : ''}
                      <div style="margin-top: 10px; padding: 6px 12px; background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px;">
                        <span style="font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 1px; display: block;">
                          Official Pass Code
                        </span>
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 20px; font-weight: 900; color: #1e3a8a; letter-spacing: 2px;">
                          ${passCode}
                        </span>
                      </div>
                    </div>
                    <div style="font-size: 11px; color: #cbd5e1; margin-top: 12px;">
                      Scan at the Bambang Camp Arrival Desk for instant check-in
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>

        <!-- Direct Portal CTA -->
        <tr>
          <td style="text-align: center; padding: 0 24px 20px 24px;">
            <a href="${qr.activationUrl}" class="btn-primary" target="_blank" rel="noopener noreferrer">
              👉 Open Digital Pass in Camper Portal
            </a>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">
              Can't click the button? Copy & paste this link in your browser:<br>
              <a href="${qr.activationUrl}" style="color: #2563eb; word-break: break-all; font-size: 11px;">
                ${qr.activationUrl}
              </a>
            </div>
          </td>
        </tr>

        ${dietaryNeeds ? `
        <!-- Medical / Dietary Alert -->
        <tr>
          <td style="padding: 0 24px 16px 24px;">
            <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 6px;">
              <strong style="color: #b45309; font-size: 13px; display: block; margin-bottom: 2px;">
                ⚠️ Dietary & Health Alert Recorded:
              </strong>
              <span style="color: #92400e; font-size: 13px; line-height: 1.4;">
                ${dietaryNeeds} (Noted for the Camp Food &amp; Medical Committees)
              </span>
            </div>
          </td>
        </tr>
        ` : ''}

        <!-- Arrival Day Procedures -->
        <tr>
          <td style="padding: 10px 24px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
              📋 On-Site Arrival Instructions
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size: 14px; color: #334155; line-height: 1.5;">
              <tr>
                <td style="padding-bottom: 10px; vertical-align: top; width: 28px;">
                  <span style="background-color: #dbeafe; color: #1d4ed8; font-weight: 800; border-radius: 50%; width: 22px; height: 22px; display: inline-block; text-align: center; line-height: 22px; font-size: 12px;">1</span>
                </td>
                <td style="padding-bottom: 10px; vertical-align: top;">
                  <strong>Arrive at Camp Headquarters:</strong> Report to the Nueva Vizcaya Camp Gates. Opening rallies begin in the afternoon.
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 10px; vertical-align: top; width: 28px;">
                  <span style="background-color: #dbeafe; color: #1d4ed8; font-weight: 800; border-radius: 50%; width: 22px; height: 22px; display: inline-block; text-align: center; line-height: 22px; font-size: 12px;">2</span>
                </td>
                <td style="padding-bottom: 10px; vertical-align: top;">
                  <strong>Arrival Desk Check-In:</strong> Present your QR code or Pass Code <strong>${passCode}</strong> at the Arrival Desk to verify your delegation badge.
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 10px; vertical-align: top; width: 28px;">
                  <span style="background-color: #dbeafe; color: #1d4ed8; font-weight: 800; border-radius: 50%; width: 22px; height: 22px; display: inline-block; text-align: center; line-height: 22px; font-size: 12px;">3</span>
                </td>
                <td style="padding-bottom: 10px; vertical-align: top;">
                  <strong>Claim Official Kit:</strong> Collect your VLC 2027 official delegate kit, lanyard, and camp syllabus.
                </td>
              </tr>
              <tr>
                <td style="vertical-align: top; width: 28px;">
                  <span style="background-color: #dbeafe; color: #1d4ed8; font-weight: 800; border-radius: 50%; width: 22px; height: 22px; display: inline-block; text-align: center; line-height: 22px; font-size: 12px;">4</span>
                </td>
                <td style="vertical-align: top;">
                  <strong>Dormitory & Small Group:</strong> Receive your cabin keys and join your delegation leader for opening orientation.
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Packing Checklist & Emergency Contact -->
        <tr>
          <td style="padding: 16px 24px 24px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px;">
              <tr>
                <td style="vertical-align: top; width: 50%; padding-right: 12px;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e293b; text-transform: uppercase; margin-bottom: 8px;">
                    🎒 Packing Essentials
                  </div>
                  <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #475569; line-height: 1.6;">
                    <li>Bible, journal & pens</li>
                    <li>Modest activewear & sleepwear</li>
                    <li>Toiletries & bath towel</li>
                    <li>Personal prescribed medication</li>
                    <li>Reusable water tumbler</li>
                  </ul>
                </td>
                <td style="vertical-align: top; width: 50%; padding-left: 12px; border-left: 1px solid #e2e8f0;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e293b; text-transform: uppercase; margin-bottom: 8px;">
                    🚨 Emergency Record
                  </div>
                  <div style="font-size: 12px; color: #475569; line-height: 1.6;">
                    <strong>${emergencyName}</strong><br>
                    Relation: ${emergencyRelation}<br>
                    Phone: <a href="tel:${emergencyPhone}" style="color: #2563eb; text-decoration: none;">${emergencyPhone}</a>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #0f172a; padding: 24px; text-align: center; color: #64748b; font-size: 11px; line-height: 1.6;">
            <p style="margin: 0 0 6px 0; color: #94a3b8; font-weight: 600;">
              Vision &amp; Leadership Camp (VLC 2027) • PCCI Youth &amp; Delegates Committee
            </p>
            <p style="margin: 0 0 6px 0;">
              <a href="https://camp.pcciministries.com" style="color: #60a5fa; text-decoration: underline; font-weight: 600;">camp.pcciministries.com</a>
            </p>
            <p style="margin: 0;">
              This is an automated confirmation sent to ${escapeHtml(camper.email)}. If you have questions or delegation adjustments, please contact your local pastor or the Camp Secretariat.
            </p>
          </td>
        </tr>

      </table>
    </center>
  </div>
</body>
</html>`;

  const text = `
======================================================
  VLC 2027 - VISION & LEADERSHIP CAMP
  Theme: ${campTheme}
  Dates: ${campDates} | Location: ${campLocation}
======================================================

Praise God, ${camper.nickname || camper.full_name}!

Your registration has been confirmed! Here is your digital pass:

------------------------------------------------------
CAMPER PASSPORT
------------------------------------------------------
Name: ${camper.full_name} (${camper.nickname})
Role: ${roleTitle}
Delegation: ${camper.church_name || 'PCCI Church Delegation'}
Province: ${camper.province || 'Philippines'}

OFFICIAL PASS CODE: ${passCode}
Direct Digital Pass Link:
${qr.activationUrl}

${dietaryNeeds ? `*** MEDICAL / DIETARY NOTE: ${dietaryNeeds} ***\n` : ''}
------------------------------------------------------
ON-SITE ARRIVAL INSTRUCTIONS
------------------------------------------------------
1. Report to Bambang, Nueva Vizcaya Camp Headquarters.
2. Present your Pass Code (${passCode}) or QR code at the Arrival Desk.
3. Claim your official camp kit and lanyard.
4. Receive your dormitory assignment and meet your small group.

Emergency Contact on Record:
${emergencyName} (${emergencyRelation}) - ${emergencyPhone}

We look forward to an anointed time of worship and leadership fellowship!

--
VLC 2027 Camp Secretariat
Pentecostal Churches of Christ, Inc.
https://camp.pcciministries.com
`.trim();

  return { subject, html, text };
}

/**
 * Render Password Reset Email template
 */
export function renderPasswordResetEmail(data: {
  full_name: string;
  reset_url: string;
  expires_in_minutes?: number;
}): { subject: string; html: string; text: string } {
  const name = escapeHtml(data.full_name || 'Delegate');
  const resetUrl = data.reset_url;
  const minutes = data.expires_in_minutes || 60;
  const subject = `🔐 Reset Your VLC 2027 Password`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Your VLC 2027 Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Vision & Leadership Camp 2027</h1>
      <p style="margin: 8px 0 0; font-size: 13px; color: #93c5fd; text-transform: uppercase; letter-spacing: 1px;">Security & Password Assistance</p>
    </div>

    <div style="padding: 32px 24px;">
      <p style="margin: 0 0 16px; font-size: 15px; color: #1e293b; line-height: 1.6;">
        Hello <strong>${name}</strong>,
      </p>
      <p style="margin: 0 0 20px; font-size: 14px; color: #475569; line-height: 1.6;">
        We received a request to reset the password for your VLC 2027 delegate account. Click the button below to choose a new password:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);">
          Reset My Password
        </a>
      </div>

      <p style="margin: 0 0 12px; font-size: 13px; color: #64748b; line-height: 1.5;">
        This password reset link will expire in <strong>${minutes} minutes</strong>. If you did not make this request, you can safely ignore this email—your account remains secure.
      </p>

      <div style="margin-top: 24px; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 12px; color: #64748b; word-break: break-all;">
        If button above doesn't work, copy and paste this link into your browser:<br />
        <a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a>
      </div>
    </div>

    <div style="padding: 20px 24px; background-color: #0f172a; text-align: center; color: #94a3b8; font-size: 11px;">
      <p style="margin: 0 0 4px 0;">Pentecostal Churches of Christ, Inc. &bull; VLC 2027 Secretariat</p>
      <p style="margin: 0;"><a href="https://camp.pcciministries.com" style="color: #60a5fa; text-decoration: underline;">camp.pcciministries.com</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
VISION & LEADERSHIP CAMP 2027 (VLC 2027)
Security & Password Reset
======================================================

Hello ${data.full_name || 'Delegate'},

We received a request to reset the password for your VLC 2027 delegate account.

To reset your password, visit this link:
${resetUrl}

This link is valid for ${minutes} minutes. If you did not request this reset, you can safely ignore this email.

--
VLC 2027 Secretariat
Pentecostal Churches of Christ, Inc.
https://camp.pcciministries.com
`.trim();

  return { subject, html, text };
}
