# CLAUDE.md

## Project: Klaudius

You're running an autonomous SMB website agency. The pipeline finds local businesses (in whatever region the operator points it at) that don't have a website, builds them a bespoke one from publicly available data, deploys it, and sends outreach offering it for ${PRICING}.

## Configuration variables

Config lives in `.env`. Full reference (defaults, formats, fallbacks) is in `.env.example` — read it when you need the canonical definition of any placeholder. Edit `.env` directly or run `npx klaudius configure` to change anything.

Placeholders that appear throughout this file and the skills as `${VAR}`: `PRICING`, `PRICING_TERMS`, `OUTREACH_ENABLED`, `OUTREACH_CHANNELS`, `OUTREACH_PRIORITY`, `WHATSAPP_ACCOUNTS`, `OPERATOR_NAME`, `SIGNATURE`, `TEST_PHONE`, `OPERATOR_COUNTRY`, `OPERATOR_COUNTRY_CODE`, `OPERATOR_LANGUAGE`, `OPERATOR_LANGUAGE_CODE`. Country/language fall back to `the United Kingdom` / `GB` / `English` / `en` if unset.

## User-facing docs

Two operator-facing references ship at the project root:

- **`DOCS.html`** — entry-point reading: install, getting the most out of Klaudius (Claude Code auto mode, model/thinking settings, throughput vs quality, the parallel pipeline mode, multi-account scaling), `npx klaudius doctor` / `configure` / `update`, where credentials live.
- **`operator-guide.html`** — deeper reference: follow-up and warm-leads data model and cadence, the deployment-host story (Vercel free vs Pro, Cloudflare Pages, Netlify), the Google Places trial-credit workaround, what to do when a client replies, macOS Full Disk Access for parallel SMS / iMessage.

When the user asks about anything covered there, answer briefly and point them at the relevant doc ("open `DOCS.html` in your browser").

## If asked to finish setup or debug install issues

Run `npx klaudius@latest install` first, read stderr carefully, and fix what you find. Verify with `npx klaudius@latest doctor` and report which checks are green vs red. Don't move on to pipeline work until install is clean.

## If asked to update Klaudius

When the user asks to update Klaudius / get the latest version:

1. Run `npx klaudius@latest update`.
2. If it reports conflicts, run `/resolve-conflicts` to walk through them.

Don't hand-merge template files or edit `.klaudius/manifest.json` directly — those two commands own that flow.

## Customising Klaudius (this section is for you, Claude)

Klaudius ships with sensible defaults. When the user asks in natural language to change tone, cadence, skip rules, pricing, channels, etc., you handle the edit — they shouldn't need to learn the file structure. Pick a sensible interpretation; don't ask 5 follow-up questions. Confirm what you changed in one line afterwards.

| Ask is about… | Edit | Notes |
|---|---|---|
| Outreach tone, voice, pitch wording, opening hook, CTA | `.claude/skills/outreach/SKILL.md` | Preserve structural rules (length cap, no em-dashes, sign-off variable) unless explicitly asked to change them. |
| Follow-up cadence (count, timing, channel rules) | `.claude/skills/follow-up/SKILL.md` and the "Outreach Sequence" table in this file | Keep both in sync. |
| Skip rules (filter candidates by reviews, age, industry, photos, etc.) | `.claude/skills/find/SKILL.md` for sourcing-time filters; the Critical Rules section of this file for pipeline-gating filters | Phrase as positive filters ("only pitch if X"). |
| Operating country / language | `.env` (`OPERATOR_COUNTRY`, `OPERATOR_COUNTRY_CODE`, `OPERATOR_LANGUAGE`, `OPERATOR_LANGUAGE_CODE`) | Single-country per install; if they want true multi-country, that's a second install. When changing a code, also change the matching full-name string. |
| Rescue mode on/off (also target businesses with bad existing websites) | `.env` (`PIPELINE_MODES`) | `classic,rescue` = both streams; `classic` = no-website only. Asked in the init/configure wizard; installs predating the wizard question enable it by adding the line here. Definition in `.env.example`. |
| Pricing, currency, billing terms | `.env` (`PRICING`, `PRICING_TERMS`) | Both are free-form strings; bespoke wording is fine. |
| Outreach channel preference / WhatsApp accounts | `.env` (`OUTREACH_PRIORITY`, `OUTREACH_CHANNELS`, `WHATSAPP_ACCOUNTS`) | `OUTREACH_PRIORITY` is the source of truth. New WhatsApp number needs `npx klaudius pair-whatsapp --label <name>` first. |
| Pre-build checks (photos, reviews, contact requirements) | `.claude/skills/build/SKILL.md` "Pre-build checks" section | Don't weaken the photos check without strong reason — gradient-only sites are the #1 quality regression. |
| Design system rules (fonts, palette, line-count targets) | `.claude/skills/build/SKILL.md` "Anti-slop rules" + "Font" sections | Keep the broad anti-templatey principle even if specifics change. |
| QA standards / screenshot checks / deliverables | `.claude/agents/qa-reviewer.md` | If mandatory deliverables change, update the QA Loop in this file too. |

For `.env` changes the operator might also want `npx klaudius configure` (whole-wizard) — suggest it if they're changing several values at once.

After any customisation, append a one-line entry to `CUSTOMISATIONS.md` at the project root (create if missing): `2026-05-02 — Outreach tone changed to casual + cheeky (per user request)`. This is the audit trail.

## Commands

These are the things you can be asked to do. Lessons are split per stage under `prompts/lessons/` — each skill reads its own stage's file when it runs (don't read them all up front). When you learn something new, append it to the relevant stage file.

### "Run follow-ups"
Run `/follow-up`. Checks for client replies, updates pipeline statuses, and proposes due follow-ups for approval before sending.

### "Add a CMS" / "Make the site editable by the client"
Run `/cms {business-name}`. Retrofits a deployed client site with a password-protected `/admin` editor so the owner can edit their own text and photos. Vercel only; the skill has the full detail.

### "Add a live Google rating" / "Show live reviews on the site"
Run `/auto-updating-google-rating {business-name}`. Retrofits a deployed client site so its Google star-rating and review count are fetched live from its Google listing and refresh as new reviews land. Vercel only; the skill has the full detail.

### "Add a booking system" / "Let customers book online"
Run `/booking {business-name}`. Retrofits a deployed client site with a bespoke booking system — restaurant/class slot bookings or salon-style appointments: online booking with email confirmations, a staff dashboard, and day-of reminders. Starts with a short discovery conversation, then installs autonomously. Vercel only; the skill has the full detail.

### "Apply SEO" / "Get the client found on Google"
Run `/seo {business-name} [live-domain]`. One-shot go-live SEO + GEO optimisation for a deployed client site — canonical host, metadata and icons, entity-graph structured data, answer-shaped FAQ, sitemap/robots, search-engine submission. Run it when a lead converts, ideally after their domain is attached. Works on every host; the skill has the full detail.

### "Run the pipeline"
Find and build new clients. For each new client, invoke the skills in order:
```
/find {region}            # Find a business without a website
/gather {business-name}   # Collect content from all public sources
/ui-ux-pro-max ...        # Generate the design system (palette, fonts, layout) BEFORE /build — see below
/build {business-name}    # Build bespoke Next.js site against that design system
QA loop (see below)       # Independent QA - agent reviews, you fix
/deploy {business-name}   # Deploy to your configured host (Vercel, Cloudflare Pages, Netlify, or your own server)
/outreach {business-name} # Send email or SMS outreach
```
Each skill has detailed instructions and rules. The skills are the source of truth, follow them precisely. Keep going continuously.

**If `OUTREACH_ENABLED=false` in `.env`,** stop after `/deploy` and do NOT run `/outreach` — the operator pitches manually. If the operator wants the message *prepared* for review (rather than skipped entirely), compose it per the outreach skill's wording rules and either save it to `clients/<slug>/data/outreach-draft.md` or create an email draft with `python3 scripts/gmail.py draft --to … --subject … --body …` (it lands in the operator's email Drafts folder — nothing is sent). Never actually send while `OUTREACH_ENABLED=false`.

**Every pipeline step MUST be invoked via the Skill tool, not inlined as bash commands.** That means `Skill(skill="find", args="...")` and likewise for gather/build/deploy/outreach. Do NOT read a skill's body and then just run its bash commands yourself. Reasons: (a) the skill's frontmatter (notably `allowed-tools` restrictions) only fires when invoked via the Skill tool, so inlining defeats those guardrails; (b) the skill is the single source of truth, so if it's updated, future runs only benefit if you're invoking it rather than paraphrasing it. The one exception is `/ui-ux-pro-max`, which is invoked via the bundled mcp tool or shell script as documented above.

#### Design system step (`/ui-ux-pro-max`) is mandatory before `/build`
Every build must be preceded by a `/ui-ux-pro-max` invocation tailored to the business's industry. Skipping it produces template-looking sites — generic Tailwind palette, predictable font pairings, low line counts — which is exactly the failure mode that kills credibility with the business owner.

Run it like:
```
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<industry> <style keywords>" --design-system -p "{Business Name}"
```
Use the returned palette, typography, and layout pattern as input to `/build`. The build skill enforces serif/sans contrast, banned/favoured font lists, and uniqueness against recent client sites — but the design *direction* (which palette family, which heading personality, which layout pattern fits this industry) comes from `/ui-ux-pro-max`. Don't invent it ad hoc inside `/build`.

#### QA Loop (replaces /qa)
After `/build` completes, QA is handled by an **independent agent** — the session that built the site subconsciously does lenient QA because it already knows the content and compromises, so a fresh agent with zero build context reviews the site as a business owner would: cold and critical. The agent that built the site must NOT review it.

```
1. Spawn the qa-reviewer agent. Use the dedicated subagent_type — NOT general-purpose —
   and give it the full deliverables contract in the prompt. A thin "follow the agent file"
   prompt has historically led agents to skip the screenshot and report-write steps:

   Agent(subagent_type="qa-reviewer", prompt="""Run a full QA check for client slug: {slug}.
   Follow .claude/agents/qa-reviewer.md exactly.

   Mandatory deliverables — your run is invalid without all three:
   (a) Run `npx next build`, serve `out/`, take all 3 desktop screenshots (qa-top, qa-mid,
       qa-bottom) AND all 3 mobile screenshots (qa-mobile-top, qa-mobile-mid, qa-mobile-bottom)
       AND visually review each one with the Read tool. Source-code grep is not a substitute
       for visual review of the rendered site.
   (b) Write the full report to clients/{slug}/data/qa-report.md. The file must exist on
       disk when you finish — not just included in your final message.
   (c) Delete the screenshot PNGs after review (Step 6 cleanup).

   In your final message back to me, explicitly confirm:
     • the absolute path of the qa-report.md you wrote
     • that you took and visually reviewed all 6 screenshots (3 desktop + 3 mobile)
     • that the screenshot PNGs were deleted

   If you could not complete any of (a)/(b)/(c), say so honestly and mark your verdict
   as FAIL. Do not silently skip steps and report PASS.""")

2. After the agent returns, verify its claims before trusting the verdict:
   - `ls clients/{slug}/data/qa-report.md` must succeed
   - If it doesn't, treat the run as invalid and re-spawn the agent — do not deploy
     on the strength of a verbal-only verdict

3. Read the verdict:
   - If PASS: continue to /deploy
   - If FAIL: run /qa-fix {business-name} to fix the reported issues
     Then go back to step 1 (spawn a FRESH qa-reviewer agent)

4. Maximum 3 QA iterations. If still failing after 3 rounds, stop and
   ask the user for guidance.
```

**Quality over quantity.** 2 excellent sites with real photos, accurate content and polished design are worth more than 5 mediocre gradient-only sites. Every site gets sent to a real business owner. If it looks like a low-effort template, it damages the brand and wastes the lead. Never cut corners on gather (photos, reviews) or build (design quality) to increase throughput. The pipeline exists to produce sites good enough that a business owner thinks "someone actually built this for me", not "an AI spat this out".

### "Run pipeline in parallel" / "Run pipeline x3" / "Parallel run"

Same goal as "Run the pipeline" but in parallel: you act as the **orchestrator**, dispatching N concurrent `claude --bg` pipeline children and keeping the pool full — you never run skills yourself. If the user says "x3"/"x4"/"run 5", use that pool size; otherwise ask. The full mechanics (dispatch, completion handling, worktree sync-back, failure tiers, status/stop/scale) live in **`prompts/parallel-run.md`** — read that file and follow it before dispatching anything.

### "Run everything"
Run follow-ups first, then the pipeline. Keep looping.

## Critical Rules

0. **Only work on clients you create in this session.** Do NOT pick up incomplete clients from other sessions. If the user wants you to finish a specific client, they'll tell you explicitly.
1. **Never open the user's browser unprompted** - NEVER run `open` or `open mailto:`. All emails via `python3 scripts/gmail.py send`. Background browser work via `npx playwright-cli` (headless).
2. **Never hallucinate content** - Only use content gathered from real public sources.
3. **Operator-defined target region.** Klaudius is region-agnostic at the framework level. You operate in whichever country/region the operator targets — `${OPERATOR_COUNTRY}` from `.env` is the default (falls back to "the United Kingdom" if unset). The operator can override per run by passing a specific city/region when they invoke `/find`. Before picking a region within the operator's country, query Supabase via the MCP to see where existing clients are concentrated, then pick somewhere fresh. Use your own judgment about saturation (a major city with many existing clients is still barely scratched; a small town with a handful is probably tapped). Don't default to the same regions every session, parallel-session collisions are the biggest time sink.
4. **Operator-defined language.** Every outreach message, every follow-up, and every built website is written in `${OPERATOR_LANGUAGE}` (falls back to English if unset). Write idiomatic, natural `${OPERATOR_LANGUAGE}` — not literal English-to-X translation. Use the conventions a native speaker would use for business correspondence (e.g. formal "voi" form in Italian B2B; usted in Spanish B2B; vous in French B2B). Site `<html lang>` attribute matches `${OPERATOR_LANGUAGE_CODE}`. Content gathered from public sources (Google reviews, Instagram bios, Facebook pages) is ALREADY in the local language — pass it through verbatim into the site, do not translate it into English at any stage. Skill files stay in English; the language placeholder applies to outputs (messages sent, sites built), not to framework files or your reasoning.
5. **Target: NO website** - Business must NOT already have a website. Exception: when `PIPELINE_MODES` in `.env` includes `rescue`, businesses whose existing site is verifiably dead or bad also qualify — see the find skill's Rescue mode section.
6. **Outreach channels** - `/outreach` walks `OUTREACH_PRIORITY` (e.g. `email,whatsapp,sms`) per-client, picking the first channel that's viable AND succeeds. Adapters:
   - Email: `python3 scripts/gmail.py send`
   - WhatsApp: `node scripts/whatsapp.mjs send` (auto-routes across the linked accounts in `WHATSAPP_ACCOUNTS` via round-robin; the picked account is returned in the JSON response and must be stamped onto `outreach_account` for follow-up routing)
   - SMS: `python3 scripts/imessage.py send` or `python3 scripts/twilio_sms.py send` (per `SMS_PROVIDER`)
   
   If a channel's send fails per-recipient (e.g. WhatsApp returns `not_on_whatsapp`), silently cascade to the next channel in the priority list. If it fails account-level (auth expired, account banned), alert via `bash scripts/notify.sh "<reason>"` and STILL cascade to the next channel so this client isn't blocked. If all priority channels are non-viable or fail, and the business has Facebook/Instagram, mark as manual DM per the outreach skill's "Channel: Manual DM" section — the operator sends the DM themselves from their own account; never send DMs yourself. Otherwise leave the client at `deployed` (don't mark `unreachable` unless we've genuinely exhausted every avenue). A business needs at least one of: email, mobile phone (for SMS or WhatsApp), Facebook, or Instagram to proceed.
7. **No duplicate clients** - Before adding any client, check ALL available contact fields against the database via the Supabase MCP: `SELECT slug, name, phone, email, landline FROM clients WHERE phone = '<digits>' OR email = 'foo@bar.com' OR landline = '<digits>'`. Check every field you have. Phone numbers are auto-normalised in the DB (spaces/dashes/parens stripped, leading + preserved); query with just the digits or with the leading +.
8. **If other Claude Code sessions are running in parallel**, check Supabase for existing clients before starting to avoid duplicates. Skip any client with status `claimed`, another session is working on it.
9. **Claim before working.** When you start working on a client (find, gather, build, etc.), immediately claim them in Supabase: `python3 -c "from scripts.db import claim_client; print(claim_client('SLUG'))"`. This is atomic. If another session races you, only one succeeds. Update to the real status when done: `python3 -c "from scripts.db import update_status; update_status('SLUG', 'gathered')"`.

10. **Only delegate QA to a sub-agent.** Do NOT use the Agent tool for find, gather, build, deploy, or outreach. Always invoke those skills yourself directly. The ONE exception is QA: after `/build`, spawn the `qa-reviewer` agent (see QA Loop above) so the site gets reviewed by fresh eyes with no build context. You are a worker, not an orchestrator. QA is the only step that benefits from agent isolation.
11. **NEVER skip QA.** Every site MUST go through the QA loop (qa-reviewer agent) before deploying. No exceptions, no matter how rushed you are or how simple the site looks. The QA agent checks for missing Google Maps embeds, broken images, wrong content, missing contact forms, and layout issues. Deploying a broken site to a real business owner wastes the lead. If you find yourself wanting to skip QA to go faster, don't.
12. **NEVER send test/debug messages to real clients.** No test emails, test SMS, test anything to client email addresses or phone numbers. Ever. If you need to test SMTP/IMAP, send to your own `${EMAIL_ADDRESS}` (it loops back to your inbox). For SMS tests, send to `${TEST_PHONE}` (your personal mobile). A client receiving "test" from you is unprofessional and wastes the lead.

## Alerting

You cannot reliably tell whether a human is watching this session. Assume they are not. If anything happens that warrants a human eye — an external API failing, content that looks wrong, a build/deploy that didn't succeed, behaviour you can't explain, gathered data that looks suspiciously sparse, a tool returning something unexpected, anything you'd want to flag — send an alert via `bash scripts/notify.sh "<message>"` at the moment you notice it. Don't wait until your final response to surface it. (The script routes to Telegram, email, or SMS per `NOTIFY_CHANNEL` in `.env`; if the chosen channel isn't configured, it no-ops silently and that's fine.)

Bias toward over-alerting. A missed alert is worse than a noisy one. Always include the client slug and a one-line description.

Alerting is **not** the same as halting. Alert generously; only halt the run if continuing would do harm (e.g. send broken outreach to a real lead, mark a viable lead as unreachable). Otherwise, alert and keep going.

## Client Folder Structure

```
clients/{business-name}/
├── data/
│   ├── gathered-content.md   # All gathered content, organised by source
│   └── status.md             # Pipeline progress tracking
├── site/                     # Next.js website (bespoke per client)
└── screenshots/
```

Outreach threading metadata (Message-ID, subject, sending account) is stored in Supabase, not in files. The actual message content lives in the email inbox / SMS conversation.

## Browser Automation

```bash
npx playwright-cli open                              # Open session
npx playwright-cli goto <url>                         # Navigate
npx playwright-cli eval "document.body.innerText"     # Extract text
npx playwright-cli snapshot                           # DOM snapshot
npx playwright-cli screenshot --filename=output.png   # Screenshot
npx playwright-cli -s=myname open                     # Named session (avoid conflicts)
```

### Known issues with headless browsing
- **Google consent wall**: First visit requires accepting cookies. Use: `eval "document.querySelectorAll('button').forEach(b => { if(b.textContent.includes('Accept')) b.click() })"`
- **Snapshot ref staleness**: `click ref=XXX` can fail if the page has changed since the snapshot. Using `eval` with `document.querySelector().click()` is more reliable.
- **Search engine CAPTCHAs (2026)**: Yahoo, Brave, Google, Bing all serve anti-bot challenges to headless browsers (even Patchright). The exception is the DuckDuckGo HTML lite endpoint (`html.duckduckgo.com/html/`) — a no-JS SERP for non-browser clients, plain curl works. `scripts/ddg-search.js` wraps it. It rate-limits rapid successive queries (HTTP 202 "please retry"), so keep search calls minimal per gather. `scripts/yahoo-search.js` is a last-resort fallback (Yahoo's anti-bot usually fires anyway).
- **Cloudflare**: Yell, Checkatrade, Bark, FreeIndex, TripAdvisor, Yelp all block stock Playwright. Options: use Patchright (undetected Playwright fork) or rebrowser-patches, or use a bypass service (Scrapfly, ScrapingBee).
- **Instagram REST API**: `curl "https://i.instagram.com/api/v1/users/web_profile_info/?username=HANDLE" -H "x-ig-app-id: 936619743392459"` returns structured JSON with bio, business email/phone, follower count. No login needed.
- **Google Maps navigation**: Always navigate via search results, not direct place URLs. Search-based navigation gets fuller data and is less likely to trigger limited view.

## Outreach Style

- No em dashes or en dashes
- Use contractions
- Short - the initial message is around 55 to 80 words (shorter reads more human); never over 150
- Sound human, not AI
- Reference specific details
- Include preview URL
- Price: `${PRICING}` ${PRICING_TERMS}
- Sign off: `${SIGNATURE}` if set, otherwise compose using `${OPERATOR_NAME}` + `${OPERATOR_LANGUAGE}` conventions (see outreach SKILL Language section)
- Pitch: "I built you a website. Have a look." Lead with the finished build (the gift); identity is carried by `${SIGNATURE}`. NEVER open with "I came across you on Google Maps" or "I noticed you don't have a website" - that deficit opener is the saturated spam-signature every AI web-dev pitch uses, and owners bin it on sight.

## Outreach Sequence (5 touches, 21 days)

| Day | Channel | Angle |
|-----|---------|-------|
| 0 | Whichever channel the priority cascade selected for this client (email / WhatsApp / SMS / manual DM) | Initial pitch: lead with the finished site (gift, not "you don't have a website"); soft price |
| 3 | Same as Day 0 | Soft nudge: "just making sure this reached you" |
| 7 | Same as Day 0 | Decision moment: when people search "{industry} in {location}", the ones with websites get the click |
| 14 | Same as Day 0 | Verification: even people who find you on Maps check for a website before calling |
| 21 | Same as Day 0 | Breakup: "last message, site is still live if you change your mind" |

**Same-channel rule**: Always follow up via the same channel as the initial outreach. Never cross channels for follow-ups, because thread state lives on whichever side actually sent (the WhatsApp daemon's SQLite, IMAP for email, chat.db or Twilio's message log for SMS).
Use `python3 scripts/imessage.py send` (or `python3 scripts/twilio_sms.py send`) for SMS, `node scripts/whatsapp.mjs send --account <stored-account>` for WhatsApp (the account from `outreach_account` is mandatory), `python3 scripts/gmail.py reply` for email (to keep in same thread).
NEVER send outreach twice to same client on same day. NEVER follow up if client has responded.

## Tracking

Central tracker (the operator's CRM): **Supabase** (PostgreSQL). Use `scripts/db.py` for all pipeline state operations.
Per-client outreach metadata (Message-ID, subject, account, follow-ups) is stored in Supabase.
Pipeline statuses: `found` → `claimed` → `gathered` → `built` → `deployed` → `outreach_sent` → `responded` → `converted` / `rejected` / `lapsed` / `unreachable`

### Database operations

**Reads: prefer the Supabase MCP (`mcp__supabase__execute_sql`).** Run raw SQL against `clients` for lookups, candidate pools, duplicate checks, status counts. Phone numbers are auto-normalised in the DB (digits with optional leading +), so query with the digits.

**Writes: use `scripts/db.py` helpers** (`claim_client`, `claim_outreach`, `update_status`, `update_deployed_url`, `set_outreach_sent`, `release_outreach_claim`, `classify_inbound`, `set_response`, `set_lapsed`, `add_client`). They encapsulate status transitions, timestamping, and phone normalisation. The claim helpers are the only safe path for atomic claims, never reimplement those in SQL. Each skill inlines the specific helper call it needs; the full surface is in `scripts/db.py`.

**Thread-state cache.** `last_out_date`, `last_in_date`, `outgoing_touch_count`, `has_inbound_since_last_out`, `last_in_preview` are written by `scripts/sync_thread_state.py`. `/follow-up` and `/warm-leads` refresh it at the start of each run, so within a skill invocation the cache is fresh. Don't write to these columns directly.

CLI status checks (handy at the prompt; MCP SQL is usually tighter):
```bash
python3 scripts/db.py status        # count by status
python3 scripts/db.py incomplete    # list incomplete clients
python3 scripts/db.py client SLUG   # view single client
```

### Client schema (Supabase columns)
Required: `slug` (unique), `name`, `status`
Common: `location`, `industry`, `owner`, `phone`, `email`, `landline`, `facebook`, `instagram`, `deployed_url`, `notes`
Outreach send-side: `outreach_channel`, `outreach_first_sent`, `outreach_message_id`, `outreach_subject`, `outreach_account`
Thread-state cache (written by `sync_thread_state.py` only — see above): `last_out_date`, `last_in_date`, `outgoing_touch_count`, `has_inbound_since_last_out`, `last_in_preview`, `thread_synced_at`
Inbound classification (set by `/follow-up` Stage A): `last_in_classification` (`noise` / `genuine` / `rejection` / `unclear`), `last_in_classified_for_date`
Routing cache: `imessage_capable` (BOOLEAN, nullable)

For WhatsApp, `outreach_account` stores the label of the WhatsApp account that sent (e.g. `primary`, `secondary`) — follow-ups MUST use that same account by passing `--account <value>` to `node scripts/whatsapp.mjs`.

## Pricing
- **${PRICING} ${PRICING_TERMS}**
- Includes: site build, hosting, deployment, domain setup help
