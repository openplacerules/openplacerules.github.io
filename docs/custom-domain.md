# Switching the site to openplacerules.org

The public site is served at [https://openplacerules.github.io](https://openplacerules.github.io) (GitHub Pages, Actions workflow in `.github/workflows/pages.yml`).

Do **not** add a `CNAME` file, and do not set a custom domain in the repo settings, until `openplacerules.org` is registered and the DNS records below are in place. A premature `CNAME` breaks the github.io URL.

When the domain is registered:

1. In `.github/workflows/pages.yml`, set `SITE_URL` to `https://openplacerules.org` and `WRITE_CNAME` to `"1"`.
2. GitHub → repo Settings → Pages → Custom domain: `openplacerules.org`. Verify the domain with the TXT record GitHub shows (`_github-pages-challenge-openplacerules`). With the Actions source, this setting is what counts.
3. DNS at the registrar for **openplacerules.org**:

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
   | TXT | `_github-pages-challenge-openplacerules` | value shown by GitHub in step 2 |

   Remove any default parking A/CNAME records the registrar adds, and don't use wildcard records.

4. After DNS resolves (up to 24 hours), tick **Enforce HTTPS**. www redirects to the apex automatically.
5. `lib/core.js` already uses `https://openplacerules.org/terms.html` as `TERMS_URL`. Schema `$id` already uses that host.

`openplacerules.com` can 301 to `https://openplacerules.org` at the registrar (GitHub Pages serves one custom domain per site).

Sources: [GitHub custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
