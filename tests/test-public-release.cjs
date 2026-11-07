'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const assets = ['index.html', 'styles.css', 'engine.js', 'scenarios.js', 'behaviour.js', 'resolution.js', 'app.js', 'experience.js'];
let checks = 0;
const ok = (condition, message) => { assert(condition, message); checks++; };
for (const name of assets) {
  const text = fs.readFileSync(path.join(root, name), 'utf8');
  ok(!/\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB)\b|document\.cookie/.test(text), name + ': no application network/storage APIs');
  ok(!/appg(?:prj|ver|dep)_|chatgpt\.site|[A-Z]:[\\/]Users[\\/]|\/Users\/|\/home\//i.test(text), name + ': no original hosting identifiers or local user paths');
  ok(!/BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|gh[pousr]_[A-Za-z0-9]{16,}|sk-[A-Za-z0-9_-]{20,}/.test(text), name + ': no credential pattern');
  ok(!/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text), name + ': no email address');
}
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const match of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)) ok(assets.includes(match[1]), 'script stays inside the public assets');
ok(!/<(?:iframe|object|embed)\b/i.test(html), 'no embedded external page');
console.log(JSON.stringify({passed: checks, status: 'Public release boundaries verified'}));
