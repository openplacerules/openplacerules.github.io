const test = require('node:test');
const assert = require('node:assert');
const { spawn } = require('child_process');
const path = require('path');
const { tempData } = require('./helpers');

test('MCP stdio server: initialize, list tools, call tools', async () => {
  const dir = tempData();
  const p = spawn(process.execPath, [path.join(__dirname, '..', 'mcp-server.js')], { env: { ...process.env, PLACE_RULES_DATA: dir } });
  const lines = []; let buf = '';
  p.stdout.on('data', (d) => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { lines.push(JSON.parse(buf.slice(0, i))); buf = buf.slice(i + 1); } });
  const send = (m) => p.stdin.write(JSON.stringify(m) + '\n');
  send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '0' } } });
  send({ jsonrpc: '2.0', method: 'notifications/initialized' });
  send({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
  send({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'check_place_rules', arguments: { lat: 35.684, lng: 139.751, activity: 'drones' } } });
  send({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'search_place_rules', arguments: { q: 'national park', country: 'TH' } } });
  send({ jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'validate_place_rules_file', arguments: { document: { spec: 'x' } } } });
  send({ jsonrpc: '2.0', id: 6, method: 'tools/call', params: { name: 'check_place_rules', arguments: { lat: 'bad', lng: 0 } } });
  send({ jsonrpc: '2.0', id: 7, method: 'nope' });
  await new Promise((r) => { const t = setInterval(() => { if (lines.length >= 7) { clearInterval(t); r(); } }, 20); });
  p.kill();
  const by = Object.fromEntries(lines.map((l) => [l.id, l]));
  assert.equal(by[1].result.serverInfo.name, 'openplacerules');
  assert.deepEqual(by[2].result.tools.map((t) => t.name).sort(), ['check_place_rules', 'get_place_rule', 'search_place_rules', 'validate_place_rules_file']);
  const chk = JSON.parse(by[3].result.content[0].text); assert.equal(chk.answer, 'prohibited'); // Imperial Palace Drone Act zone
  assert.ok(JSON.parse(by[4].result.content[0].text).count >= 5);
  assert.equal(JSON.parse(by[5].result.content[0].text).valid, false);
  assert.equal(by[6].result.isError, true);
  assert.equal(by[7].error.code, -32601);
});
