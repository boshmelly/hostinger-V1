# Outreach Variations — Systems With Melly / Klaudius

## Channel priority (effective immediately)
1. **EMAIL** — send live if client has email address (07:00–19:00 BST window)
2. **LETTER** — run `python3 scripts/generate-letter.py <slug>` for deployed clients with NO email but have a location/address
3. **CALL LIST** — if no email and no address, client is logged for manual phone call (status=call_pending)

WhatsApp is SUSPENDED. Do not attempt WhatsApp. Do not check pairing. Ignore all WhatsApp code paths.

---

## Outreach decision tree (follow this exactly)

```
Has email?
  YES → 1. run screenshot-site.py <slug> <deployed_url>  (skip if outreach-screenshot.png already exists)
        2. Day 0: send PHASE 1a email (website offer, below)
        3. No reply by Day 3 → send PHASE 1b Email 1 (missed calls story)
        4. No reply by Day 7 → send PHASE 1b Email 2 (don't know where to start story)
        5. No reply by Day 10 → send PHASE 1b Email 3 (admin drag story, introduces £200/month)
        6. Any reply at any point → STOP the sequence, route to inbox-responder for a human-voiced reply within SLA
  NO  → has deployed_url?
          YES → run generate-letter.py → status=letter_queued, outreach_channel=letter
          NO  → has phone?
                  YES → status=call_pending, outreach_channel=call
                  NO  → status=deployed (no outreach possible yet)
```

Note: this replaces the old V1/V2/V3 single-email rotation. V1/V2/V3 are kept below as legacy/fallback copy only — do not use them for new sends unless the 1a/1b sequence is explicitly paused.

## MANDATORY PRE-SEND STEP: screenshot preview
Before the Phase 1a email, generate a preview image of the live site:
```bash
python3 scripts/screenshot-site.py <slug> <deployed_url>
```
Then send with the image embedded inline via `--html-body` + `--image-path` (referenced as `cid:screenshot` in the HTML). If the screenshot fails, fall back to plain-text-only, never block the send.

---

## PHASE 1a — Website Offer (single email, Day 0)

**Trigger:** Free sample site already built for {business_name}, live at {deployed_url}.
**Segment:** Any trade SME with a validated email, no existing website or a weak one.

**Subject:** We built {business_name} a website in 3 days. It's already live.

**Plain text body:**
```
Hi,

We took a chance and built {business_name} a full website already. No forms, no calls, no commitment. It's live right now here: {deployed_url}

Have a look. Three things worth knowing about it:

1. You can update it yourself. Photos, prices, job listings, opening hours, whatever changes week to week. No developer, no waiting on us, no invoice for a text edit.

2. You get a back office. Log in and see who's booked you, what enquiries have come in, and what's happening on the site without ringing anyone to ask.

3. We've built out your most important SEO pages already. This is usually the missing piece. Most trade sites look fine but never show up when someone searches "electrician near me" or "plumber [town]". Yours is set up to actually get found, which means more calls from people already looking for you.

If you want to keep it, it's £399, one-off, yours outright. If not, no hard feelings, we built it as a demonstration and you owe us nothing.

Have a look and let me know what you think: {deployed_url}

Ola
{ola_phone}
{ola_email}
```

**HTML body:**
```html
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
  <p>Hi,</p>
  <p>We took a chance and built <strong>{business_name}</strong> a full website already. No forms, no calls, no commitment. It's live right now.</p>
  <div style="margin: 24px 0; text-align: center;">
    <img src="cid:screenshot" alt="Preview of {business_name} website" style="max-width: 100%; border: 1px solid #e0e0e0; border-radius: 6px;" />
    <p style="margin-top: 8px;">
      <a href="{deployed_url}" style="color: #0a66c2; text-decoration: none; font-weight: bold;">View it live at {deployed_url} &rarr;</a>
    </p>
  </div>
  <p>Three things worth knowing about it:</p>
  <ol style="padding-left: 20px;">
    <li style="margin-bottom: 12px;"><strong>You can update it yourself.</strong> Photos, prices, job listings, opening hours, whatever changes week to week. No developer, no waiting on us, no invoice for a text edit.</li>
    <li style="margin-bottom: 12px;"><strong>You get a back office.</strong> Log in and see who's booked you, what enquiries have come in, and what's happening on the site without ringing anyone to ask.</li>
    <li style="margin-bottom: 12px;"><strong>We've built your most important SEO pages already.</strong> This is usually the missing piece. Most trade sites look fine but never show up when someone searches "electrician near me" or "plumber [town]". Yours is set up to actually get found, which means more calls from people already looking for you.</li>
  </ol>
  <p>If you want to keep it, it's <strong>£399, one-off, yours outright</strong>. If not, no hard feelings, we built it as a demonstration and you owe us nothing.</p>
  <p style="margin-top: 24px;">
    <a href="{deployed_url}" style="background: #0a66c2; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">See {business_name}'s site</a>
  </p>
  <p style="margin-top: 32px;">Ola<br/>{ola_phone}<br/>{ola_email}</p>
</div>
```

---

## PHASE 1b — Automations Opportunity (3-email follow-up, only if no reply to 1a)

**Trigger:** No reply to Phase 1a. Free website already built is the opener/hook. Ongoing automation service is £200/month, separate from the £399 one-off build.
**Cadence:** Email 1 = Day 3, Email 2 = Day 7, Email 3 = Day 10 (relative to Phase 1a send).
**Why every email ends on a question:** replies matter almost as much as conversions here. A "how does that work" reply is worth tracking, because normal back-and-forth engagement (opens, replies, no complaints) is what keeps our sending domain trusted by Gmail/Outlook/Yahoo's post-2024 authentication enforcement. Track replies as a KPI alongside bookings and £200/month sign-ups.

### Email 1 — Missed calls losing jobs (Day 3)

**Subject:** The electrician who missed 11 calls in one week

**Plain text body:**
```
Hi,

Quick one. A local electrician we work with used to lose count of missed calls. Turned out he was missing 11 genuine job enquiries a week, most of them while he was up a ladder or driving between quotes. Every missed call went straight to a full voicemail box. No callback, no message left, job gone to the next name on Google.

We set up something simple: missed calls now trigger an instant text back with a booking link, and anything urgent gets flagged to him directly. He picked up 4 extra jobs in the first month just from calls that would have gone nowhere before.

I'm not assuming that's happening at {business_name}, might be totally different. But if a missed call ever turns into a lost job for you, I'd be curious how you currently handle it.

What happens right now when someone rings you and you can't pick up?

Ola
{ola_phone}
{ola_email}
```

**HTML body:**
```html
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
  <p>Hi,</p>
  <p>Quick one. A local electrician we work with used to lose count of missed calls. Turned out he was missing <strong>11 genuine job enquiries a week</strong>, most of them while he was up a ladder or driving between quotes. Every missed call went straight to a full voicemail box. No callback, no message left, job gone to the next name on Google.</p>
  <p>We set up something simple: missed calls now trigger an instant text back with a booking link, and anything urgent gets flagged to him directly. He picked up <strong>4 extra jobs in the first month</strong> just from calls that would have gone nowhere before.</p>
  <p>I'm not assuming that's happening at <strong>{business_name}</strong>, might be totally different. But if a missed call ever turns into a lost job for you, I'd be curious how you currently handle it.</p>
  <p style="font-weight: bold;">What happens right now when someone rings you and you can't pick up?</p>
  <p style="margin-top: 32px;">Ola<br/>{ola_phone}<br/>{ola_email}</p>
</div>
```

### Email 2 — Not knowing where to start (Day 7)

**Subject:** The plumber who didn't touch his laptop for 6 months

**Plain text body:**
```
Hi,

Following on from the other day.

A plumber we work with told us straight: "I know I should be doing something with automation, I just don't know what the first step even is." He'd bought software before, tried a CRM once, gave up after a week because nobody showed him how it fit around an actual working day.

We didn't start with software. We started by watching how he actually worked for one day, quoting on his phone, chasing invoices by memory, texting customers one by one to confirm jobs. Then we automated just those three things. Nothing else. No dashboard he had to learn, no new app to open.

Six months later that's still the whole system, and he's never touched a spreadsheet since.

Most owners we talk to don't need more tools, they need someone to point at the one thing worth fixing first.

If you had to guess, what's the one repetitive thing eating your time at {business_name} right now?

Ola
{ola_phone}
{ola_email}
```

**HTML body:**
```html
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
  <p>Hi,</p>
  <p>Following on from the other day.</p>
  <p>A plumber we work with told us straight: <em>"I know I should be doing something with automation, I just don't know what the first step even is."</em> He'd bought software before, tried a CRM once, gave up after a week because nobody showed him how it fit around an actual working day.</p>
  <p>We didn't start with software. We started by watching how he actually worked for <strong>one day</strong>, quoting on his phone, chasing invoices by memory, texting customers one by one to confirm jobs. Then we automated just those three things. Nothing else. No dashboard he had to learn, no new app to open.</p>
  <p><strong>Six months later</strong> that's still the whole system, and he's never touched a spreadsheet since.</p>
  <p>Most owners we talk to don't need more tools, they need someone to point at the one thing worth fixing first.</p>
  <p style="font-weight: bold;">If you had to guess, what's the one repetitive thing eating your time at {business_name} right now?</p>
  <p style="margin-top: 32px;">Ola<br/>{ola_phone}<br/>{ola_email}</p>
</div>
```

### Email 3 — Chasing payment and admin drag, introduces £200/month (Day 10)

**Subject:** The joiner chasing 1 invoice for 47 days

**Plain text body:**
```
Hi,

Last one from me on this, promise.

A joiner we work with had an invoice sit unpaid for 47 days. Not because the customer refused to pay, just because nobody ever chased it properly. He'd meant to follow up, got busy on site, forgot, meant to follow up again, forgot again. That's not a character flaw, that's just what happens when admin has to compete with actual paid work.

We set up automatic payment reminders that go out on a schedule without him lifting a finger, polite at first, firmer if it drags on. His average time to get paid dropped from around 6 weeks to under 2.

None of this is complicated on our end. It's the same pattern each time: watch how the business actually runs, fix the one or two things quietly draining time or money, leave the rest alone.

We do this ongoing for £200 a month, on top of the free website we already put together for {business_name}. No contract lock-in, cancel any time it's not earning its keep.

Worth a 15 minute call to see what that would look like for you specifically? Or if it's easier, just reply here and tell me what's currently the biggest admin headache and I'll tell you honestly whether it's something we'd fix.

Ola
{ola_phone}
{ola_email}
```

**HTML body:**
```html
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
  <p>Hi,</p>
  <p>Last one from me on this, promise.</p>
  <p>A joiner we work with had an invoice sit unpaid for <strong>47 days</strong>. Not because the customer refused to pay, just because nobody ever chased it properly. He'd meant to follow up, got busy on site, forgot, meant to follow up again, forgot again. That's not a character flaw, that's just what happens when admin has to compete with actual paid work.</p>
  <p>We set up automatic payment reminders that go out on a schedule without him lifting a finger, polite at first, firmer if it drags on. His average time to get paid dropped from around <strong>6 weeks to under 2</strong>.</p>
  <p>None of this is complicated on our end. It's the same pattern each time: watch how the business actually runs, fix the one or two things quietly draining time or money, leave the rest alone.</p>
  <p>We do this ongoing for <strong>£200 a month</strong>, on top of the free website we already put together for <strong>{business_name}</strong>. No contract lock-in, cancel any time it's not earning its keep.</p>
  <p style="font-weight: bold;">Worth a 15 minute call to see what that would look like for you specifically? Or if it's easier, just reply here and tell me what's currently the biggest admin headache and I'll tell you honestly whether it's something we'd fix.</p>
  <p style="margin-top: 32px;">Ola<br/>{ola_phone}<br/>{ola_email}</p>
</div>
```

---

## After sending email
Set in Supabase:
- `outreach_channel` = 'email'
- `outreach_variation` = '1a' / '1b-1' / '1b-2' / '1b-3'
- `outreach_sent_at` = now()
- `status` = 'outreach_sent'

## After generating letter
Set in Supabase:
- `outreach_channel` = 'letter'
- `status` = 'letter_queued'
- `notes` += ' | Letter generated [date]. Physical send pending.'

## After marking for call
Set in Supabase:
- `outreach_channel` = 'call'
- `status` = 'call_pending'

---

## LEGACY (kept for reference only, do not use for new sends)

V1/V2/V3 single-email rotation superseded by the Phase 1a/1b funnel above on 2026-07-19. Full V1/V2/V3 copy preserved in `outreach-variations.md.bak-20260719`.

---

## Ph1b-Industrial — All-in-one automations pitch (new ICP, 2026-07-21)

**Trigger:** Team B expansion per Ola. Same £200/month automations service, but
positioned as ONE system doing three jobs at once, not three separate emails
building to it. Targets industrial/B2B verticals, not residential trades.

**New ICP verticals (Sonia sourcing targets):**
- Industrial maintenance firms
- Specialty manufacturers
- Robotics integrators
- Calibration labs
- Commercial contractors

These are B2B-to-B2B operators, not homeowner-facing trades. Buying language
shifts accordingly: fewer "missed call = lost job" homeowner stories, more
"missed RFQ = lost contract" and "quote turnaround speed is a competitive
factor" framing. Decision-maker is usually an ops manager or owner-operator,
not a solo tradesperson.

### Subject
**Subject:** One system, three jobs: more leads, calls answered, quotes out same day

### Plain text body
```
Hi,

Most industrial and specialty firms we talk to are running three separate
problems as if they are unrelated: not enough qualified leads coming in, calls
going to voicemail during the day because everyone is on the shop floor or on
site, and quotes going out days after a customer asked, by which point they
have already called someone else.

We built one system that handles all three together, not three separate tools
you have to stitch together yourself:

1. Lead flow - we identify and route qualified enquiries to you directly,
   instead of you chasing directories or waiting on referrals.
2. Calls answered - every call gets picked up, logged, and triaged, even when
   your team is hands-on and cannot get to the phone.
3. Quotes out same day - structured quoting that turns a request into a
   priced document in hours, not days, so you are first to respond, not last.

It is one system, £200 a month, no contract lock-in. Worth a 15 minute call to
see what that would look like specifically for {business_name}?

Ola
{ola_phone}
{ola_email}
```

### HTML body
```html
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
  <p>Hi,</p>
  <p>Most industrial and specialty firms we talk to are running three separate problems as if they are unrelated: not enough qualified leads coming in, calls going to voicemail during the day because everyone is on the shop floor or on site, and quotes going out days after a customer asked, by which point they have already called someone else.</p>
  <p>We built one system that handles all three together, not three separate tools you have to stitch together yourself:</p>
  <ol style="padding-left: 20px;">
    <li style="margin-bottom: 12px;"><strong>Lead flow</strong> - we identify and route qualified enquiries to you directly, instead of you chasing directories or waiting on referrals.</li>
    <li style="margin-bottom: 12px;"><strong>Calls answered</strong> - every call gets picked up, logged, and triaged, even when your team is hands-on and cannot get to the phone.</li>
    <li style="margin-bottom: 12px;"><strong>Quotes out same day</strong> - structured quoting that turns a request into a priced document in hours, not days, so you are first to respond, not last.</li>
  </ol>
  <p>It is one system, <strong>£200 a month</strong>, no contract lock-in.</p>
  <p style="font-weight: bold;">Worth a 15 minute call to see what that would look like specifically for {business_name}?</p>
  <p style="margin-top: 32px;">Ola<br/>{ola_phone}<br/>{ola_email}</p>
</div>
```

Signature note: use signature-template-2-card (brand colours) for this
segment, more corporate-facing than the informal trades signature.

---

## Vertical-specific reframes for Ph1b-Industrial (2026-07-21, from Sonia's research)

The standard Ph1b-Industrial pitch ("leads + calls answered + same-day quoting")
does NOT fit every vertical as-is. Confirmed by evidence, not assumption:

**Works as standard pitch:** Specialty manufacturers, Industrial maintenance,
Commercial contractors. All three show single-inbox/single-mobile owner
contact with no dispatcher layer — missed call genuinely = lost job, and
same-day quoting is credible for these trades.

**Calibration labs — REFRAME required.** Calibration runs on scheduled
recalibration contracts, not inbound sales calls. "More leads" and "same-day
quoting" don't map to how this business gets work. Replace the 3 pillars with:
automated recalibration renewal reminders, booking/scheduling admin, and
enquiry-triage (routing "what's your turnaround for X" questions into a
queue). Subject line and body need a full rewrite for this vertical — do not
send the standard Ph1b-Industrial copy to calibration lab leads.

**Robotics integrators — REFRAME required.** Same-day quoting is not credible
here — cell design/CE compliance/site surveys mean nobody quotes same-day, and
claiming otherwise reads as ignorant to an engineer-led buyer. Replace pillar
3 with "same-day acknowledgement + qualification call booked" instead of
"same-day quote." Pillars 1 and 2 (leads, calls answered) still hold.

Action for next copywriting pass: write two short variant bodies (calibration,
robotics) reusing the same open/close structure as Ph1b-Industrial but with
pillar 3 swapped per above. Flagging here rather than guessing the copy blind.

---

## Ph1b-Calibration — Reframed variant for calibration labs (2026-07-21)

**Use for:** calibration_labs rows in team_b_industrial_leads.csv only.
**Do not use the standard Ph1b-Industrial copy for this vertical.**

### Subject
**Subject:** One system for renewal reminders, booking, and enquiry triage

### Plain text body
```
Hi,

Most calibration labs we talk to are not short of work, they are short of admin
hours. Renewal dates get tracked in a spreadsheet someone has to remember to
check, booking a collection means a phone tag with the customer, and a simple
"what's your turnaround for a 3-day express" enquiry sits in an inbox until
someone has time to reply.

We built one system that handles all three without adding headcount:

1. Renewal reminders - customers get notified automatically when their kit is
   due for recalibration, before they have to chase you.
2. Booking and scheduling - collection and drop-off slots get organised
   without a round of calls to confirm a time.
3. Enquiry triage - turnaround and scope questions get routed and answered
   fast, so you are not the bottleneck between a question and a booked job.

It is one system, £200 a month, no contract lock-in. Worth a 15 minute call to
see what that would look like for {business_name}?

Ola
{ola_phone}
{ola_email}
```

### HTML body
```html
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
  <p>Hi,</p>
  <p>Most calibration labs we talk to are not short of work, they are short of admin hours. Renewal dates get tracked in a spreadsheet someone has to remember to check, booking a collection means a phone tag with the customer, and a simple "what is your turnaround for a 3-day express" enquiry sits in an inbox until someone has time to reply.</p>
  <p>We built one system that handles all three without adding headcount:</p>
  <ol style="padding-left: 20px;">
    <li style="margin-bottom: 12px;"><strong>Renewal reminders</strong> - customers get notified automatically when their kit is due for recalibration, before they have to chase you.</li>
    <li style="margin-bottom: 12px;"><strong>Booking and scheduling</strong> - collection and drop-off slots get organised without a round of calls to confirm a time.</li>
    <li style="margin-bottom: 12px;"><strong>Enquiry triage</strong> - turnaround and scope questions get routed and answered fast, so you are not the bottleneck between a question and a booked job.</li>
  </ol>
  <p>It is one system, <strong>£200 a month</strong>, no contract lock-in.</p>
  <p style="font-weight: bold;">Worth a 15 minute call to see what that would look like for {business_name}?</p>
  <p style="margin-top: 32px;">Ola<br/>{ola_phone}<br/>{ola_email}</p>
</div>
```

---

## Ph1b-Robotics — Reframed variant for robotics integrators (2026-07-21)

**Use for:** robotics_integrators rows in team_b_industrial_leads.csv only.
**Do not use the standard Ph1b-Industrial copy for this vertical** (pillar 3
swapped from "same-day quote" to "same-day acknowledgement").

### Subject
**Subject:** One system: more leads, calls answered, same-day acknowledgement

### Plain text body
```
Hi,

Most integrators we talk to are running lean, a small engineering team, no
dedicated sales desk, and every enquiry competes with an active install or a
site visit. A serious enquiry can sit unanswered for days simply because
nobody's free to reply properly, and by the time someone does, the buyer's
already spoken to someone else.

We built one system that handles the front end without adding headcount:

1. Lead flow - qualified enquiries get identified and routed to you directly.
2. Calls answered - every call gets picked up, logged, and triaged, even
   mid-install.
3. Same-day acknowledgement - every enquiry gets a same-day reply and a
   qualification call booked, so you're never the slow responder even when
   the real quote takes longer to put together properly.

It is one system, £200 a month, no contract lock-in. Worth a 15 minute call to
see what that would look like for {business_name}?

Ola
{ola_phone}
{ola_email}
```

### HTML body
```html
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.6;">
  <p>Hi,</p>
  <p>Most integrators we talk to are running lean, a small engineering team, no dedicated sales desk, and every enquiry competes with an active install or a site visit. A serious enquiry can sit unanswered for days simply because nobody is free to reply properly, and by the time someone does, the buyer has already spoken to someone else.</p>
  <p>We built one system that handles the front end without adding headcount:</p>
  <ol style="padding-left: 20px;">
    <li style="margin-bottom: 12px;"><strong>Lead flow</strong> - qualified enquiries get identified and routed to you directly.</li>
    <li style="margin-bottom: 12px;"><strong>Calls answered</strong> - every call gets picked up, logged, and triaged, even mid-install.</li>
    <li style="margin-bottom: 12px;"><strong>Same-day acknowledgement</strong> - every enquiry gets a same-day reply and a qualification call booked, so you are never the slow responder even when the real quote takes longer to put together properly.</li>
  </ol>
  <p>It is one system, <strong>£200 a month</strong>, no contract lock-in.</p>
  <p style="font-weight: bold;">Worth a 15 minute call to see what that would look like for {business_name}?</p>
  <p style="margin-top: 32px;">Ola<br/>{ola_phone}<br/>{ola_email}</p>
</div>
```

---

## Inbound-Interest Opener — Upwork/Reddit "asking for a website" leads (2026-07-24)

**Trigger:** lead sourced from `upwork_website_leads.csv` (or any other channel
where the person is already publicly asking for a website — inbound, not
cold). Different from every other template in this file: they already want
this, so the email is a qualifying question, not a pitch.

**Subject:** Saw you're looking for a website — quick two questions

**Body:**
```
Hi,

Saw your post looking for a website for {business_name} — happy to help.

Two quick questions before I put a proposal together:
1. What's your budget range for this?
2. Do you already have a Google Business Profile or reviews live anywhere?
   (Not a dealbreaker either way, just helps me scope what you need.)

Reply with those and I'll come back with something specific, not a generic
template pitch.

Ola
{ola_phone}
{ola_email}
```

**Why two questions, not a pitch upfront:** they're already sold on wanting
a site — the job here is qualifying budget fit and gauging how established
the business already is (a business with existing GBP/reviews is a stronger
signal than one starting from zero), not persuading them a website is worth
having.

---

## Team B — 11-Touch Sequence (built 2026-07-25, replaces the 3-email Ph1b sequence)

Written from a marketing-writer brief: extend the existing Ph1b automations
pitch from 3 emails to a full 11-touch sequence spanning ~4 weeks, add the
weekend "tried calling you" variant, and add the free-demo ask (send us your
business name / website / Google Business listing, we build a demo, no card,
test it a month) as a standing CTA across the sequence rather than a single
email.

**Cadence:** Day 0, 0 (same-day follow if no answer), 2, 4, 7, 10, 14, 18,
22, 26, 30. Touches 1-3 are email, 4+ alternate email/WhatsApp per market
(UK = email only; Nigeria/Kenya = WhatsApp ONLY after a reply/engagement on email or Instagram first — never cold-first, per Sonia's WhatsApp ban-risk research, 2026-07-25. See corrected overlay below.)

---

### Touch 0 — Weekend "tried calling you" (send tonight through Sunday, Team B only)

Use this specifically for leads where a call was attempted and missed —
not a cold opener. Weekend framing: businesses are closed, so lead with
that instead of pretending it's a normal business day.

**Subject:** Tried calling — quick version instead

**Body:**
```
Hi,

Tried giving you a call just now, no worries if the weekend's not the time.

Quick version of what I wanted to say: we build the automations side for
businesses like {business_name} — leads, calls answered, quotes out fast —
for £200 a month, no contract lock-in.

Rather than take up more of your weekend, send over your business name,
website, or Google Business listing and we'll build you a working demo to
actually test — no card needed, run it free for a month and see if it
earns its keep.

Ola
{ola_phone}
{ola_email}
```

**Why this works:** states the price immediately (no waiting through 3
emails to find out what it costs), respects that it's the weekend, and
converts "missed call" into a low-friction next step instead of a repeat
call attempt.

---

### Touch 1 — Day 0 (standard cold open, if no prior call attempt)
*(Existing Ph1b-Industrial email — kept as-is, see "Ph1b-Industrial" section above.)*

### Touch 2 — Day 0, same day (if no open/reply to touch 1 within a few hours)
**Subject:** Forgot to mention the price

**Body:**
```
Meant to say this the first time — it's £200 a month, no contract, cancel
whenever it's not earning its keep. Same offer as before: send your
business name, site, or Google Business listing and we'll build a demo
you can actually try before deciding anything.
```

### Touch 3 — Day 2
*(Existing Email 2 — support-post style, kept as-is.)*

### Touch 4 — Day 4
**Subject:** The demo offer still stands

**Body:**
```
No pressure if it's not the right time, but the offer's still there — send
over {business_name}'s site or Google Business listing and we'll have a
working demo back to you within a couple of days. No card, test it free
for a month, keep it or don't.
```

### Touch 5 — Day 7
*(Existing Email 3 — invoice-chasing story, kept as-is, this is the strongest proof-point email in the sequence.)*

### Touch 6 — Day 10
**Subject:** What's actually stopping this from being worth it?

**Body:**
```
Genuinely asking — is it price, timing, or you're just not sure it'd make
a difference for {business_name}? Happy to build the free demo either way
so you can see it working rather than take my word for it.
```

### Touch 7 — Day 14
**Subject:** Real example, two weeks in

**Body:**
```
Two weeks since I first reached out. A joiner we work with went from
missing about a third of his calls to zero, automatically. That's the
whole pitch, honestly — £200/month, no contract. Still happy to build the
free demo if you want to see it running before deciding.
```

### Touch 8 — Day 18
**Subject:** Last few before I leave this be

**Body:**
```
Not trying to wear you down — just conscious this has been going back and
forth a few weeks. If a demo would help you decide, say the word and I'll
have it built this week.
```

### Touch 9 — Day 22
**Subject:** {business_name} — one honest question

**Body:**
```
If I built this for free right now and you tried it for a month, is there
any reason you wouldn't at least look? If yes, tell me why — genuinely
want to know. If no, send the business details over and I'll get started.
```

### Touch 10 — Day 26
**Subject:** Closing this thread out

**Body:**
```
This'll be my last one unless you want to pick it back up. The offer
doesn't expire — free demo, no card, month to test it, £200/month after
if you keep it. Reply any time.
```

### Touch 11 — Day 30 (final, breakup email)
**Subject:** Bowing out — door's open if that changes

**Body:**
```
I'll stop here so I'm not clogging your inbox. If things change and a
free demo sounds useful down the line, just reply to this thread, I'll
pick it straight back up.

Ola
{ola_phone}
{ola_email}
```

---

### The standing CTA across every touch (not just one email)
"Send over your business name, website, or Google Business listing — we
build you a working demo to test, no card, free for a month." This
replaces the old single-ask pattern with a low-friction request repeated
in different framing at every stage, since the barrier to "try a free
demo" is much lower than "book a 15-minute call."

### Nigeria-specific overlay (per Senior Sales Manager, Lagos, 2026-07-25;
WhatsApp protocol corrected 2026-07-25 per Sonia's ban-risk research)

- **CORRECTED PRICE: $150-250, not $399.** Evidence-based research
  (2026-07-25) found real Nigerian market pricing clusters far below the
  original $399 figure — Fiverr sellers and local agencies price basic-to-mid
  business sites at ₦70k-380k (~$46-$250). $399 (~₦600k) sat at the very top
  of the local high-end WordPress market, disconnected from what buyers
  actually see when comparing. Use $150-250 for Nigeria going forward —
  still a real premium over Fiverr's ~$45 average (justified by speed/AI
  build quality), without pricing out of the credible local range.
- **WhatsApp is SECOND-TOUCH ONLY, gated on a reply.** Do not add WhatsApp
  as a numbered step in the cadence regardless of response — only move a
  lead to WhatsApp once they've replied or engaged on email/Instagram
  first. Cold WhatsApp outbound is exactly the pattern that got the
  channel spam-flagged before. Verified policy: WhatsApp requires explicit
  opt-in for any business-initiated message outside a 24h service window;
  send cold templates via the official WhatsApp Business Platform (API)
  only, never the free WhatsApp Business app for bulk sending (near-certain
  permanent ban risk, no tiered recovery path). Warm a new number 2-3
  weeks with normal low-volume activity before any templated send. Watch
  the quality rating (Green/Yellow/Red) daily — pull outbound entirely at
  the first Yellow signal, do not wait for Red.
- **Bank transfer / Paystack, not card** — checkout must support this or
  loses most interested buyers at the finish line.
- **Timing: WAT, Tue-Thu, 11am-2pm or 6pm-8pm.** Avoid Mondays (chaos),
  Fridays (early close), and month-end (rent/salary days, cash tight).
- **Target owner-operators with an active Instagram** (signals seriousness
  + budget). Avoid businesses under 6 months old (no cash flow yet) — this
  is now also a hard disqualify-at-gather rule, see lessons.md.
- **Trust is the real objection, not price.** Counter with visible proof —
  WhatsApp status showing live builds, a reachable local-feeling number,
  named testimonials — not just an email thread.

---

## US market — planned config (activate when campaign launches, not before)

Ola's ask: if US expansion launches next Wednesday, split US-market sends
7/day via aretesolution.co.uk and 3/day via revenuedrive.co.uk (10/day
total for US, separate from the existing UK dispatch which already runs
25/day at its own 90/10 domain split).

**Not built as a live cron yet** — the US campaign itself is conditional on
Sonia's metro-area research landing first (in progress) and Ola's
go-ahead. Building a second parallel dispatch cron for a market that isn't
confirmed would be premature. When it is confirmed:

1. Copy `daily-outreach-dispatch.py` to `us-outreach-dispatch.py`, filter
   leads to US-market records only (needs a `market` or `country` column
   set during gather — add this now so US leads are tagged from day one,
   even before the campaign formally starts).
2. Add a US-specific routing wrapper (`send-outreach-us.sh`) with a fixed
   7:3 arete:revenuedrive ratio, not the existing 90:10 warm-up ratio —
   the existing ratio is calibrated for revenuedrive's slow UK warm-up;
   US needs its own pacing decision once Sonia's research lands.
3. Cron at a US-business-hours-appropriate UTC time once the target
   region (EST/CST/PST) is confirmed.

Confirm with Ola once Sonia's US metro research and the go/no-go decision
land — this section documents the plan, not a live system.
