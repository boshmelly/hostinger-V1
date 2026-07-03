# Interactive Experiences for Klaudius Sites

> Item 2 from the workflow review. How to make the generated SME sites feel premium and alive
> instead of static brochures. Stack assumption: Next.js + Tailwind + Framer Motion (same as the
> Revenue Drive build), so everything here drops straight into the Klaudius templates.

## The principle

Interactivity on an SME site has one job: get the visitor to *do something small* before you ask for the big thing (call, book, pay). Every pattern below is a small yes that leads to the enquiry.

## The patterns, ranked by conversion value

### 1. Instant quote / price estimator (highest value)
A 3-slider calculator: job type, size, urgency. Shows a live price range, then "Get exact quote" captures the lead. For a service business this outperforms every animation on the page.

```tsx
// components/QuoteEstimator.tsx (skeleton)
const [jobType, setJobType] = useState('rewire');
const [rooms, setRooms] = useState(3);
const estimate = BASE[jobType] + rooms * PER_ROOM[jobType];
// render sliders + animated <Counter value={estimate} /> + CTA
```

### 2. Before/after slider
Drag handle across two photos of a real job. Trades sell transformation; this shows it without a word of copy. Use `react-compare-slider` (3kb) or a plain range input over two absolutely positioned images.

### 3. The URL / business checker (already proven)
The Revenue Drive pattern: visitor enters their website or postcode, gets a small personalised result, then the email step. Reuse this component across all Klaudius verticals; only the copy changes.

### 4. Scroll-triggered reveals (cheap polish, use everywhere)
Framer Motion `whileInView` on every section. This is the single cheapest "premium feel" upgrade:

```tsx
<motion.section
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.5 }}
>
```

### 5. Animated counters + live proof
Jobs completed, years trading, response time. Count up on scroll into view. Pair with a rotating testimonial. Already built for Revenue Drive; templatise it.

### 6. Micro-interactions on CTAs
Hover scale 1.02, tap scale 0.98, sticky mobile call button with a subtle pulse every 8s. Small, but it is the difference between template and premium.

## What NOT to add

- Chatbot widgets on generated sites (maintenance burden across 75+ sites, and SME owners will not answer them)
- Autoplaying sound, cursor effects, heavy WebGL. Kills mobile performance, and trade customers are 70%+ mobile
- More than one calculator/quiz per page. One interactive centrepiece per site

## Rollout into Klaudius

1. Build each pattern once as a component in the Klaudius template repo (`QuoteEstimator`, `BeforeAfter`, `Checker`, `Reveal`, `Counter`)
2. The build prompt per site then only picks which centrepiece to use and feeds the trade-specific numbers
3. Patterns 4-6 go into every build by default, zero prompt cost

Related: [[always-on-builds]] · [[service-display-loop]]
