import { chromium } from 'playwright';
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext();
  await c.route('**/api/**', (r) => r.fulfill({ status: 200, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ success: true }) }));
  await c.addInitScript({ content: "try{window.localStorage.setItem('accessToken','dry-token');window.localStorage.setItem('user', JSON.stringify({id:999}))}catch(e){}" });
  const p = await c.newPage();
  await p.goto('http://localhost:5174', { waitUntil: 'load' });
  const html = await p.content();
  console.log('content length', html.length);
  console.log('buttons', await p.evaluate(() => document.querySelectorAll('button').length));
  console.log('anchors', await p.evaluate(() => document.querySelectorAll('a[href]').length));
  await b.close();
})();
