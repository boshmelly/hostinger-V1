# Klaudius — Autonomous Website Builder

> The MY-agency pipeline on the Hostinger VPS. Target: 1000 SME sites. 75 built so far.
> This folder is the operating manual and design spec; the site code lives on the VPS.

## Files

- [[always-on-builds]] — builds that survive laptop close. systemd runner, max 3 concurrent, install scripts in `scripts/`
- [[interactive-experiences]] — patterns to make generated sites feel premium (brand game, estimator, before/after, reveals)
- [[brand-website-design]] — bespoke animated website design from a brief, with real copy and visuals
- [[service-display-loop]] — the 4-beat service loop component spec, plus Higgsfield/TikTok reuse and in-store screen mode
- [[ponytail-integration]] — minimal code discipline for all Klaudius components (YAGNI ladder, review QA)

## Current status (2026-07-03)

- **Interruption problem: solved on paper.** Scripts written and smoke-tested. Needs a 2-command install on the VPS (see always-on-builds)
- **Concurrency capped at 3** builds at a time to protect VPS resources and keep token spend predictable
- **Email approach 1a/1b live** (screenshot-only vs weblink). Loop component is designed to feed both
- **Notion items 1-3: incorporated.** Brand game (sliding puzzle), bespoke animated website design, in-store screen loop mode all folded into the specs

## Open items

1. Run `setup-vps.sh` on the Hostinger VPS (Ola, 15 min, instructions in always-on-builds)
2. Clone ponytail repo for brand game prompts and tooling

← Back to [[Engine]]
