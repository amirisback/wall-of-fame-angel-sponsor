/**
 * Wall of Fame — Dev Server
 * Serves static files + handles POST /api/save to write data/content.json
 * Usage: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;
const CONTENT_PATH = path.join(ROOT, 'data', 'content.json');

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  // CORS headers (for local dev)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // ── POST /api/save → write content.json ──────────────
  if (req.method === 'POST' && req.url === '/api/save') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        // Validate JSON
        const parsed = JSON.parse(body);
        const pretty = JSON.stringify(parsed, null, 2) + '\n';
        fs.writeFileSync(CONTENT_PATH, pretty, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, message: 'content.json saved!' }));
        console.log(`[${new Date().toLocaleTimeString()}] ✓ Saved data/content.json`);
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, message: err.message }));
        console.error(`[${new Date().toLocaleTimeString()}] ✕ Save error:`, err.message);
      }
    });
    return;
  }

  // ── Static file serving ──────────────────────────────
  let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    // No cache for dev
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  🚀 Dev server running at http://localhost:${PORT}`);
  console.log(`  📝 CMS editor at        http://localhost:${PORT}/cms.html`);
  console.log(`  💾 Save endpoint at      POST http://localhost:${PORT}/api/save\n`);
});
