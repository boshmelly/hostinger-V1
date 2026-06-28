---
name: my-agency-v2-plan
type: project
status: draft
created: 2026-06-27
---

# My-Agency V2 — "Last Chance Before You Sell"

## The Premise

Most boomer-owned SMEs (45-70) are either:
- **Burning out** — running the business manually, no systems, no exit plan
- **Planning to sell** — but the business isn't attractive because it is the owner

They are not looking for a tech company. They are looking for a lifeline or a clean exit.

V2 uses the same Klaudius infrastructure but changes the offer sequence and the ICP.

---

## ICP (Ideal Client Profile)

| Attribute | Criteria |
|-----------|----------|
| Age | 50-70, owner-operator |
| Revenue | £200k-£2M (UK) / $250k-$3M (US) |
| Business age | 10+ years, established but stuck |
| Digital presence | None or outdated (pre-2015 site) |
| Signal | Google Business Profile with 4+ stars but low web presence |
| Industries | Trades, professional services, specialist retail, food service |
| Geography | Phase 1: US (Texas, Florida, Ohio — boomer density + English + less sales-averse) / Phase 2: Germany, Netherlands (EU boomer market, high trust, high LTV) |

---

## Offer Sequence

### Stage 1 — The Gift (Klaudius builds it first)
Same as V1. Build the website, deploy it, send outreach.
Email subject: "I built [Business Name] something — it's live now"
No ask. Just deliver.

### Stage 2 — The Question (3-4 days after stage 1)
One reply-baiting question. Not a form. Not a survey.
Pick from:

- "Is the phone number on it the right one to send enquiries to?"
- "Do you ever lose jobs because you're on-site and can't pick up — is that a real problem for you?"
- "Are you at a point where you're thinking about what comes next for the business?"

If they reply to Q3 — that is your opening to the partnership conversation.

### Stage 3a — Buy (if open to growth)
**Quick Win Audit** — £150 one-off, 30 min call + PDF showing 3 money leaks.
Leads into: **Back Office AI Stack** — £3,000 flat, systems + automations delivered.

### Stage 3b — Partner (if they are thinking about selling / burning out)
**AI Partnership Proposal** — not a sales pitch. A question:

> "We've noticed [Business Name] has been running [X] years and built a solid reputation. We're looking at a small number of businesses to partner with — not to buy, but to inject systems that increase the sellable value. Would you be open to a 20-minute conversation?"

Angle: you help them become exit-ready. Revenue share or equity stake for the systems work. Long tail play.

### Stage 3c — Nothing (no response)
Physical letter (Klaudius generates this automatically).
Final sequence: letter + one final email at Day 14.

---

## V2 Infrastructure Changes from V1

| Component | V1 | V2 |
|-----------|----|----|
| Geography | UK only | US first, then EU |
| Industries | Trades only | Trades + professional services + specialist retail |
| Outreach | Email + letter + call | Email + letter + call + LinkedIn (for partnership angle) |
| Stage 2 | Not built | Reply-baiting question email auto-sends Day 4 |
| Stage 3b | Not built | Partnership email template + CRM flag `status=partner_prospect` |
| CRM field | outreach_channel | Add: `exit_signal` boolean (did they mention selling?) |
| Data source | Google Maps scrape | Google Maps + Companies House (UK) + BBB (US) + broker sites |

---

## Technical Build Plan

### Phase 1 — ICP List (Week 1)
- Apify scrape: US boomer business owners with email, established businesses, low web presence
- Validate with `/validate-data` agent
- Target: 5,000 contacts with email in 3.5 weeks
- Segment by: industry, geography, estimated revenue, digital presence score

### Phase 2 — Email Infrastructure (Week 1-2)
- Separate sending domain from Klaudius (avoid spam contamination)
- New domain: `systemswithmelly.com` or `ourmelly.com`
- Warm up domain over 7 days before bulk send
- Sending volume: 200/day Week 1, 500/day Week 2, 1000+/day Week 3 onward
- Tool: existing gmail.py infrastructure or switch to Instantly/Smartlead for US volume

### Phase 3 — Build Pipeline (Week 2+)
- Same Klaudius VPS pipeline
- Trigger build only after email response (not proactive like V1)
- OR keep proactive build for first 500 contacts, then response-triggered

### Phase 4 — Partnership Sequence (Week 3+)
- CRM flag: `exit_signal=true` for anyone who uses keywords: "thinking of selling", "tired", "retirement", "exit", "successor", "buy me out"
- Auto-route these to Steve (AI operator) for a personalised partnership email

---

## Success Metrics (POC Gate)

Before scaling to 5,000 emails, hit these gates from first 500:

| Metric | Target |
|--------|--------|
| Email open rate | >35% |
| Reply rate | >5% |
| Calls booked | >2% |
| Paying clients | 3+ |
| Partnership conversations opened | 1+ |

If any gate fails, fix the offer before scaling volume.

---

## Next Actions

1. Steve assigns research agent: ICP data pull (US + EU boomer businesses with email)
2. Apify scrape + `/validate-data` on first 1,000 contacts
3. Set up sending domain + warm-up sequence
4. Add `exit_signal` field to Supabase CRM
5. Write Stage 2 (reply-bait) and Stage 3b (partnership) email templates
6. Run first 200 emails as live test, measure opens + replies

---

*Created 2026-06-27 | Feeds into: RevenueDrive, Klaudius V2, AreteStays partnership angle*
