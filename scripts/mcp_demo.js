#!/usr/bin/env node
// Demo: an AI agent talks to the place-rules MCP server over stdio (JSON-RPC 2.0, newline-delimited),
// exactly as an MCP client (Claude Desktop, Cursor, an agent framework...) would. The "agent" logic here is a
// fixed script so the demo is reproducible; a real agent would choose the tool calls itself.
// Usage: node scripts/mcp_demo.js [--date YYYY-MM-DD] [--out mcp-demo-transcript.md]
'use strict';
const { spawn } = require('child_process'), path = require('path'), fs = require('fs');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const DATE = arg('--date', '2026-11-21'), OUT = arg('--out', null);
const srv = spawn(process.execPath, [path.join(__dirname, '..', 'mcp-server.js')], { stdio: ['pipe', 'pipe', 'inherit'] });
let buf = '', nextId = 1; const waiting = new Map(), log = [];
srv.stdout.on('data', (d) => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { const line = buf.slice(0, i); buf = buf.slice(i + 1); if (!line.trim()) continue; const m = JSON.parse(line); if (waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); } } });
const send = (method, params) => new Promise((res) => { const id = nextId++; waiting.set(id, res); const msg = { jsonrpc: '2.0', id, method, params }; log.push(['→', msg]); srv.stdin.write(JSON.stringify(msg) + '\n'); }).then((m) => { log.push(['←', m]); return m; });
const notify = (method) => { const msg = { jsonrpc: '2.0', method }; log.push(['→', msg]); srv.stdin.write(JSON.stringify(msg) + '\n'); };
const call = async (name, args) => JSON.parse((await send('tools/call', { name, arguments: args })).result.content[0].text);

(async () => {
  const say = []; const user = "I'm visiting Bangkok next week with my Ray-Ban Meta glasses and a small DJI drone. Can I film inside the Grand Palace, and can I fly the drone near Suvarnabhumi Airport? Also, any smart-glasses rules I should know about elsewhere in Thailand?";
  const init = await send('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'demo-agent', version: '1.0' } });
  notify('notifications/initialized');
  const tools = (await send('tools/list', {})).result.tools.map((t) => t.name);
  const gp = await call('check_place_rules', { lat: 13.7500, lng: 100.4913, activity: 'recording', date: DATE });
  const gpg = await call('check_place_rules', { lat: 13.7500, lng: 100.4913, activity: 'camera_glasses', date: DATE });
  const bkk = await call('check_place_rules', { lat: 13.70, lng: 100.72, activity: 'drones', date: DATE });
  const th = await call('search_place_rules', { country: 'TH', activity: 'camera_glasses', limit: 10 });
  srv.stdin.end();
  const top = (r) => (r.matches || []).filter((m) => m.decides !== false).slice(0, 2).map((m) => `${m.name} (${m.source && m.source.publisher})`).join('; ');
  say.push(`Grand Palace, recording: **${gp.answer}**. ${gp.explanation || ''}`);
  say.push(`Grand Palace, camera glasses specifically: **${gpg.answer}**${gpg.answer === 'unknown' ? ' (no rule found; this does not mean allowed)' : ''}.`);
  say.push(`Near Suvarnabhumi, drones: **${bkk.answer}**. ${bkk.explanation || ''}`);
  say.push(`Thailand entries mentioning camera glasses: ${th.count ?? (th.entries || []).length}${(th.entries || []).length ? ' — ' + th.entries.map((e) => e.name).join('; ') : ''}.`);
  const md = [`# MCP demo transcript (generated ${new Date().toISOString().slice(0, 10)}, check date ${DATE})`, '',
    `Server: \`node mcp-server.js\` (stdio). Client: scripted demo agent (\`node scripts/mcp_demo.js\`). Tools offered: ${tools.join(', ')}.`, '',
    `**User:** ${user}`, '', '## Agent → MCP server traffic', '',
    ...log.map(([dir, m]) => '```json\n' + `// ${dir === '→' ? 'agent → server' : 'server → agent'}\n` + JSON.stringify(m, null, 1).slice(0, 1800) + (JSON.stringify(m, null, 1).length > 1800 ? '\n… (truncated)' : '') + '\n```'),
    '', '## Agent answer (composed from the tool results)', '', ...say.map((s) => '- ' + s), '',
    '_Every answer above links back to its sources in the tool results. Reported entries are unverified by the place owner; this is not legal advice._'].join('\n');
  if (OUT) { fs.writeFileSync(OUT, md); console.log('wrote', OUT); } else console.log(md);
})();
