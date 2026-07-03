# Klaudius — Autonomous Website Builder

> The MY-agency pipeline on the Hostinger VPS. Target: 1000 SME sites. 75 built so far.
> This folder is the operating manual and design spec; the site code lives on the VPS.

## Files

- [[always-on-builds]] — builds that survive laptop close. systemd runner, max 3 concurrent, install scripts in `scripts/`
- [[interactive-experiences]] — patterns to make generated sites feel premium (estimator, before/after, reveals)
- [[service-display-loop]] — the 4-beat service loop component spec, plus the Higgsfield/TikTok reuse plan

## Current status (2026-07-03)

- **Interruption problem: solved on paper.** Scripts written and smoke-tested. Needs a 2-command install on the VPS (see always-on-builds)
- **Concurrency capped at 3** builds at a time to protect VPS resources and keep token spend predictable
- **Email approach 1a/1b live** (screenshot-only vs weblink). Loop component is designed to feed both
- **Notion items 1-3**: page is private, unreadable from a session without Notion access. Paste the text of items 1-3 into chat or make the page public, then the premium UI/UX extraction gets folded into the two design docs

## Open items

1. Run `setup-vps.sh` on the Hostinger VPS (Ola, 15 min, instructions in always-on-builds)
2. Paste Notion items 1-3 content so it can be merged into the design docs
3. `DietrichGebert/ponytail` clone was blocked pending approval in this session; `agency-agents` is a macOS Homebrew cask so it installs on the laptop, not the VPS or this environment. Decide if either is still wanted and where

← Back to [[Engine]]
