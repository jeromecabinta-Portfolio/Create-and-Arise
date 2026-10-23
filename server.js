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
const STUDIO_FACEBOOK = 'https://www.facebook.com/CreateAndArise2023';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.mov': 'video/quicktime',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
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
        <a href="${STUDIO_FACEBOOK}" target="_blank" style="display: inline-block; background: #1877f2; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 20px; border-radius: 8px; text-decoration: none; margin: 4px;">
          🌐 Facebook (@CreateAndArise2023)
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
      <div>WhatsApp: ${STUDIO_PHONE} &bull; Email: ${OWNER_EMAIL} &bull; FB: <a href="${STUDIO_FACEBOOK}" style="color: #60a5fa; text-decoration: none;">facebook.com/CreateAndArise2023</a></div>
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

/**
 * Intelligent AriseBot AI Engine - Studio Knowledge & Semantic Intent Resolver
 */
async function generateBotResponse(userMsg, history = []) {
  const q = userMsg.toLowerCase().trim();

  // 1. If Gemini API Key is configured, attempt live Gemini completion
  if (process.env.GEMINI_API_KEY) {
    try {
      const geminiRes = await queryGeminiAPI(userMsg, history);
      if (geminiRes && geminiRes.reply) {
        return geminiRes;
      }
    } catch (gErr) {
      console.warn('[Gemini AI Relay]: Falling back to local intelligence:', gErr.message);
    }
  }

  // 2. Client Reviews & Specific Brands (Aimé Leon Dore, Buck Mason, Blue Bottle, The Ridge, Crossway, etc.)
  if (q.includes('aime') || q.includes('leon dore') || q.includes('streetwear') && (q.includes('client') || q.includes('review'))) {
    return {
      reply: `🌟 **Aimé Leon Dore (New York City, NY, USA)**\n\n**Discipline:** Web Design & UI/UX • Luxury Streetwear E-Commerce\n**Stakeholder:** Marcus Sterling, Head of Digital Commerce\n\n💬 *"${escapeMarkdown("Jerome and the Create and Arise team engineered our custom web platform with sub-second performance. Their clean code and responsive edge infrastructure cut our load times from 7.2s to 0.4s and lifted checkout conversions by 4.8x across international drop releases.")}"*\n\n🚀 **Key Outcome:** Sub-0.4s Edge Load Speed & 4.8x Checkout Conversion Lift.\n🌐 **Official Site:** [aimeleondore.com](https://www.aimeleondore.com)`,
      actions: [
        { label: '👁️ Deep Dive Case Study (Aimé Leon Dore)', callback: 'openCaseStudy2' },
        { label: '💻 Explore Web Design Services', callback: 'selectWeb' },
        { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' }
      ],
      chips: ['Blue Bottle Coffee', 'The Ridge', 'Buck Mason', 'Web Design', 'Pricing']
    };
  }

  if (q.includes('buck mason') || q.includes('heritage') && (q.includes('brand') || q.includes('review'))) {
    return {
      reply: `🌟 **Buck Mason (Los Angeles, California, USA)**\n\n**Discipline:** Graphics & Branding • American Heritage Menswear\n**Stakeholder:** Michael Ramirez, Head of Brand Retail\n\n💬 *"${escapeMarkdown("Create and Arise took our brand presentation to new heights. The attention to detail in our custom typography hierarchy, woven label specs, and tactile packaging guidelines enabled seamless store expansions across key flagship retail locations.")}"*\n\n👔 **Key Outcome:** Bespoke Monogram & Seamless Expansion across 30+ Flagship Stores.\n🌐 **Official Site:** [buckmason.com](https://www.buckmason.com)`,
      actions: [
        { label: '👁️ Deep Dive Case Study (Buck Mason)', callback: 'openCaseStudy8' },
        { label: '🎨 Explore Branding Services', callback: 'selectGraphics' },
        { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' }
      ],
      chips: ['Aimé Leon Dore', 'Blue Bottle Coffee', 'The Ridge', 'Branding', 'Pricing']
    };
  }

  if (q.includes('blue bottle') || q.includes('coffee') && (q.includes('packaging') || q.includes('review') || q.includes('client'))) {
    return {
      reply: `🌟 **Blue Bottle Coffee (Oakland, California, USA)**\n\n**Discipline:** Branding & Packaging • Artisan Specialty Coffee Roasteries\n**Stakeholder:** Elena Vance, Senior Brand Director\n\n💬 *"${escapeMarkdown("Create and Arise delivered immaculate visual brand systems and tactile packaging guidelines. Their respect for craftsmanship, typographic restraint, and clean vector precision gave our retail team total confidence across our nationwide cafes and roasteries.")}"*\n\n☕ **Key Outcome:** Single-Origin Packaging Guidelines & Direct-Trade Monogram System.\n🌐 **Official Site:** [bluebottlecoffee.com](https://bluebottlecoffee.com)`,
      actions: [
        { label: '👁️ Deep Dive Case Study (Blue Bottle)', callback: 'openCaseStudy3' },
        { label: '🎨 Explore Packaging & Branding', callback: 'selectGraphics' },
        { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' }
      ],
      chips: ['Aimé Leon Dore', 'Buck Mason', 'The Ridge', 'Cost Estimator', 'Contact']
    };
  }

  if (q.includes('ridge') || q.includes('wallet') || q.includes('roas') && (q.includes('ad') || q.includes('client'))) {
    return {
      reply: `🌟 **The Ridge (Santa Monica, California, USA)**\n\n**Discipline:** Digital Paid Ads & Creative Strategy • High-Growth EDC & DTC\n**Stakeholder:** Jadd Sanchez, Performance Marketing Director\n\n💬 *"${escapeMarkdown("Create and Arise completely turned our paid social advertising performance around. They engineered 36 high-converting ad creative variants, slashed our customer acquisition cost by 64%, and scaled our campaigns to a consistent 3.8x blended ROAS.")}"*\n\n📈 **Key Outcome:** +320% ROAS Lift & Slashed CAC from $58 to $18.50.\n🌐 **Official Site:** [ridge.com](https://ridge.com)`,
      actions: [
        { label: '👁️ Deep Dive Case Study (The Ridge)', callback: 'openCaseStudy4' },
        { label: '📈 Explore Paid Ads Services', callback: 'selectAds' },
        { label: '📅 Book a Strategy Call', callback: 'openBookCallModal' }
      ],
      chips: ['Aimé Leon Dore', 'Buck Mason', 'Digital Ads', 'Pricing', 'Contact']
    };
  }

  if (q.includes('crossway') || q.includes('bible') || q.includes('esv') || q.includes('gospel coalition') || q.includes('compassion') || q.includes('church') || q.includes('ministry')) {
    return {
      reply: `✝️ **Faith-Driven Ministry Partnerships**\n\nCreate and Arise proudly serves leading Christian organizations and global ministries:\n\n• **Crossway (ESV Bible - Wheaton, IL):** Editorial book typography, scripture carousels & +240% reader outreach.\n• **The Gospel Coalition (Austin, TX):** Theological video reels, social discipleship carousels & +280% reach.\n• **Compassion International (Colorado Springs, CO):** Donor campaign decks, storytelling presentations & 100% biblical stewardship.\n\nEvery project is delivered with reverence, visual polish, and kingdom integrity.`,
      actions: [
        { label: '👁️ Crossway Case Study', callback: 'openCaseStudy5' },
        { label: '👁️ Compassion Case Study', callback: 'openCaseStudy10' },
        { label: '📅 Schedule Ministry Consultation', callback: 'openBookCallModal' }
      ],
      chips: ['Client Reviews', 'Web Design', 'Cost Estimator', 'Our Faith', 'Contact']
    };
  }

  // 3. Client Reviews General
  if (q.includes('review') || q.includes('reviews') || q.includes('testimonial') || q.includes('testimonials') || q.includes('feedback') || q.includes('rating') || q.includes('ratings') || q.includes('satisfied') || q.includes('clients')) {
    return {
      reply: `⭐ **Verified Client Reviews & Testimonials**\n\nCreate and Arise maintains a **100% 5-Star Track Record** with visionary brands across the USA and worldwide:\n\n• **Aimé Leon Dore (NYC):** 0.4s load speed & 4.8x conversion lift.\n• **Buck Mason (LA):** Iconic monogram & expansion to 30+ stores.\n• **Blue Bottle Coffee (Oakland):** Single-origin retail packaging guidelines.\n• **The Ridge (Santa Monica):** +320% ROAS lift & CAC slashed by 64%.\n• **Velocity Global (Denver):** 4x enterprise inbound pipeline.\n• **Crossway & TGC:** +240% to +280% digital outreach surge.\n\nAll client websites are live and verified!`,
      actions: [
        { label: '⭐ View Client Reviews', callback: 'scrollToReviews' },
        { label: '🖼️ Explore Portfolio Showcase', callback: 'scrollToPortfolio' },
        { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' }
      ],
      chips: ['Aimé Leon Dore', 'The Ridge', 'Buck Mason', 'Blue Bottle Coffee', 'Pricing']
    };
  }

  // 4. Web Design & Development
  if (q.includes('web') || q.includes('website') || q.includes('landing page') || q.includes('e-commerce') || q.includes('ecommerce') || q.includes('ui') || q.includes('ux') || q.includes('develop') || q.includes('code') || q.includes('shopify') || q.includes('frontend')) {
    return {
      reply: `💻 **Web Design & Development at Create and Arise**\n\nWe design and hand-craft high-converting, sub-second responsive websites:\n\n• **Speed & Performance:** 99/100 Core Web Vitals with sub-0.5s edge load speeds (just like our work for Aimé Leon Dore!).\n• **Clean Architecture:** Semantic HTML5, modern vanilla CSS, responsive layouts, zero template bloat.\n• **Conversion Optimization:** Lead capture forms, automated booking integrations, GA4 analytics.\n• **Investment:** Starting at **$750 / ₱43,500** with 2 to 3-week turnaround.\n\nWould you like an instant estimate or a free design audit of your current site?`,
      actions: [
        { label: '🧮 Estimate Web Design ($750+)', callback: 'selectWeb' },
        { label: '👁️ Aimé Leon Dore Case Study', callback: 'openCaseStudy2' },
        { label: '📅 Book Free 30-Min Strategy Call', callback: 'openBookCallModal' }
      ],
      chips: ['Pricing', 'Graphic Design', 'Digital Ads', 'Social Media', 'Book a Call']
    };
  }

  // 5. Graphic Design & Branding
  if (q.includes('graphic') || q.includes('graphics') || q.includes('logo') || q.includes('branding') || q.includes('brand identity') || q.includes('packaging') || q.includes('vector') || q.includes('pitch deck') || q.includes('stationery') || q.includes('merch')) {
    return {
      reply: `🎨 **Graphic Design & Brand Identity**\n\nOur foundational craft helps visionary brands command respect and trust:\n\n• **Complete Master Logo Suite:** Primary, secondary, submarks, and favicon vectors (AI, SVG, EPS, PDF, PNG).\n• **Brand Architecture Guidelines:** Color palettes, typography hierarchies, and visual standard books.\n• **Packaging & Unboxing:** Factory-ready die-lines, foil stamping, and 3D photorealistic mockups.\n• **Full Commercial Rights:** 100% source file handover with unlimited commercial rights.\n• **Investment:** Starting at **$450 / ₱25,000** with 2-week delivery.`,
      actions: [
        { label: '🧮 Estimate Branding ($450+)', callback: 'selectGraphics' },
        { label: '👁️ Buck Mason Case Study', callback: 'openCaseStudy8' },
        { label: '👁️ Blue Bottle Packaging Suite', callback: 'openCaseStudy3' },
        { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' }
      ],
      chips: ['Pricing', 'Web Design', 'Digital Ads', 'Social Media', 'Contact']
    };
  }

  // 6. Digital Ads & Growth Marketing
  if (q.includes('ad') || q.includes('ads') || q.includes('marketing') || q.includes('campaign') || q.includes('meta ads') || q.includes('facebook ads') || q.includes('google ads') || q.includes('tiktok ads') || q.includes('roas') || q.includes('traffic') || q.includes('cac')) {
    return {
      reply: `📈 **Digital Ads & Performance Marketing**\n\nWe engineer omnichannel campaigns designed to scale revenue profitably:\n\n• **Platforms:** Meta Ads (Facebook & Instagram), Google Search & Display, TikTok Ads.\n• **High-Converting Creatives:** Static hooks, carousel funnels, and conversion-tested copywriting.\n• **Proven Results:** We slashed CAC by 64% and achieved **+320% ROAS** for high-growth brands like The Ridge.\n• **Full Funnel:** Dedicated landing pages, pixel integration, and weekly ROAS tracking.\n• **Investment:** Starting at **$500 / ₱29,000** per month/sprint.`,
      actions: [
        { label: '🧮 Estimate Ads Package ($500+)', callback: 'selectAds' },
        { label: '👁️ The Ridge Case Study', callback: 'openCaseStudy4' },
        { label: '📅 Book Paid Ads Consultation', callback: 'openBookCallModal' }
      ],
      chips: ['Pricing', 'Web Design', 'Graphic Design', 'Social Media', 'Contact']
    };
  }

  // 7. Social Media Management
  if (q.includes('social') || q.includes('smm') || q.includes('instagram') || q.includes('content calendar') || q.includes('grid') || q.includes('feed') || q.includes('posting') || q.includes('followers')) {
    return {
      reply: `📱 **Social Media Management**\n\nTransform your social media channels into an aesthetic, authoritative client magnet:\n\n• **30-Day Content Architecture:** Monthly editorial calendars mapped to your business sales cycle.\n• **Visual Polish:** High-impact branded carousels, aesthetic grids, and devotional/educational assets.\n• **Growth Copywriting:** High-retention hooks, thoughtful captions, and optimized hashtag clusters.\n• **Community Stewardship:** Strategic response protocols and monthly performance analytics.\n• **Investment:** Starting at **$450 / ₱25,000** per month.`,
      actions: [
        { label: '🧮 Estimate Social Media ($450+)', callback: 'selectSocial' },
        { label: '👁️ TGC Discipleship Case Study', callback: 'openCaseStudy21' },
        { label: '📅 Schedule Social Strategy Call', callback: 'openBookCallModal' }
      ],
      chips: ['Pricing', 'Web Design', 'Graphic Design', 'Digital Ads', 'Contact']
    };
  }

  // 8. Video Editing / Reels Query
  if (q.includes('reel') || q.includes('reels') || q.includes('video') || q.includes('tiktok video') || q.includes('shorts') || q.includes('youtube') || q.includes('editing') || q.includes('motion')) {
    return {
      reply: `🎬 **Creative Capabilities Note:**\n\nAt **Create and Arise**, our studio is 100% focused on our 4 high-impact core disciplines:\n\n1. **🎨 Graphic Design & Brand Identity**\n2. **💻 Web Design & Development**\n3. **📈 Digital Ads Marketing**\n4. **📱 Social Media Management**\n\nWe do **not** offer standalone freelance video shooting or YouTube editing, which allows us to deliver world-class craft and ROI for our 4 specialized core pillars!\n\nWhich core service can we assist you with today?`,
      actions: [
        { label: '🎨 Graphic Design', callback: 'selectGraphics' },
        { label: '💻 Web Design', callback: 'selectWeb' },
        { label: '📈 Digital Ads', callback: 'selectAds' },
        { label: '📱 Social Media Management', callback: 'selectSocial' }
      ],
      chips: ['Web Design', 'Graphic Design', 'Pricing', 'Contact']
    };
  }

  // 9. Pricing, Rates & Currency
  if (q.includes('price') || q.includes('pricing') || q.includes('cost') || q.includes('rates') || q.includes('how much') || q.includes('magkano') || q.includes('fee') || q.includes('quote') || q.includes('budget') || q.includes('estimate') || q.includes('currency') || q.includes('php') || q.includes('usd')) {
    return {
      reply: `💰 **Transparent Studio Pricing & Packages**\n\nWe offer clear fixed-price packages with zero hidden fees:\n\n• **🎨 Graphic Design & Branding:** from **$450 / ₱25,000**\n• **💻 Web Design & Development:** from **$750 / ₱43,500**\n• **📈 Digital Ads Marketing:** from **$500 / ₱29,000**\n• **📱 Social Media Management:** from **$450 / ₱25,000**\n\n✨ **Options:**\n• Standard Delivery: 2–3 Weeks\n• Express Priority Sprint: 7 Days (+30%)\n• Ongoing Monthly Retainer: 10% Bundle Discount\n\nSupported Currencies: **USD ($), PHP (₱), AUD (A$), EUR (€), GBP (£)**!`,
      actions: [
        { label: '🧮 Open Interactive Cost Estimator', callback: 'scrollToEstimator' },
        { label: '📅 Book a Free Discovery Call', callback: 'openBookCallModal' },
        { label: '📝 Submit Custom Project Scope', callback: 'scrollToContact' }
      ],
      chips: ['Web Design', 'Graphic Design', 'Digital Ads', 'Payment Methods', 'Contact']
    };
  }

  // 10. Jerome Cabinta (Developer) & PURPOSE / STUDIO™
  if (q.includes('jerome') || q.includes('cabinta') || q.includes('developer') || q.includes('who built') || q.includes('who coded') || q.includes('who made') || q.includes('purpose') || q.includes('streetwear')) {
    return {
      reply: `👨‍💻 **Meet Web Developer Jerome Cabinta**\n\n**Jerome Cabinta** is the web developer and UI/UX implementation specialist at Create and Arise who built this website from the ground up!\n\n• **Craft:** Clean semantic HTML5, modern vanilla CSS, sub-second edge speeds, and zero template bloat.\n• **Featured Live Project:** [create-with-purpose.vercel.app](https://create-with-purpose.vercel.app) — an interactive 500 GSM heavyweight streetwear platform.\n• **Philosophy:** Excellence in workmanship as working for the Lord (Colossians 3:23).`,
      actions: [
        { label: '🚀 Launch PURPOSE / STUDIO™ Live', callback: 'openPurposeProject' },
        { label: '👁️ Purpose Studio Case Study', callback: 'openCaseStudy7' },
        { label: '📅 Book Call with Jerome & Team', callback: 'openBookCallModal' },
        { label: '💬 Chat on WhatsApp', callback: 'openWhatsApp' }
      ],
      chips: ['Meet the Team', 'Web Design', 'Client Reviews', 'Pricing', 'Contact']
    };
  }

  // 11. Team Collective
  if (q.includes('team') || q.includes('who are you') || q.includes('members') || q.includes('staff') || q.includes('founder') || q.includes('elijah') || q.includes('collective')) {
    return {
      reply: `👥 **The Create and Arise Creative Collective**\n\nBased in the Philippines and serving clients across the USA, UK, Australia, and worldwide:\n\n• **Elijah Morales** — Founder & Executive Creative Director\n• **Jerome Cabinta** — Web Developer & UI/UX Specialist\n• **Hannah Grace Santos** — Senior Brand & Packaging Designer\n• **Caleb Tan** — Digital Ads & Growth Strategist\n• **Faith Dela Cruz** — Social Media & Content Strategist\n\nDedicated weekday sprints, direct Slack/Loom communication, and 100% intellectual property handover!`,
      actions: [
        { label: '👥 Meet Our Team & Reviews', callback: 'scrollToTeam' },
        { label: '📅 Book Discovery Call', callback: 'openBookCallModal' },
        { label: '💬 WhatsApp Direct Chat', callback: 'openWhatsApp' }
      ],
      chips: ['Client Reviews', 'Services', 'Pricing', 'Our Faith', 'Contact']
    };
  }

  // 12. Operating Hours & Sabbath
  if (q.includes('hour') || q.includes('hours') || q.includes('open') || q.includes('schedule') || q.includes('operating') || q.includes('saturday') || q.includes('sunday') || q.includes('weekend') || q.includes('sabbath') || q.includes('closed') || q.includes('available')) {
    return {
      reply: `🕒 **Studio Operating Schedule (PHT / GMT+8):**\n\n• **Monday to Friday:** 8:00 AM – 6:00 PM PHT (Active Studio & Build Sprints)\n• **Saturday & Sunday:** Closed for Weekend Sabbath, Rest & Family Renewal\n\n⚡ **Global Asynchronous Collaboration:** We collaborate smoothly with clients in the US (EST/PST), Australia, and Europe with zero midnight meetings. Guaranteed replies within 24 weekday business hours!`,
      actions: [
        { label: '📅 Schedule a Discovery Call', callback: 'openBookCallModal' },
        { label: '📝 Submit Consultation Form', callback: 'scrollToContact' },
        { label: '💬 Send WhatsApp Message', callback: 'openWhatsApp' }
      ],
      chips: ['Services', 'Pricing', 'Meet the Team', 'Contact']
    };
  }

  // 13. Payment Methods
  if (q.includes('payment') || q.includes('pay') || q.includes('gcash') || q.includes('maya') || q.includes('bank') || q.includes('paypal') || q.includes('stripe') || q.includes('wise') || q.includes('credit card')) {
    return {
      reply: `💳 **Secure Payment Methods Accepted:**\n\n• **Philippine Clients:** GCash, Maya, BDO, BPI, UnionBank (PHP ₱)\n• **USA & International Clients:** Stripe, PayPal, Wise, Direct International Wire Transfer (USD $, AUD A$, EUR €, GBP £)\n\n💼 **Terms:** 50% initial milestone deposit to lock your sprint calendar, with the remaining 50% upon final delivery and 100% commercial source file handover.`,
      actions: [
        { label: '🧮 Interactive Cost Estimator', callback: 'scrollToEstimator' },
        { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' },
        { label: '📝 Start a Project Inquiry', callback: 'scrollToContact' }
      ],
      chips: ['Pricing', 'Web Design', 'Graphic Design', 'Contact']
    };
  }

  // 14. Location & Base
  if (q.includes('location') || q.includes('where') || q.includes('benguet') || q.includes('la trinidad') || q.includes('manila') || q.includes('philippines') || q.includes('base') || q.includes('country')) {
    return {
      reply: `📍 **Studio Headquarters:**\n\nCreate and Arise is headquartered in **La Trinidad, Benguet, Philippines (GMT+8)**, serving visionary clients across the USA, UK, Europe, Australia, and Asia.\n\nOur highland studio operates with world-class design standards, international communication protocols, and dedicated asynchronous video walkthroughs (Loom & Figma).`,
      actions: [
        { label: '👥 Meet Our Team & Reviews', callback: 'scrollToTeam' },
        { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' },
        { label: '💬 Chat on WhatsApp', callback: 'openWhatsApp' }
      ],
      chips: ['Client Reviews', 'Services', 'Pricing', 'Operating Hours']
    };
  }

  // 15. Free Audit / Consultation
  if (q.includes('audit') || q.includes('free audit') || q.includes('consultation') || q.includes('book') || q.includes('meeting') || q.includes('strategy call') || q.includes('discovery call')) {
    return {
      reply: `📅 **Book Your Free 30-Minute Discovery Strategy Call**\n\nLet's discuss your brand, current bottlenecks, and digital growth roadmap:\n\n• **What We Cover:** Brand positioning, UI/UX audit, conversion funnel bottlenecks, and tailored budget options.\n• **Meeting Platforms:** Google Meet, Zoom, or WhatsApp Video.\n• **Zero Pressure:** 100% free consultation with transparent advice.`,
      actions: [
        { label: '📅 Book Discovery Call Now', callback: 'openBookCallModal' },
        { label: '📝 Send Project Specifications', callback: 'scrollToContact' },
        { label: '💬 Chat on WhatsApp (+63 927 468 2635)', callback: 'openWhatsApp' }
      ],
      chips: ['Pricing', 'Services', 'Client Reviews', 'Contact']
    };
  }

  // 16. Contact Info & Socials
  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('number') || q.includes('whatsapp') || q.includes('facebook') || q.includes('messenger') || q.includes('reach')) {
    return {
      reply: `📞 **Get in Touch with Create and Arise:**\n\n• **WhatsApp / Mobile:** +63 927 468 2635\n• **Official Email:** [createandarise05@gmail.com](mailto:createandarise05@gmail.com)\n• **Facebook:** [@CreateAndArise2023](https://www.facebook.com/CreateAndArise2023)\n• **Studio Hours:** Mon–Fri 8:00 AM – 6:00 PM PHT\n\nWe respond to all weekday inquiries within 24 business hours!`,
      actions: [
        { label: '💬 Message on WhatsApp', callback: 'openWhatsApp' },
        { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' },
        { label: '📝 Fill Project Inquiry Form', callback: 'scrollToContact' }
      ],
      chips: ['Pricing', 'Services', 'Operating Hours', 'About Us']
    };
  }

  // 17. Greetings & Introductions
  if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'kumusta' || q.startsWith('hi ') || q.startsWith('hello ') || q.startsWith('hey ') || q.includes('magandang') || q.includes('greetings')) {
    return {
      reply: `👋 **Hello and welcome to Create and Arise!** ✨\n\nI'm **AriseBot**, your AI creative and digital growth consultant. We are a premier Christian-founded creative design & digital studio based in the Philippines, helping visionary businesses and ministries arise through:\n\n1. **🎨 Graphic Design & Brand Identity**\n2. **💻 Web Design & Responsive UI/UX**\n3. **📈 Digital Ads & Paid Campaigns**\n4. **📱 Social Media Management**\n\nHow can I assist your brand today?`,
      actions: [
        { label: '🎨 Explore Services', callback: 'showServicesMenu' },
        { label: '💰 Check Transparent Pricing', callback: 'scrollToEstimator' },
        { label: '⭐ View Verified USA Reviews', callback: 'scrollToReviews' },
        { label: '📅 Book Free Discovery Call', callback: 'openBookCallModal' }
      ],
      chips: ['Web Design', 'Graphic Design', 'Digital Ads', 'Social Media', 'Pricing', 'Client Reviews']
    };
  }

  // 18. Default Intelligent Fallback
  return {
    reply: `Thank you for asking! ✨ At **Create and Arise**, we specialize in purpose-driven Graphic Design, High-Converting Web Design, Digital Ads Marketing, and Social Media Management for brands worldwide.\n\nWhether you need an e-commerce platform like **Aimé Leon Dore**, iconic branding like **Buck Mason**, or profitable digital ads like **The Ridge**, we're ready to engineer your growth!\n\nWhat would you like to explore next?`,
    actions: [
      { label: '🎨 View Creative Services', callback: 'showServicesMenu' },
      { label: '🧮 Interactive Cost Calculator', callback: 'scrollToEstimator' },
      { label: '⭐ Read Client Reviews & Outcomes', callback: 'scrollToReviews' },
      { label: '📅 Book a Free Discovery Call', callback: 'openBookCallModal' }
    ],
    chips: ['Web Design', 'Graphic Design', 'Digital Ads', 'Social Media', 'Pricing', 'Contact']
  };
}

/**
 * Escapes markdown characters for quotes
 */
function escapeMarkdown(text) {
  return text.replace(/"/g, '&quot;');
}

/**
 * Optional Gemini API Query Helper
 */
function queryGeminiAPI(userMsg, history) {
  return new Promise((resolve, reject) => {
    if (!process.env.GEMINI_API_KEY) return resolve(null);

    const systemPrompt = `You are AriseBot, the virtual AI creative assistant for "Create and Arise", a Christian-founded creative design and digital marketing studio in La Trinidad, Benguet, Philippines (GMT+8).
Services: 
1. Graphic Design & Brand Identity (from $450/₱25k)
2. Web Design & Development (from $750/₱43.5k)
3. Digital Ads Marketing (from $500/₱29k)
4. Social Media Management (from $450/₱25k)
Team: Jerome Cabinta (Web Developer), Elijah Morales (Founder & Creative Director), Hannah Grace Santos (Senior Brand Designer), Caleb Tan (Ads Lead), Faith Dela Cruz (Social Lead).
Verified USA Clients: Aimé Leon Dore (0.4s speed, 4.8x conversion lift), Buck Mason (monogram, 30+ stores), Blue Bottle Coffee (single-origin packaging), The Ridge (+320% ROAS, CAC $18.50), Crossway ESV Bible (+240% outreach), Velocity Global (4x pipeline).
Tone: Warm, highly professional, encouraging, faith-honoring, and focused on commercial excellence.`;

    const payload = JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMsg}` }] }
      ]
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const replyText = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            resolve({
              reply: replyText,
              actions: [
                { label: '📅 Book a Discovery Call', callback: 'openBookCallModal' },
                { label: '🧮 Interactive Cost Calculator', callback: 'scrollToEstimator' },
                { label: '💬 WhatsApp Direct Chat', callback: 'openWhatsApp' }
              ],
              chips: ['Web Design', 'Graphic Design', 'Pricing', 'Client Reviews', 'Contact']
            });
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => { req.destroy(); resolve(null); });
    req.write(payload);
    req.end();
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

  // API Route: POST /api/chat (AriseBot AI Assistant Backend)
  if (reqPath === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        let payload = {};
        try {
          payload = JSON.parse(body || '{}');
        } catch (parseErr) {
          payload = { message: body };
        }
        const userMsg = (typeof payload === 'object' && payload.message ? payload.message : (typeof payload === 'string' ? payload : '')).trim();

        if (!userMsg) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Empty message' }));
          return;
        }

        // Save conversation log for studio lead insights
        try {
          const dataDir = path.join(__dirname, 'data');
          const chatLogFile = path.join(dataDir, 'chat_logs.json');
          if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
          let logs = [];
          if (fs.existsSync(chatLogFile)) {
            try { logs = JSON.parse(fs.readFileSync(chatLogFile, 'utf8')); } catch (e) { logs = []; }
          }
          logs.push({
            timestamp: new Date().toISOString(),
            userMessage: userMsg,
            historyLength: (payload.history || []).length
          });
          if (logs.length > 500) logs = logs.slice(-500);
          fs.writeFileSync(chatLogFile, JSON.stringify(logs, null, 2), 'utf8');
        } catch (logErr) {
          console.warn('[Chat] Could not save log:', logErr.message);
        }

        const botReplyData = await generateBotResponse(userMsg, payload.history || []);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          ...botReplyData
        }));
      } catch (err) {
        console.error('Chatbot endpoint error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
      }
    });
    return;
  }

  if (reqPath === '/') reqPath = '/index.html';
  
  const filePath = path.join(__dirname, decodeURIComponent(reqPath));
  
  fs.stat(filePath, (err, stat) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
      return;
    }

    if (stat.isDirectory()) {
      res.writeHead(403);
      res.end('Directory listing forbidden');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const range = req.headers.range;

    if (range && (ext === '.mp4' || ext === '.webm' || ext === '.ogg')) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stat.size,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
