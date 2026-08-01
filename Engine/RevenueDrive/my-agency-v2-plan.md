---
name: my-agency-v2-plan
type: project
status: deployment-ready
created: 2026-06-27
updated: 2026-06-28
---

# My-Agency V2 — Deployment Plan

> Canonical source. All agents, sessions, and delivery partners read this first.
> Last updated: 2026-06-28

---

## 1. Executive Summary

Klaudius V2 runs as one additional pipeline alongside V1 (x5), targeting US boomer SME owners aged 55-68. The sequence uses a permission-first gift mechanic: ask before deploying, deploy on consent, then route replies into either a growth track (audit, AI stack) or an exit/partner track (systems-first, exit-readiness positioning).

Geography priority: Georgia first, then Ohio, Florida, Texas. Total addressable market is 12 million boomer-owned US businesses facing a succession cliff by 2035, with zero affordable systems-prep competitors at the sub-$3,500 price point.

The entire post-consent outbound sequence is automated via Instantly webhooks, pg_cron in Supabase, and a Node.js reply handler on the VPS. Only exit-signal contacts break to human (Ola) review, with a mandatory phone call from Ola within 48 hours of flag.

POC gates must pass at 100 contacts (smoke test, Week 1) then 200 before scaling to 500, and again before scaling to full run. The realistic 90-day revenue model is £13,500 base case. The fastest cash path is the existing V1 built-list, not the 5,000-contact automation run.

LinkedIn content, broker partnership outreach, and the Klaudius outbound list compound into a self-reinforcing flywheel where every build and every reply becomes a content asset and a partnership conversation starter.

---

## 2. ICP Profile

| Attribute | Criteria | Why It Matters |
|---|---|---|
| Age band | 55-68 (primary), 50-54 and 69-72 (secondary) | Peak exit psychology window. 55+ has real succession pressure. 68+ has lower change appetite. |
| Business age | 10+ years (hard filter). 20+ years = exit signal flag. | Boomer ownership proxy. Longer tenure correlates with owner-dependency and exit readiness. |
| Web presence | No website, or site built pre-2015 with no SEO | Core Klaudius targeting logic. Digital absence = gift opportunity. |
| Google presence | 3.5+ stars, 20+ reviews, Google Business Profile exists | Established reputation. Proves the business is real and worth gifting. |
| Business structure | Sole director (UK) or single-member LLC / sole proprietor (US) | No succession structure in place. Exit pressure without a plan. |
| Industry | HVAC, plumbing, electrical, roofing, auto repair, landscaping, pest control, commercial cleaning, funeral homes, flooring | Highest boomer ownership rates. High digital absence. Email reachable. Avoid: legal, medical, accounting (regulated, sales-averse). |
| Geography (V2 Phase 1) | Georgia, Ohio, Florida, Texas (in that order) | Georgia: fastest growth (31.7%). Ohio: densest boomer ownership (56.2%). Florida: highest self-employment rate (8.8%). Texas: largest volume (3.52M SMEs). |
| Exit signals (qualitative) | Business 20+ years, sole director, no online presence, Google listing shows owner by name | Indicates all value is in one person. Sellability gap is high. Partner track is relevant. |
| Email reachability | Verified email found for owner or business | Must clear NeverBounce/ZeroBounce before entering sequence. |
| Revenue band (estimate) | Under $1M annual revenue | Underserved by brokers and exit advisors. £3k/$3.5k offer is credible and affordable. |

**ICP disqualifiers:** California (regulatory risk), New York (high competition, high skepticism), any business with a modern website (score 7+ on digital presence), regulated professions.

---

## 3. Offer Sequence

### CRITICAL CHANGE FROM ORIGINAL DRAFT: Permission Before Deployment

Do NOT deploy the website live before consent. This removes the legal exposure of publishing a business owner's name, phone number, and branding without permission, and removes the psychological uncanniness of an uninvited build. Instead: build the site, host it on a staging URL, and ask permission to publish it.

### Stage Overview

| Stage | Day | Trigger | Goal |
|---|---|---|---|
| Stage 0 | Day 0 | Contact validated in Supabase | Website built and staged (not yet live) |
| Stage 1 | Day 0 | Site staged | Permission email sent, preview link included |
| Stage 2 | Day 4 | No reply, stage=1 | One specific question based on CRM data |
| Stage 3 no reply | Day 7 | No reply, stage=2 | Soft nudge (no exit language) |
| Stage 3 no reply | Day 10 | No reply | Typed business letter via Lob.com (not faked handwriting) |
| Stage 3a reply growth | Day 4-7 on reply | Reply, no exit signal | Audit offer |
| Stage 3b reply exit | Day 4-7 on reply | Reply with exit keywords | Ola phone call within 48 hours, then partner conversation |
| Stage 4 | Day 14 | No reply | Final email, sequence closes |

---

### Stage 1 Email — The Preview (Day 0)

**Subject line options (A/B test, rotate by batch):**
- `[Business Name] — I found something missing`
- `Quick question before I do anything, [First Name]`
- `I built [Business Name] a website — want to see it first?`

**Body (100 words max, plain text only):**

> Hi [First Name],
>
> I was searching for a [trade] in [City] and found [Business Name]. Strong reviews, but no website. So I built one.
>
> I have not published it yet. I wanted to check with you first.
>
> Here is the preview: [staging URL]
>
> If you want it live, just reply and I will push it in five minutes. If anything needs changing, I will fix it. If you would rather I delete it, no problem at all.
>
> Either way it costs you nothing.
>
> Ola Mellila
> Systems With Melly | I spent nine years delivering infrastructure projects in London before building this.
> [physical address] | Reply STOP to opt out

**Key changes from original draft:**
- From name is "Ola Mellila" not "Melly" for first contact.
- Staging URL, not live URL. Permission is asked explicitly.
- One credential sentence in the signature. Boomers verify tenure.
- No "no strings" language. Legitimate offers do not need to say that.

---

### Stage 2 Email — One Specific Question (Day 4)

Do not ask about missed calls. That is a recognised sales script opener that boomer tradespeople have heard from every contractor management SaaS in existence. Ask something that demonstrates you actually looked at their specific business.

**Select question based on CRM data:**

| Condition | Question to use |
|---|---|
| Google listing shows owner by first name and trade | "Is the phone number on the preview the right one to send enquiries to? I can update it in five minutes." |
| Business has been trading 20+ years, name shows on Google | "I noticed [Business Name] has been running since [year] — do you still do [specific service from their Google profile]? Wanted to make sure the site reflects what you actually offer." |
| High review count, mobile/site operator | "Your reviews mention [specific service from reviews]. Do you want that front and centre on the site, or is there something else you focus on now?" |

**Subject:** `Your preview site, quick question`

**Body:**

> Hi [First Name],
>
> [INSERT SPECIFIC QUESTION FROM TABLE ABOVE]
>
> No pitch. Just helps me know what to put on it before anything goes live.
>
> Ola

---

### Stage 3 No Reply Path

**Day 7 — Soft Nudge (no exit or succession language)**

Subject: `Still happy to publish this`

> Hi [First Name],
>
> The preview for [Business Name] is still sitting here: [staging URL]. Happy to push it live whenever you are ready, or to delete it if you would rather.
>
> Just let me know.
>
> Ola

**Day 10 — Typed Business Letter via Lob.com**

Format: plain typed letterhead, not a faked handwritten font. Three short paragraphs.

> [Business letterhead: Systems With Melly, [UK address]]
>
> [Date]
>
> Dear [First Name],
>
> A couple of weeks ago I sent [Business Name] a preview website. I have not heard back and wanted to make sure you received it. The preview link is: [URL].
>
> If it is not useful, no problem at all. If you would like it published or changed, just reply to my email or call [Ola's number].
>
> Either way, I hope the business is going well.
>
> Ola Mellila
> Systems With Melly

**Day 14 — Final Email**

Subject: `Leaving this with you, [First Name]`

> The preview for [Business Name] is at [staging URL]. I will leave it there for another 30 days in case it becomes useful.
>
> If you ever want to update it, add a contact form, or just have a conversation about what comes next for the business, you know where I am.
>
> Ola

CRM status set to `dead`. Flagged for 90-day retargeting.

---

### Stage 3a — Growth Track (On Reply, No Exit Signal)

**Subject:** (reply thread, no new subject)

> Glad the site is useful. A few business owners I have done this for asked me to look at the rest of their setup, because the website is usually just one of four or five revenue leaks.
>
> I do a 30-minute audit, £97, and you get a PDF showing exactly where enquiries are going missing. No obligation to do anything with it.
>
> Want me to send over what that looks like?

PASTOR structure in follow-up if no response to audit offer:
- Problem: enquiries are going missing without a system to catch them
- Amplify: those are people who already want your service and called someone else
- Story: helped a plumber in Georgia find three extra jobs a month through one change
- Transformation: the audit shows exactly where the leaks are
- Offer: £97, 30 minutes, PDF report
- Response: reply yes and I send the link

---

### Stage 3b — Exit/Partner Track (On Reply, Exit Signal Detected)

**MANDATORY: Ola reviews every flagged contact within 24 hours and calls within 48 hours. Do not autofire a partner email. The phone call converts at a far higher rate than any email for this ICP.**

**After the call, if the conversation is warm, send this follow-up:**

Subject: (reply thread)

> Thank you for making time today. What you said about [specific point from the call] stood out.
>
> As I mentioned, we help a small number of business owners each year get their operations running more independently. That is what makes the business more valuable, whether you decide to sell, step back, or simply want to enjoy running it more.
>
> I will send over the one-page brief we discussed. No pressure on timeline. Just a conversation.
>
> Ola

**Partner letter (for high-value exit prospects, sent separately via Lob.com):**

> Para 1: "You have built something real. [Business Name] has been operating for [X] years and has a reputation that took a long time to earn."
> Para 2: "Businesses like yours are hard to sell at full value because everything runs through the owner. Buyers see that as risk and discount the price accordingly."
> Para 3: "We work with a small number of businesses each year to install systems that make them owner-independent. This makes the business more sellable, and more enjoyable to run while you still own it. We charge a flat fee and take no equity."
> Para 4: "If this is on your radar, even loosely, I would welcome a 20-minute call. No pitch. Just a look at what is possible."

**Banned phrases in all partner outreach:** acquisition, purchase, buyout, buy your business, success fee, percentage of sale. (These terms trigger M&A broker licensing questions in multiple US states. Keep all language positioned as a systems engagement until a legal agreement is in place.)

---

### Copy Rules (All Stages)

| Rule | Detail |
|---|---|
| Reading level | Grade 6-7 (Hemingway App) |
| Email length | 80-120 words max |
| Paragraphs | 1-2 sentences each |
| Format | Plain text only, no HTML |
| From name | "Ola Mellila" on all cold sends. "Ola at Systems With Melly" on warm follow-ups. |
| Banned words Stage 1-2 | AI, automation, platform, stack, system, algorithm, funnel, synergy |
| One action per email | Never give options in Stage 1 or 2 |
| "AI" language | Do not use in Stage 1 or 2. Boomers distrust AI-branded unsolicited mail. |
| "No strings" | Never use. Legitimate offers do not need to say it. |
| Handwritten font letters | Never use. Faked intimacy destroys trust faster than impersonal copy. |
| From name "Melly" alone | Never on cold email. Earn the nickname on warm conversations. |

---

## 4. Data Acquisition Plan

| Source | Tool / Actor | Cost | Timeline | Expected Records |
|---|---|---|---|---|
| Google Maps no-website filter | `blackfalcondata/google-maps-no-website-leads-scraper` | $0.015-0.02/qualified lead. Budget $75-100 for 5k raw. | Week 1-2 | 5,000 raw, ~2,000 qualified after scoring |
| BBB age enrichment + email | `fatihtahta/bbb-scraper` ($3.99/1000, emails included) or `haketa/bbb-scraper` ($0.006/result) | $20-30 for 5,000 records | Week 1-2 | years_in_business filter narrows to 10+ year businesses |
| LinkedIn owner profiling supplementary | `harvestapi/linkedin-company-employees` ($0.012/profile with email) | $60 for 5,000 (enrichment only, not volume) | Week 2-3 | Use for name finding and personalisation, not volume |
| State business registries free | Direct scrape or Apify web scraper | Free | Week 1 | Sole proprietors and single-member LLCs registered pre-2015 |
| Email enrichment | Apollo.io Basic ($49/month, 5,000 credits) | $49/month | Ongoing | 45-55% hit rate on boomer ICP without website |
| Email validation | NeverBounce or ZeroBounce ($0.003/email) | $15 for 5,000 | Week 2-3 | Target: 85%+ validity rate before loading to sequence |

**Total data acquisition cost (first run): $112-152**

**State priority and Apify run configuration:**

| State | Priority | Launch Cities |
|---|---|---|
| Georgia | First | Atlanta, Augusta, Columbus, Savannah, Macon |
| Ohio | Second | Columbus, Cleveland, Cincinnati, Akron, Toledo |
| Florida | Third | Orlando, Tampa, Jacksonville, Fort Lauderdale, Miami |
| Texas | Fourth | Houston, Dallas, Austin, San Antonio, Fort Worth |

**Apify actor input (per city per trade):**
```json
{
  "searchTerms": ["plumber","roofer","HVAC contractor","electrician","landscaper","cleaning service","pest control","flooring"],
  "location": "Columbus, OH",
  "searchRadiusKm": 40,
  "gl": "us",
  "requirePhone": true,
  "maxResults": 500
}
```

Filter post-scrape: lead_score >= 40, phone present, category confirmed trade, no website confirmed.

**Expected yield from 5,000 raw records:** 2,000-2,500 usable emails after enrichment and validation. Budget 8,000-10,000 raw scrapes to hit 5,000 validated.

**Exit signal keyword list for CRM listener (expanded):**

sell, selling, sold, retirement, retire, tired, done, exit, successor, take over, buy me out, wind down, winding down, my kids don't want it, thinking of closing, not sure how much longer, ready for a change, might just shut it down, step back, next chapter, too old, looking to sell, thinking of selling

---

## 5. Email Infrastructure

### Tool Selection

| Tool | Cost | Recommendation |
|---|---|---|
| Instantly.ai | $37/month (Growth) | PRIMARY for V2. Built-in warmup, multi-inbox rotation, reply detection webhook, A/B testing, CAN-SPAM compliance checker. |
| Smartlead | $39/month | Alternative. Stronger API, better for custom Klaudius integration if webhook customisation is needed. |
| Gmail API | Free | DO NOT USE for US cold volume. Rate-limited at 2,000/day per account, flags fast without warmup infrastructure. |

### Domain Setup

- Register 3 sending domains (separate from systemswithmelly.com and olamapped.com, brand contamination risk).
- Recommended names: `getmelly.co`, `mellydigital.co`, `mellysystems.co`
- Register via Cloudflare ($10/year each).
- 2-3 Google Workspace mailboxes per domain ($6/mailbox/month). Total: 6-9 inboxes.
- Configure SPF, DKIM, DMARC on Day 1 before any warmup.
- For US physical address in email footer (CAN-SPAM requirement): iPostal1 or Regus US address ($10/month).

### Domain Warm-Up Schedule

| Week | Action | Daily Volume Per Inbox | Total Daily Volume |
|---|---|---|---|
| 1-2 | Warmup only (Instantly built-in warmup pool) | 5-10 | 30-60 |
| 2 | 100-email smoke test (see Section 11) | 10-15 | 60-90 |
| 3 | First POC batch (200 contacts) if smoke test passes | 20-30 | 120-180 |
| 4 | POC analysis. Do not scale until gates checked. | Hold | Hold |
| 5 | Scale to 500 if POC gates pass | 30-40 | 180-240 |
| 6-7 | Scale to 1,000/day if 500-contact gates pass | 40-50 | 240-300 |
| 8+ | Scale to full 5,000 run at 200/day sustained | 50 max per inbox | 300-450/day |

**Hard limit:** 50 emails per inbox per day. At 9 inboxes, maximum safe daily volume is 450. To hit 1,000/day, expand to 20+ inboxes (buy additional aged domains).

### Deliverability Hard Thresholds (Auto-Pause Triggers)

| Metric | Threshold | Action |
|---|---|---|
| Bounce rate | Above 2% | Pause campaign, audit list quality |
| Spam complaint rate (Google Postmaster) | Above 0.08% | Pause, rotate domain |
| Domain reputation (Google Postmaster) | Drops to Medium or Low | Pause, warm spare domain |
| Daily unsubscribes | Above 1% of sends | Review copy, pause if persists |

### CAN-SPAM + PECR Compliance Checklist

**LEGAL NOTICE: CAN-SPAM does not fully protect a UK-based sender targeting US recipients. PECR (Privacy and Electronic Communications Regulations) applies to UK senders. PECR requires prior consent for marketing email to sole traders and small partnerships. Before sending ANY volume, obtain a written legal opinion from a UK solicitor with PECR experience (cost: £200-400, timeline: 5-7 days). This runs in parallel with domain warmup. Do not skip.**

| Item | Requirement | Status |
|---|---|---|
| PECR legal opinion | Written opinion on B2B cold email from UK to US sole traders | Get before first send |
| From address | Real verified domain, no spoofing | Build into Instantly template |
| Subject line | Not deceptive | "Quick question before I do anything" passes |
| Physical address | UK business address or US registered agent in every email footer | Automate in Instantly template |
| Opt-out mechanism | One-click unsubscribe or "reply STOP" | Include in every email |
| Honour opt-outs | Within 10 business days | Log in Supabase v2_unsubscribes, suppress from future sends |
| B2B only | Business addresses only, not personal email addresses | Filter at acquisition stage |
| Pre-send suppression check | v2_unsubscribes checked via database trigger before any stage advance | Structural, not process |

**State M&A advisory licensing (for partner track):** Florida, California, and Texas require M&A advisor licensing for those who facilitate business sales for compensation. The deferred success fee structure (percentage of sale) triggers this in those states. Partner track emails must use systems engagement language only until a legal agreement is in place. Get a one-page "Systems Preparation Agreement" drafted by a UK commercial solicitor (£200-400) before any partner conversation progresses past a first call.

---

## 6. Automation Blueprint

### V2 Pipeline Flow

```
[Apify Scrape] -> [BBB Enrich] -> [Apollo Email Find] -> [NeverBounce Validate]
       |
[Supabase v2_unsubscribes check via trigger before stage advance]
       |
[Supabase v2_contacts table loaded, stage='built']
       |
[Klaudius V2 worker: build and STAGE website (not live), set stage='stage1_sent', record outreach_sent_at]
       |
[Instantly: Stage 1 permission email sent with staging URL, open tracking on]
       |
[pg_cron daily at 8am UTC: check stage1_sent_at < NOW()-4days AND reply_detected=false]
       |
[Instantly API: fire Stage 2 email, update stage='stage2_sent']
       |
[Instantly webhook on reply -> POST /api/v2/reply-received on VPS port 3001]
       |
[Node.js handler: regex exit keyword match]
    /                                    \
[Exit signal = true]              [Exit signal = false]
[stage='partner_prospect']        [stage='stage2_replied']
[Flag Ola via Slack/email]        [Auto-trigger Stage 3a audit offer]
[Ola calls within 48 hours]
       |
[pg_cron Day 10: no reply -> Lob.com letter API, stage='letter_sent']
[pg_cron Day 14: no reply -> final email -> stage='dead']
[90-day retargeting flag set]
```

### VPS Coexistence with V1

| Resource | V1 | V2 | Shared? |
|---|---|---|---|
| tmux session | `klaudius` | `klaudius-v2` | No |
| .env file | `/root/klaudius/.env` | `/root/klaudius-v2/.env` | No |
| Supabase project | v1 tables | v2_ prefixed tables | Yes (different tables) |
| Instantly account | V1 domains | V2 domains (separate account or sub-workspace) | No |
| Node.js runtime | Shared | Shared | Yes |
| PM2 process | `klaudius-v1` | `klaudius-v2` | No |
| VPS IP | Port 3000 (V1) | Port 3001 (V2) | Shared IP, different ports |

**Before launch: run `free -m` and `htop` on VPS. If RAM < 2GB free, upgrade DigitalOcean droplet from 2GB to 4GB ($24/month). Take a snapshot first. This is a prerequisite, not a Day 1 task.**

### Supabase Schema

```sql
-- Run as migration on existing Supabase project
CREATE TABLE IF NOT EXISTS v2_contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name text NOT NULL,
  owner_name text,
  email text NOT NULL,
  phone text,
  us_state text,
  city text,
  industry text,
  google_rating numeric,
  review_count int,
  years_in_business_est int,
  web_presence_score int DEFAULT 0,
  lead_score int DEFAULT 0,
  source text,
  instantly_campaign_id text,
  stage text DEFAULT 'built',
  site_staging_url text,
  site_live boolean DEFAULT false,
  outreach_sent_at timestamptz,
  reply_detected boolean DEFAULT false,
  reply_body text,
  reply_received_at timestamptz,
  exit_signal boolean DEFAULT false,
  exit_keywords_matched text[],
  ola_called boolean DEFAULT false,
  ola_called_at timestamptz,
  partner_status text DEFAULT 'none',
  letter_sent boolean DEFAULT false,
  letter_sent_at date,
  linkedin_outreach_sent boolean DEFAULT false,
  converted boolean DEFAULT false,
  audit_sold boolean DEFAULT false,
  stack_sold boolean DEFAULT false,
  unsubscribed boolean DEFAULT false,
  unsubscribed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Suppression list (CAN-SPAM + PECR compliance)
CREATE TABLE IF NOT EXISTS v2_unsubscribes (
  email text PRIMARY KEY,
  unsubscribed_at timestamptz DEFAULT now(),
  source text
);

-- Structural suppression check: blocks stage advance if email is on suppression list
CREATE OR REPLACE FUNCTION check_unsubscribed()
RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM v2_unsubscribes WHERE email = NEW.email) THEN
    RAISE EXCEPTION 'Email % is on suppression list', NEW.email;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_suppression
BEFORE UPDATE OF stage ON v2_contacts
FOR EACH ROW EXECUTE FUNCTION check_unsubscribed();

-- pg_cron: Day 4 trigger (enable extension first in Supabase dashboard)
-- Supabase Dashboard > Database > Extensions > pg_cron > Enable
SELECT cron.schedule(
  'v2-stage2-trigger',
  '0 8 * * *',
  $$
    SELECT net.http_post(
      url := 'http://72.61.18.158:3001/api/v2/trigger-stage2',
      body := '{}'::jsonb,
      headers := '{"Authorization": "Bearer YOUR_SECRET"}'::jsonb
    )
    WHERE EXISTS (
      SELECT 1 FROM v2_contacts
      WHERE stage = 'stage1_sent'
      AND outreach_sent_at <= NOW() - INTERVAL '4 days'
      AND reply_detected = false
      AND unsubscribed = false
    )
  $$
);

-- pg_cron: Day 10 letter trigger
SELECT cron.schedule(
  'v2-letter-trigger',
  '0 9 * * *',
  $$
    SELECT net.http_post(
      url := 'http://72.61.18.158:3001/api/v2/trigger-letter',
      body := '{}'::jsonb,
      headers := '{"Authorization": "Bearer YOUR_SECRET"}'::jsonb
    )
    WHERE EXISTS (
      SELECT 1 FROM v2_contacts
      WHERE stage = 'stage2_sent'
      AND outreach_sent_at <= NOW() - INTERVAL '10 days'
      AND reply_detected = false
      AND letter_sent = false
      AND unsubscribed = false
    )
  $$
);
```

### Exit Signal Handler (Node.js, VPS port 3001)

```javascript
const EXIT_KEYWORDS = [
  'sell','selling','sold','retirement','retire','tired','done','exit',
  'successor','take over','buy me out','wind down','winding down',
  "kids don't want it","thinking of closing","not sure how much longer",
  'ready for a change','might just shut it down','step back',
  'next chapter','too old','looking to sell','thinking of selling'
];

app.post('/api/v2/reply-received', async (req, res) => {
  const body = req.body.email_body?.toLowerCase() || '';
  const matched = EXIT_KEYWORDS.filter(kw => body.includes(kw));

  if (matched.length > 0) {
    await supabase.from('v2_contacts')
      .update({
        exit_signal: true,
        exit_keywords_matched: matched,
        partner_status: 'flagged',
        stage: 'partner_prospect',
        reply_detected: true,
        reply_body: req.body.email_body,
        reply_received_at: new Date().toISOString()
      })
      .eq('email', req.body.to_email);
    // Ola must call this person within 48 hours. Do not autofire a partner email.
    await notifyOla(`EXIT SIGNAL: ${req.body.to_email} -- keywords: ${matched.join(', ')} -- CALL WITHIN 48 HOURS`);
  } else {
    await supabase.from('v2_contacts')
      .update({
        reply_detected: true,
        reply_body: req.body.email_body,
        reply_received_at: new Date().toISOString(),
        stage: 'stage2_replied'
      })
      .eq('email', req.body.to_email);
    await triggerStage3a(req.body.to_email);
  }

  res.json({ ok: true });
});
```

### Daily Check Ritual (ADHD Operating Mode — 15 minutes max)

Three numbers only. Check these, nothing else, unless an alert fires.

| Number | Where to find it | What triggers action |
|---|---|---|
| Yesterday's Instantly open rate | Instantly dashboard | Below 25%: pause and check domain reputation |
| Exit signal count (last 24h) | Supabase: `SELECT COUNT(*) FROM v2_contacts WHERE exit_signal=true AND ola_called=false` | Any row: call that person today |
| PM2 process status | `pm2 list` | Not "online": investigate, watchdog should have restarted |

Everything else is weekly or event-triggered. The watchdog handles restarts. Ola's attention is only required for exit signal replies and gate decisions.

### Watchdog Script

```bash
#!/bin/bash
# /root/watchdog-v2.sh
V2_STATUS=$(pm2 jlist | jq -r '.[] | select(.name=="klaudius-v2") | .pm2_env.status')
if [ "$V2_STATUS" != "online" ]; then
  pm2 restart klaudius-v2
  echo "$(date): klaudius-v2 restarted" >> /root/logs/watchdog-v2.log
  curl -X POST $SLACK_WEBHOOK -d '{"text":"klaudius-v2 was down and has been restarted"}'
fi
```

Add to crontab: `*/15 * * * * /root/watchdog-v2.sh >> /root/logs/watchdog-v2.log 2>&1`

---

## 7. Exit Market Opportunity

### UK Market

| Metric | Data |
|---|---|
| Total private sector businesses | 5.7M |
| Directors aged 60+ | 808,126 companies |
| High-risk cohort (sole director 60+, assets >£50k, no succession) | 162,883 companies holding £158.5B in assets |
| SMEs with formal exit/succession strategy | 35% (65% have nothing) |
| SMEs that try to sell and fail to find a buyer | ~80% |
| Business dissolutions FY2025 | 726,735 (record high, up 9.6% YoY) |
| EBITDA multiple (construction, micro/small) | 2.75-4.15x (avg 3.2-3.5x) |

**UK gap:** Exit advisors (Shaw and Co, Exits.co.uk, Hilton Smythe, CapEQ) operate in the £1M+ EBITDA range. BDO requires £5k-£50k advisory fees. Sub-£1M EBITDA businesses have no affordable, systems-first exit preparation option.

### US Market

| Metric | Data |
|---|---|
| Boomer-owned US small businesses | ~12 million (41% of all privately owned SMBs) |
| Workers employed by boomer-owned businesses | 25+ million (1 in 6 US jobs) |
| Projected SMB ownership transitions by 2035 | 6 million (McKinsey) |
| Enterprise value at stake | $5-10 trillion |
| Owners with no succession plan | 58% |
| Owners who have had a professional valuation | 15% |
| Exits via sale vs closure | 5% sale, 92% closure |
| EBITDA multiple (US micro/small M&A) | 4.8x average (2024) |

### Broker Partnership Model

| Tier | Structure | Revenue per Client | Partner Receives |
|---|---|---|---|
| Tier 1 (Introduction) | Accountant or broker refers client | £3,000/$3,500 from client | £450 (15%) referral fee |
| Tier 2 (White-label) | Partner brands it as their own "Business Readiness Service", charges £3,500-£5,000 | £2,500 from partner | Partner keeps £1,000-£2,500 markup |
| Tier 3 (Deferred success fee) | Systems delivered, percentage of sale price if business sells within 24 months | £5k-£10k on a £500k sale | Ola takes contractual deferred fee |

**NOTE: Tier 3 is NOT a 90-day revenue line. It is a 2-3 year horizon play. Do not include it in 90-day cash projections. Focus Tier 3 conversations on UK businesses only until US state M&A licensing is clarified legally.**

**Target broker partners:** UK: Rightbiz, BusinessesForSale, Hilton Smythe, The Exit Foundry, BCMS. US: BizBuySell broker directory, IBBA members in TX/FL/OH/GA.

**Pitch script for accountants:** "You already know which of your clients are thinking about exiting in the next 3 years. Most will leave money on the table because the business is too owner-dependent. We spend 90 days implementing systems that increase the EBITDA multiple and buyer confidence. We charge £3k. We offer a 15% introduction fee or a white-label arrangement where you brand it as your own business readiness service."

**Fastest cash from broker track:** identify 2 UK accountants willing to white-label the stack as their own "Business Readiness Service" at £4k-£5k, paying Ola £2,500-£3,000 per referral. This is a 30-60 day path to cash, not 90 days.

### Ola's Construction Credibility Angle

- £38M TfL programme delivery is a direct trust anchor with construction and highways owner-operators.
- Construction-specific pitch hook: "Construction businesses typically sell at 2.75-3.5x EBITDA. Businesses with documented systems, recurring contracts, and a team that does not depend on the owner sell at 4-5x. That difference on a £500k EBITDA business is £600k-£750k. We spend 90 days putting that infrastructure in place."
- Arete Brokerage crossover: when a construction/property SME owner exits through V2, Arete can handle any property element of the deal, earning a property transaction fee on top of the systems engagement fee.
- AreteStays crossover: construction business owners are prime contractor accommodation clients for AreteStays. Zero additional acquisition cost.

---

## 8. Content and Brand

### LinkedIn Positioning Update (Do in First Week)

| Element | Current | V2 Update |
|---|---|---|
| Headline | Data governance / general AI | Add "AI Systems for Business Exit Readiness" |
| About section | Enterprise data focus | Add paragraph on boomer SME systemisation and exit readiness |
| URL | linkedin.com/in/datagovernanceola | Keep (SEO risk to change). Update display headline only. |
| Featured section | General | Pin first "Behind the Build" video once posted |

### Content Pillars

| Pillar | Topic | Format | Frequency |
|---|---|---|---|
| 1. The Exit Clock | Business worth less if it cannot run without you. What buyers actually pay for. | 3-line hook + story + question | 2x per week |
| 2. Behind the Build | Before/after of Klaudius site builds. "I found a 28-year plumbing business with no website." | Native video (60-90s) or carousel | 1x per week |
| 3. The Immigrant Operator | 9 years hands-on trades to £38M TfL delivery to AI systems. Credibility transfer, not diversity story. | Personal story post | 1x per fortnight |
| 4. Data Quality as Exit Risk | The £2M AI failure story. Data quality is the real moat. | Authority/education post | 1x per month |
| 5. The Systems Scorecard | "Can your business run 30 days without you? Score yourself." Comment-bait, lead magnet for £97 audit. | Poll or checklist post | 1x per month |

**ADHD reality check:** 2 posts per week minimum (not 4). Batch 4 posts in one sitting per fortnight. Each Klaudius build auto-triggers a content note in Supabase. Weekly review of that note becomes content fodder with no extra discovery cost.

### 90-Day Content Calendar

| Weeks | Focus | Key Posts |
|---|---|---|
| 1-4 | Foundation | Rewrite LinkedIn profile. "Immigrant Operator" arc (3 posts). First "Behind the Build" video. |
| 5-8 | Authority | £2M data quality story. Systems Scorecard post. Second video. First anonymised Klaudius case study. |
| 9-12 | Broker Outreach | "What makes a business unsellable in 2026" (written for broker audience). One-page exit-readiness offer published. DM 10 UK business brokers with personalised note + best-performing post link. Launch monthly "Business Systems Briefing" newsletter to Klaudius built-list. |

### Newsletter: "The Systems Brief by Melly"

| Element | Detail |
|---|---|
| Platform | Beehiiv (free at launch) |
| Cadence | First Monday of the month |
| Format | 3 items, 300 words max |
| Item 1 | One practical AI tip for SME operations |
| Item 2 | One exit-readiness insight |
| Item 3 | One link to a LinkedIn post or case study |
| List | Everyone who received a Klaudius site (V1 and V2), whether they replied or not |
| Health metric to watch | Unsubscribe rate per send |

---

## 9. Revenue Model

### CRITICAL: Fastest Cash Path

**Before any automation is built, run this parallel track using assets already in hand:**

The V1 Klaudius built-list contains businesses that already received a website. These are warm contacts, not cold. Call 10-20 of them directly. Offer the £97 audit. Close 3-5. Upsell 1 to the £3k stack. Potential: £3k-£5k in 2-3 weeks, zero additional infrastructure cost.

This is the fast-cash bridge while domains warm and the V2 pipeline builds. If personal runway is under 90 days, this track is not optional.

### Pricing Tiers

| Tier | Offer | Price | Delivery |
|---|---|---|---|
| Entry | Digital Business Audit | £97 | AI-generated PDF, 30-min call. Priced to filter buyers, not just validate the funnel. |
| Mid | "Be Claude Ready in 72 Hours" | £200/$250 | Outsourced (Nigeria/India, 30% cut) |
| Core | RevenueDrive Back Office AI Stack | £3,000/$3,500 | 5-agent scaffold, 90-day delivery |
| Partner | Systems-first exit preparation | £3,000 flat (no success fee in copy until legal agreement signed) | Custom, legal agreement required |

**NOTE on audit pricing: the original £30/$38 price was a proof-of-funnel token, not a revenue line. £97 filters serious buyers, improves audit-to-stack conversion, and generates 3x more revenue per unit. £38 signals a pricing psychology trick that boomer tradespeople recognise and resent.**

### Honest 90-Day Revenue Model

All scenarios use 5,000 contacts, 5% reply rate, and ICP-realistic conversion rates (not B2B SaaS benchmarks).

| Scenario | Calculation | Gross Revenue |
|---|---|---|
| Conservative | 2 stacks at £3k + 5 audits at £97 | £6,485 |
| Base | 4 stacks at £3k + 10 audits at £97 | £12,970 |
| Optimistic | 6 stacks at £3k + 1 white-label partner deal at £10k + 15 audits at £97 | £29,455 |

**The £87k-£100k figure from original research is removed. It is not traceable to a defensible calculation and must not appear in any partner, investor, or broker conversation. The base case at £13k is credible and achievable without heroic assumptions.**

**Call-to-close conversion rates used above:** 10-15% call-to-paid (not the 40% in the original model). 40% is a B2B SaaS benchmark. This ICP is digitally disengaged boomer tradespeople. 10-15% is the honest floor.

### Unit Economics (5,000 Contact Run)

| Metric | Assumption | Result |
|---|---|---|
| Contacts in sequence | 5,000 | 5,000 |
| Email open rate | 35% | 1,750 opens |
| Reply rate | 5% | 250 replies |
| Exit signal replies | 1-2% of total list | 50-100 flagged |
| Calls booked (3a growth track) | 10% of non-exit replies | ~17-18 calls |
| Audits closed (15% of calls) | 15% | ~3 audits x £97 = £291 |
| AI Stack conversions (from audits + direct close) | Base case 4 total | 4 stacks x £3,000 = £12,000 |
| Partnership deals closed via broker white-label | 2 deals in 90 days | 2 x £2,500 = £5,000 |
| 90-day gross revenue (base) | | ~£17,291 |

### Operating Cost (V2 First Run)

| Item | Cost |
|---|---|
| Apify data acquisition | $80-120 |
| BBB enrichment | $12-20 |
| Residential proxies | $20 |
| Apollo email enrichment | $49/month |
| NeverBounce validation | $15 |
| Instantly.ai (sending + warmup) | $37/month |
| 3 sending domains + Cloudflare | $36 |
| Google Workspace (6 mailboxes) | $36/month |
| Lob.com letters (200 POC x $1.50) | $300 at scale |
| US registered address (CAN-SPAM) | $10/month |
| VPS upgrade if needed | $12 additional/month |
| PECR legal opinion | £200-400 |
| Systems Preparation Agreement (solicitor) | £200-400 |
| **Total first 90 days** | **~$700-900 + £400-800 legal** |

**Margin: strong on revenue. Legal costs are one-time. Costs recover at 1 audit sale + 1 stack sale.**

### POC Validation Gates

| Stage | Contacts | Hard Gates (must hit before scaling) | Soft Gates |
|---|---|---|---|
| Smoke test | 100 | Deliverability rate 95%+. Open rate 25%+. Zero hard bounces. Domain reputation clean. | First reply received |
| Batch 1 | 200 | Open rate 35%+. Reply rate 5%+. At least 1 paying client. Bounce rate under 2%. | 3+ exit signal replies flagged |
| Batch 2 | 500 | All Batch 1 gates hold. Domain reputation clean. Delivery capacity confirmed. | 5+ partnership conversations open |
| Full run | 5,000 | All Batch 2 gates hold. 2+ outsourced builders briefed on delivery. | First case study documented |

**Do not scale before each gate passes.**

---

## 10. VPS Deployment Checklist

**Prerequisites (do before touching the VPS):**
- [ ] Register 3 V2 sending domains on Cloudflare
- [ ] Set up SPF, DKIM, DMARC on all 3 domains
- [ ] Set up 6-9 Google Workspace mailboxes (2-3 per domain)
- [ ] Create Instantly.ai account, connect all mailboxes, enable warmup (14 days before first send)
- [ ] Register US physical address via iPostal1 or Regus ($10/month)
- [ ] Buy Lob.com account, set up typed letter template (NOT handwritten font), test with one address
- [ ] Commission PECR legal opinion from UK solicitor (runs in parallel with warmup, no delay to schedule)
- [ ] Commission "Systems Preparation Agreement" (one-page, UK commercial solicitor)
- [ ] Run Apollo.io and Apify: acquire and validate first 100 contacts (Georgia, HVAC + plumbing)

**VPS Steps (execute in order):**

```bash
# Step 1: Check resources (PREREQUISITE — do before anything else)
ssh root@72.61.18.158
free -m
# Must show 2GB+ free RAM
# If not, upgrade DigitalOcean droplet FIRST (snapshot, then resize)
htop
# Confirm V1 x5 workers are not maxing CPU

# Step 2: Snapshot VPS before any changes
# Do this in DigitalOcean dashboard before proceeding.

# Step 3: New tmux session
tmux new -s klaudius-v2

# Step 4: Clone or copy V2 pipeline
cp -r /root/klaudius /root/klaudius-v2
# or: git clone [klaudius-v2 repo] /root/klaudius-v2

# Step 5: Create V2 .env (NEVER share with V1)
nano /root/klaudius-v2/.env
# Add these variables:
# V2_GEOGRAPHY=US
# V2_ICP_INDUSTRIES=hvac,plumbing,roofing,electrical,landscaping,cleaning,pest_control,flooring,auto_repair,funeral
# V2_SEND_DOMAIN=[your domain]
# V2_INSTANTLY_API_KEY=[key]
# V2_SUPABASE_URL=[url]
# V2_SUPABASE_KEY=[key]
# V2_LOB_API_KEY=[key]
# V2_SLACK_WEBHOOK=[url for exit signal alerts]
# V2_US_PHYSICAL_ADDRESS=[iPostal address]
# V2_SITE_MODE=staging
# (site mode: staging means Klaudius builds but does not publish live until consent reply)

# Step 6: Open firewall port for reply handler
ufw allow 3001
ufw status

# Step 7: Run Supabase migration
# Open Supabase dashboard > SQL editor
# Paste the full SQL from Section 6 (v2_contacts, v2_unsubscribes, trigger, pg_cron jobs)
# Enable pg_cron: Supabase Dashboard > Database > Extensions > pg_cron > Enable

# Step 8: Install dependencies for V2
cd /root/klaudius-v2
npm install
npm install @lob/lob-typescript

# Step 9: Set up PM2 for V2
npm install -g pm2   # if not already installed
pm2 start /root/klaudius-v2/v2-pipeline.js --name klaudius-v2
pm2 start /root/klaudius-v2/v2-reply-handler.js --name klaudius-v2-webhook
pm2 save
pm2 startup
# Follow the output command to register on system restart

# Step 10: Verify both V1 and V2 are running without conflict
pm2 list
# Should show: klaudius-v1 (online), klaudius-v2 (online), klaudius-v2-webhook (online)

# Step 11: Add watchdog
chmod +x /root/watchdog-v2.sh
mkdir -p /root/logs
crontab -e
# Add: */15 * * * * /root/watchdog-v2.sh >> /root/logs/watchdog-v2.log 2>&1

# Step 12: Smoke test (10 contacts manually)
# Load 10 contacts into v2_contacts table (INSERT, stage='built')
# Trigger Stage 1 manually:
#   curl -X POST http://localhost:3001/api/v2/trigger-stage1-test -H "Authorization: Bearer YOUR_SECRET"
# Verify Instantly sends the email
# Send a test reply from an external inbox
# Verify webhook fires on port 3001
# Confirm exit keyword detection: send a reply containing "thinking of selling"
# Confirm Ola alert fires (Slack/email)
# Confirm Lob.com generates a test letter (use test API key)
# Confirm suppression trigger: add test email to v2_unsubscribes, attempt stage update, confirm EXCEPTION raised

# Step 13: Load 100 Georgia contacts (smoke test batch)
# Run Apify actor for Atlanta GA, HVAC + plumbing, maxResults 300
# Filter: lead_score >= 40, phone present, no website
# Enrich via Apollo, validate via NeverBounce
# Import to v2_contacts, set stage='built', site_staging_url populated

# Step 14: Start smoke test campaign (100 contacts)
# Confirm domains have completed 14-day warmup
# Set Instantly campaign live for 100 contacts
# Monitor daily: open rate, bounce rate, domain reputation (Google Postmaster Tools)

# Step 15: Assess smoke test at Day 5
# Hard gates: deliverability 95%+, open rate 25%+, zero hard bounces
# If passes: load 200-contact POC batch (Batch 1)
# If fails: diagnose domain reputation or list quality before proceeding
```

**Post-launch daily monitoring (15 minutes, same as Section 6 daily check ritual):**
- Instantly dashboard (open rate, reply rate, bounce rate)
- Supabase: `SELECT * FROM v2_contacts WHERE exit_signal=true AND ola_called=false`
- `pm2 list` (process health)

**Weekly:**
- Google Postmaster Tools and Microsoft SNDS (spam complaint rates)
- `pm2 logs klaudius-v2 --lines 100`
- Content: one LinkedIn post drafted from the week's Klaudius build notes

---

## 11. 100-Email POC Smoke Test Plan

**Purpose:** minimum viable test to validate deliverability, copy resonance, and reply handler before committing to the full 200-contact POC or spending on infrastructure. Run in Week 2 (while domains finish warmup). Total cost: effectively zero beyond existing subscriptions.

### Scope

| Parameter | Value |
|---|---|
| Contact volume | 100 |
| Geography | Atlanta, GA only |
| Industry | HVAC and plumbing only (two trades) |
| Emails sent | Stage 1 only (permission email with staging URL) |
| Stage 2 onwards | Only fire for actual replies from these 100 |
| Infrastructure needed | 1 warmed inbox, 1 Supabase table, 1 Apify run, 1 Apollo enrichment pass |
| Duration | 7 days from first send |

### Step-by-Step

| Day | Action | Time Required |
|---|---|---|
| Day -3 (prep) | Run Apify `blackfalcondata/google-maps-no-website-leads-scraper` for Atlanta GA, searchTerms: ["plumber","HVAC contractor"], maxResults: 300, requirePhone: true | 30 min |
| Day -2 (prep) | Filter Apify output: lead_score >= 40, phone present, no website. Target 120-150 raw records. Enrich via Apollo (email find). Validate via NeverBounce. Target: 100 clean emails. | 2 hours |
| Day -1 (prep) | Load 100 contacts to v2_contacts. Set stage='built'. Build and stage 100 websites (not live). Populate site_staging_url field. | 1-2 hours |
| Day 1 | Send Stage 1 permission email to 100 contacts via Instantly. Verify sends in Instantly dashboard. Check no bounces in first 2 hours. | 30 min + monitoring |
| Day 2-3 | Check open rate in Instantly. Target: 25%+ (= 25 opens). Check for any replies. If reply with exit signal: Ola calls that person. If reply without exit signal: Stage 3a audit offer sent manually (not automated). | 15 min/day |
| Day 4 | Stage 2 fires automatically for non-replies (pg_cron). Verify the cron ran correctly in Supabase logs. | 15 min |
| Day 5-6 | Monitor replies from Stage 2. Check Slack for any exit signal alerts. | 15 min/day |
| Day 7 | Assess gates. | 30 min |

### Smoke Test Gates

| Metric | Pass | Fail action |
|---|---|---|
| Deliverability rate | 95%+ (< 5 bounces from 100 sends) | Audit list quality before any further send |
| Open rate | 25%+ (25+ opens) | Rewrite Stage 1 subject line, re-test on next 50 |
| Hard bounces | 0-2 max | Above 2: pause, re-validate list |
| Domain reputation | Green on Google Postmaster Tools | Any drop: pause, switch to spare domain |
| Reply rate | At least 1 reply (1%+) | Check if email landed in spam, test copy variant |
| Webhook fires correctly | All replies appear in v2_contacts reply_body field | Debug Node.js handler before scaling |
| Exit signal detection | Test by sending one self-reply with exit keywords | Fix regex before scaling |

### What to Do With Replies

**If 1-3 replies come in:** handle manually. Call any exit-signal replies within 48 hours. Offer the £97 audit to growth-track replies directly in the thread. Do not wait for the automation to scale before practicing the conversation.

**If 0 replies:** check Instantly spam folder report. If 50%+ of emails landed in spam, the domain needs more warmup or the list quality is wrong. Do not proceed to 200-contact POC until this is resolved.

**If 5+ replies:** the copy is working. Load the 200-contact POC batch immediately and let the automation handle Stage 2 onwards.

### What This Test Costs

| Item | Cost |
|---|---|
| Apify run (300 records) | ~$4.50 |
| Apollo enrichment (100 emails) | Within existing $49/month quota |
| NeverBounce (100 validations) | $0.30 |
| Instantly sends (100 emails) | Within existing $37/month quota |
| Total | Under $5 |

**This is the cheapest possible validation. The cost of skipping it is a failed 5,000-contact run with 3 domains blacklisted.**

---

## 12. Critique Resolution

| Fatal Flaw Raised | How This Plan Addresses It |
|---|---|
| Website deployed without consent is a legal and trust liability | Stage 0 now builds and stages only. Stage 1 email asks permission before publishing. The site goes live only on consent reply. |
| "Melly" as from-name reads as alias/food brand, not a credible B2B operator | All cold sends use "Ola Mellila" as from-name. Credential line added to signature. "Melly" is reserved for warm conversations. |
| Day 4 missed-calls question is an obvious sales script | Stage 2 now uses one specific question drawn from actual CRM data about that business (service shown on Google profile, review content, years in business). Generic scripts removed. |
| Faked handwritten font on physical letter destroys trust | Lob.com letter is now a typed business letter on simple letterhead. Faking handwriting is explicitly banned. |
| Exit/succession framing at Day 7 before any trust is established | Exit language is removed from the no-reply path entirely. It appears only in Stage 3b, which fires only after a reply contains exit keywords. |
| "No strings" is a red flag phrase | Removed from all copy. Replaced with direct statements of what will happen. |
| CAN-SPAM does not protect a UK sender. PECR applies. | PECR legal opinion added as a prerequisite before any send. Written opinion from a UK solicitor with PECR experience, £200-400, runs in parallel with domain warmup. |
| 5,000-contact, 3.5-week timeline is arithmetically impossible with mandatory warmup | Timeline reframed honestly: Day 1 domains registered and warmup starts, Day 15 first 100-contact smoke test, Day 22 200-contact POC if smoke test passes, Week 8-10 first full 5,000-contact run begins. |
| Partner track deferred success fee triggers M&A broker licensing in FL, TX, CA | Partner track copy uses systems engagement language only. No success fee or sale percentage mentioned in any email. Legal agreement drafted by solicitor before any partner conversation progresses past first call. Tier 3 removed from 90-day revenue projections. |
| VPS resource check listed as Day 1 task, not prerequisite | RAM/CPU check is now explicitly a prerequisite with hard instruction: upgrade before cloning V2 repo. |
| 20 next actions = paralysis for ADHD founder | Collapsed to 3 actions this week (Section 13). Everything else has a sequenced timeline that gates off warmup completion. |
| No pre-send suppression check in schema | Database trigger `enforce_suppression` added on v2_contacts.stage update. Structural, not a process step. Cannot be bypassed by a Node.js bug. |
| No hard deliverability thresholds | Explicit thresholds added in Section 5: bounce rate above 2% = pause, spam complaint rate above 0.08% = pause and rotate domain. |
| $38 audit price reads as a pricing psychology trick | Repriced to £97. This filters serious buyers, improves audit-to-stack conversion, and removes the association with price-trick tactics. |
| Exit-signal contacts handled by automation | Stage 3b now requires Ola to call within 48 hours. No partner email autofires. Automation only flags and notifies. |
| £87k-£100k revenue projection is not traceable | Removed. Replaced with three honest scenarios: conservative £6.5k, base £13k, optimistic £29.5k. All defensible against the actual conversion math. |
| No personal runway bridge | Fastest cash path section added (Section 9): call the existing V1 built-list directly, offer £97 audit, close 3-5, upsell 1 stack. £3k-£5k in 2-3 weeks with zero new infrastructure. |
| Klaudius V1 revenue actuals not established as baseline | Acknowledged as a gap. Before V2 scaling decisions, pull V1 actual conversion data from Supabase and use it to calibrate V2 assumptions. |

---

## 13. Next Actions

**The only three actions that matter this week (everything else gates off these):**

| Priority | Action | Time | Deadline |
|---|---|---|---|
| 1 | Register 3 V2 sending domains on Cloudflare. Configure SPF, DKIM, DMARC. Start Instantly warmup. The 14-day clock starts today or it does not start. | 1 hour | Today |
| 2 | Call 5-10 contacts from the existing V1 Klaudius built-list. Offer the £97 audit directly. This is the fast-cash bridge. | 2-3 hours | This week |
| 3 | Email a UK solicitor with PECR experience. Brief: "I am a UK sender cold-emailing US sole traders and small partnerships. I need a written opinion on whether this is permissible under PECR and on what legal basis." Cost: £200-400. Runs in parallel with warmup. | 20 min | Today |

**What comes after (once warmup is running):**

| Action | When |
|---|---|
| Check VPS RAM (`free -m`, `htop`). Upgrade droplet if needed. Snapshot first. | Day 2 |
| Register US physical address via iPostal1. | Day 2 |
| Run Apify for Atlanta GA, HVAC + plumbing, 300 records. Enrich via Apollo. Validate via NeverBounce. | Day 2-3 |
| Update LinkedIn headline and about section (exit readiness positioning). | Day 3 |
| Write and post first "Behind the Build" LinkedIn post using a V1 build. | Day 7 |
| Run Supabase migration (v2_contacts, suppression trigger, pg_cron). | Day 3-5 |
| Build and test V2 Node.js reply handler on VPS port 3001. Test exit keyword detection. | Day 3-5 |
| Set up Lob.com typed letter template. Test with one real address. | Day 5 |
| Set up PM2 for klaudius-v2. Add watchdog-v2.sh to crontab. | Day 5 |
| Load 100 Georgia contacts. Build and stage 100 sites. | Day 14 (after warmup) |
| Launch 100-contact smoke test campaign. | Day 15 |
| Assess smoke test gates at Day 7 of campaign. | Day 22 |
| If gates pass: load 200-contact POC batch. | Day 23-24 |
| Brief 2 outsourced delivery partners on AI stack delivery. | Day 21 |
| Commission "Systems Preparation Agreement" from UK commercial solicitor. | Day 14 |
| Identify 10 UK business brokers and 5 accountants for Tier 1/2 pitch. | Day 30 |
| Go/no-go on 500-contact batch based on 200-contact POC gates. | Day 37 |
| Scale to 500 contacts (Ohio, second state) if gates pass. | Day 38 |

---

*Created 2026-06-27 | Updated 2026-06-28 | Canonical source: `~/Knowledge/Engine/RevenueDrive/my-agency-v2-plan.md`*
*Feeds into: RevenueDrive, Klaudius V2, Arete Brokerage exit track, AreteStays contractor accommodation*
