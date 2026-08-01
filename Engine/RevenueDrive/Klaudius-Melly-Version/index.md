---
name: klaudius-melly-version
description: Snapshot of the customized Klaudius pipeline (Team A/B strategy, lessons, config) as of the 2026-07-26 update to v0.21.0
metadata:
  type: project
  date: 2026-07-26
---

# Klaudius — Melly Version (snapshot 2026-07-26)

Captured right after updating the live VPS pipeline from Klaudius 0.17.1 → 0.21.0.
This is the **strategy/knowledge layer**, not the full system — see the note on the
32GB full backup below for why the two are kept separate.

## What's here

- [[strategy-docs/lessons|lessons.md]] — the full accumulated operational
  playbook: email-gating rules, disqualify-at-gather, Team C / rescue mode
  pricing, QA + hero motion gate, photo/build/deploy gotchas. This is the
  single most valuable file in the whole system — months of hard-won fixes.
- [[strategy-docs/outreach-variations|outreach-variations.md]] — every
  outreach template: Ph1a/Ph1b sequences, the 11-touch Team B cadence, the
  Nigeria/Kenya/SA pricing corrections, the WhatsApp reply-gated protocol,
  the Upwork inbound-opener template.
- [[strategy-docs/CLAUDE|CLAUDE.md]] — canonical Klaudius v0.21.0 project
  reference (updated this session — includes the new `/seo`, `/booking`,
  `/auto-updating-google-rating` skills and the real `PIPELINE_MODES`
  rescue-mode switch).
- [[strategy-docs/CUSTOMISATIONS|CUSTOMISATIONS.md]] — what's been changed
  from stock Klaudius, tracked by the platform itself.
- `strategy-docs/env.example.txt` — the config surface (env vars), for
  reference when setting up a fresh instance.

## Why the 32GB isn't dumped here

Obsidian is a markdown vault — it's built to hold and link notes, not
gigabytes of built client sites, node artifacts, and images. The full
32GB backup (`clients/` directory, every deployed site's build output,
`node_modules`-scale bulk) lives where it belongs: on the VPS at
`/root/Klaudius - Melly Version` (a full `cp -a` snapshot taken right
before the 0.21.0 update, 2026-07-26).

**If you ever need the full thing locally:**
```bash
rsync -avz --progress root@72.61.18.158:"/root/Klaudius - Melly Version/" ~/klaudius-full-backup/
```
Fair warning: 32GB, will take a while depending on connection.

## Timeline this snapshot represents
- 2026-07-24: email-first gating, disqualify-at-gather, daily outreach
  dispatch cron built, Africa market pricing (Nigeria/Kenya/SA)
- 2026-07-25: Nigeria pricing corrected ($399→$150-250) after real
  competitor validation, WhatsApp reply-gated protocol locked in after
  ban-risk research, 11-touch Team B sequence, US expansion scouting
  (Austin, TX recommended)
- 2026-07-26: Klaudius updated 0.17.1→0.21.0, rescue mode + Team C
  enabled, QA hero-motion gate switched on, Upwork channel retired
  (account/payment not set up)
