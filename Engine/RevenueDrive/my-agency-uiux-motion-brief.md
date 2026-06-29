---
name: my-agency-uiux-motion-brief
type: brief
status: ready-to-run
created: 2026-06-28
---

# My-Agency — UI/UX + Motion Brief (paste-ready for stitch + ui-ux-pro-max)

> Goal: add jazz, sparkle and motion so the site feels alive and interactive, without tipping into gimmick.
> Run this in your LOCAL Cowork / Claude Code session — the my-agency code and the skills both live there.
> Code is at `~/Desktop/Mr Melly/Businesses/Kladius/my-agency` (per DASHBOARD). NOT in this vault.
> Stack assumed: Next.js + TypeScript + Tailwind + Framer Motion + Lucide (same as revenue-drive-website-build).

## How to run it (local session, in order)

1. `/ui-ux-pro-max` — lock the look/feel first: palette, type pairing, motion personality. Feed it the section list below.
2. `/stitch-design` — generate the upgraded screens/components from that direction.
3. `/stitch-build` — convert to React/Vite/shadcn components and wire into the existing app.
4. `/stitch-utilities` — clean up, convert any leftover mockups to code.

Then verify with `/run` (launch the app) and eyeball each interaction.

## Motion personality (the rule that keeps it premium)

Calm, confident, scroll-driven. Reference: Linear, Stripe, Vercel. NOT: carousels, autoplay hero video, things flying across the screen.

- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (easeOutExpo feel) for entrances.
- **Duration:** 0.4-0.6s entrances, 0.15-0.2s hover/tap feedback.
- **Stagger:** 60-90ms between sibling items.
- **Trigger:** Framer Motion `whileInView` with `viewport={{ once: true, margin: "-15%" }}`.
- **Distance:** 16-24px translate max. Subtle. No big jumps.

## Section-by-section interactions

| Section | Add this |
|---|---|
| **Hero** | Headline words stagger-fade up on load. Subtle animated gradient mesh or aurora behind (slow drift, GPU-only). Primary CTA: soft glow pulse on idle, scale 0.97 on tap. |
| **Logo / trust row** | Marquee that pauses on hover. Greyscale → colour on hover per logo. |
| **Problem / leakage** | Scroll-draw the lead→quote→follow-up→close diagram (SVG path `pathLength` animates 0→1). Red leak dots pulse in sequence. |
| **What we do (4 stages)** | Cards rise + fade on scroll, staggered. Icon does a one-shot draw/morph on enter. Hover: lift 4px + soft shadow + border-accent. |
| **Pricing tiers** | Cards stagger in. "Most popular" tier gets a subtle animated gradient border (conic-gradient rotation). Feature rows expand with height spring. |
| **Counters / stats** | Count-up from 0 when in view (`once: true`). Number flips with a quick blur-in. |
| **Testimonials** | Fade-and-slide between quotes, not a hard carousel. Auto-advance pausable, swipe on mobile. |
| **CTA band** | Background gradient slow-shifts. Button magnetic-hover (cursor pull) on desktop only. |
| **Sticky mobile CTA** | Slides up after hero scrolls out, slides away near footer. |

## Sparkle (use sparingly, 2-3 spots max)

- Hero CTA: tiny particle shimmer on hover (canvas or CSS, ~6 particles, fades fast).
- Section dividers: thin animated gradient line that draws left-to-right on enter.
- Success/confirmation states (form submit): confetti burst ONE time, then never again that session.

## Non-negotiable guardrails

- **Performance:** animate only `transform` and `opacity`. No layout-thrashing props (top/left/width). Lazy-mount heavy canvas. Target Lighthouse perf 90+ mobile.
- **Accessibility:** wrap all motion in `prefers-reduced-motion` — reduced users get instant, no-motion states. Keep focus rings. Marquee/auto-advance must be pausable.
- **Mobile:** disable magnetic/cursor effects on touch. Lighter particle counts. Test on a real phone.
- **No CLS:** reserve space for animated elements so nothing jumps the layout.

## Acceptance check (run before calling it done)

- [ ] Every section animates in once on scroll, never re-fires annoyingly.
- [ ] `prefers-reduced-motion` fully respected (toggle OS setting and reload).
- [ ] No autoplay video, no infinite carousels.
- [ ] Lighthouse mobile perf 90+, CLS < 0.05.
- [ ] Looks calm and premium, not busy. If in doubt, cut an effect.

## Why this isn't running in the cloud session

The my-agency code is on the local Mac/VPS, and the stitch + ui-ux-pro-max skills are installed locally, not in the web Claude session. This brief is the bridge: paste-and-go locally.

Related: [[my-agency-v2-plan]] · [[revenue-drive-website-build]] · [[skill-map]]
