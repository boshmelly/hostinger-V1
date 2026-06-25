# ARETESTAYS LANDING PAGE
## Markdown Specification for Website Builder
---

## SECTION 1: HERO — THE EXPLOSION

```
Layout: Full-width dark background (charcoal #1a1a1a) with accent color (green #2f5a43)
Typography: Bold, short, declarative. No questions. No soft language.
```

### Hero Headline (Explosive)
```
PRIMARY HEADING
"Your Home Away From Home.
Built For People Who Move."

SIZE: 52px (desktop) / 32px (mobile)
FONT: Sans-serif, ultra-bold (weight 800)
COLOR: White
LINE-HEIGHT: 1.2

SUPPORTING SUBHEADING
"4 nights to 26 months. Inspected in person. 
Families, contractors, relocating professionals. 
London. Essex. Surrey."

SIZE: 18px
FONT: Regular weight
COLOR: Light gray (#e0e0e0)
MARGIN-TOP: 16px
```

### Hero Background Visual (Interactive Element 1)
```
BACKGROUND ANIMATION:
- Rotating property cards (4–5 cards, slight 3D tilt)
- Each card fades in/out showing different property types
- Card 1: Modern 2-bed apartment (Essex)
- Card 2: Spacious family house (Surrey)
- Card 3: Corporate housing (London)
- Card 4: Insurance placement property (Woolwich)
- SPEED: Slow rotate (8 seconds per cycle)
- OPACITY: 15–20% so headline stays readable

ALTERNATIVE (if no animation support):
- High-res image of one beautiful interior (bedroom, modern, light-filled)
- Overlay: 40% dark gradient to keep text readable
```

### Hero CTA Button (Above the fold, right-aligned)
```
PRIMARY BUTTON:
TEXT: "Explore Our Stays"
PADDING: 16px 28px
BACKGROUND: Green (#2f5a43)
TEXT COLOR: White
HOVER: Darker green (#1f3d2f)
FONT-WEIGHT: 700
POSITION: Top-right of hero section, 80px from top

SECONDARY BUTTON (below primary):
TEXT: "Free Assessment"
STYLING: White text, green outline, transparent background
HOVER: Green fill, white text
```

---

## SECTION 2: TRUST BLOCK — THE PROOF
```
Background: White (#ffffff)
Grid: 4 columns (responsive: 2 on tablet, 1 on mobile)
Spacing: 32px between cards
```

### Card 1: Trustpilot Rating
```
STAT: "4.3 ⭐"
LABEL: "Rated on Trustpilot"
SUBTEXT: "Based on 10+ verified guest reviews"
ICON: Star burst or shield icon (green)
LINK: "Read all reviews" → https://uk.trustpilot.com/review/aretestays.co.uk
```

### Card 2: Properties Inspected
```
STAT: "100%"
LABEL: "In-Person Inspected"
SUBTEXT: "Every property verified before listing"
ICON: Checkmark in circle
VISUAL: "What we check: Cleanliness, Safety, Amenities, Photos accuracy"
```

### Card 3: Guest Satisfaction
```
STAT: "4.8 / 5"
LABEL: "Average Guest Rating"
SUBTEXT: "Consistent feedback: Clean, Modern, Safe"
ICON: Heart or thumbs-up
QUOTE EXCERPT: "Very hygienic, had everything needed, 10/10"
```

### Card 4: Fast Response
```
STAT: "< 2 hours"
LABEL: "Average Response Time"
SUBTEXT: "Monday–Sunday, ready to help"
ICON: Clock or lightning bolt
CTA: "Start a conversation"
```

---

## SECTION 3: INTERACTIVE ZONE — THE CHOOSER
```
Background: Light gray (#f5f5f5)
Type: Interactive component (tabbed selector)
Goal: Let users self-identify their need and see relevant properties immediately
```

### Who Are You? (Tab Selector)
```
TABS (horizontal, clickable, visual state changes):

TAB 1: "👨‍💼 Business Travel"
TAB 2: "👨‍👩‍👧‍👦 Relocation"
TAB 3: "🏗️ Contractor"
TAB 4: "🏥 Insurance Placement"
TAB 5: "👥 Groups"

STYLING:
- Border-bottom animation on active tab
- Text color: Green (#2f5a43) when active, gray when inactive
- Smooth transition (0.3s)
```

### What Happens When User Clicks a Tab?

**TAB 1: BUSINESS TRAVEL**
```
CONTENT SHOWN:
Heading: "Your Base For Work. Your Comfort For Rest."
Description (50 words): "Modern apartments & townhouses with desk space, 
high-speed WiFi, and proximity to London's business hubs. 
Longer stays mean lower nightly rates. Book weekly, pay less."

PROPERTY CARDS DISPLAYED (3–4 examples):
- Modern 2-bed Woolwich (desk, amenities, CCTV parking)
- Contemporary flat Canary Wharf (walking distance to offices)
- Spacious house Chislehurst (quiet, business-friendly)

CARD ELEMENTS:
- Hero image (high quality, realistic lighting)
- Nightly rate starting at £XX
- Quick amenities list: WiFi, Desk, Kitchen, Parking
- "Check Availability" button (green, actionable)

CTA BELOW CARDS: "See all business properties" → filtered listing page
```

**TAB 2: RELOCATION**
```
CONTENT SHOWN:
Heading: "Moving? Take Your Time Settling In."
Description: "1–6 month stays. Properties come fully furnished and ready. 
We handle the logistics. You focus on your new city."

PROPERTY CARDS:
- Family house Woolwich (3 bed, move-in ready)
- Spacious apartment Canary Wharf (modern, light-filled)
- Townhouse Essex (suburban, family-friendly)

AMENITIES HIGHLIGHTED:
- Fully furnished (no need to buy)
- Utilities included (no setup headache)
- Long-term discounts (save 20% vs short-term)
- Flexible extension (extend or exit, no penalty)

CTA: "Discuss your relocation needs" → booking form
```

**TAB 3: CONTRACTOR**
```
CONTENT SHOWN:
Heading: "Site Work. Site Stay. Simple."
Description: "Weeks or months. Close to major London projects. 
Secure parking. Clean kitchen. WiFi. Sleep well. Work hard."

PROPERTY CARDS:
- Modern house Woolwich (easy commute, parking)
- Apartment near A2 corridor (20 min to Essex sites)
- Townhouse Croydon (south London access)

AMENITIES HIGHLIGHTED:
- Secure parking included
- Weekly housekeeping (optional add-on)
- Late check-out / early check-in available
- Furnished (no need to bring your stuff)

CTA: "Check rates for contractors" → contractor booking flow
```

**TAB 4: INSURANCE PLACEMENT**
```
CONTENT SHOWN:
Heading: "Displacement Housing. Done Right."
Description: "We understand the urgency. Properties ready 24 hours. 
Direct billing to insurers. Fast, professional, compassionate."

PROPERTY CARDS:
- 1-bed apartments (immediate availability)
- 2-bed houses (families)
- Accessible units (mobility needs)

WHAT WE HANDLE:
- Insurance company coordination
- Fast approval & placement
- Weekly check-ins
- Pet-friendly options (if needed)

CTA: "Get placement support" → insurer contact form
```

**TAB 5: GROUPS**
```
CONTENT SHOWN:
Heading: "House Your Team. Keep Them Happy."
Description: "Events, conferences, relocations. Multiple properties 
in the same area. Coordinated pricing. Simplified admin."

PROPERTY CARD EXAMPLE:
- "4-property cluster in Woolwich"
- Sleeps 12–15 people
- Shared common areas available
- Team rates (10%+ discount)

WHAT WE ORGANIZE:
- Block booking discounts
- Unified billing
- Group coordination & support
- Welcome packs (optional)

CTA: "Request a group quote" → quote form
```

### Interactive Zone Styling
```
CARD DISPLAY:
- Smooth fade-in when tab is clicked (0.4s transition)
- Cards display in a 2-column grid (responsive: 1 on mobile)
- Each card has a shadow on hover (lifts slightly)
- Image takes 60% of card height, content 40%

PROPERTY IMAGE REQUIREMENTS:
- High-res, natural lighting (no staged/fake feel)
- Property shown in use (guest in the space, or space ready to be used)
- Consistent color tone across all images
- Alt text: "[Room type] in [location] — AreteStays"
```

---

## SECTION 4: GUEST VOICES — SOCIAL PROOF CAROUSEL

```
Background: White
Layout: Carousel (3 visible cards, horizontal scroll, auto-rotate every 6 seconds)
```

### Review Cards (Rotating)
```
CARD TEMPLATE:
LAYOUT:
  - Guest name & location (top left)
  - Star rating (5 stars)
  - Quote (italicized, 40–60 words)
  - Property type / stay length (small text, gray)

EXAMPLE CARD 1:
Name: "Sarah M. — Business Travel"
Rating: ⭐⭐⭐⭐⭐
Quote: "Clean, modern, everything provided. WiFi was reliable, 
beds comfortable. I've stayed 3 times now. Best rates I've found 
for furnished short-term in London."
Length: "4-week stay"

EXAMPLE CARD 2:
Name: "Marcus & Family — Relocation"
Rating: ⭐⭐⭐⭐⭐
Quote: "Moved from Surrey to London for work. The house was already 
furnished, utilities set up, CCTV parking. We didn't have to stress 
about anything except unpacking. Highly recommend."
Length: "6-month placement"

EXAMPLE CARD 3:
Name: "Jamie T. — Contractor"
Rating: ⭐⭐⭐⭐⭐
Quote: "Site work near Woolwich. Needed somewhere reliable for 
3 months. Secure parking, quiet, clean. Checkout was easy. 
Booking the next project already."
Length: "12-week stay"

EXAMPLE CARD 4:
Name: "Insurance Team — Fast Placement"
Rating: ⭐⭐⭐⭐⭐
Quote: "Client needed emergency housing. AreteStays had them 
placed within 24 hours. Professional, compassionate, zero hassle. 
We use them for all our displacement cases now."
Length: "Emergency placement"

STYLING:
- White card, subtle shadow
- Green accent bar at top (brand color)
- Responsive: 1 card on mobile, 2 on tablet, 3 on desktop
- Auto-rotate every 6 seconds (pause on hover/interact)
- Manual next/prev arrows (green, clear)
```

---

## SECTION 5: WHAT MAKES US DIFFERENT — COMPARISON

```
Background: Light gray (#f9f9f9)
Layout: Side-by-side comparison table (visual, not dense)
Typography: Simple, scannable
```

### Comparison Matrix
```
COLUMN 1 HEADER: "Airbnb / Booking.com"
COLUMN 2 HEADER: "Chain Hotels"
COLUMN 3 HEADER: "AreteStays"

ROW 1: In-Person Inspections?
  | ❌ Self-listed (unknown quality)
  | ❌ Never (it's a hotel room)
  | ✅ 100% inspected before listing

ROW 2: Furnished & Ready?
  | ⚠️ Sometimes inconsistent
  | ✅ Yes, but feels corporate
  | ✅ Yes, feels like home

ROW 3: Parking Included?
  | ❌ Often extra charge
  | ❌ Often extra charge
  | ✅ Included standard

ROW 4: Flexible Length (1 month+)?
  | ⚠️ Possible but unpredictable
  | ❌ No (minimum 1 night, not suited)
  | ✅ 4 nights to 26 months

ROW 5: Long-Stay Discounts?
  | ❌ No (increases with length)
  | ❌ No (daily rate fixed)
  | ✅ 20% off for 8+ weeks

ROW 6: Personal Check-Ins?
  | ❌ Automated messages only
  | ⚠️ Front desk (if you ask)
  | ✅ Weekly, proactive

ROW 7: Insurance Direct Billing?
  | ❌ No
  | ⚠️ Some properties only
  | ✅ Standard service

VISUAL STYLING:
- Green checkmarks (✅) for AreteStays
- Red Xs (❌) for competitors
- Amber warnings (⚠️) for partial
- No snarky language (factual, matter-of-fact)
```

---

## SECTION 6: THE CTA BLOCK — BELOW THE FOLD

```
Background: Dark green (#2f5a43)
Text: White
Layout: Center-aligned, breathing room (padding: 64px all sides)
```

### What's Your Next Move?

```
HEADLINE: "Ready to Find Your Next Home?"
SUBHEADING: "Start in 2 minutes. No pressure. Just information."

FORM FIELDS (simple, 3 visible):
  - "Your name" (text)
  - "What brings you to London?" (dropdown: Business / Relocation / Contractor / Insurance / Group)
  - "How long do you need?" (dropdown: 1–4 weeks / 1–3 months / 3–6 months / 6+ months)

BUTTON:
  - TEXT: "Get Started"
  - COLOR: White text, white background → hover: green background, white text
  - ACTION: Submit form → thank-you page + email + calendar link to book a call

SECONDARY TEXT (small, light gray):
  "We typically respond within 2 hours. 
   Or book a call directly → [Calendly link]"
```

---

## SECTION 7: FOOTER

```
Background: Very dark (#1a1a1a)
Text: Light gray (#b0b0b0)
Layout: 4-column grid (responsive: 2 col tablet, 1 col mobile)
```

### Footer Columns

**Column 1: About**
```
Heading: "About AreteStays"
Links:
- Our story
- Meet the team
- Press kit
- Careers
```

**Column 2: Properties**
```
Heading: "Browse"
Links:
- All stays
- Business travel
- Relocation
- Contractors
- Groups
```

**Column 3: Support**
```
Heading: "Help"
Links:
- FAQs
- Booking terms
- Privacy policy
- Contact us
```

**Column 4: Social**
```
Heading: "Connect"
Links:
- LinkedIn
- Instagram
- Trustpilot reviews
- Google reviews
```

### Footer Bottom Bar
```
Copyright: "© 2026 AreteStays Ltd. All rights reserved."
Contact: "hello@aretestays.co.uk | +44 [phone]"
Trust badges: Trustpilot logo, Google Business Profile verified icon
```

---

## RESPONSIVE BEHAVIOR

```
DESKTOP (1024px+):
- Hero: Full-width image carousel background
- Trust block: 4 columns side by side
- Interactive zone: Full-width tabs, 2-column property grid
- Comparison: 3-column table visible
- Review carousel: 3 cards visible

TABLET (768px–1023px):
- Hero: Simplified background (static image or single rotation)
- Trust block: 2 columns (2 rows)
- Interactive zone: 1-column property grid
- Comparison: Stacked layout (rotate table vertically)
- Review carousel: 2 cards visible

MOBILE (< 768px):
- Hero: Single background image, smaller headline
- Trust block: 1 column (stacked cards)
- Interactive zone: Tab width adjusted, 1 card at a time
- Comparison: Simplified version (key points only, less dense)
- Review carousel: 1 card at a time, swipe to next
```

---

## TECHNICAL NOTES FOR BUILDER

```
SEO KEYWORDS TO INCLUDE:
- Serviced accommodation London / Essex / Surrey
- Corporate housing UK
- Furnished short-term rentals
- Relocation services London
- Insurance housing placement

META DESCRIPTION:
"Serviced accommodation for business travel, relocation & contractors. 
4 nights to 26 months. In-person inspected. East London, Essex, Surrey."

IMAGE OPTIMIZATION:
- All hero images: WebP format, 2x sizes for Retina
- Lazy-load property cards (load on scroll)
- Alt text on every image

INTERACTIVE FEATURES:
- Tab switching: CSS transitions (no page reload)
- Carousel: Auto-rotate every 6 seconds, pause on hover
- Forms: Client-side validation, show errors inline
- Buttons: Hover states, active states, focus for accessibility

ACCESSIBILITY:
- Color contrast ratio 4.5:1 minimum (WCAG AA)
- All images have alt text
- Form labels properly associated with inputs
- Keyboard navigation works throughout
- Focus states visible on all interactive elements
```

---

## CONTENT TO SOURCE FROM MELLY

```
BEFORE BUILD:
1. Hero background images or video (3–5 property interiors)
2. 4–6 high-res property photos (representing different stay types)
3. Google reviews text (to feature in social proof)
4. Trustpilot URL (to link from trust block)
5. Team bio & photo (for About section)
6. Phone number + email for footer

BEFORE LAUNCH:
1. Google Business Profile URL (to link from footer)
2. Calendly link (for CTA / footer)
3. Email confirmation template (for form submissions)
4. Privacy policy & T&Cs (for footer links)
5. Instagram handle (for social links)
```

---

## SUCCESS METRICS

Track these after launch:
```
- Hero CTA click-through rate (target: 8–12%)
- Trust block engagement (which stat gets clicked most?)
- Interactive zone tab selection (which need type is most popular?)
- Form submission rate (target: 5–8% of visitors)
- Review carousel pause-on-hover rate (indicates engagement)
- Mobile vs desktop conversion (are mobile users converting?)
```

---

## BUILD CHECKLIST

```
☐ Hero section with animated property cards (or static fallback)
☐ Trust block with 4 stat cards, Trustpilot link active
☐ Interactive tab zone (5 tabs, content changes on click)
☐ Property cards within each tab (images, prices, CTAs)
☐ Guest review carousel (auto-rotate, manual arrows)
☐ Comparison table (AreteStays vs competitors)
☐ CTA form (3 fields minimum: name, need, length)
☐ Footer with all sections + links + social
☐ Mobile responsiveness (test on real devices)
☐ Accessibility audit (keyboard nav, color contrast, alt text)
☐ Form submission working (test end-to-end)
☐ Google Analytics tagged (track clicks, form submits)
☐ Open Graph meta tags (for social sharing)
```

---

**FINAL NOTE TO MELLY:**
This landing page converts because it answers one question immediately: 
"Is this for me?" The interactive zone lets users self-identify, see 
proof instantly, and move to action. The trust block compounds the 
credibility. The hero explosion tells people you're serious and 
different.

Hand this to your builder. They'll know what to do.
