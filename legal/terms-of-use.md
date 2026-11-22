# OpenPlaceRules — Terms of Use and Disclaimer

**Draft v0.1 · 22 November 2026 · Not yet reviewed by a lawyer.**

These terms apply to the OpenPlaceRules website, map, registry data, JSON API and MCP server (together, the "Service"). The Service is run by the OpenPlaceRules maintainers, Bangkok, Thailand ("we", "us"). By using the Service you agree to these terms. If you do not agree, do not use it.

## 1. What the Service is — and is not

- OpenPlaceRules collects **house rules and public rules** about camera glasses, recording, AI capture, robots and drones at places, and lets places publish their own rules in `/.well-known/place-rules.json`.
- **It is information only. It is not legal advice, not permission, and not an official source.** Entries marked "reported" come from public sources or community reports and are **unverified by the owner**; entries marked "owner-verified" are the place's own statement.
- **The law, the authorities, and the rules posted or told to you at the place always win.** Rules change without notice; an entry can be wrong, incomplete, outdated or missing. **"Unknown" or a missing entry never means "allowed".**
- **Drones and aircraft:** always check your national aviation authority, official airspace maps and NOTAMs/TFRs before flying. Never rely on the Service for flight safety.

## 2. Your responsibilities

- Check the linked source and the place itself before you act on any entry.
- Obey the law and the place's rules, and respect other people's privacy.
- Do not use the Service to harass anyone, to locate or track people, or to break the law.
- Do not overload the Service (respect published rate limits; cache answers for at most 24 hours as the spec suggests).

## 3. Apps, devices and AI agents using the API or MCP server

If you build on the API or MCP server you must:
1. show end users the rule **with** its source, date and verification status, and pass on the notice that it is information, not legal advice;
2. not present an answer as permission or as an official determination, and not silently enforce or override a rule without telling the user;
3. treat missing, stale or invalid data as "unknown";
4. comply with the data licence (section 5), including attribution.

## 4. Submissions and claims

- When you report a place or claim one, you confirm that what you send is accurate to the best of your knowledge and that you have the right to share it.
- You grant us a worldwide, royalty-free, perpetual licence to use, edit, publish and re-license what you submit as part of the registry under the licences in section 5. Owner-verified rules remain your statement of your own rules; you can update or remove them by changing or removing your file.
- We may moderate, edit, refuse or remove anything, and we may mark entries as stale, disputed or expired.
- Do not submit other people's personal data (e.g. names or photos of staff or visitors).

## 5. Licences

- Registry data: **Open Database License 1.0 (ODbL)**; includes data © OpenStreetMap contributors. See `data/ATTRIBUTION.md`.
- Specification: **CC BY 4.0**. Code: **MIT**.
- Source websites keep their own rights; we link to them and summarise facts in our own words.

## 6. Corrections and takedown

If an entry about your place is wrong, publish `/.well-known/place-rules.json` (it overrides reported entries) or contact us at **hello@openplacerules.org** with the entry and the correct source. Rights holders may send copyright or database-right notices to the same address; we will review and remove or fix entries where appropriate.

## 7. No warranty

The Service is provided **"as is" and "as available"**, free of charge, without warranties of any kind, express or implied, including accuracy, completeness, fitness for a purpose, availability and non-infringement.

## 8. Limitation of liability

To the fullest extent the law allows, we are not liable for any loss or damage arising from use of, or reliance on, the Service, including fines, penalties, confiscation of equipment, lost profits or data, or indirect or consequential loss. Where liability cannot be excluded, it is limited to the amount you paid us for the Service in the 12 months before the claim (zero for free use). Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or any other liability that cannot be limited by law, and nothing removes rights you have as a consumer under mandatory law.

## 9. No token, no financial product

The Service involves no payments, wallets, custody or tokens. **We have not issued any token and do not sell or promise any token.** Anyone offering an "OpenPlaceRules token", presale or airdrop is not us unless announced on this website.

## 10. Changes, suspension, law

We may change or stop the Service, or these terms, at any time; the date at the top shows the current version. These terms are governed by the laws of Thailand, without prejudice to mandatory consumer-protection law of your country of residence. Courts of Thailand have jurisdiction unless mandatory law gives you the right to sue at home.

## 11. Contact

**hello@openplacerules.org**
