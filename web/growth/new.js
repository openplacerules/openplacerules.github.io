// R1: place-rules.json generator. Builds a spec-valid file in the browser, validates it with the same validator the registry uses.
(function () {
  const { ACTS, esc, cleanDomain, validDomain, download, rulesToParam, SITE } = OPR;
  const $ = (id) => document.getElementById(id);
  const PRESETS = {
    cafe: { rules: { camera_glasses: 'restricted', recording: 'restricted', ai_capture: 'prohibited', drones: 'prohibited' },
      conditions: 'Photos of your own table are fine. Do not record staff or other guests without consent.', exceptions: '' },
    nl_ap: { rules: { camera_glasses: 'prohibited' },
      conditions: 'Iedereen moet zich in onze gebouwen en op onze terreinen vrij en veilig kunnen voelen, zonder het risico ongemerkt te worden gefilmd of opgenomen. Daarom is het dragen en/of gebruik van camerabrillen en andere apparatuur waarmee ongemerkt beeld- of geluidsopnamen kunnen worden gemaakt, bij ons niet toegestaan. U mag geen camerabril of vergelijkbare verborgen opnameapparatuur dragen of gebruiken om beeld of geluid op te nemen.',
      exceptions: 'Gebruikt u een slimme bril vanwege een beperking? Sommige mensen gebruiken slimme brillen als hulpmiddel, bijvoorbeeld om teksten te lezen, voorwerpen te herkennen of zich zelfstandig te verplaatsen. Bespreek zo mogelijk met een medewerker hoe u uw hulpmiddel kunt blijven gebruiken, met respect voor de privacy van anderen. U hoeft daarvoor geen medische gegevens te verstrekken.' },
    gym: { rules: { camera_glasses: 'prohibited', recording: 'restricted', ai_capture: 'prohibited' },
      conditions: 'Recording only of yourself, never in changing rooms; no other members in frame without consent.', exceptions: 'Prescription glasses without a camera are fine.' },
    temple: { rules: { camera_glasses: 'restricted', recording: 'restricted', drones: 'prohibited' },
      conditions: 'Personal photos in outer areas only; no photos inside the ordination hall. ถ่ายภาพส่วนตัวได้เฉพาะบริเวณด้านนอก ห้ามถ่ายภาพภายในอุโบสถ (Thai wording: needs native review.)', exceptions: '' },
    event: { rules: { camera_glasses: 'prohibited', recording: 'restricted', ai_capture: 'prohibited' },
      conditions: 'No camera glasses during the event. Official photographers wear lanyards; ask before photographing other attendees.', exceptions: 'Assistive devices: tell the registration desk.', temporary: true },
    school: { rules: { camera_glasses: 'prohibited', recording: 'prohibited', ai_capture: 'prohibited', drones: 'prohibited', robots: 'prohibited' },
      conditions: 'No recording devices on school grounds during school hours.', exceptions: 'Approved accessibility devices.' },
  };
  function build() {
    const dom = cleanDomain($('dom').value), r = {};
    ACTS.forEach((a) => { const v = $('r_' + a).value; if (v) r[a] = v; });
    const doc = { spec: 'place-rules/0.1', updated: new Date().toISOString().replace(/\.\d+Z$/, '+00:00'), place: { name: $('name').value.trim() || 'Unnamed place' }, rules: r };
    if (dom && validDomain(dom)) doc.place.url = 'https://' + dom;
    if ($('addr').value.trim()) doc.place.address = $('addr').value.trim();
    const lat = parseFloat($('lat').value), lng = parseFloat($('lng').value), rad = parseFloat($('rad').value);
    if (Number.isFinite(lat) && Number.isFinite(lng)) doc.place.geometry = { type: 'circle', center: [lat, lng], radius_m: Number.isFinite(rad) && rad > 0 ? rad : 50 };
    if ($('tz').value.trim()) doc.place.timezone = $('tz').value.trim();
    if ($('exp').value) doc.expires = new Date($('exp').value + 'T23:59:59').toISOString().replace(/\.\d+Z$/, '+00:00');
    if ($('cond').value.trim()) doc.conditions = $('cond').value.trim();
    if ($('exc').value.trim()) doc.exceptions = $('exc').value.trim().slice(0, 500);
    const c = {}; if ($('email').value.trim()) c.email = $('email').value.trim(); if ($('curl').value.trim()) c.url = $('curl').value.trim();
    if (Object.keys(c).length) doc.contact = c;
    if ($('src').value.trim()) doc.source = $('src').value.trim();
    return { doc, dom };
  }
  function render() {
    const { doc, dom } = build(), text = JSON.stringify(doc, null, 2);
    $('out').textContent = text;
    const errs = (window.PlaceRulesValidate ? PlaceRulesValidate(doc).errors : []) || [];
    if (!Object.keys(doc.rules).length) errs.unshift('rules: choose at least one activity');
    if ($('dom').value && !validDomain(dom)) errs.unshift('domain: "' + dom + '" does not look like a domain (example: mycafe.co.th)');
    $('status').innerHTML = errs.length ? '<span style="color:#c0392b">✗ ' + errs.map(esc).join('<br>✗ ') + '</span>' : '<span style="color:#1e8449">✓ Valid place-rules/0.1 file</span>';
    $('where').textContent = dom && validDomain(dom) ? 'https://' + dom + '/.well-known/place-rules.json' : 'https://YOUR-DOMAIN/.well-known/place-rules.json';
    const signUrl = 'sign.html?name=' + encodeURIComponent(doc.place.name) + '&r=' + encodeURIComponent(rulesToParam(doc.rules)) + (dom ? '&dom=' + encodeURIComponent(dom) : '') + '&lang=' + $('lang').value + (doc.exceptions ? '&note=' + encodeURIComponent(doc.exceptions.slice(0, 140)) : '');
    $('signlink').href = signUrl;
    $('badge').textContent = '<a href="' + SITE + '/check.html' + (doc.place.geometry ? '?lat=' + doc.place.geometry.center[0] + '&lng=' + doc.place.geometry.center[1] : '') + '"><img src="' + SITE + '/badge/published.svg" alt="This place publishes its device rules (OpenPlaceRules)"></a>';
    $('dl').disabled = !!errs.length;
  }
  $('preset').onchange = () => {
    const p = PRESETS[$('preset').value]; if (!p) return;
    ACTS.forEach((a) => ($('r_' + a).value = p.rules[a] || '')); $('cond').value = p.conditions; $('exc').value = p.exceptions;
    if (p.temporary && !$('exp').value) { const d = new Date(Date.now() + 3 * 864e5); $('exp').value = d.toISOString().slice(0, 10); }
    if ($('preset').value === 'nl_ap') $('lang').value = 'nl'; if ($('preset').value === 'temple') { $('lang').value = 'th'; if (!$('tz').value) $('tz').value = 'Asia/Bangkok'; }
    render();
  };
  $('me').onclick = () => navigator.geolocation && navigator.geolocation.getCurrentPosition((p) => { $('lat').value = p.coords.latitude.toFixed(5); $('lng').value = p.coords.longitude.toFixed(5); render(); });
  $('dl').onclick = () => download('place-rules.json', JSON.stringify(build().doc, null, 2) + '\n');
  document.querySelectorAll('input,select,textarea').forEach((el) => (el.oninput = el.onchange = el.onchange || render));
  try { $('tz').placeholder = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}
  const P = new URLSearchParams(location.search); if (P.get('preset') && PRESETS[P.get('preset')]) { $('preset').value = P.get('preset'); $('preset').onchange(); } else render();
})();
