// Shared helpers for the static growth pages (generator, sign, claim, submit). No dependencies, nothing is sent anywhere.
(function (g) {
  const ACTS = ['camera_glasses', 'recording', 'ai_capture', 'robots', 'drones'];
  const T = {
    en: { title: 'House rules for devices', camera_glasses: 'Camera glasses', recording: 'Recording / photos', ai_capture: 'AI capture', robots: 'Robots', drones: 'Drones',
      prohibited: 'Not allowed', restricted: 'Restricted', allowed: 'Allowed', scan: 'Scan for the rules and sources. Devices and AI agents can read them too.' },
    th: { title: 'กฎการใช้อุปกรณ์ในสถานที่', camera_glasses: 'แว่นตาที่มีกล้อง', recording: 'การถ่ายภาพ / วิดีโอ', ai_capture: 'การบันทึกเพื่อส่งให้ AI', robots: 'หุ่นยนต์', drones: 'โดรน',
      prohibited: 'ไม่อนุญาต', restricted: 'อนุญาตแบบมีเงื่อนไข', allowed: 'อนุญาต', scan: 'สแกนเพื่อดูกฎและแหล่งที่มา' },
    nl: { title: 'Huisregels voor apparaten', camera_glasses: 'Camerabrillen', recording: "Opnemen / foto's", ai_capture: 'AI-opname', robots: "Robots", drones: 'Drones',
      prohibited: 'Niet toegestaan', restricted: 'Beperkt', allowed: 'Toegestaan', scan: 'Scan voor de regels en bronnen.' },
  };
  const ICON = { camera_glasses: '👓', recording: '📷', ai_capture: '🧠', robots: '🤖', drones: '🛸' };
  const COLOR = { prohibited: '#c0392b', restricted: '#b9770e', allowed: '#1e8449' };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cleanDomain = (d) => String(d || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/[/?#].*$/, '').replace(/\.$/, '');
  const validDomain = (d) => /^(?=.{3,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(d);
  function qrSvg(text, cell) { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: cell || 4, margin: 2 }); }
  function download(name, text, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type || 'application/json' })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); }
  // rules <-> compact URL param "camera_glasses:prohibited,drones:prohibited"
  const rulesToParam = (r) => Object.entries(r).map(([k, v]) => k + ':' + v).join(',');
  const paramToRules = (s) => { const r = {}; String(s || '').split(',').forEach((p) => { const [k, v] = p.split(':'); if (ACTS.includes(k) && COLOR[v]) r[k] = v; }); return r; };
  g.OPR = { ACTS, T, ICON, COLOR, esc, cleanDomain, validDomain, qrSvg, download, rulesToParam, paramToRules, SITE: g.OPR_SITE || location.origin, REPO: g.OPR_REPO || '' };
})(window);
