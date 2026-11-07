'use strict';
const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const http = require('node:http');
const path = require('node:path');
const root = path.join(__dirname, '..');
let checks = 0;
const ok = (value, message) => { assert(value, message); checks++; };
const child = spawn(process.execPath, [path.join(root, 'server.cjs')], {
  cwd: root,
  env: {...process.env, PORT: '0'},
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true
});
let diagnostics = '';
child.stderr.on('data', data => { diagnostics += data.toString(); });
function request(port, route, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request({hostname: '127.0.0.1', port, path: route, method}, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', data => { body += data; });
      res.on('end', () => resolve({status: res.statusCode, headers: res.headers, body}));
    });
    req.on('error', reject);
    req.setTimeout(5000, () => req.destroy(new Error('Local HTTP check timed out')));
    req.end();
  });
}
async function main() {
  try {
    const port = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Local server did not start: ' + diagnostics)), 10000);
      let output = '';
      child.stdout.on('data', data => {
        output += data.toString();
        const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)/);
        if (match) { clearTimeout(timeout); resolve(Number(match[1])); }
      });
      child.once('error', error => { clearTimeout(timeout); reject(error); });
      child.once('exit', code => { clearTimeout(timeout); reject(new Error('Server exited before readiness: ' + code + ' ' + diagnostics)); });
    });
    const index = await request(port, '/');
    ok(index.status === 200 && index.body.includes('Apparel retailer procurement lab'), 'home page renders the simulator source');
    for (const asset of ['styles.css', 'engine.js', 'scenarios.js', 'behaviour.js', 'resolution.js', 'app.js', 'experience.js']) {
      const response = await request(port, '/' + asset);
      ok(response.status === 200 && response.body.length > 0, 'application asset is served: ' + asset);
    }
    for (const route of ['/README.md', '/package.json', '/.env', '/.git/config', '/tests/run.cjs', '/..%2fpackage.json']) {
      ok((await request(port, route)).status === 404, 'non-public file is not served: ' + route);
    }
    ok((await request(port, '/', 'POST')).status === 405, 'server has no upload endpoint');
    const head = await request(port, '/engine.js', 'HEAD');
    ok(head.status === 200 && head.body === '', 'HEAD returns headers without an asset body');
    ok(index.headers['set-cookie'] === undefined, 'server does not set cookies');
    console.log(JSON.stringify({passed: checks, status: 'Local server assets and file boundaries passed'}));
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      await new Promise(resolve => { child.once('exit', resolve); child.kill(); });
    }
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
