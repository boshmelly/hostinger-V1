# Email Sequence — Brochure Download Nurture (14 days, 5 emails)

## Trigger

Prospect submits the brochure download form on the landing page. Required fields: first name, email, industry, company name.

## Platform

Brevo or ConvertKit. Brevo preferred (better UK price, decent automation).

## Goal

Move 15 to 25% of brochure downloaders to an AI assistant call within 14 days. Cut anyone unengaged after day 14.

## Sequence

### Email 1 — Day 0, sent immediately

Subject: "Your RevenueDrive brochure (and one specific leak we see in {{industry}})"

Body (short):

"Hi {{first_name}},

The brochure is attached. The one thing I'd point you to first is page 4. That's where we show how a £1.4m electrical contractor was losing £4,200 a month to one specific leak.

If you're in {{industry}}, the leak pattern is usually different but the size isn't. Most businesses we audit find £15,000 to £45,000 recoverable in the first 90 days.

If you want to find out what your number looks like, talk to our AI assistant. Six questions, six minutes. Link below.

[Talk to Mel — RevenueDrive AI assistant]

Ola"

### Email 2 — Day 2

Subject: "The 4-stage audit, in plain English"

Body:

Walk through the 4 stages (Lead Capture, Quote Conversion, Ops Handoffs, Admin Efficiency) with one specific industry-relevant example for each. Pull the example from the prospect's industry if the merge field allows. Keep under 200 words.

CTA: link to AI assistant.

### Email 3 — Day 5

Subject: "What we found in {{industry}} last month"

Body:

A real (redacted) case study from the prospect's industry. If we don't have one yet, use a closely adjacent industry and say so. Show: the leak found, the recommendation, the recovered revenue.

CTA: link to AI assistant.

### Email 4 — Day 9

Subject: "Pricing transparency"

Body:

The honest version. £3,000 audit fee. Refunded if recovery is under £15k. Implementation tiers (£450 to £5,000) are optional and separate. No hidden costs.

CTA: link to AI assistant. Secondary: "Reply to this email if you'd rather book a call directly with Ola."

### Email 5 — Day 14

Subject: "Last one from me, for now"

Body:

"Hi {{first_name}},

If RevenueDrive isn't a fit right now, no worries. The brochure stays useful even if you never speak to us. The leakage map and the 4-stage audit framework are both in there, you can run a version on yourself.

If you want to talk, the AI assistant is the fastest route. If you don't, I'll stop sending these.

Either way, good luck with {{company_name}}.

Ola"

CTA: link to AI assistant. No secondary CTA.

## Segmentation

If prospect engages (clicks any CTA) but doesn't book by Day 14: move to monthly newsletter list.
If prospect books AI assistant call: pause sequence, route to post-call sequence.
If prospect doesn't open Email 1 or 2: deliverability check, then continue.
If prospect unsubscribes: respect immediately, no retargeting.

## Voice rules check

- No em-dashes anywhere
- No "I just wanted to follow up"
- No "circling back"
- Specific numbers in every email
- One real example per email minimum
- Failures featured (Email 3 includes the leak we found)

## Owner

Marketing Strategist drafts. Brand Voice approves. Product / Ops wires the merge fields and triggers. PM signs off before activation.
