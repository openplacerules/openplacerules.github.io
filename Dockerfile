# MCP server for OpenPlaceRules (stdio).
# Build: docker build -t ghcr.io/openplacerules/mcp:0.3.0 .
# Run:   docker run -i --rm ghcr.io/openplacerules/mcp:0.3.0
# By default the server uses the seed bundled in the image (no network required).
# To fetch the live registry at start, run with -e PLACE_RULES_OFFLINE=0 and network.
FROM node:20-alpine
WORKDIR /app
COPY package.json mcp-server.js ./
COPY lib ./lib
COPY data/seed.json data/ATTRIBUTION.md ./data/
LABEL io.modelcontextprotocol.server.name="org.openplacerules/mcp"
ENV NODE_ENV=production
ENV PLACE_RULES_OFFLINE=1
USER node
CMD ["node", "mcp-server.js"]
