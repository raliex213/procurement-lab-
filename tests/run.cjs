'use strict';
const {spawnSync} = require('node:child_process');
const path = require('node:path');
const root = path.join(__dirname, '..');
const tests = ['test-engine.cjs', 'test-scenarios.cjs', 'test-behaviour.cjs', 'test-resolution.cjs', 'test-atelier-press.cjs', 'test-public-release.cjs', 'test-server.cjs'];
const scripts = ['engine.js', 'scenarios.js', 'behaviour.js', 'resolution.js', 'app.js', 'experience.js', 'server.cjs', 'tests/run.cjs', 'tests/helpers/legacy-run.cjs', ...tests.map(name => 'tests/' + name)];
for (const script of scripts) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, script)], {encoding: 'utf8', cwd: root});
  if (result.error || result.status !== 0) {
    console.error(result.stderr || String(result.error));
    process.exit(1);
  }
}
let total = 0;
for (const test of tests) {
  // A new process isolates the simulation modules modified by each extension.
  const result = spawnSync(process.execPath, [path.join(__dirname, test)], {encoding: 'utf8', cwd: root});
  if (result.error || result.status !== 0) {
    console.error('FAILED: ' + test + '\n' + (result.stderr || result.stdout || String(result.error)));
    process.exit(1);
  }
  const report = JSON.parse(result.stdout.trim().split(/\r?\n/).at(-1));
  total += report.passed;
  console.log(test + ': ' + report.passed + ' checks passed');
}
console.log('All ' + total + ' checks passed; ' + scripts.length + ' JavaScript files passed syntax checks.');
