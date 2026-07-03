# PR Glossary & Deployment History

## What is a PR? (3 sentences)

A **Pull Request (PR)** is a versioned change request in GitHub. It shows exactly what code changed and why (the commit history), and allows review before merging into the main branch. Each PR gets a number (#1, #2, #3, etc.) for tracking and reference.

---

## Klaudius Deployment PRs

### PR #1: (Reserved)
Placeholder for first Klaudius feature PR.

### PR #2: (Reserved)
Placeholder for second Klaudius feature PR.

### PR #3: Klaudius always-on VPS build runner + site experience specs
**Status:** Draft (ready for review and merge)

**What shipped:**
- Always-on systemd build runner (max 3 concurrent, survives SSH drop)
- Smoke-tested runner (queue → active → done workflow verified)
- Interactive experience patterns (6 ranked by conversion value)
- Bespoke animated website design spec
- Service display loop (4-beat carousel, in-store screen mode)
- Ponytail integration (minimal code discipline, YAGNI ladder)
- VPS installer scripts + systemd service unit

**Commits:**
1. `52dab81` — Add Klaudius ops folder: always-on VPS runner, interactive patterns, service loop spec
2. `86f26fa` — Allow .sh and .service files in vault; add Klaudius runner scripts
3. `a7db472` — Fold Notion items 1-3 into Klaudius specs
4. `6c8d9cb` — Add ponytail integration guide
5. `4ab4bf2` — Add delivery summary
6. `fb4cf5c` — Update Klaudius index to reference ponytail-integration

**Files changed:**
- `Engine/Klaudius/` (new folder)
  - `Klaudius.md` — index and status
  - `DELIVERY.md` — what shipped, what's next
  - `always-on-builds.md` — install and daily use
  - `interactive-experiences.md` — 6 patterns + do-not-add list
  - `brand-website-design.md` — bespoke animated sites
  - `service-display-loop.md` — 4-beat carousel spec
  - `ponytail-integration.md` — minimal code discipline
  - `scripts/` — runner, service, installer (ready to parameterize)
- `.gitignore` — extended to allow `.sh` and `.service` files

**Why this matters:**
Solves the "laptop close interrupts builds" problem. Builds now run 24/7 on the VPS independent of SSH. One install command on a new VPS, then queue sites and close the laptop.

**Next step:** Run `setup-vps.sh` on the Hostinger VPS to make the runner live.

---

## Future PRs (planned)

### PR #4 (planned): Parameterized template + multi-instance support
- DEPLOYMENT-TEMPLATE.md (comprehensive guide)
- Refactored scripts with environment variables
- Preflight validation + license check
- Support for multiple concurrent instances (prod, staging, test)

### PR #5 (planned): Component templatisation
- Reusable Next.js components for all 6 interactive patterns
- Per-site `services.json` schema
- Integration into Klaudius build prompts

### PR #6 (planned): Ponytail-review QA integration
- Automated code audit for each generated site
- YAGNI ladder validation in build pipeline
- Fail-fast on over-builds

---

## License

**Klaudius License Key:** `-3FR2-Q986-Y9D4-RJQT`

All PRs and deployment templates use this key for validation and tracking.
