#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const FRONTEND_BASE = process.env.FRONTEND_BASE || 'http://localhost:5173';
const BACKEND_BASE = process.env.BACKEND_BASE || 'http://localhost:5000';
const MODE = (process.env.E2E_MODE || 'dry').toLowerCase(); // 'dry' or 'live'
const TEST_USER_TYPE = process.env.TEST_USER_TYPE || 'thai';
const TEST_THAI_ID = process.env.TEST_THAI_ID || '2222222222222';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'dddddddd';
const MAX_ROUTES = Number(process.env.MAX_ROUTES || 200);

const reportFile = path.join(process.cwd(), 'scripts', 'e2e-click-report.json');

function resolveUrl(href, base) {
  try { return new URL(href, base).toString(); } catch { return null; }
}

async function run() {
  console.log('E2E clicker starting', { FRONTEND_BASE, BACKEND_BASE, MODE });

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext();

  // Intercept API calls in dry mode to avoid destructive actions
  await context.route('**/api/**', async (route) => {
    if (MODE === 'dry') {
      const stub = JSON.stringify({ success: true, message: 'stubbed by e2e-clicker' });
      await route.fulfill({ status: 200, headers: { 'content-type': 'application/json' }, body: stub });
    } else {
      await route.continue();
    }
  });

  // Prepare authentication (live => real login, dry => fake user)
  let authToken = null;
  let userObj = null;
  if (MODE === 'live') {
    try {
      const loginPayload = TEST_USER_TYPE === 'thai'
        ? { userType: 'thai', thaiId: TEST_THAI_ID, password: TEST_PASSWORD }
        : { userType: TEST_USER_TYPE, passport: TEST_THAI_ID, password: TEST_PASSWORD };
      const resp = await context.request.post(`${BACKEND_BASE}/api/auth/login`, { data: loginPayload });
      const json = await resp.json().catch(() => null);
      if (json && json.success && json.data && json.data.accessToken) {
        authToken = json.data.accessToken;
        userObj = json.data.user;
        console.log('Live login success, user id=', userObj?.id);
      } else {
        console.warn('Live login did not return token; continuing unauthenticated');
      }
    } catch (e) {
      console.warn('Live login request failed:', e.message);
    }
  } else {
    authToken = 'dry-token';
    userObj = { id: 999999, email: 'test@example.com', role: 'patient', first_name_th: 'Test', last_name_th: 'User' };
  }

  // Inject localStorage before pages load
  await context.addInitScript({
    content: `
      try {
        window.localStorage.setItem('accessToken', ${JSON.stringify(authToken)});
        window.localStorage.setItem('refreshToken', ${JSON.stringify(authToken)});
        window.localStorage.setItem('user', ${JSON.stringify(JSON.stringify(userObj))});
      } catch(e) { /* ignore */ }
    `
  });

  const page = await context.newPage();
  page.on('dialog', async (dialog) => { console.log('Dialog:', dialog.message()); try { await dialog.dismiss(); } catch {} });
  page.on('console', msg => { try { console.log('PAGE LOG:', msg.type(), msg.text()); } catch(e){} });
  page.on('pageerror', err => { try { console.log('PAGE ERROR:', err.message); } catch(e){} });

  const visited = new Set();
  const queue = ['/'];
  const results = [];

  while (queue.length && visited.size < MAX_ROUTES) {
    const route = queue.shift();
    const full = resolveUrl(route, FRONTEND_BASE);
    if (!full) continue;
    if (visited.has(full)) continue;
    visited.add(full);
    console.log('\n-- Visiting', full);

    try {
      await page.goto(full, { waitUntil: 'load', timeout: 30000 });
      // give SPA time to render
      await page.waitForTimeout(1500);
    } catch (e) {
      console.warn('Navigation failed for', full, e.message);
    }

    // Collect internal anchors and enqueue (and attempt light clicks)
    try {
      const anchors = await page.$$eval('a[href]', as => as.map(a => a.getAttribute('href')).filter(h => !!h && !h.startsWith('mailto:') && !h.startsWith('tel:')));
      console.log('  anchors discovered on page:', anchors.length);
      for (const a of anchors) {
        const resolved = resolveUrl(a, full);
        if (!resolved) continue;
        if (resolved.startsWith(FRONTEND_BASE)) {
          const pathname = new URL(resolved).pathname + new URL(resolved).search;
          if (!visited.has(new URL(pathname, FRONTEND_BASE).toString())) queue.push(pathname);
        }
      }
    } catch (e) { /* ignore */ }

    // Click visible interactive elements (buttons, anchors, role=button, inputs)
    try {
      // Gather candidate interactive elements and their visibility in-page
      const sel = 'a[href], button, [role="button"], input[type="button"], input[type="submit"], [onclick]';
      const elements = await page.evaluate((selector) => {
        const nodes = Array.from(document.querySelectorAll(selector));
        return nodes.map((el, idx) => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          const visible = style && style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
          return { idx, tag: el.tagName, href: el.getAttribute('href'), text: el.innerText || '', visible, outer: el.outerHTML ? el.outerHTML.slice(0,300) : '' };
        });
      }, sel);

      console.log('  candidate interactive elements found (total):', elements.length);
      let clicked = 0;
      for (const info of elements) {
        if (!info.visible) continue;
        // If anchor, enqueue target; avoid clicking anchors to prevent navigation inside evaluate
        if (info.tag === 'A' && info.href) {
          const resolved = resolveUrl(info.href, full);
          if (resolved && resolved.startsWith(FRONTEND_BASE)) {
            const pathname = new URL(resolved).pathname + new URL(resolved).search;
            if (!visited.has(new URL(pathname, FRONTEND_BASE).toString())) queue.push(pathname);
          }
          // record but don't click anchors here
          results.push({ page: full, index: info.idx, info, clicked: false });
          continue;
        }

        // For non-anchor visible elements (buttons), perform click via in-page action by index
        const entry = { page: full, index: info.idx, info, clicked: false, navigatedTo: null, error: null };
        try {
          // Click the element by index inside the page context to avoid locator issues
          await page.evaluate((selector, index) => {
            const nodes = Array.from(document.querySelectorAll(selector));
            const el = nodes[index];
            if (el) {
              el.scrollIntoView({behavior: 'auto', block: 'center'});
              try { el.click(); } catch (e) { /* ignore */ }
            }
          }, sel, info.idx);

          await page.waitForTimeout(900);
          entry.clicked = true;
          clicked++;
        } catch (err) {
          entry.error = err.message || String(err);
        }
        results.push(entry);
      }
      console.log('  visible interactive elements processed (clicked where applicable):', clicked);
    } catch (e) {
      console.warn('Interactive elements scan failed on', full, e.message);
    }
  }

  // Save report
  try {
    const report = { meta: { startedAt: new Date().toISOString(), FRONTEND_BASE, BACKEND_BASE, MODE }, visited: Array.from(visited), results };
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2), 'utf8');
    console.log('\nReport written to', reportFile);
  } catch (e) {
    console.warn('Failed to write report:', e.message);
  }

  await browser.close();
}

run().catch((e) => { console.error('Fatal error:', e); process.exit(2); });
