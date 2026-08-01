# Klaudius Customisations (High-Volume Mode)

## 2026-06-19

- **Rich contact form mandated** — All builds now require: (1) three CTA anchor-scroll buttons placed after the hero, mid-page, and above the form; (2) a service-selector chip grid (clickable, accent-coloured on selection, sourced from actual gathered services); (3) Name, Phone, Postcode fields with WhatsApp photo prompt panel; (4) mailto: submit pre-populated with all fields. No more blank textarea forms.

## 2026-06-18

- **QA loop removed** — Direct deploy after build (no qa-reviewer agent spawn). Replaced with daily spot-check (1 in 10 sites) and HALT-on-regression logic.
- **Design system caching** — Per-region per-industry (e.g., `design-systems/romford/electrician.json`). Generated once per day, reused across all builds that day.
- **Batch find** — Region-specific candidates fetched once per day, queued for children to claim atomically via Supabase.
- **Regional quota tracking** — `.claude/regional-quota.json` tracks progress per region. Auto-rotates to next region when quota hit.
- **Token optimization** — Batch find (saves 15k), design caching (saves 20k), QA removal (saves 60k) = ~95k tokens/day savings. Running ~10-15 sites/day at ~426k tokens total.
- **Quality tolerance** — Aggressive (15% acceptable issues). Spot-check catches regressions; isolated failures fixed via redeploy + correction email.

## Target Throughput

- **Romford/Havering**: 10 sites/day, 100 total, ~10 days
- **Lincoln**: 5 sites/day, 50 total, ~10 days
- **Colchester**: 5 sites/day, 50 total, ~10 days
- **Worcester**: 5 sites/day, 50 total, ~10 days
- **Total**: 200 sites over ~40 days
- **Daily Supabase sync**: Nightly export to `exports/stamp-ready-<date>.csv` for Tuesday pull to Stamp


## 2026-06-19 (update)

- **Email template updated** — New format: Subject "I built [Business Name]", leads with Google Maps observation + reviews stats, screenshot above URL, £299 one-off price point, Melly/Revenue Drive sign-off with WhatsApp link.
- **Pricing updated** — £299 one-off, no monthly fees (was £750 upfront + £50/month).
- **CC mandatory** — melly@revenuedrive.co.uk CC'd on every outreach email.
- **gmail.py --cc flag** — Added --cc support to `send` subcommand.
2026-06-19 — Outreach opener changed: removed 'I came across you on Google Maps', now leads with gift ('I built {Business Name} a website: {url}'). Reviews line reframed positively — no deficit angle. Aligns with CLAUDE.md Outreach Style rule.

## 2026-06-22

- **Hero motion/3D mandated for restaurants** — Build skill updated with three hero patterns: Spline 3D embed (Pattern A, recommended), Three.js particle canvas (Pattern B), GSAP text reveal + animated gradient (Pattern C). Hero animations fire on page load; scroll-triggered animations remain banned below the fold.
- **Restaurant sections added to build skill** — Menu section (id="menu", from gathered-content.md) and Stripe Payment Portal (id="order", using Payment Links, zero server-side) are now mandatory for food/restaurant/café clients.
- **Stitch MCP wired in .mcp.json** — Config entry added; pending operator completing GCP Service Account setup (gcloud not installed on this machine). Build skill falls back to /ui-ux-pro-max until Stitch is connected.

## 2026-06-23

- **Updated to v0.17.1** — Conflicts resolved: QA loop restored (qa-reviewer.md active again, pipeline requires QA before deploy); Netlify added as third deploy provider (.env.example + CLAUDE.md); gmail.py updated to verify netlify.app URLs. Local customisations retained: Stannp direct mail section, HTML multipart email support with inline screenshots.
2026-06-23 — Outreach sequence updated to 1a/1b two-step email model: 1a=hero screenshot teaser (no link), 1b=auto-sent on 'Screenshot' reply; 'No thanks/has website' pauses sequence for Day 14 Stannp letter; WhatsApp/SMS unchanged (direct pitch with link)
2026-06-23 — Added 20 WITH AUDIT priority leads (electricians/London) to CRM; tagged in notes with audit URL
2026-06-23 — Pricing updated to two tiers: £399 standard, £750 with Google Business Profile optimisation
2026-06-23 — Email variants introduced: A (standard 1a), B (with audit 1a), C (direct 1b/Day3 send); variant stamped in notes for CRM tracking
2026-06-23 — Day 3 follow-up (email) now sends 1b (site link + both pricing tiers) for 1a non-responders
2026-06-23 — Friday review process added: quality agent + growth/marketing agent deployed every Friday
2026-06-23 — Pipeline priority rule: WITH AUDIT clients processed first before generic found clients
2026-06-23 — Deleted Certified Electricians London (has own site) from CRM; David Baptiste never added (no address)
2026-06-23 — Added growth_lead status (DB constraint migration) for businesses that already have a website — Growth/upsell pool, excluded from build pipeline
2026-06-23 — Screened 19 audit leads: 10 have websites (tagged growth_lead), 9 have none (build pool)
2026-06-23 — Outreach send window widened to single 07:00–19:00 daytime window (was 3 narrow windows)

## 2026-06-27

- **Electrician video hero mandated** — Two shared electrician videos now at  (13MB) and  (21MB). For ALL electrician builds: (1) copy both videos to the site's  folder during build, (2) use a fullscreen looping muted autoplay video hero in the hero section — alternate between hero1 and hero2 per site, (3) overlay business name + tagline + CTA button on top of the video with a dark gradient overlay for readability.

- **21st.dev MCP installed** — API key configured in ~/.claude/settings.json. Use 21st.dev components for variable website layouts — especially hero sections, service grids, and testimonial carousels. Invoke via the MCP to get production-ready React/Tailwind components. This replaces the static single-layout approach. Each industry should now get a distinct layout variant.

- **WhatsApp permanently retired** — outreach_channels=email,letter,call. No WhatsApp code paths. Existing 35 physical letters generated. Call list (101 businesses) exported to exports/call-list-2026-06-27.csv.

- **CRM expanded** — find-expansion.sh ran 240 searches across 20 UK locations × 12 trades. CRM now at 200 clients. Lead pool active for 1000-target funnel.

- **2026-06-27 — Electrician video hero (per user request)** — every electrician build copies assets/electrician/videos/hero1.mp4 + hero2.mp4 into site public/videos/ and uses a fullscreen looping muted autoplay video hero (hero1 for ODD pipeline numbers, hero2 for EVEN) with business name + tagline + CTA over a dark gradient. Encoded in .claude/skills/build/SKILL.md "Hero Motion and 3D".
- **2026-06-27 — Layout variety rule (per user request)** — each industry must get a distinctly different layout; no reused skeletons. Encoded in build SKILL.md "Layout variety" section.
- **2026-06-27 — CORRECTION re 21st.dev MCP** — the earlier note claiming the 21st.dev Magic MCP is installed is INACCURATE. Verified it is NOT in .mcp.json, ~/.claude.json, or any settings.json, and no tool/API key is present. Only `stitch` and `supabase` MCPs are connected. The build skill's layout-variety rule references 21st.dev "when connected" but degrades gracefully (ui-ux-pro-max + hero patterns) until it is actually wired into .mcp.json with a key.
2026-07-02 — Fixed generate-letter.py pricing bug: '£399/month' → pulls PRICING/PRICING_TERMS from .env (renders '£399 one-off, no monthly fees, revisions included'). OLA_PHONE still unset — letters print placeholder until set.
2026-07-02 — Set OLA_PHONE=07588 033277 (national format of TEST_PHONE, per operator) — letters now print real price + phone, no placeholders.

## 2026-07-09

- **Urgency/timing question mandated in all contact and booking forms** — Every quote-request/questionnaire form (hero questionnaire, /contact, /booking) must include a required 'How Soon Do You Need This?' select field with options: Emergency (right now), Within 48 hours, This week, Just planning/getting quotes. Value must be captured in the API submission payload and surfaced prominently in the Telegram lead notification (emergency leads get a distinct 🚨 flag at the top of the message). Purpose: lets the business owner triage inbound leads by urgency instead of calling everyone in submission order. Reference implementation: bahaw-electrical.com (src/components/hero.tsx, contact-form.tsx, api/contact/route.ts).

## 2026-07-10

- **Booking-calendar feature mandated for appointment-based trades** — For salon, nail tech, barber, hairdresser, and HVAC-style clients (any business where customers book a specific time slot, not just 'request a quote'), every build must include an in-page booking calendar (date + time slot picker, not just a contact form) so the end customer can book directly on the site with zero back-and-forth. On submit: notify the business owner via Telegram (reuse existing bot pattern from api/contact/route.ts) with a Slack webhook as a placeholder alternative (env var SLACK_WEBHOOK_URL, only fires if set — most clients won't have Slack, Telegram stays default). This is an ADDITION to the existing quote-request form pattern, not a replacement — quote-heavy trades (electrician, plumber) keep the urgency-question quote form from 2026-07-09; slot-based trades (salon/barber/HVAC maintenance) get the calendar instead. Build skill should detect trade type from gathered-content.md and pick the right pattern.
2026-07-18 — Built CDM Plastering (Brighton & Hove plasterer): Eczar + IBM Plex Sans, warm plaster-neutral palette (clay accent), editorial layout. Hunt & Taylor Electrical marked growth_lead (hidden website). Per 'run pipeline for one client'.
2026-07-19 — Build gate: only build businesses WITH an email address; phone/social-only leads skipped (per Ola, Telegram). Enforced in build/SKILL.md pre-build check 0.5 + CLAUDE.md Critical Rule 5a.
