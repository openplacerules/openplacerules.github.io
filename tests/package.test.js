'use strict';
// The MCP package (packages/mcp) is built locally. Official registry publishing uses the OCI image in server.json.
const test = require('node:test'), assert = require('node:assert');
const { execFileSync, spawnSync } = require('child_process'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), pkgDir = path.join(root, 'packages', 'mcp');
test('MCP package builds, server.json is OCI, and the packed server answers over stdio', () => {
  execFileSync('node', [path.join(root, 'scripts/build_mcp_package.js')]);
  const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
  const srv = JSON.parse(fs.readFileSync(path.join(pkgDir, 'server.json'), 'utf8'));
  const rootPkg = require(path.join(root, 'package.json'));
  const df = fs.readFileSync(path.join(root, 'Dockerfile'), 'utf8');
  assert.strictEqual(pkg.name, '@openplacerules/mcp');
  assert.strictEqual(pkg.mcpName, srv.name);
  assert.strictEqual(srv.name, 'org.openplacerules/mcp');
  assert.strictEqual(srv.packages[0].registryType, 'oci');
  assert.strictEqual(srv.packages[0].identifier, `ghcr.io/openplacerules/mcp:${pkg.version}`);
  assert.strictEqual(srv.packages[0].transport.type, 'stdio');
  assert.ok(!srv.packages[0].version, 'OCI packages must not have a version field');
  assert.ok(!srv.packages[0].registryBaseUrl, 'OCI packages must not have registryBaseUrl');
  assert.match(df, /LABEL io\.modelcontextprotocol\.server\.name="org\.openplacerules\/mcp"/);
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
