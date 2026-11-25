# Owner-verified place-rules files

Each `*.json` file in this directory is a place whose operator has proven
control of the domain, as described in SPEC.md section 7.

The static site build (`scripts/build_static.js` + `scripts/build_growth.js`)
merges these records into the published registry. An owner file overrides any
reported seed entry listed in its `supersedes` array; the reported entry is
kept as history (`superseded_by`).

Files are written by `scripts/verify_claim.js` (run from
`.github/workflows/verify-claim.yml` on issues labelled `claim`) and by the
local claim API. Do not add or edit them by hand unless you have run the
verifier against the live domain.
