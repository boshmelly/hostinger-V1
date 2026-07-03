# Ponytail Integration

> Ponytail is the "lazy senior dev" skill: before writing code, it stops at the first rung that holds (YAGNI → reuse → stdlib → native → installed dependency → one-liner). For Klaudius, this is the code-writing discipline.

## What ponytail brings

1. **Minimal code discipline.** Every interactive component in Klaudius (brand game, quote estimator, before/after, reveals, counters) is written to the ponytail ladder, which means:
   - No bloat (every line has a reason)
   - No over-dependencies (reuse stdlib and platform features first)
   - Reusable across all 75+ sites (one component, one prompt, one maintenance point)

2. **Pre-built patterns.** Ponytail ships with examples in `examples/`: debounce, rate-limit, infinite-scroll, react-countdown, modal-dialog, email-validation, etc. Use these as templates for Klaudius components.

3. **Review mode.** The `ponytail-review` skill audits generated code against the ladder, catching over-builds before they ship. Chain it into the Klaudius build pipeline to QA each site.

## The ladder (in order)

1. Does this need to exist? (YAGNI) → skip it
2. Already in this codebase? → reuse it
3. Stdlib does it? → use it
4. Native platform feature? → use it
5. Installed dependency? → use it
6. Can you do it in one line? → one line

Applied to Klaudius:

- Quote estimator: native `<input type="range">` (rung 4), no slider library
- Before/after: CSS Grid + `pointer-events` (rung 4), no react-compare-slider
- Reveals: `Intersection Observer` (rung 4), not a library
- Counters: `requestAnimationFrame` (rung 4), not a plugin
- Brand game (sliding puzzle): vanilla JS event listeners (rung 4), not Phaser or Babylon

## Using ponytail in the build prompt

When the Klaudius build prompt generates a site, include this instruction:

```
Follow the ponytail discipline: YAGNI, reuse, stdlib, native platform, 
installed dependency, then one-liner. Every interactive component must 
justify its LOC; remove bloat before you ship.
```

## QA with ponytail-review

After generating a site, run the output HTML/React through the review skill:

```
Audit this code for over-builds using ponytail discipline. Identify any 
lines that could be removed, any dependencies that could be native platform 
features, any copy-paste that should be reused. Report findings.
```

## Repo reference

Cloned to: `/tmp/claude-0/-home-user-hostinger-V1/2efa6c77-8808-5f60-bdbe-4ba956e7b98a/scratchpad/ponytail`

Key folders:
- `skills/` — ponytail, ponytail-review, ponytail-audit, ponytail-help, ponytail-debt, ponytail-gain
- `examples/` — minimal patterns for common UI needs
- `benchmarks/` — proof that ponytail cuts code 54% on average without cutting safety

Related: [[interactive-experiences]] · [[always-on-builds]]
