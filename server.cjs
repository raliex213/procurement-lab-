'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const files = new Set(['index.html', 'styles.css', 'engine.js', 'scenarios.js', 'behaviour.js', 'resolution.js', 'app.js', 'experience.js']);
const types = {'.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8'};
const port = process.env.PORT === undefined ? 4173 : Number(process.env.PORT);
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT must be an integer from 0 to 65535.');
const server = http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, {'Allow': 'GET, HEAD'}).end();
    return;
  }
  let name;
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    name = pathname === '/' ? 'index.html' : pathname.slice(1);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }
  if (!files.has(name)) {
    res.writeHead(404).end('Not found');
    return;
  }
  fs.readFile(path.join(__dirname, name), (error, body) => {
    if (error) {
      res.writeHead(500).end('Unable to read application asset');
      return;
    }
    res.writeHead(200, {
      'Content-Type': types[path.extname(name)],
      'Content-Length': body.length,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  });
});
server.on('error', error => {
  console.error('Could not start the local server: ' + error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log('Procurement Lab: http://127.0.0.1:' + server.address().port);
});
