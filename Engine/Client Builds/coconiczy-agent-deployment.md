---
name: coconiczy-agent-deployment
type: execution-plan
status: ready-to-deploy
created: 2026-06-29
---

# coconiczy Ordering System — 5-Agent Deployment Plan

> Goal: Build a menu + collection-only ordering system + Stripe integration for coconiczy's Cookout.
> Deploy 5 agents in parallel to execute this.
> Stack: WordPress + WooCommerce + Orderable (or custom Next.js), collection-only, Stripe, review automation.
> Status: DEPLOYING NOW

## Agent assignments (deploy in parallel)

| Agent | Task | Input | Output |
|-------|------|-------|--------|
| **Menu Architect** | Build menu structure from Deliveroo or template: items, prices, modifiers, photos, categories | Menu template spec (below) | Menu JSON/schema ready for WooCommerce import |
| **Collection Flow Engineer** | Design order flow: cart → collection address + time slot → Stripe payment → confirmation. Remove delivery. | Order flow spec (below) | Complete collection-only order flow + database schema |
| **Stripe Integration Specialist** | Wire Stripe for direct payment: setup webhook, handle confirmations, error states, refund flow | Stripe API spec (below) | Stripe integration + webhook handlers + test payloads |
| **Automation Builder** | Auto-email/SMS on order: confirmation, status updates, review request with Google link | Automation spec (below) | Email/SMS templates + trigger logic + review capture |
| **Deployment Lead** | Wire all 4 components together, deploy to VPS, set up domains, smoke test, go-live checklist | Integration spec (below) | Live site on Hostinger VPS, domain pointed, ready |

---

## Agent 1: Menu Architect

**Input:**
```
Build coconiczy's menu structure. Source: Deliveroo page (scrape or manual copy).
Items needed:
- Food category (BBQ, sides, drinks, etc.)
- Item name, description, price
- Modifiers (size, extras, sauce, etc.)
- Photos (use placeholders if not available, URLs must be public)
- Availability flags (sold out, seasonal)

Output format: JSON array of products + categories for WooCommerce import.
```

**Acceptance criteria:**
- [ ] Menu has 20+ items across 4+ categories
- [ ] Each item has name, price, description, modifiers
- [ ] JSON is valid and imports cleanly to WooCommerce
- [ ] Photos are optimised for web (< 500KB each)

---

## Agent 2: Collection Flow Engineer

**Input:**
```
Design order flow for collection-only (no delivery).

Spec:
1. Cart page: show items, quantities, modifiers
2. Checkout page:
   - Customer name + phone (required)
   - Collection location (1 fixed address, coconiczy's)
   - Pickup time slot (dropdown: today 6pm-9pm, tomorrow 12pm-3pm, etc. — 30min slots)
   - Order notes (optional)
3. Payment gateway: Stripe
4. Order confirmation: order #, time, location, total
5. Order status page (customer can check: "preparing", "ready", "collected")

Remove: shipping address, delivery options, geolocation.
Database: order table with customer info, items, time slot, payment status.
```

**Acceptance criteria:**
- [ ] Cart logic handles modifiers + quantities correctly
- [ ] Checkout flow is 3 steps max, mobile-friendly
- [ ] Time slot logic prevents booking past closing time
- [ ] Order confirmation shows pickup time clearly
- [ ] Order status page updates live (via webhook from payment)

---

## Agent 3: Stripe Integration Specialist

**Input:**
```
Integrate Stripe for direct payment.

Spec:
1. Stripe account: Business details + bank account (coconiczy will set up separately)
2. Payment flow:
   - Customer enters card on checkout
   - Stripe creates payment intent
   - Webhook fires on payment.succeeded
   - Order marked as "paid" + "preparing"
3. Error handling:
   - Declined card → show error, allow retry
   - Timeout → queue order for manual review
4. Refund flow: customer service can issue refunds via Stripe dashboard
5. Test mode: use Stripe test keys first, flip to live when ready

Webhook endpoint: POST /api/webhooks/stripe
Webhook signature validation required (security).
```

**Acceptance criteria:**
- [ ] Test payment (4242...) succeeds
- [ ] Declined payment (4000...) shows error gracefully
- [ ] Webhook fires + updates order status
- [ ] Signature validation passes security audit
- [ ] Refund flow tested (test refund, verify order status updates)

---

## Agent 4: Automation Builder

**Input:**
```
Automate email/SMS + review requests.

Spec:
1. Order confirmation email (immediately after payment):
   - Order number, items, total
   - Pickup time + location
   - Link to order status page
2. Status update emails (when coconiczy marks order as "preparing" + "ready"):
   - "Your order is being prepared"
   - "Your order is ready for pickup"
3. Review request (1 hour after collection time passes):
   - Google review link (pre-formatted)
   - "How was your order? Leave a review"
   - Link to on-site review form (optional)
4. SMS: send confirmation + ready alerts (if customer opts in)

Platform: SendGrid (email) + Twilio (SMS) or WordPress plugin (MailPoet).
Triggers: Stripe webhook → order confirmation, order status update → status emails, time elapsed → review request.
```

**Acceptance criteria:**
- [ ] Order confirmation email sends < 1min after payment
- [ ] Status update emails send when order status changes
- [ ] Review request sends 1hr after collection time
- [ ] All emails have reply-to address (coconiczy@...)
- [ ] Unsubscribe link present on every email
- [ ] SMS opt-in respected (only send if customer agreed)

---

## Agent 5: Deployment Lead

**Input:**
```
Wire all 4 components, deploy, go-live.

Spec:
1. Code integration:
   - Menu JSON → WooCommerce product import
   - Collection flow → custom checkout plugin or custom code
   - Stripe → Stripe for WooCommerce plugin (or custom)
   - Automation → webhooks + email service
2. Infrastructure:
   - Deploy to Hostinger VPS (WordPress multisite or fresh instance)
   - Domain: coconiczy.co.uk or coco-restaurant.co.uk (or Hostinger subdomain)
   - SSL: auto (Hostinger LetsEncrypt)
3. Smoke test:
   - Create test order, pay with test card
   - Check confirmation email arrives
   - Mark order ready, check status email arrives
   - Verify webhook fires and order status updates
4. Go-live checklist:
   - [ ] All 4 agents' code is integrated + tested
   - [ ] Stripe live keys added (coconiczy provides)
   - [ ] Domain is live + SSL verified
   - [ ] Email sending verified (test + real)
   - [ ] Payment processing tested (test mode first)
   - [ ] Backup + monitoring configured
   - [ ] coconiczy trained on order dashboard
5. Hand-off:
   - Coconiczy can log in, add items, manage orders
   - Documentation: how to mark orders ready, how to issue refunds, how to check customer emails
```

**Acceptance criteria:**
- [ ] Test order (end-to-end) succeeds
- [ ] Live domain is up + SSL is green
- [ ] Stripe is live (or toggled to live when coconiczy is ready)
- [ ] Email service confirmed working
- [ ] coconiczy has dashboard access + documentation
- [ ] Monitoring (uptime, error logs) is configured

---

## Supporting specs (for agents to reference)

### Menu template (Agent 1 input example)

```json
{
  "categories": [
    {
      "id": "bbq-mains",
      "name": "BBQ Mains",
      "items": [
        {
          "id": "pulled-pork",
          "name": "Pulled Pork",
          "description": "Slow-smoked 8 hours, tender & smoky",
          "price": 12.99,
          "modifiers": [
            {
              "name": "Size",
              "options": ["Regular", "Large"]
            },
            {
              "name": "Sauce",
              "options": ["Chipotle", "Honey BBQ", "Carolina Gold"]
            }
          ],
          "photo": "https://cdn.example.com/pulled-pork.jpg"
        }
      ]
    }
  ]
}
```

### Order flow state machine (Agent 2 input example)

```
States: pending → preparing → ready → collected
pending → paid (Stripe webhook)
pending → failed (payment declined, auto-cancel after 30min)
preparing → ready (coconiczy marks via dashboard)
ready → collected (customer picks up)
Any → refunded (customer service issues refund, refund webhook updates)
```

### Stripe webhook payload (Agent 3 input example)

```json
{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_1234...",
      "amount": 3299,
      "currency": "gbp",
      "metadata": {
        "order_id": "coconiczy_1234"
      }
    }
  }
}
```

### Email template example (Agent 4 input example)

```
Subject: Your coconiczy Cookout order is confirmed

Hi [Customer Name],

Your order #12345 is confirmed and being prepared.

Order details:
- Pulled Pork (Large, Chipotle sauce) x2
- Loaded Fries x1
- Total: £32.99

Pickup: Today at 6:30 PM
Location: coconiczy Cookout, 123 High Street, London N1 1XX

Track your order: [link to status page]

See you soon!
coconiczy team
```

---

## Deployment timeline

- **Hour 1-2:** Agents work in parallel (async)
- **Hour 2-3:** Deployment Lead integrates + smoke tests
- **Hour 3-4:** Go-live + hand-off documentation
- **Total:** ~4 hours to live ordering system

---

## Notes

- If coconiczy's existing website is found during this work, integrate the ordering system into it. If not, spin up a fresh WordPress instance on Hostinger and use that.
- Menu photos can be placeholders initially; coconiczy can upload real photos after launch.
- Stripe setup requires coconiczy's business details + bank account; can use test mode until ready.
- All agents should document their code, configs, and decision rationale for handoff.

Related: [[coconiczy-cookout-ordering]] · [[revenue-drive-website-build]]
