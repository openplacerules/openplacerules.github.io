# Contributing to OpenPlaceRules

Thank you. This repository is the open spec, the public registry, and the static site at [openplacerules.org](https://openplacerules.org).

Community conversation happens in [GitHub Discussions](https://github.com/openplacerules/openplacerules.github.io/discussions). Start with the [Start here](https://github.com/openplacerules/openplacerules.github.io/discussions/12) post. Please follow the [Code of Conduct](CODE_OF_CONDUCT.md).

A short guide, including how venues claim a place, is at [openplacerules.org/contribute/](https://openplacerules.org/contribute/).

## Add a sourced rule

Every new entry must cite a public source (an official page, sign or document). Please do not submit legal advice or ask us to invent a rule. Leave out any activity the source does not mention: an omitted activity means “unspecified” and never means permitted.

1. Use the generator at [https://openplacerules.org/new/](https://openplacerules.org/new/), or the report form at [https://openplacerules.org/submit.html](https://openplacerules.org/submit.html).
2. Open a GitHub issue with the **Add a place rule (with source)** template (label `report`), start a thread in the **Q&A** Discussions category, or open a pull request that includes the JSON, the source URL and the date you checked it.
3. Newcomers can pick a [good first issue](https://github.com/openplacerules/openplacerules.github.io/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

An example of the expected entry shape is commit [`d7720ef`](https://github.com/openplacerules/openplacerules.github.io/commit/d7720ef). Maintainers geocode and merge accepted entries into `data/seed.json`.

## Report or correct a place

Use the links on a place page, or open an issue with the **Report a wrong rule** template (label `correction`). Every reported change must cite a public source. Please do not submit legal advice or ask us to invent a rule.

## Claim a place (owner verification)

A registry entry is marked **verified by owner** only when the place's own domain proves control, as described in `SPEC.md` section 7. There are three accepted methods; in every case the rules themselves are read from `https://<domain>/.well-known/place-rules.json` and must be a valid `place-rules/0.1` file.

1. **well-known** — that file contains `"verification": { "method": "well-known", "token": "<token>" }`.
2. **meta tag** — the home page contains `<meta name="place-rules-verification" content="<token>">`.
3. **DNS** — a TXT record `_place-rules.<domain>` with the value `place-rules-verification=<token>`.

How a venue gets verified:

1. Open [the claim page](https://openplacerules.org/claim.html). If you are claiming an existing registry entry, add `?id=<entry-id>` (or use **Claim this entry** on the place page, then continue on the claim page to get a token).
2. Publish the file (a generator is at `/new/`) and add the token via one of the three methods above.
3. Send the pre-filled GitHub issue (label `claim`). It must include `Domain:` and `Token:`. The registry id is optional.
4. [`.github/workflows/verify-claim.yml`](.github/workflows/verify-claim.yml) runs `scripts/verify_claim.js` on issues that are opened or edited with that label (or when a maintainer starts the workflow by hand). It checks the file and the proof of control from GitHub's servers, not from the browser.
5. If the check succeeds, a pull request imports `data/owner/<domain>.json` as an owner-verified entry. When the claimed domain clearly belongs to a reported entry (same site as the seed source or the file's `place.url`), that reported entry is listed in `supersedes` and is kept as history. Otherwise a maintainer confirms the link before it is applied, so an unrelated place cannot disappear by accident.
6. If the check fails, the issue is labelled `needs-info` and the comment says what was missing (token, valid file, DNS record, and so on). Edit the issue when it is ready and the check runs again.
7. Once the PR is merged, the site build includes the owner file. [`/data/stats.json`](https://openplacerules.org/data/stats.json) (`owner_verified`) and `/api/stats.json` count it. The owner entry overrides the reported one in map and API answers (SPEC §7.1).

A "Claim this entry" issue that only has a name and a registry id, without a domain and token, is not enough to mark the place owner-verified. Use the claim page for that step.

Maintainers: merge claim PRs after a quick look (especially when the comment asks for a supersede check). To re-run a check, use **Actions → verify-claim → Run workflow** and the issue number, or edit the issue. The workflow opens the import PR with `GITHUB_TOKEN`, so the repository must have Settings → Actions → General → **Allow GitHub Actions to create and approve pull requests** enabled.

Venue staff who need help with a claim can also ask in the **General** Discussions category.

## Credits

People who contribute are listed on the [credits page](https://openplacerules.org/credits/) only if they opt in. See [`CREDITS.md`](CREDITS.md). We will not add a name, handle or link without that request.

## Tests and local development

```bash
npm test                         # includes fixture tests for the claim verifier (no live network)
node server.js 8787              # local map + API, including POST /api/claims
```

The claim-verifier tests inject a fake `fetch` and DNS resolver and use files in `tests/fixtures/claims/`. Do not point them at real domains. Tests never write to the committed `data/` tree.

Please do not commit secrets, `.pem` keys, or files from `legal/` that are listed in `.gitignore`.
