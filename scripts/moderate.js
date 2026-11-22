#!/usr/bin/env node
// Moderation CLI for community submissions. Usage:
//   node scripts/moderate.js list [pending|approved|rejected|all]
//   node scripts/moderate.js approve <id> [note]    node scripts/moderate.js reject <id> [note]
const store = require('../lib/store');
const [cmd = 'list', a, ...rest] = process.argv.slice(2);
if (cmd === 'list') {
  const which = a || 'pending';
  const list = store.listSubmissions().filter((s) => which === 'all' || s.status === which);
  if (!list.length) console.log(`no ${which} submissions`);
  for (const s of list) console.log(`${s.id} [${s.status}] ${s.name} — ${JSON.stringify(s.rules)}\n   ${s.summary}\n   source: ${s.source_url}  submitted ${s.submitted}\n`);
} else if (cmd === 'approve' || cmd === 'reject') {
  const s = store.setSubmissionStatus(a, cmd === 'approve' ? 'approved' : 'rejected', rest.join(' '));
  console.log(s ? `${s.id} -> ${s.status}` : 'not found'); if (!s) process.exit(1);
} else { console.error('unknown command'); process.exit(1); }
