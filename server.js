const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8085;
const OWNER_EMAIL = 'createandarise05@gmail.com';

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
 * Server-side relay directly to FormSubmit endpoint for createandarise05@gmail.com.
 * This guarantees reliable email delivery without browser adblocker interference.
 */
function relayToFormSubmit(payload) {
  return new Promise((resolve) => {
    try {
      const data = JSON.stringify({
        ...payload,
        _replyto: payload.email || OWNER_EMAIL,
        _template: 'table',
        _captcha: 'false'
      });

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Referer': `http://localhost:${PORT}/`,
          'Origin': `http://localhost:${PORT}`
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

    req.on('end', () => {
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

        // Relay booking notification directly to createandarise05@gmail.com
        relayToFormSubmit({
          name: newBooking.name,
          email: newBooking.email,
          _replyto: newBooking.email,
          service: newBooking.service,
          date: newBooking.date,
          time_slot_pht: newBooking.timeSlot,
          time_slot_local: newBooking.timeSlotLocal,
          client_timezone: newBooking.timezone,
          meeting_platform: newBooking.platform,
          booking_reference: newBooking.id,
          project_notes: newBooking.notes,
          _subject: `📅 [NEW DISCOVERY CALL] ${newBooking.name} - ${newBooking.date} (${newBooking.timeSlot})`
        }).catch(err => console.warn('Booking relay error:', err));

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, booking: newBooking }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // API Route: POST /api/contact (General inquiries, audit requests, feedback)
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

        const msgRecord = {
          id: 'MSG-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900),
          ...payload,
          receivedAt: new Date().toISOString()
        };

        messages.push(msgRecord);
        fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');

        // Relay to createandarise05@gmail.com via FormSubmit
        const relayRes = await relayToFormSubmit(payload);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Message received and dispatched to studio email.', relay: relayRes }));
      } catch (err) {
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
