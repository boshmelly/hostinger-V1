# coconiczy Ordering System — Deployment Documentation Index

**Status:** READY TO DEPLOY  
**Date:** 2026-06-29  
**Deployment Lead:** You  
**Client:** coconiczy Cookout (Ola)  

---

## Quick Navigation

### For Deployment Lead (You)

Start here for the complete integration blueprint:

1. **[coconiczy-integration-and-go-live.md](coconiczy-integration-and-go-live.md)** — MAIN DOCUMENT
   - **Part 1:** System architecture & integration points (where menu, order flow, Stripe, automation plug together)
   - **Part 2:** Hostinger VPS deployment (WordPress setup, domain, SSL, WooCommerce config)
   - **Part 3:** 8 smoke test scenarios (step-by-step test execution plan)
   - **Part 4:** Go-live checklist (pre-launch, go-live day, post-launch monitoring)
   - **Part 5:** Hand-off documentation for coconiczy (admin dashboard quick reference)
   - **Part 6:** Timeline & effort estimates
   - **Part 7:** Integration specs for agents
   - **Part 8:** Post-launch operations

2. **[coconiczy-integration-diagrams.md](coconiczy-integration-diagrams.md)** — VISUAL REFERENCE
   - Detailed system architecture diagram (full stack from customer browser to email)
   - Order lifecycle state machine (order status flow from payment to review request)
   - Integration points checklist (how components plug together)
   - Webhook data flow (critical security path for payment processing)
   - Email trigger automation flow (all 4 email triggers documented)

3. **[coconiczy-agent-deployment.md](coconiczy-agent-deployment.md)** — AGENT ASSIGNMENTS
   - 5-agent parallel deployment plan
   - Agent 1 (Menu Architect) — build menu structure
   - Agent 2 (Collection Flow Engineer) — design checkout flow
   - Agent 3 (Stripe Integration Specialist) — wire Stripe payment
   - Agent 4 (Automation Builder) — email/SMS triggers
   - Agent 5 (Deployment Lead) — YOUR role ← You are here
   - Supporting specs (templates, examples, payloads)

4. **[coconiczy-cookout-ordering.md](coconiczy-cookout-ordering.md)** — PROJECT SPEC
   - Original business requirements from Ola
   - Deliveroo menu duplication approach
   - Price parity legal considerations
   - Economics (why direct ordering saves coconiczy money)

---

## Key Dates & Timeline

| Phase | Duration | Owner | Status |
|-------|----------|-------|--------|
| **Plan & Spec** | 30 min | All | ✓ DONE |
| **Build (4 agents parallel)** | 2–3 hours | Agents 1–4 | ⏳ IN PROGRESS |
| **Integration & Testing** | 1–2 hours | Deployment Lead (you) | ⏳ NEXT |
| **Smoke Tests (8 scenarios)** | 1–2 hours | Deployment Lead | ⏳ NEXT |
| **Go-Live Activation** | 30 min | Deployment Lead + coconiczy | ⏳ NEXT |
| **Hand-Off & Training** | 1 hour | Deployment Lead + coconiczy | ⏳ NEXT |
| **Post-Launch Monitoring** | 24–48 hours | Deployment Lead | ⏳ NEXT |
| **TOTAL** | **5–8 hours** | — | **~1–2 days elapsed** |

---

## Critical Path & Dependencies

```
Agent 1 (Menu)     ─┐
Agent 2 (Flow)     ─┼──> Integration (You) ──> Smoke Tests ──> Go-Live
Agent 3 (Stripe)   ─┤
Agent 4 (Automation)─┘

Blockers to watch:
✓ Menu JSON must be valid & importable
✓ Checkout flow must be deployed & functional
✓ Stripe webhook must be registered & signature validation working
✓ Email service must send test emails successfully
✓ Domain must resolve (or use Hostinger subdomain as fallback)
```

---

## What You Need to Do (Deployment Lead Role)

### Phase 1: Pre-Integration (Now)

- [ ] Confirm Hostinger VPS access (or provision new VPS)
- [ ] Confirm WordPress fresh install OR identify existing WordPress instance
- [ ] Create MySQL database for coconiczy (coconiczy_prod or similar)
- [ ] Verify PHP 8.1+ and mod_rewrite enabled
- [ ] Get coconiczy to start Stripe account setup (parallel, takes ~1 day)
- [ ] Decide on domain (custom domain or Hostinger subdomain)

### Phase 2: Collect Agent Deliverables (Waiting)

Once agents complete work, collect:

1. **Agent 1 (Menu):**
   - `menu.json` or `menu.csv` (must be valid, importable)
   - All product photos (URLs or files)
   - Modifier definitions (size, sauce, etc.)

2. **Agent 2 (Order Flow):**
   - Checkout page code (Orderable plugin config OR custom template)
   - Order status page code (customer-facing tracking)
   - Time slot logic (respects opening hours, 30-min intervals)
   - Any custom CSS/templates

3. **Agent 3 (Stripe):**
   - Webhook handler code (PHP or Node.js)
   - Payment intent creation code
   - Error handling code
   - Webhook configuration instructions
   - Test payloads (for your testing)

4. **Agent 4 (Automation):**
   - Email templates (4 total: confirmation, preparing, ready, review request)
   - Trigger code (MailPoet automations or SendGrid API setup)
   - Cron job config (for delayed review request)
   - Email service config instructions

### Phase 3: Integration (You execute this)

When all agents deliver:

1. **Install & configure WordPress:**
   - [ ] WooCommerce + required plugins
   - [ ] Orderable OR custom checkout code
   - [ ] Stripe payment plugin
   - [ ] Email service (MailPoet or SendGrid)
   - [ ] Set up database tables, order statuses

2. **Import menu (Agent 1):**
   - [ ] Upload menu.json or menu.csv to WooCommerce
   - [ ] Verify all products visible in shop
   - [ ] Verify prices correct
   - [ ] Verify modifiers work
   - [ ] Verify photos load

3. **Deploy checkout flow (Agent 2):**
   - [ ] Deploy checkout template to WordPress
   - [ ] Test: add items to cart
   - [ ] Test: fill in customer details, time slot
   - [ ] Test: see order confirmation page

4. **Wire Stripe (Agent 3):**
   - [ ] Register webhook endpoint in Stripe test dashboard
   - [ ] Add webhook handler to WordPress
   - [ ] Wire payment button to Stripe SDK
   - [ ] Add Stripe test keys to WordPress settings
   - [ ] Test: create test order, webhook fires, order updates

5. **Wire email automation (Agent 4):**
   - [ ] Set up email service (MailPoet or SendGrid)
   - [ ] Configure email automation triggers
   - [ ] Create email templates in MailPoet or SendGrid
   - [ ] Set up cron job for review request delay
   - [ ] Test: create order, confirm email arrives < 1 min

6. **Set up domain + SSL:**
   - [ ] Register or transfer domain
   - [ ] Point DNS to Hostinger VPS
   - [ ] Issue SSL certificate (Let's Encrypt auto-renew)
   - [ ] Update WordPress Site URL to https://coconiczy.co.uk
   - [ ] Verify SSL (https://www.ssllabs.com/ssltest/)

### Phase 4: Smoke Testing (You execute this)

Run all 8 tests (detailed in main document, Part 3):

1. **Menu Completeness** — All items, prices, photos visible
2. **Order Flow & Collection** — Checkout collects name, phone, time slot correctly
3. **Payment Success** — Test card (4242...) processes, webhook fires, order created
4. **Payment Decline** — Declined card (4000...) shows error gracefully
5. **Status Updates & Emails** — Marking orders ready triggers emails
6. **Refund Flow** — Issue refund, customer notified
7. **Order Status Page** — Customer can track without login
8. **Mobile Responsiveness** — Mobile UX smooth, touch-friendly

**All 8 must PASS before go-live.**

### Phase 5: Go-Live (You + coconiczy)

1. **Activate Stripe live keys:**
   - [ ] coconiczy provides live secret + publishable keys
   - [ ] You update WordPress settings (test mode OFF)
   - [ ] Verify webhook endpoint now pointing to live Stripe

2. **Final system check:**
   - [ ] Site accessible at https://coconiczy.co.uk
   - [ ] Test card payment works (4242...)
   - [ ] Confirmation email arrives
   - [ ] coconiczy logs in, sees order in admin
   - [ ] coconiczy can mark order ready, customer gets email

3. **Comms:**
   - [ ] Email coconiczy with: URL, login credentials, quick reference guide, support contact
   - [ ] coconiczy announces to customers/social media
   - [ ] Site is LIVE!

### Phase 6: Post-Launch (First 24–48 Hours)

- [ ] Monitor every 2 hours: site up, orders flowing, emails sending
- [ ] Check Stripe dashboard: payments processing
- [ ] Be available for coconiczy questions
- [ ] First real customer order: walk through entire flow
- [ ] Week 1: daily monitoring, user feedback

---

## Critical Files & Locations

All in `/home/user/hostinger-V1/Engine/Client Builds/`:

- `coconiczy-integration-and-go-live.md` — **MAIN GUIDE (you are here)**
- `coconiczy-integration-diagrams.md` — Visual architecture + data flows
- `coconiczy-agent-deployment.md` — Agent assignments & specs
- `coconiczy-cookout-ordering.md` — Original business requirements

---

## Contact & Support

**coconiczy's Contact:**
- Name: Ola (owner)
- Email: [her email]
- Phone: [her phone]
- Availability: [her hours]

**Your (Deployment Lead) Contact:**
- Email: [your email]
- Phone: [your phone for emergencies]
- Hours: [your availability]

**Escalation:**
- Payment processing fails → Check Stripe dashboard, webhook logs
- Email not sending → Check MailPoet/SendGrid logs, spam folder
- Site down → Check Hostinger status, WordPress error log
- Order issue → Check admin dashboard, order notes

---

## Checklist: Ready to Deploy?

Before launching agents, confirm:

- [ ] **VPS Access:** Hostinger VPS running, PHP 8.1+, MySQL ready
- [ ] **WordPress:** Fresh install or existing instance identified
- [ ] **Database:** MySQL database created (coconiczy_prod or similar)
- [ ] **Stripe:** coconiczy has started account setup (test keys will be provided by agents, live keys later)
- [ ] **Domain:** Decision made (custom domain or Hostinger subdomain)
- [ ] **Team:** Agents 1–4 ready, clear on their roles
- [ ] **Timeline:** All stakeholders aware of 5–8 hour estimate, 1–2 day timeline
- [ ] **Handoff:** coconiczy available for 1-hour training on go-live day

**Status:** ✓ READY

---

## Key Success Metrics

After go-live, coconiczy can measure success by:

1. **Technical:** Site uptime > 99%, payment processing 100% success rate
2. **Customer:** Confirmation emails 100% delivery rate, < 2% bounce rate
3. **Revenue:** 20–50 orders/week, ~£600–1500/week in orders (typical for local food business)
4. **Support:** < 2 hour response time, < 1 customer complaint per week

---

## Next Steps

1. **Now:** Read main document (`coconiczy-integration-and-go-live.md`) thoroughly
2. **Next:** Collect deliverables from Agents 1–4 as they complete
3. **Then:** Execute Phase 3 (Integration) step-by-step
4. **Finally:** Run Phase 4 (Smoke Tests) — all 8 must PASS
5. **Go-Live:** Phase 5 (Activate Stripe live keys, customer announcements)

---

**Questions?** Refer to the detailed main document or the integration diagrams for specific technical details.

**Ready to start?** Let's go! 🚀

---

**Document version:** 1.0  
**Last updated:** 2026-06-29  
**For:** coconiczy Ordering System Deployment  
**Owner:** Deployment Lead
