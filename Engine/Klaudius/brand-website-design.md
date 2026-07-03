# Brand Website Design

> Item 2 from Notion. Turn a branding brief into a complete, fully functional animated site with real copy and visuals in place, not a wireframe.

## The build

A complete website from a single brief: Fable writes the copy, generates/sources the images, and animates every section. Delivered as a self-contained file a client can open in the browser immediately.

## Process

Use Claude Design to:
1. Build the **Design Guidelines** first (brand colours, typography, tone, spacing, imagery style)
2. Then use those guidelines + the brief to generate the **full website**

## The prompt (step 2, after guidelines are done)

```
Build me a complete, fully functional brand website based on my input. I want 
a finished, animated site with real copy and real visuals in place, not a wireframe 
or placeholder blocks. Deliver it as a self-contained file I can open in the browser 
and hand to a client.
```

## Output format

- Single self-contained HTML file
- All CSS and JS inline (no external dependencies)
- Animated sections (scroll reveals, transitions, micro-interactions)
- Real copy and real images (not Lorem Ipsum)
- Mobile responsive, fullscreen ready
- Drop into Klaudius as a template or run per-client as a bespoke build

## Rollout into Klaudius

For each generated SME site:
1. Extract the client's brand brief (trade, location, key services, tone)
2. Use Claude Design to generate Design Guidelines
3. Use those guidelines to build the full website
4. Embed as the landing page, or run as the primary site

This is a different approach from the component-based pipeline: each site is bespoke, fully animated, copy-complete. Use when the client brief is strong and you have visual reference.

Related: [[interactive-experiences]] · [[service-display-loop]]
