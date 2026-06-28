#!/usr/bin/env bash
# install-skills.sh — install the agreed skills + MCP servers "across the board".
# Run this on the Hostinger VPS (and any other machine) to match local + global setup.
# Safe to re-run. Requires: node 18+, npx, and the `claude` CLI on PATH.
set -uo pipefail

echo "==> Installing skills (global -g and project-local)"
for repo in \
  "mvanhorn/last30days-skill" \
  "anthropics/skills" \
  "gsd-build/gsd-2" ; do
  echo "  - $repo (global)";  npx -y skills add "$repo" -g  || echo "    (global add reported an issue for $repo)"
  echo "  - $repo (local)";   npx -y skills add "$repo"     || echo "    (local add reported an issue for $repo)"
done
# Fallback for gsd if gsd-2 is unavailable in your registry:
# npx -y skills add open-gsd/gsd-pi -g

echo "==> Adding MCP servers (project .mcp.json + user/global config)"
# Playwright (no API key needed)
claude mcp add -s project playwright -- npx -y @playwright/mcp@latest || true
claude mcp add -s user    playwright -- npx -y @playwright/mcp@latest || true

# Firecrawl — REQUIRES an API key. Export it first:  export FIRECRAWL_API_KEY=fc-xxxx
FCKEY="${FIRECRAWL_API_KEY:-REPLACE_WITH_YOUR_FIRECRAWL_KEY}"
claude mcp add -s project firecrawl -e FIRECRAWL_API_KEY="$FCKEY" -- npx -y firecrawl-mcp || true
claude mcp add -s user    firecrawl -e FIRECRAWL_API_KEY="$FCKEY" -- npx -y firecrawl-mcp || true

echo "==> Verifying"
claude mcp list || true
echo "Done. If firecrawl shows the placeholder key, set FIRECRAWL_API_KEY and re-run the two firecrawl lines."
