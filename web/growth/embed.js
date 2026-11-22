/* OpenPlaceRules embed (R5). Usage:
   <div data-openplacerules data-lat="13.7500" data-lng="100.4913" data-activity="camera_glasses"></div>
   or <div data-openplacerules data-id="registry-entry-id"></div>
   <script async src="https://openplacerules.github.io/embed.js"></script>
   Inserts a small iframe (no cookies, no tracking) that runs the check in the reader's browser and links back. */
(function () {
  var s = document.currentScript, base = (s && s.src ? s.src.replace(/embed\.js(\?.*)?$/, '') : 'https://openplacerules.github.io/');
  function mount(el) {
    if (el.getAttribute('data-opr-mounted')) return; el.setAttribute('data-opr-mounted', '1');
    var q = [], id = el.getAttribute('data-id');
    if (id) q.push('id=' + encodeURIComponent(id));
    ['lat', 'lng', 'activity'].forEach(function (k) { var v = el.getAttribute('data-' + k); if (v) q.push((k === 'activity' ? 'a' : k) + '=' + encodeURIComponent(v)); });
    var f = document.createElement('iframe');
    f.src = base + 'embed.html?' + q.join('&'); f.title = 'OpenPlaceRules: rules at this place'; f.loading = 'lazy';
    f.style.cssText = 'border:1px solid #ddd;border-radius:10px;width:100%;max-width:420px;height:' + (el.getAttribute('data-height') || '170') + 'px';
    el.appendChild(f);
  }
  function run() { var els = document.querySelectorAll('[data-openplacerules]'); for (var i = 0; i < els.length; i++) mount(els[i]); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
