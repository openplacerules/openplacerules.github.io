// R4 (static edition): report a rule you saw. Builds a moderated report (same fields as POST /api/submissions) and hands it over
// as a pre-filled GitHub issue or copyable text. Nothing is published until a maintainer checks the source.
(function () {
  const { ACTS, esc, REPO } = OPR;
  const $ = (id) => document.getElementById(id);
  function build() {
    const r = {}; ACTS.forEach((a) => { const v = $('r_' + a).value; if (v) r[a] = v; });
    return { name: $('name').value.trim(), country: $('country').value.trim().toUpperCase(), lat: parseFloat($('lat').value) || null, lng: parseFloat($('lng').value) || null,
      rules: r, summary: $('summary').value.trim(), source_url: $('src').value.trim(), reported_by: $('by').value.trim() || undefined };
  }
  function render() {
    const s = build(), errs = [];
    if (!s.name) errs.push('name is required');
    if (!/^[A-Z]{2}$/.test(s.country)) errs.push('country must be a 2-letter code (TH, JP, GB…)');
    if (!Object.keys(s.rules).length) errs.push('choose at least one rule');
    if (!/^https?:\/\/\S+\.\S+/.test(s.source_url)) errs.push('a public source URL is required (policy page, notice, law, news report)');
    $('status').innerHTML = errs.length ? '<span style="color:#c0392b">✗ ' + errs.map(esc).join('<br>✗ ') + '</span>' : '<span style="color:#1e8449">✓ Ready to send for review</span>';
    const body = 'Reported rule (moderated; not published until the source is checked)\n\n```json\n' + JSON.stringify(s, null, 2) + '\n```';
    $('send').innerHTML = errs.length ? '' : (REPO ? '<a class="btn" href="' + esc(REPO) + '/issues/new?labels=report&title=' + encodeURIComponent('Report: ' + s.name) + '&body=' + encodeURIComponent(body) + '">Send report (GitHub issue)</a>' : '') + '<button class="btn alt" id="copy">Copy report</button>';
    const c = $('copy'); if (c) c.onclick = () => navigator.clipboard && navigator.clipboard.writeText(body);
  }
  document.querySelectorAll('input,select,textarea').forEach((el) => (el.oninput = el.onchange = render));
  render();
})();
