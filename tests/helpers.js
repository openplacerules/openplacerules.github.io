const fs = require('fs');
const os = require('os');
const path = require('path');
// Fresh temp data dir with a copy of the real seed, so tests never touch ./data.
function tempData() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'place-rules-test-'));
  fs.copyFileSync(path.join(__dirname, '..', 'data', 'seed.json'), path.join(d, 'seed.json'));
  process.env.PLACE_RULES_DATA = d;
  return d;
}
module.exports = { tempData };
