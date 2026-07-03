# Service Display Loop (product loop, adapted for services)

> Item 3 from the workflow review. E-commerce sites use a product display loop: image, price,
> add to cart, next product. Services need the same rhythm but the "product" is an outcome.
> This is the design for the Klaudius service loop component.

## The loop unit

Each service cycles through a 4-beat card, auto-advancing, pause on hover:

| Beat | Content | Example (electrician) |
|---|---|---|
| 1. Name it | Service title + one-line promise | "Full Rewire. Done in 5 days, zero mess." |
| 2. Show it | Photo or 5-10s ambient video of the work | Clip of tidy consumer unit install |
| 3. Prove it | One number or one testimonial line | "214 rewires since 2019" |
| 4. Ask | Single CTA | "Get a rewire quote" → estimator |

Six services on a site = six loop cards in a grid on desktop, a swipeable carousel on mobile. Each card runs its own loop, staggered so the page feels alive without being chaotic.

## Component spec

```tsx
// components/ServiceLoop.tsx
type ServiceBeat = { kind: 'title' | 'media' | 'proof' | 'cta'; content: string; mediaUrl?: string };
type Service = { slug: string; beats: ServiceBeat[] };

// Behaviour:
// - AnimatePresence crossfade between beats, 3.5s per beat
// - pause on hover/focus, swipe to advance on touch
// - stagger: card index * 900ms initial delay so cards are out of phase
// - beat 4 holds until interaction or 6s, then loops to beat 1
// - respects prefers-reduced-motion: falls back to static card with all 4 beats stacked
```

Data per site comes from the build prompt as JSON, so Klaudius generates `services.json` per client and the component stays identical across all 75+ sites. One component, maintained once.

## Why this matters for the agency offer

- The 1a emails (screenshot only): screenshot the loop mid-beat-2, the media beat. Motion implied even in a still.
- The 1b emails (weblink): the loop is the first thing a prospect interacts with. It demos "your services, displayed like a premium brand" in 10 seconds.
- Upsell path: beat 3 (proof) is empty for most SMEs at build time. "Send us 3 job photos and 2 numbers" becomes the onboarding email, which starts the client relationship.

## Saved for later: Higgsfield / TikTok shop

The same 4-beat loop is a vertical video script: hook (name it), visual (show it), proof, CTA. When the TikTok shop build starts, feed each `services.json` through Higgsfield to generate the video variant of every loop card. Nothing to build now; the data format above is deliberately video-ready. Parked until the Notion items 1-3 context lands (page is private, could not be read this session).

Related: [[always-on-builds]] · [[interactive-experiences]]
