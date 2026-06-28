# CLAUDE.md — operating notes for this repo

Read this first. It captures hard-won session learnings so you start fast and don't repeat mistakes.
(For the wider life/business map see `MELLY-OS.md` and `Library of Tools/mi.md`.)

## Who
Ola "Mel" Seweje — UK (Essex/Havering), Black founder, ex-TfL programme manager (£38M, APM/PMP/CDMP).
Ventures: **RevenueDrive / Systems By Melly** (AI automation for SMEs), **Kladius** (web agency), **Arete** (property/short-let).
Working style: fast, action-first, voice-dump briefs (decode intent, don't take them literally). Address growth work to "Steve" (the COO persona). Email: melly@reveneuedrive.co.uk.

## ⚠️ Repo gotcha #1 — the allowlist .gitignore (this WILL bite you)
`.gitignore` ignores **everything** except `.md`, `.txt`, `.csv`. Consequences:
- Any code/JSON/HTML/PDF/image deliverable is **silently dropped** by a normal `git add`. Use `git add -f`.
- **After the first commit of any new file type, run `git status` AND `git ls-files <dir>` to confirm it actually landed.** Do not trust a clean `git commit`.
- `.agents/` (local skill installs) is ignored on purpose — reproduced via `install-skills.sh`, never committed.
- A Stop hook blocks ending the turn while untracked files exist — keep the tree clean (commit or gitignore).

## Where things live
- **`Engine/Growth Research/`** — the growth system: two one-pagers, `Intelligence Report.md`, `Standout Opportunities.md`, `Who Buys Funeral Homes.md`, `V2 Partnership One-Pager.md`, `OUTSTANDING-TASKS.md`, `System/Two-Doorway Operating System.md`, and `crm/` (Next.js + Supabase, JSON-first, seeded from `crm/data/intel.json`).
- Active PR: **#1** on `boshmelly/hostinger-V1`, branch `claude/growth-market-research-aqfsfb`.

## Patterns that worked (reuse them)
- **Big fan-out (20+ agents) → use `Workflow`**, not inline Agents — keeps dumps out of context. It always runs in background (no `run_in_background` param).
- **Passing >~10 records into a workflow:** write the script with a `__DATA__` placeholder, inject via a Node string-replace, run with `{scriptPath}`. Don't hand-transcribe and don't bloat `args`.
- **Generate docs/CSV/HTML from data with a Node script** (read `intel.json` → emit files). Exact, no transcription errors.
- **PDF from HTML:** `/opt/pw-browsers/chromium-*/chrome-linux/chrome --headless=new --no-sandbox --no-pdf-header-footer --print-to-pdf=out.pdf file://...` (Playwright npm module isn't installed; the binary is). Print CSS should force-expand any JS accordions/detail rows.
- **Verify a scaffolded app builds** before calling it done (`npx tsc --noEmit`), or state explicitly it's untested.

## Integrity rules (non-negotiable for outreach work)
- Researched contacts/emails carry a **confidence flag**; always tell Ola to **verify before sending**.
- **Never fabricate case studies or same-sector clients.** Real proof only: the Essex HVAC outcome (+£3,200/mo) and Ola's TfL/programme background.
- Note **PECR/GDPR** (B2B opt-out; sole traders = personal data) and **FCA financial-promotion** rules (deals = commercial contracts, legal sign-off before investment-style pitches).

## Tooling
- Web search: **prefer `firecrawl_search`** (installed MCP, richer than built-in WebSearch); call `firecrawl_search_feedback` after to refund a credit. `playwright` MCP is available for browser automation.
- Skills installed (local+global): `last30days`, `anthropics/skills` (pdf, pptx, docx, canvas-design…), `gsd-orchestrator`. `last30days` needs API keys / browser cookies and an open network — blocked in the cloud sandbox, fine on Ola's machine/VPS.
- **Sandbox network:** the agent proxy only reaches the scoped repo + allowed domains; `git clone` of other repos and many social endpoints 403. Don't burn time fighting it — note it and move on.
- Outstanding setup: add real `FIRECRAWL_API_KEY`; run `install-skills.sh` on the Hostinger VPS (not reachable from the sandbox).

## Calendar
Google Calendar MCP is connected. Ola's week is grant-heavy (Barclays/UnLtd/UKSPF). A recurring "Steve Review" growth slot lives on Fridays; check `OUTSTANDING-TASKS.md` for the live list before that meeting.
