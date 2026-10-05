const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Simple zero-dependency .env loader
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.substring(0, idx).trim();
          const val = trimmed.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
      console.log('[Env] Loaded local configuration from .env');
    } catch (e) {
      console.warn('[Env] Error loading .env:', e.message);
    }
  }
}
loadEnv();

let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  // Nodemailer will be loaded if available
}

const PORT = parseInt(process.env.PORT || '8085', 10);
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'createandarise05@gmail.com';
const STUDIO_NAME = 'Create and Arise';
const STUDIO_PHONE = '+63 927 468 2635';
const STUDIO_BASE = 'La Trinidad, Benguet, Philippines (GMT+8)';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

/**
 * Creates a Nodemailer transport if SMTP credentials are configured.
 */
function getMailTransporter() {
  if (!nodemailer) return null;

  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;

  return nodemailer.createTransport({
    host: host,
    port: port,
    secure: secure,
    auth: { user, pass }
  });
}

/**
 * Generate rich, branded HTML for the client's confirmation email.
 */
function buildClientInquiryEmailHtml({ name, email, ref, services, budget, phone, message, dateStr }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Confirmation - Create and Arise</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0b10; color: #f8fafc; margin: 0; padding: 24px 12px; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 600px; margin: 0 auto; background: #12141e; border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.6);">
    
    <!-- Studio Header Banner -->
    <div style="background: linear-gradient(135deg, #1a1e2e 0%, #0d0f17 100%); border-bottom: 2px solid #f59e0b; padding: 32px 24px; text-align: center;">
      <div style="color: #f59e0b; font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin: 0;">
        CREATE AND ARISE
      </div>
      <div style="color: #94a3b8; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-top: 6px;">
        Purpose-Driven Creative Design &amp; Digital Marketing &bull; Philippines
      </div>
    </div>

    <!-- Main Message Body -->
    <div style="padding: 32px 26px;">
      <div style="display: inline-block; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #10b981; font-weight: 700; font-size: 12px; padding: 6px 14px; border-radius: 20px; margin-bottom: 18px;">
        ✓ INQUIRY RECEIVED &amp; CONFIRMED
      </div>

      <h1 style="font-size: 22px; font-weight: 700; color: #f8fafc; margin: 0 0 12px 0;">
        Thank You for Inquiring, ${name}!
      </h1>

      <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 24px 0;">
        We have safely received your project specifications. <strong>Jerome Cabinta</strong> and our creative team are reviewing your project requirements and will respond within <strong>24 weekday business hours</strong> (Mon&ndash;Fri 8:00 AM &ndash; 6:00 PM PHT).
      </p>

      <!-- Inquiry Summary Card -->
      <div style="background: #1a1e2e; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <div style="font-size: 12px; color: #f59e0b; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.06);">
          Project Inquiry Record
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 7px 0; color: #94a3b8; width: 40%;">Reference ID:</td>
            <td style="padding: 7px 0; color: #fde68a; font-weight: 700; text-align: right; font-family: monospace;">${ref}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #94a3b8;">Selected Services:</td>
            <td style="padding: 7px 0; color: #f8fafc; font-weight: 600; text-align: right;">${services}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #94a3b8;">Estimated Budget:</td>
            <td style="padding: 7px 0; color: #10b981; font-weight: 600; text-align: right;">${budget}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #94a3b8;">Phone / WhatsApp:</td>
            <td style="padding: 7px 0; color: #f8fafc; text-align: right;">${phone || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 7px 0; color: #94a3b8;">Submitted At:</td>
            <td style="padding: 7px 0; color: #cbd5e1; text-align: right;">${dateStr} (PHT)</td>
          </tr>
        </table>

        ${message ? `
        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed rgba(255,255,255,0.08); font-size: 13px; color: #94a3b8;">
          <strong style="color: #cbd5e1;">Project Scope Details:</strong>
          <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 10px 12px; margin-top: 6px; font-style: italic; color: #e2e8f0; line-height: 1.5;">
            &ldquo;${message}&rdquo;
          </div>
        </div>` : ''}
      </div>

      <!-- Turnaround Guarantee Box -->
      <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
        <div style="color: #f59e0b; font-weight: 700; font-size: 14px; margin-bottom: 6px;">
          ⏱️ Our 24-Hour Weekday Turnaround Guarantee
        </div>
        <p style="margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.5;">
          We personally review every single inquiry. You will receive a direct email reply and initial proposal from Jerome Cabinta within 24 weekday business hours. Inquiries sent during weekends are prioritized first thing Monday morning!
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div style="text-align: center; margin-bottom: 12px;">
        <a href="https://wa.me/639274682635?text=${encodeURIComponent(`Hi Jerome! I received my inquiry confirmation (Ref: ${ref}). Looking forward to connecting!`)}" style="display: inline-block; background: #10b981; color: #0a0b10; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 4px;">
          💬 Chat on WhatsApp (+63 927 468 2635)
        </a>
        <a href="mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(`Inquiry Follow-up (${ref})`)}" style="display: inline-block; background: rgba(255,255,255,0.08); color: #f8fafc; font-weight: 600; font-size: 14px; padding: 12px 20px; border-radius: 8px; text-decoration: none; margin: 4px; border: 1px solid rgba(255,255,255,0.15);">
          ✉️ Direct Studio Email
        </a>
      </div>
    </div>

    <!-- Email Footer -->
    <div style="background: #0d0f17; border-top: 1px solid rgba(255, 255, 255, 0.06); padding: 24px; text-align: center; font-size: 12px; color: #64748b; line-height: 1.6;">
      <p style="font-style: italic; color: #fde68a; margin: 0 0 8px 0;">
        &ldquo;May the favor of the Lord our God rest on us; establish the work of our hands.&rdquo; &bull; Psalm 90:17
      </p>
      <div><strong>Create and Arise Studio</strong> &bull; ${STUDIO_BASE}</div>
      <div>WhatsApp: ${STUDIO_PHONE} &bull; Email: ${OWNER_EMAIL}</div>
      <div style="margin-top: 8px; color: #475569; font-size: 11px;">
        This automated confirmation was sent because you submitted a project inquiry on createandarise.com.
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Dispatch confirmation email directly to the inquirer AND notify the studio owner.
 * If SMTP is configured via environment variables, sends directly via Nodemailer.
 * Otherwise, falls back to FormSubmit relay with proper domain headers.
 */
async function sendInquiryEmails(payload) {
  const name = payload.name || 'Valued Client';
  const email = payload.email;
  const ref = payload.inquiryReference || ('INQ-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000));
  const services = payload.services || 'General Creative Consultation';
  const budget = payload.budget || 'Not specified';
  const phone = payload.phone || 'N/A';
  const message = payload.message || payload.notes || '';
  const dateStr = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Manila',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const transporter = getMailTransporter();

  if (transporter && email) {
    try {
      console.log(`[SMTP] Sending direct email confirmation to client: ${email}...`);
      
      // 1. Send confirmation email to client
      const clientMailOptions = {
        from: `"${STUDIO_NAME}" <${process.env.EMAIL_USER || process.env.SMTP_USER}>`,
        to: email,
        replyTo: OWNER_EMAIL,
        subject: `✨ [Create and Arise] Inquiry Received & Confirmed (Ref: ${ref})`,
        html: buildClientInquiryEmailHtml({ name, email, ref, services, budget, phone, message, dateStr })
      };

      const clientInfo = await transporter.sendMail(clientMailOptions);
      console.log(`[SMTP] ✓ Client confirmation email delivered (${clientInfo.messageId})`);

      // 2. Send lead notification to Studio Owner
      const studioMailOptions = {
        from: `"${STUDIO_NAME} Web Lead" <${process.env.EMAIL_USER || process.env.SMTP_USER}>`,
        to: OWNER_EMAIL,
        replyTo: email,
        subject: `🚀 [NEW INQUIRY] ${name} - ${services} (Ref: ${ref})`,
        html: `
          <h2>New Project Inquiry Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Services:</strong> ${services}</p>
          <p><strong>Budget:</strong> ${budget}</p>
          <p><strong>Reference:</strong> ${ref}</p>
          <p><strong>Submitted:</strong> ${dateStr} (PHT)</p>
          <h3>Project Details:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      };

      await transporter.sendMail(studioMailOptions);
      console.log(`[SMTP] ✓ Studio notification email delivered to ${OWNER_EMAIL}`);

      return { ok: true, method: 'smtp', ref: ref };
    } catch (smtpErr) {
      console.warn('[SMTP Error] Failed to send via Nodemailer:', smtpErr.message);
      console.log('[Fallback] Relaying to FormSubmit...');
    }
  }

  // Fallback: Relay to FormSubmit with proper domain headers so FormSubmit accepts and sends autoresponse
  return relayToFormSubmit({
    ...payload,
    inquiryReference: ref,
    _autoresponse: payload._autoresponse || `Thank you for reaching out to Create and Arise! ✨ We have safely received your project inquiry (Ref: ${ref}). Jerome Cabinta and our creative team will review your specifications and reply within 24 weekday business hours (Mon–Fri 8AM–6PM PHT). WhatsApp: ${STUDIO_PHONE} | ${OWNER_EMAIL}`
  });
}

/**
 * Server-side relay directly to FormSubmit endpoint for createandarise05@gmail.com.
 * Sends with valid production origin & referer headers to guarantee acceptance.
 */
function relayToFormSubmit(payload) {
  return new Promise((resolve) => {
    try {
      const defaultAutoresponse = `Thank you for reaching out to Create and Arise! ✨ We have safely received your inquiry. Jerome Cabinta and our creative team will review your project details and respond within 24 weekday business hours (Mon–Fri 8AM–6PM PHT). WhatsApp: ${STUDIO_PHONE} | ${OWNER_EMAIL}`;

      const data = JSON.stringify({
        ...payload,
        _replyto: payload.email || OWNER_EMAIL,
        _autoresponse: payload._autoresponse || defaultAutoresponse,
        _template: 'table',
        _captcha: 'false'
      });

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Referer': 'https://createandarise.com/',
          'Origin': 'https://createandarise.com'
        }
      };

      const req = https.request(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, options, (res) => {
        let respData = '';
        res.on('data', chunk => { respData += chunk; });
        res.on('end', () => {
          console.log(`[FormSubmit Relay] Status ${res.statusCode}: ${respData.substring(0, 120)}`);
          resolve({ ok: res.statusCode === 200, status: res.statusCode, body: respData });
        });
      });

      req.on('error', (err) => {
        console.warn('[FormSubmit Relay Error]:', err.message);
        resolve({ ok: false, error: err.message });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        console.warn('[FormSubmit Relay]: Request timed out');
        resolve({ ok: false, error: 'Timeout' });
      });

      req.write(data);
      req.end();
    } catch (e) {
      console.warn('[FormSubmit Relay Exception]:', e.message);
      resolve({ ok: false, error: e.message });
    }
  });
}

const server = http.createServer((req, res) => {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = req.url.split('?')[0];

  // API Route: GET /api/bookings
  if (reqPath === '/api/bookings' && req.method === 'GET') {
    const dataDir = path.join(__dirname, 'data');
    const bookingsFile = path.join(dataDir, 'bookings.json');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(bookingsFile)) {
      fs.writeFileSync(bookingsFile, '[]', 'utf8');
    }

    fs.readFile(bookingsFile, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read bookings' }));
        return;
      }
      res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(data || '[]');
    });
    return;
  }

  // API Route: POST /api/book-call
  if (reqPath === '/api/book-call' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const { name, email, date, timeSlot, service, platform, notes, timezone, timeSlotLocal } = payload;

        if (!name || !email || !date || !timeSlot) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Name, email, date, and time slot are required.' }));
          return;
        }

        const dataDir = path.join(__dirname, 'data');
        const bookingsFile = path.join(dataDir, 'bookings.json');

        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }

        let bookings = [];
        if (fs.existsSync(bookingsFile)) {
          try {
            const raw = fs.readFileSync(bookingsFile, 'utf8');
            bookings = JSON.parse(raw);
          } catch (e) {
            bookings = [];
          }
        }

        // Check for double booking at the same date and slot
        const isConflict = bookings.some(b => b.date === date && b.timeSlot === timeSlot);
        if (isConflict) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'This time slot is already reserved. Please select another slot.' }));
          return;
        }

        const newBooking = {
          id: 'CAA-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000),
          name: name.trim(),
          email: email.trim(),
          service: service || 'Full Creative & Growth Suite',
          date: date,
          timeSlot: timeSlot,
          timeSlotLocal: timeSlotLocal || timeSlot,
          timezone: timezone || 'Asia/Manila (PHT)',
          platform: platform || 'Google Meet',
          notes: (notes || '').trim(),
          createdAt: new Date().toISOString()
        };

        bookings.push(newBooking);
        fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2), 'utf8');

        // Dispatch email confirmation to client and alert to studio
        const emailRes = await sendInquiryEmails({
          name: newBooking.name,
          email: newBooking.email,
          _replyto: newBooking.email,
          service: `Discovery Call: ${newBooking.service}`,
          budget: 'Complimentary Discovery Session (Free)',
          phone: `Platform: ${newBooking.platform}`,
          date: newBooking.date,
          time_slot_pht: newBooking.timeSlot,
          time_slot_local: newBooking.timeSlotLocal,
          client_timezone: newBooking.timezone,
          meeting_platform: newBooking.platform,
          inquiryReference: newBooking.id,
          message: `Meeting Date: ${newBooking.date} at ${newBooking.timeSlot} (${newBooking.platform}). Notes: ${newBooking.notes || 'None'}`,
          _subject: `📅 [NEW DISCOVERY CALL] ${newBooking.name} - ${newBooking.date} (${newBooking.timeSlot})`,
          _autoresponse: `Thank you for booking a Discovery Call with Create and Arise! ✨ (Ref: ${newBooking.id}). Your appointment is confirmed for ${newBooking.date} at ${newBooking.timeSlot}. Jerome Cabinta will send your calendar invite and ${newBooking.platform} link. Studio: ${OWNER_EMAIL} | WhatsApp: ${STUDIO_PHONE}`
        });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, booking: newBooking, email: emailRes }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // API Route: POST /api/contact (General inquiries, consultation requests, audits)
  if (reqPath === '/api/contact' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const dataDir = path.join(__dirname, 'data');
        const messagesFile = path.join(dataDir, 'messages.json');

        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }

        let messages = [];
        if (fs.existsSync(messagesFile)) {
          try {
            messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
          } catch (e) {
            messages = [];
          }
        }

        const inquiryRef = payload.inquiryReference || ('INQ-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000));

        const msgRecord = {
          id: inquiryRef,
          ...payload,
          inquiryReference: inquiryRef,
          receivedAt: new Date().toISOString()
        };

        messages.push(msgRecord);
        fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');

        // Dispatch confirmation email to inquirer + notification to studio owner
        const emailRes = await sendInquiryEmails(msgRecord);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          inquiryReference: inquiryRef,
          message: 'Inquiry received. Email confirmation dispatched to inquirer.',
          email: emailRes
        }));
      } catch (err) {
        console.error('Contact endpoint error:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  if (reqPath === '/') reqPath = '/index.html';
  
  const filePath = path.join(__dirname, decodeURIComponent(reqPath));
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
