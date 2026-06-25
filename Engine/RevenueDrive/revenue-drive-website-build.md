# Revenue Drive Website — Build State

> Production site to replace the outdated revenuedrive.co.uk. Targets UK electricians.
> Source: consolidated from scattered AI memory, 2026-06-25. Verify against the repo before acting.

**Build location:** `~/Desktop/revenue-drive-website`
**Tech:** Next.js 14 App Router, TypeScript, Tailwind, Framer Motion, Lucide React.
**Deploy target:** Vercel → connect to GHL via domain forwarding or static export.

## Built

- Container scroll-animation hero (Framer Motion)
- Website URL checker, 3-step form (URL → email → success)
- Problem/Solution, Automation Showcase, Services (6 cards with video slots)
- Pricing (3 tiers: £500/£350/£100, most expensive first, expandable features)
- ScoreApp quiz link: https://melly-nxwkxfay.scoreapp.com/
- Trust section, animated counters + testimonials, sticky mobile CTA

## TODO before launch

- Add real electrician photos to `/public/images/`
- Add 5-10s ambient videos to `/public/videos/`, uncomment `<video>` tags in Services.tsx
- Replace placeholder phone/email/Calendly URL with real contact details
- Deploy to Vercel, then connect to GHL

Related: [[mi]]
