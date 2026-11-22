# Custom domain: openplacerules.org

The public site is served at [https://openplacerules.org](https://openplacerules.org) (GitHub Pages, Actions workflow in `.github/workflows/pages.yml`). [https://openplacerules.github.io](https://openplacerules.github.io) redirects there. `openplacerules.com` 301s to `https://openplacerules.org` at the registrar (GitHub Pages serves one custom domain per site).

`.github/workflows/pages.yml` sets `SITE_URL` to `https://openplacerules.org` and `WRITE_CNAME` to `"1"`. Set the Pages custom domain to `openplacerules.org` (via Settings or `gh api -X PUT repos/openplacerules/openplacerules.github.io/pages -f cname=openplacerules.org`). If GitHub shows a verification TXT record (`_github-pages-challenge-openplacerules`), add it at the registrar. After DNS resolves and GitHub issues the certificate, tick **Enforce HTTPS** (or `gh api -X PUT repos/openplacerules/openplacerules.github.io/pages -F https_enforced=true`). www redirects to the apex automatically.

DNS at the registrar for **openplacerules.org**:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | `openplacerules.github.io` |

Remove any default parking A/CNAME records the registrar adds, and don't use wildcard records.

User-facing URLs use the custom domain:

- `TERMS_URL` in `lib/core.js` is `https://openplacerules.org/terms.html`.
- Example and fallback origin in `web/growth/embed.js`.
- `websiteUrl` / homepage fields in `packages/mcp/server.json` and `scripts/build_mcp_package.js`.
- Schema `$id` in `spec/place-rules.schema.json` is `https://openplacerules.org/spec/place-rules.schema.json`.

Public contact is **hello@openplacerules.org** (mailbox forwarding is in place) and the [GitHub issues tracker](https://github.com/openplacerules/openplacerules.github.io/issues), in `/.well-known/place-rules.json` (`contact.email` and `contact.url`), `legal/terms-of-use.md` and `legal/privacy-policy.md`.

Sources: [GitHub custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
