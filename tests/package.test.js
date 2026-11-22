'use strict';
// The npm package for the MCP server (packages/mcp) is built locally and must match the MCP registry server.json. Not published.
const test = require('node:test'), assert = require('node:assert');
const { execFileSync, spawnSync } = require('child_process'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), pkgDir = path.join(root, 'packages', 'mcp');
test('MCP npm package builds, matches server.json, and answers over stdio', () => {
  execFileSync('node', [path.join(root, 'scripts/build_mcp_package.js')]);
  const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
  const srv = JSON.parse(fs.readFileSync(path.join(pkgDir, 'server.json'), 'utf8'));
  const rootPkg = require(path.join(root, 'package.json'));
  assert.strictEqual(pkg.name, '@openplacerules/mcp');
  assert.strictEqual(pkg.mcpName, srv.name);                 // registry ownership check for npm
  assert.strictEqual(srv.packages[0].identifier, pkg.name);
  assert.strictEqual(srv.packages[0].version, pkg.version);
  assert.strictEqual(srv.version, pkg.version);
  assert.strictEqual(pkg.version, rootPkg.version);
  assert.ok(srv.description.length <= 100);                   // registry schema limit
  assert.match(fs.readFileSync(path.join(pkgDir, 'mcp-server.js'), 'utf8'), /^#!\/usr\/bin\/env node/);
  for (const f of pkg.files) assert.ok(fs.existsSync(path.join(pkgDir, f)), f);
  const input = ['{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}',
    '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"check_place_rules","arguments":{"lat":13.69,"lng":100.75,"activity":"drones"}}}'].join('\n') + '\n';
  const r = spawnSync(process.execPath, [path.join(pkgDir, 'mcp-server.js')], { input, encoding: 'utf8', timeout: 10000, env: { ...process.env, PLACE_RULES_DATA: '', PLACE_RULES_OFFLINE: '1' } });
  const msgs = r.stdout.trim().split('\n').map((l) => JSON.parse(l));
  assert.strictEqual(msgs[0].result.serverInfo.name, 'openplacerules');
  assert.strictEqual(msgs[0].result.serverInfo.version, pkg.version);
  assert.strictEqual(JSON.parse(msgs[1].result.content[0].text).answer, 'prohibited');
});
