// R4 (static edition): claim a place without a hosted API. Generates a token, checks DNS (DNS-over-HTTPS) and the well-known file
// from the browser where CORS allows, then hands the owner a pre-filled claim (GitHub issue or e-mail) for a maintainer to confirm.
(function () {
  const { esc, cleanDomain, validDomain, REPO } = OPR;
  const $ = (id) => document.getElementById(id);
  const key = (d) => 'opr-token-' + d;
  function token(d) { let t = localStorage.getItem(key(d)); if (!t) { const b = new Uint8Array(12); crypto.getRandomValues(b); t = 'opr-' + Array.from(b, (x) => x.toString(16).padStart(2, '0')).join(''); localStorage.setItem(key(d), t); } return t; }
  function show() {
    const d = cleanDomain($('dom').value);
    if (!validDomain(d)) { $('steps').style.display = 'none'; return; }
    const t = token(d); $('steps').style.display = 'block';
    document.querySelectorAll('.d').forEach((el) => (el.textContent = d)); document.querySelectorAll('.t').forEach((el) => (el.textContent = t));
  }
  async function check() {
    const d = cleanDomain($('dom').value), t = token(d), out = [];
    try {
      const r = await fetch('https://cloudflare-dns.com/dns-query?name=_place-rules.' + encodeURIComponent(d) + '&type=TXT', { headers: { accept: 'application/dns-json' } });
      const j = await r.json(); const txt = (j.Answer || []).map((a) => String(a.data).replace(/"/g, ''));
      out.push(txt.some((x) => x.includes('place-rules-verification=' + t)) ? '✓ DNS TXT record found' : '✗ DNS: no matching TXT record at _place-rules.' + d + ' yet (DNS can take a while)');
    } catch (e) { out.push('? DNS check unavailable from this browser'); }
    let file = null;
    try {
      const r = await fetch('https://' + d + '/.well-known/place-rules.json', { cache: 'no-store' });
      file = await r.json();
      const v = window.PlaceRulesValidate ? PlaceRulesValidate(file) : { valid: true, errors: [] };
      out.push(v.valid ? '✓ place-rules.json found and valid' : '✗ place-rules.json found but invalid: ' + v.errors.slice(0, 3).join('; '));
      if (file.verification && file.verification.token === t) out.push('✓ token found in the file');
    } catch (e) { out.push('? Could not read https://' + d + '/.well-known/place-rules.json from the browser (missing, or the server does not send CORS headers). A maintainer will check it server-side.'); }
    $('result').innerHTML = out.map(esc).join('<br>');
    const body = 'Domain: ' + d + '\nToken: ' + t + '\nPlace / registry entry (optional): ' + ($('entry').value || '') + '\nBrowser check:\n- ' + out.join('\n- ') + '\n\nI confirm I am authorised to publish house rules for this place.';
    const title = 'Claim: ' + d;
    $('send').innerHTML = (REPO ? '<a class="btn" href="' + esc(REPO) + '/issues/new?labels=claim&title=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body) + '">Send claim (GitHub issue)</a>' : '') +
      '<button class="btn alt" id="copy">Copy claim text</button>';
    $('copy').onclick = () => navigator.clipboard && navigator.clipboard.writeText(title + '\n\n' + body);
  }
  $('dom').oninput = show; $('go').onclick = check;
  const P = new URLSearchParams(location.search); if (P.get('domain')) $('dom').value = P.get('domain'); if (P.get('id')) $('entry').value = P.get('id'); show();
})();
