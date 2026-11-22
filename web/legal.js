// Tiny Markdown renderer for the legal pages (headings, lists, tables, bold, code, links). Source of truth: legal/*.md
function renderLegal(src, id) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inl = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>')
    .replace(/(^|[\s(])(https?:\/\/[^\s)<]+)/g, '$1<a href="$2" rel="noopener">$2</a>');
  fetch(src).then((r) => r.text()).then((md) => {
    const out = []; let list = null, table = null;
    const close = () => { if (list) { out.push(`</${list}>`); list = null; } if (table) { out.push('</table>'); table = null; } };
    for (const line of md.split('\n')) {
      let m;
      if ((m = line.match(/^(#{1,4})\s+(.*)/))) { close(); out.push(`<h${m[1].length}>${inl(m[2])}</h${m[1].length}>`); }
      else if (/^\|/.test(line)) { if (list) { out.push(`</${list}>`); list = null; } if (/^\|[\s|:-]+\|$/.test(line)) continue;
        const cells = line.replace(/^\||\|$/g, '').split('|').map((c) => inl(c.trim()));
        if (!table) { table = 1; out.push('<table><tr>' + cells.map((c) => `<th>${c}</th>`).join('') + '</tr>'); } else out.push('<tr>' + cells.map((c) => `<td>${c}</td>`).join('') + '</tr>'); }
      else if ((m = line.match(/^\s*(?:[-*]|(\d+)\.)\s+(.*)/))) { const t = m[1] ? 'ol' : 'ul'; if (table) { out.push('</table>'); table = null; } if (list !== t) { if (list) out.push(`</${list}>`); out.push(`<${t}>`); list = t; } out.push(`<li>${inl(m[2])}</li>`); }
      else if (/^>\s?/.test(line)) { close(); out.push(`<blockquote>${inl(line.replace(/^>\s?/, ''))}</blockquote>`); }
      else if (!line.trim()) close();
      else { close(); out.push(`<p>${inl(line)}</p>`); }
    }
    close(); document.getElementById(id).innerHTML = out.join('\n');
  }).catch(() => { document.getElementById(id).innerHTML = `Could not load <a href="${src}">${src}</a>.`; });
}
