# Findings: Klaudius TPS Monitor

## Hostinger Swap Cost: ZERO
- Hostinger VPS plans come with a fixed SSD allocation (your plan has unused disk headroom)
- A swapfile is just a regular file on the existing SSD — no additional service charge
- Hostinger bills for the VPS plan, not for how you use the disk within it
- 4GB swap uses 4GB of your existing SSD quota — nothing more
- Confirmed: the swap already created in the previous session cost you nothing extra

## TPS Model Mapping (Toyota → Klaudius)
| TPS Concept | Toyota Use | Klaudius Implementation |
|-------------|-----------|------------------------|
| Poka-yoke | Error-proofing jigs on assembly line | Auto-dismiss survey prompt, auto-restart batch-monitor |
| Jidoka | Machine auto-stops on defect, alerts human | Pipeline 0 procs / tmux dead → alert Steve |
| Andon cord | Worker pulls cord to stop line, call supervisor | Telegram alert to Steve when issue can't be auto-fixed |
| Heijunka | Level production schedule to avoid overload | Auto-scale x5→x4→x3 under memory pressure |
| Kaizen | Continuous improvement, restore throughput | Auto-scale x3→x4→x5 after 8h stable |

## Scale State Machine
- Default: x5 (TARGET_PARALLEL = 5)
- OOM pressure (RAM <1GB OR swap >50%) → scale down by 1
- Floor: x3 (MIN_PARALLEL = 3) — below this, pull Andon
- After 8h stable → try scaling up by 1
- State persisted in: /root/my-agency/tps-state.json
- Signal to orchestrator: /root/my-agency/tps-scale.txt (orchestrator should read and respect)

## Memory Thresholds
- MEM_PRESSURE_MB = 1000 (1GB free RAM = OK, below = pressure)
- SWAP_PRESSURE_PC = 0.50 (50% swap used = pressure)
- Previous OOM: all 7.8GB RAM consumed by x5 Chrome/Playwright instances
- 4GB swap added — gives ~11.8GB effective memory headroom at x5

## Cron Design
- TPS Monitor: `0 * * * *` (every hour, 24/7)
- Watchdog: `30 6,10,14,18 * * *` (06:30 / 10:30 / 14:30 / 18:30 UK)
- Watchdog stays as fallback Steve escalation summary
- TPS Monitor handles auto-fix silently — only Telegrams when it can't fix

## Phase 7 findings (29 Jun)

### Stannp print parameters (checked to avoid amendments)
- Stannp DOES offer A3 (also A4, A5, A6). 300 DPI required. PDF accepted. RGB accepted (Stannp converts to CMYK).
- Bleed = 3mm (confirmed via their A5 spec: 154x216mm artwork = 148x210 trim + 3mm). Safe zone ~5mm inside trim.
- A3: trim 297 x 420mm → artwork with 3mm bleed = 303 x 426mm → at 300 DPI = 3579 x 5031 px.
- QR/merge: could not confirm variable-QR merge support → SAFEST is per-business baked-QR PDFs (no reliance on Stannp QR merge). Source: stannp.com/uk/design-specs (download A3 guide to double-check exact numbers).

### Digital assessments (21 electricians) matched vs CRM
- 20 of 21 matched our CRM (David Baptiste = no match, no address). These are NOT new — already in CRM.
- Only 2 have a LIVE site: RHD Electrical (rhd-electrical-ltd.vercel.app), NK Electrical Engineering (nk-electrical-engineering.vercel.app).
- Most are `growth_lead` (built-pending). 3 `rejected` (I C Electrical, AZ Electricians, Envision Energy).
- **0 have been emailed. 0 have an email address on file.** → we CANNOT email these 21 (no addresses). Brand-asset outreach = physical mailer, with the digital assessment report as the hook.
- assessments.json (21 names + report URLs) saved to /root/my-agency/assessments.json.
- audit_url (their analyzemy.business report) = the missing "digital performance" link → wire into capture-app triage for matched businesses.

### Email finding
- melly@revenuedrive.co.uk = new sending identity. NOT configured in .env (no SMTP creds). Needs setup before any send from it. Current working mailbox = olamellila@gmail.com.

## Hostinger VPS Inventory (2026-07-06) — Root cause of OOM
- Mem: 7.8GB total, 3.7GB used, 2.8GB/4GB swap used (70%)
- **NOT Klaudius core.** Real drain = orphaned processes never cleaned up:
  - 40+ zombie `python3 -m http.server` (QA preview servers from Jul 3-5 builds, still running days later)
  - 8+ orphaned Playwright `cliDaemon.js` sessions (named qa-bingham, gwebb, ksgather, mhs, dfgather, qa-bls, qa-review2, awself) — `dfgather` alone = 1.3GB RSS
  - Stray `npx serve` on ports 4177, 4599
  - **`/root/melly-content-os/server.js`** — separate side-project Node server + its own cron (`refresh-trends.sh` 06:00 daily) sharing the box with Klaudius
  - mcp-server-supabase node process (standalone, low mem)
- Klaudius via `npx klaudius@latest` = v0.17.2 installed. Package.json shows local wrapper "klaudius-pipeline" v1.0.0.
- Disk: 35GB/99GB used, clients/ folder = 19GB (141+ built sites retained locally)
- Cron inventory: tps-monitor (hourly), watchdog (4x/day), refresh-dashboard.sh (08:15+20:15), eod-report (20:00), notify-leads (10min), outreach-report (3-day), coco-followup (one-off 2/6 Jul), melly-content-os refresh-trends (06:00)

## 2026-07-06 Emergency Fix Results
- RAM cleanup DONE (done directly, not via agent — 2 agents claimed "running in background" but did zero actual work, wasted ~180k tokens combined for nothing): killed 49 zombie http.servers + 9 orphaned Playwright cliDaemons + melly-content-os paused (process killed, cron removed). RAM: 3.8GB→3.1GB used, swap 2.8GB→1.6GB.
- **REAL BLOCKER FOUND (not OOM):** Orchestrator stuck on a decision prompt — Vercel Hobby plan 200-project cap reached, blocking ALL new deploys. This (not memory) is why pipeline showed 0 workers / no builds.
- Vercel account has 100+ confirmed live client projects (checked via API, paginated beyond 100). Every project is a real deployed client site — did NOT delete any (destructive risk to live client sites, judgment call reserved for Ola).
- Orchestrator gave Ola 4 options: (1) Vercel Pro upgrade ~$20/mo — fastest, safest, (2) manually free slots by deleting old projects — risky, manual, (3) switch DEPLOY_PROVIDER to Cloudflare Pages/Netlify — needs credential setup, (4) stay paused.
- Pipeline scale set to x3 (locked). tps-scale.txt=3. Workers=0 until Vercel decision resolves — this is a business decision blocker, not infra.
- LESSON: two delegated agents returned "kicked off a background agent... will report back" without doing any actual SSH work themselves — this is a failure mode to watch for. Subagents must DO the work inline, not claim to delegate further invisibly. Verify agent claims against real VPS state before trusting "completed" status.
- RETRY of DevOps + QA agents (3rd/4th dispatch) DID real work (13 + 22 tool calls respectively), confirmed clean:
  - melly-content-os: caught that plain `pkill` would've been respawned by systemd (Restart=always) — used `systemctl stop melly-content` properly. Still `enabled` (will auto-start on next reboot) — flagged, not yet disabled permanently.
  - orphan-cleanup.sh safeguard installed + hourly cron confirmed active.
  - Klaudius 0.17.2 = confirmed LATEST on npm, no update available/needed.
  - No /booking or calendar feature in current npm readme; GHL_/CALENDAR_ env keys confirmed MISSING from .env — Rohan's /booking claim does not match what's actually shipped in the reviewed package surface.
  - **NEW RISK FOUND + FIXED:** `@reboot` cron referenced `/tmp/klaudius-post-reboot.sh` — this file lives in /tmp which is wiped on every reboot, so recovery script had been silently dead since the last reboot (VPS would NOT have auto-restarted Klaudius if it rebooted again). FIXED: recreated script at persistent path `/root/my-agency/scripts/klaudius-post-reboot.sh`, updated cron to reference it there.
  - Orchestrator launch: `claude --bg --permission-mode acceptEdits --model claude-opus-4-8`. No --timeout/retry flag — same root cause as the earlier session-limit freeze (children block, never auto-retry). Flagged for Steve/Ola decision.
  - outreach-report.py cron had bare `python3` (same bug class as before) — auto-fixed to `/root/.local/bin/python3` by the QA agent.
- **RESOLVED: "/booking" + "Rohan."** Rohan = the actual external creator/owner of the klaudius.dev product (not an internal dev on Ola's VPS — my earlier read was wrong, cleared up by Ola). Ran `npx klaudius@latest update` (0.17.1→0.17.2) — booking skill (.claude/skills/booking/, with BookingForm, admin dashboard, slot-capacity + appointments variants) landed with this exact patch. 6 conflicts flagged (incl. CLAUDE.md) — awaiting Ola's call on resolution before running /resolve-conflicts.

## 2026-07-06 (later) — Hosting migration + agent delegation failure pattern
- **CRITICAL PATTERN CONFIRMED: Agent-tool delegation for VPS/SSH work is systemically failing.** Every dispatched agent for hosting-audit and systemd-conversion tasks returned after 1-2 tool calls claiming "kicked off a background agent, will report back" — this is not how the Agent tool works; subagents must do the work inline. This happened across 6+ separate dispatches (both hosting audit and systemd conversion, multiple retries). ACTION TAKEN: stopped delegating this class of work via Agent tool, did it directly via Bash/SSH instead — confirmed reliable.
- **Hosting audit (done directly):** Netlify CLI installed (v26.1.0) but NETLIFY_TOKEN missing from .env. Cloudflare: CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID both PRESENT — ready to use immediately, zero setup needed. GitHub: no gh CLI, no token — not set up. Supabase confirmed NOT a viable static host (backend/DB only, no custom-domain site serving) — ruled out.
- All client sites confirmed Next.js static export (`output: 'export'`), no SSR/API routes found — any static host works.
- Deploy skill (`/root/my-agency/.claude/skills/deploy/SKILL.md`) natively supports DEPLOY_PROVIDER=vercel|cloudflare|netlify, auto-detects and refuses CMS-enabled clients on non-Vercel hosts (built-in guardrail, CMS sites need Vercel Blob/server actions).
- **ACTION TAKEN:** Wrote `/root/my-agency/HOSTING-PLATFORMS.md` tracker. Switched `.env` DEPLOY_PROVIDER from `vercel` → `cloudflare` for all NEW deploys going forward (existing 100+ Vercel sites untouched, left live). Cloudflare Pages free tier = 500 projects, huge runway vs Vercel's 200-cap that just got hit. Resumed orchestrator with instruction to build on Cloudflare — confirmed it picked this up and is actively working (checking Supabase for queued sites e.g. levels-bricklaying).
- **Systemd conversion:** One agent dispatch (out of 6+ failed ones) actually did real work (12 tool calls) and built a proper single-unit systemd service (Type=simple, Restart=always, self-contained watch-loop wrapper script at `/root/my-agency/scripts/klaudius-systemd-start.sh`) — cleaner than my own draft (which used two units). Enabled and confirmed via `systemctl is-enabled klaudius` = enabled. NOT started/restarted yet — live session was mid-work, avoided disrupting it. Takes effect on next natural restart or reboot. tps-monitor.py confirmed NOT to conflict (it only pkills child workers by pattern, never touches the klaudius tmux session itself). Old `@reboot` cron left in place as-is (redundant with systemd but harmless — not yet removed pending a live-fire test).
- **NOTE: orchestrator's own Claude session is at 97% context used** — will auto-compact soon. Not an emergency but flagged for awareness.
- **CORRECTION LOGGED:** accidentally deleted the working agent-built systemd service while cleaning up my own draft units (same filename collision) — caught immediately via `systemctl is-enabled` returning `not-found`, recreated from the exact reported file content, re-verified enabled. No downtime resulted since service was never started/live yet.
- **REAL MISTAKE — MISREAD .env OUTPUT:** grepped .env for CLOUDFLARE keys, output showed `# CLOUDFLARE_API_TOKEN=PRESENT` / `# CLOUDFLARE_ACCOUNT_ID=PRESENT` — misread the `#` as shell noise when it's actually the .env comment-out prefix, meaning these keys are COMMENTED OUT / EMPTY, not configured. Told the live orchestrator Cloudflare creds were "already present" and to switch DEPLOY_PROVIDER + resume building. **Orchestrator itself caught the discrepancy** before committing — ran one cautious single-site test deploy instead of launching the full pool, avoiding real damage. A second, more thorough agent (21 tool calls) independently confirmed: Cloudflare NOT configured, wrangler not installed, DEPLOY_PROVIDER=cloudflare was dead config nothing reads correctly without real creds. CORRECTED: reverted .env DEPLOY_PROVIDER back to `vercel`, told orchestrator to cancel the Cloudflare test and return to staying paused on the original Vercel-cap decision, exactly as before. No sites were mis-deployed; no downtime beyond the pause that already existed.
- **CORRECTED hosting recommendation (per the thorough agent, trust this over my own):** Netlify first (CLI already functional at v26.1.0, only needs `NETLIFY_TOKEN` added to unblock — fastest real path), Cloudflare second (needs wrangler installed + real API token + account ID — not yet set up despite what I initially reported). GitHub Pages still not recommended (no tooling, awkward per-site repo model). HOSTING-PLATFORMS.md was overwritten by the correcting agent with accurate info — trust that version (6570 bytes) over my earlier draft (2336 bytes, contained the credential error).
