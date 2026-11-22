// R2: printable door sign (A4 / A5 / sticker), English, Thai or Dutch, QR back to the place page or the venue's own file.
(function () {
  const { ACTS, T, ICON, COLOR, esc, cleanDomain, qrSvg, paramToRules, SITE } = OPR;
  const $ = (id) => document.getElementById(id), P = new URLSearchParams(location.search);
  let target = '';
  function rules() { const r = {}; ACTS.forEach((a) => { const v = $('r_' + a).value; if (v) r[a] = v; }); return r; }
  function render() {
    const r = rules(), lang = $('lang').value, langs = lang === 'en' ? ['en'] : ['en', lang], size = $('size').value;
    const dom = cleanDomain($('dom').value);
    const url = target || (dom ? 'https://' + dom + '/.well-known/place-rules.json' : SITE + '/new/');
    document.body.dataset.size = size;
    const line = (k) => langs.map((l, i) => i ? '<small>' + esc(T[l][k]) + '</small>' : esc(T[l][k])).join('<br>');
    $('sign').innerHTML = '<div class="sh">' + esc($('name').value) + '</div><div class="st">' + line('title') + '</div>' +
      Object.keys(r).map((a) => '<div class="sr"><span class="si">' + ICON[a] + '</span><span class="sl">' + line(a) + '</span><span class="sv" style="background:' + COLOR[r[a]] + '">' + line(r[a]) + '</span></div>').join('') +
      ($('note').value ? '<p class="sn">' + esc($('note').value) + '</p>' : '') +
      '<div class="sq">' + qrSvg(url, size === 'sticker' ? 3 : 4) + '<div>' + langs.map((l) => esc(T[l].scan)).join('<br>') + '<br><b>OpenPlaceRules</b> · ' + esc(url.replace(/^https:\/\//, '')) + '</div></div>';
    let banner = $('review-note');
    if (!banner) {
      banner = document.createElement('p');
      banner.id = 'review-note';
      banner.className = 'muted noprint';
      $('sign').parentNode.insertBefore(banner, $('sign'));
    }
    if (lang === 'th' || lang === 'nl') {
      const label = lang === 'th' ? 'Thai' : 'Dutch';
      banner.hidden = false;
      banner.innerHTML = label + ' wording on this sign is ours and <strong>needs native review</strong> before you print many copies or treat it as official.';
    } else {
      banner.hidden = true;
      banner.textContent = '';
    }
  }
  document.querySelectorAll('input,select').forEach((el) => (el.oninput = el.onchange = render));
  $('print').onclick = () => print();
  if (P.get('name')) $('name').value = P.get('name');
  if (P.get('dom')) $('dom').value = P.get('dom');
  if (P.get('note')) $('note').value = P.get('note');
  if (P.get('lang') && T[P.get('lang')]) $('lang').value = P.get('lang');
  if (P.get('r')) { const r = paramToRules(P.get('r')); ACTS.forEach((a) => ($('r_' + a).value = r[a] || '')); }
  if (P.get('id')) fetch('data/seed.json').then((x) => x.json()).then((d) => {
    const e = d.entries.find((x) => x.id === P.get('id')); if (!e) return render();
    target = SITE + '/p/' + e.id + '/'; $('name').value = e.name; ACTS.forEach((a) => ($('r_' + a).value = e.rules[a] || ''));
    if (e.country === 'TH') $('lang').value = 'th'; if (e.country === 'NL') $('lang').value = 'nl'; render();
  }); else { if (!P.get('r')) { $('r_camera_glasses').value = 'prohibited'; $('r_recording').value = 'restricted'; } render(); }
})();
