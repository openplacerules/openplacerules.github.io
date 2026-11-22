#!/usr/bin/env node
// Builds the publishable npm package for the MCP server into packages/mcp/ (NOT published).
// Contents: mcp-server.js (bin), the four lib files it needs, the seed data snapshot, licences, README with the registry name.
// Publish later (needs approval + npm account/org):  cd packages/mcp && npm publish --access public
'use strict';
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const out = path.join(root, 'packages', 'mcp');
const rootPkg = require(path.join(root, 'package.json'));
const VERSION = rootPkg.version;
const MCP_NAME = 'org.openplacerules/mcp';
// Keep the hand-written server.json and PUBLISH.md in this directory; regenerate everything else.
for (const f of fs.existsSync(out) ? fs.readdirSync(out) : []) if (!['server.json', 'PUBLISH.md'].includes(f)) fs.rmSync(path.join(out, f), { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const cp = (from, to = from) => { fs.mkdirSync(path.dirname(path.join(out, to)), { recursive: true }); fs.copyFileSync(path.join(root, from), path.join(out, to)); };
cp('mcp-server.js');
for (const f of ['core.js', 'registry.js', 'store.js', 'validate.js']) cp(`lib/${f}`);
cp('data/seed.json'); cp('data/ATTRIBUTION.md');
cp('LICENSE'); for (const f of fs.readdirSync(path.join(root, 'licenses'))) cp(`licenses/${f}`);
fs.chmodSync(path.join(out, 'mcp-server.js'), 0o755);
const seed = JSON.parse(fs.readFileSync(path.join(root, 'data/seed.json'), 'utf8'));
const pkg = {
  name: '@openplacerules/mcp',
  version: VERSION,
  description: 'MCP server for OpenPlaceRules: ask whether camera glasses, recording, AI capture, robots or drones are allowed at a place, with sources.',
  mcpName: MCP_NAME,
  keywords: ['mcp', 'model-context-protocol', 'smart-glasses', 'drones', 'robots', 'privacy', 'place-rules', 'openplacerules'],
  homepage: 'https://openplacerules.org',
  author: 'The OpenPlaceRules contributors',
  license: '(MIT AND ODbL-1.0)',
  bin: { 'openplacerules-mcp': 'mcp-server.js' },
  main: 'mcp-server.js',
  files: ['mcp-server.js', 'lib/', 'data/seed.json', 'data/ATTRIBUTION.md', 'LICENSE', 'licenses/', 'README.md'],
  engines: { node: '>=20' },
  publishConfig: { access: 'public' },
};
fs.writeFileSync(path.join(out, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
fs.writeFileSync(path.join(out, 'README.md'), `# @openplacerules/mcp

<!-- mcp-name: ${MCP_NAME} -->

MCP server (stdio, zero dependencies) for [OpenPlaceRules](https://openplacerules.org), the open registry of rules for
camera glasses, recording, AI capture, robots and drones. Agents call it before they capture or move.

\`\`\`json
{ "mcpServers": { "openplacerules": { "command": "npx", "args": ["-y", "@openplacerules/mcp"] } } }
\`\`\`

Tools:
- \`check_place_rules(lat, lng, activity, date?)\` returns allowed | restricted | prohibited | unknown, with sources. Unknown never means allowed.
- \`search_place_rules(q, activity, value, country, verified, limit)\`
- \`get_place_rule(id)\`
- \`validate_place_rules_file(document)\` validates a \`/.well-known/place-rules.json\` file (spec place-rules/0.1).

By default the server fetches the live registry at https://openplacerules.org/data/seed.json. A snapshot is also
bundled at build time (${seed.entries.length} entries, dataset ${seed.version}) and is used if the live fetch fails, or
when you set \`PLACE_RULES_OFFLINE=1\`. Set \`PLACE_RULES_DATA=/path/to/dir\` to use your own data directory (containing seed.json).

Each entry links to its public source and is "reported, unverified by owner" unless the place verified it. This is information, not legal advice.

This package is not yet published to the npm registry. Until it is, run the server from the public repo with
\`npx -y github:openplacerules/openplacerules.github.io\` or \`git clone\` and \`node mcp-server.js\`.

Licences: code MIT; data ODbL-1.0 (see data/ATTRIBUTION.md; boundaries © OpenStreetMap contributors).
`);
console.log(`npm package: ${out} (${pkg.name}@${pkg.version}, mcpName ${MCP_NAME}, ${seed.entries.length} entries)`);
