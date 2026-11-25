# Publishing org.openplacerules/mcp to the official MCP Registry

The official registry hosts metadata only. A stdio server needs a public
package first. npm signup is bot-walled, so this server is published as a
public OCI image instead of an npm package.

## Package

- Registry name: `org.openplacerules/mcp` (DNS auth on the openplacerules.org apex)
- Image: `ghcr.io/openplacerules/mcp:0.3.0` (also tagged `latest`)
- Ownership check: the image config label
  `io.modelcontextprotocol.server.name=org.openplacerules/mcp`
- `server.json` uses `"registryType": "oci"` and puts the version in
  `identifier` (no `version` or `registryBaseUrl` on the package)
- Dockerfile and `.github/workflows/ghcr-mcp.yml` build and push the image
  and set the GHCR package to public

## Steps

1. Bump `version` in the root `package.json` and in `server.json`, and update
   the OCI identifier tag to match (for example `ghcr.io/openplacerules/mcp:0.3.1`).
2. Push to `main`. The `ghcr-mcp` workflow publishes
   `ghcr.io/openplacerules/mcp:<version>` and `:latest`. GitHub has no API
   to change GHCR visibility, so the first time the package exists, set it
   to Public in the package settings:
   https://github.com/users/openplacerules/packages/container/mcp/settings
   Later pushes stay public. The workflow fails if an anonymous pull does not work.
3. After the image is public, install `mcp-publisher` and log in with the
   Ed25519 key (kept off the repo, at `/home/box/.openplacerules/mcp-registry-ed25519.pem`
   on the project box):

   ```bash
   KEY_FILE="$(mktemp)"
   (umask 077; openssl pkey -in /home/box/.openplacerules/mcp-registry-ed25519.pem -noout -text \
     | sed -n '/priv:/,/pub:/p' | sed '1d;$d' | tr -d ' :\n' > "$KEY_FILE")
   mcp-publisher login dns --domain openplacerules.org --private-key-file "$KEY_FILE"
   rm -f "$KEY_FILE"
   mcp-publisher publish packages/mcp/server.json
   ```

4. Check: `curl "https://registry.modelcontextprotocol.io/v0/servers?search=openplacerules"`

The npm package in this directory can still be built with
`npm run mcp-package` (and still has `mcpName` for a future npm publish). It
is not the official registry artifact.

The registry is in preview; breaking changes or data resets may occur.
