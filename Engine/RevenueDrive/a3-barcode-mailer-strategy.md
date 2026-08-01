---
name: a3-barcode-mailer-strategy
type: project
status: ready-to-action
created: 2026-06-29
---

# Physical Mailer + QR Strategy (the "scan to see your website" hook)

> The unfair advantage: most agencies send a letter saying "we can build you a site."
> You send them a printed page of THEIR site, already built, with a QR code that opens it live.
> The gift is already made. The QR turns paper into a measurable click.

---

## 1. The core mechanic

1. Klaudius has already built the prospect a real website (the gift).
2. We print a physical mailer showing a screenshot of THEIR site + headline + a **QR code**.
3. QR points to a **tracked short link** → redirects to their live site.
4. When they scan, we log it. A scan = a hot lead. That triggers the call + email follow-up.

The QR is the bridge between offline (paper, high trust, opened) and online (their live site, instant proof).

## 2. Format decision: A3 vs A5 vs postcard

| Format | Impact | Cost (print+UK post, ~Stannp) | Verdict |
|--------|--------|-------------------------------|---------|
| A3 folded | Very high, "wow" | ~£1.50-2.50 each | Use for high-value / warm targets only |
| A5 flyer | Strong | ~£0.55-0.85 each | **Default for volume** |
| Postcard A6 | Good, cheapest | ~£0.40-0.60 each | Best for cold blast at scale |

**Recommendation:** Run A5 as the default workhorse, reserve A3 for the 20-30 highest-value local targets where the visual impact justifies the cost. Test A6 postcard for cold volume. Start with a 30-piece A3 test to the best leads.

## 3. What goes on the mailer

- **Front:** Big screenshot of their live site. Headline: "We already built [Business Name] a website. Scan to see it live." QR code, large, with "Point your camera here".
- **Back:** 3 lines on the offer (direct ordering / more Google reviews / no monthly lock-in), your name + number + email, and a deadline ("yours free to claim until [date]").
- One QR, one phone number, one clear action. No clutter.

## 4. Tracking (this is what makes it a system, not a gamble)

- Each prospect gets a **unique short link** e.g. `mly.uk/c/<slug>` → 302 redirect to their site.
- Log every scan: slug, timestamp, into Supabase (`scans` table or a column on `clients`).
- A scan flips the CRM record to `mailer_scanned` → fires a Telegram to you + queues the call.
- Bonus: a literal tracking barcode/ref printed small for Stannp delivery confirmation.

## 5. Build pipeline (what I will build)

1. **`gen-mailer.py`** — pulls a prospect from Supabase, screenshots their live site (Playwright), generates a unique QR (python `qrcode`), lays it into an A3/A5 PDF (reportlab or HTML→PDF). Output: print-ready PDF per prospect.
2. **Redirect + scan logger** — tiny endpoint (`mly.uk/c/<slug>`) on the VPS (Flask) or a Vercel function. Logs scan to Supabase, 302s to their site.
3. **Stannp send** — push the PDF batch to Stannp API (you already have `stannp_sends.db`), post to the prospect addresses.
4. **Scan → CRM → alert** — scan event updates `clients.status = mailer_scanned`, Telegram + call task.

## 6. Action checklist (tonight / tomorrow)

- [ ] **You:** confirm format (A5 default + 30x A3 test?) and budget per batch.
- [ ] **You:** confirm short domain (have one? e.g. a spare domain on Cloudflare for `mly.uk/c/...`) or use a free-tier redirect.
- [ ] **You:** confirm Stannp account is funded + API key in `.env`.
- [ ] **Me:** build `gen-mailer.py` (screenshot + QR + PDF).
- [ ] **Me:** stand up the redirect + scan logger, add `scans` to Supabase.
- [ ] **Me:** generate the first 30 A3 PDFs from top leads, send you for eyeball before Stannp posts them.

## 7. Economics (sanity check)

- 30x A3 test ≈ £45-75 all-in. One £200 "Claude Ready" close pays for ~3-4 batches.
- At A5 scale: 200 pieces ≈ £110-170. Break-even = a single mid-tier close.
- The scan data means you only burn phone/email energy on prospects who already raised a hand.

## v2 requirements (Ola, 29 Jun) — LOCKED

1. **QR/barcode must be trackable** with a notification of how many people scanned. → scan row per hit in Supabase `mailer_scans`; running count pushed to Telegram (real-time on scan + rolled into the 20:00 EOD report).
2. **Capture BEFORE redirect.** The QR does NOT go straight to the site. It lands on a capture page that collects **email + phone**, then forwards to their website.
3. **Two-way CTA on the capture page:** "Message us on WhatsApp or text to request changes, send more recent photos, or add your latest reviews." → buttons: `wa.me/447474912431` (business eSim, on WhatsApp) + `sms:+447474912431`.
4. **All 141 companies loaded** — generate a unique tracked QR + capture page for every built site, not just Coco.

### Capture layer architecture (to build)
- `capture-mly.vercel.app/?c=<slug>` (static page, Vercel HTTPS).
- Embedded slug → {business name, live site URL} map (generated from Supabase, all 141).
- On load: insert `mailer_scans` row (slug, timestamp).
- Form: email + phone (phone optional to stay GDPR-clean) + consent line.
- On submit: insert `mailer_leads` row → Telegram "New lead: <name> left <email>/<phone>" → redirect to their site.
- WhatsApp + SMS buttons to 07474912431 for amendments / new photos / reviews.
- Supabase tables: `mailer_scans(slug, ts)`, `mailer_leads(slug, email, phone, ts, consent)`.
- QR generator: `gen-qr.py` → one PNG per slug pointing to the capture URL, for Stannp print.

### Build order (next focused session)
1. Create Supabase `mailer_scans` + `mailer_leads` tables (with anon-insert policy).
2. Build + deploy the capture page to Vercel; pilot on Coco's slug end-to-end.
3. Generate QRs for all 141; hand the batch to Stannp.
4. Add scans/leads counts to the EOD Telegram report.

## Inputs still needed from Ola
- Confirm WhatsApp/text CTA number = **07474912431** (business eSim).
- Short domain for pretty QR links (optional; MVP can run on `*.vercel.app`).
- Stannp account funded + API key in `.env` (you said you've signed in; confirm funded).
