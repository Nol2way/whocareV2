/*
  Simple system check script (CommonJS) to exercise core API endpoints.
  Usage:
    node scripts/system-check.cjs
  Optional env vars:
    BASE_URL (default http://localhost:5000)
    TEST_USER_TYPE (default 'thai')
    TEST_THAI_ID (default '2222222222222')
    TEST_PASSWORD (default 'dddddddd')
*/

const http = require('http');
const https = require('https');
const { URL } = require('url');

const BASE = process.env.BASE_URL || 'http://localhost:5000';
const TEST_USER_TYPE = process.env.TEST_USER_TYPE || 'thai';
const TEST_THAI_ID = process.env.TEST_THAI_ID || '2222222222222';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'dddddddd';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(path, BASE);
      const lib = url.protocol === 'https:' ? https : http;
      const opts = {
        method,
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        headers: { ...headers },
        timeout: 15000,
      };

      let payload = null;
      if (body) {
        payload = typeof body === 'string' ? body : JSON.stringify(body);
        if (!opts.headers['Content-Type']) opts.headers['Content-Type'] = 'application/json';
        opts.headers['Content-Length'] = Buffer.byteLength(payload);
      }

      const req = lib.request(opts, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          let parsed = null;
          try { parsed = data ? JSON.parse(data) : null; } catch (e) { parsed = null; }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed, text: data });
        });
      });

      req.on('error', (err) => reject(err));
      req.on('timeout', () => { req.destroy(new Error('Request timed out')); });

      if (payload) req.write(payload);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

async function run() {
  console.log('System check starting against', BASE);

  // 1) Health
  try {
    const h = await request('GET', '/api/health');
    console.log('\n[1] /api/health ->', h.status);
    console.log('    body:', h.body ? JSON.stringify(h.body) : h.text.slice(0, 200));
  } catch (e) {
    console.error('\n[1] /api/health error:', e.message);
  }

  // 2) Login
  let token = null;
  try {
    const loginBody = TEST_USER_TYPE === 'thai' ? { userType: 'thai', thaiId: TEST_THAI_ID, password: TEST_PASSWORD } : { userType: TEST_USER_TYPE, passport: TEST_THAI_ID, password: TEST_PASSWORD };
    const r = await request('POST', '/api/auth/login', loginBody);
    console.log('\n[2] POST /api/auth/login ->', r.status);
    console.log('    response:', r.body ? JSON.stringify({ success: r.body.success, message: r.body.message }) : r.text.slice(0,200));
    if (r.status === 200 && r.body && r.body.success && r.body.data && r.body.data.accessToken) {
      token = r.body.data.accessToken;
      console.log('    Logged in. Access token received (length):', token.length);
    } else {
      console.warn('    Login failed or no token returned');
    }
  } catch (e) {
    console.error('\n[2] Login error:', e.message);
  }

  // Helper to call authed endpoints
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // 3) Profile
  try {
    const p = await request('GET', '/api/auth/profile', null, authHeaders);
    console.log('\n[3] GET /api/auth/profile ->', p.status);
    console.log('    body:', p.body ? JSON.stringify(p.body) : p.text.slice(0,200));
  } catch (e) {
    console.error('\n[3] Profile error:', e.message);
  }

  // 4) Public services
  try {
    const s = await request('GET', '/api/services');
    console.log('\n[4] GET /api/services ->', s.status);
    console.log('    services count:', Array.isArray((s.body && s.body.data) ? s.body.data : s.body) ? ((s.body && s.body.data) ? s.body.data.length : (s.body || []).length) : 'unknown');
  } catch (e) {
    console.error('\n[4] Services error:', e.message);
  }

  // 5) Hospitals (new endpoint)
  try {
    const h = await request('GET', '/api/hospitals');
    console.log('\n[5] GET /api/hospitals ->', h.status);
    if (h.body && h.body.success) {
      const th = (h.body.data && h.body.data.thailand) ? h.body.data.thailand.length : 0;
      const intl = (h.body.data && h.body.data.international) ? h.body.data.international.length : 0;
      console.log(`    thailand: ${th}, international: ${intl}`);
    } else {
      console.log('    body:', h.body || h.text.slice(0,200));
    }
  } catch (e) {
    console.error('\n[5] Hospitals error:', e.message);
  }

  // 6) My bookings (auth required)
  try {
    const b = await request('GET', '/api/bookings/my', null, authHeaders);
    console.log('\n[6] GET /api/bookings/my ->', b.status);
    if (b.body && b.body.success) {
      console.log('    bookings count:', Array.isArray(b.body.data) ? b.body.data.length : 'unknown');
    } else {
      console.log('    body:', b.body || b.text.slice(0,200));
    }
  } catch (e) {
    console.error('\n[6] My bookings error:', e.message);
  }

  // 7) If services present and token present, try slots for first service tomorrow
  try {
    const svcResp = await request('GET', '/api/services');
    let svcList = [];
    if (svcResp && svcResp.body && svcResp.body.success && Array.isArray(svcResp.body.data)) svcList = svcResp.body.data;
    if (svcList.length > 0 && token) {
      const svcId = svcList[0].id;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const qs = `/api/bookings/slots?service_id=${svcId}&date=${dateStr}`;
      const slots = await request('GET', qs, null, authHeaders);
      console.log(`\n[7] GET ${qs} ->`, slots.status);
      if (slots.body && slots.body.success && slots.body.data && Array.isArray(slots.body.data.slots)) {
        const available = slots.body.data.slots.filter(s => s.status === 'available').length;
        console.log(`    slots for ${dateStr}: total ${slots.body.data.slots.length}, available ${available}`);
      } else {
        console.log('    body:', slots.body || slots.text.slice(0,200));
      }
    } else {
      console.log('\n[7] Skipping slots check (no services or not logged in)');
    }
  } catch (e) {
    console.error('\n[7] Slots check error:', e.message);
  }

  console.log('\nSystem check complete.');
}

run().catch((e) => { console.error('Unexpected error:', e); process.exit(2); });
