# coconiczy Automation — Quick Reference Card

**For:** WooCommerce setup team / developers  
**Project:** coconiczy Cookout direct ordering  
**Date:** June 29, 2026

---

## Message Schedule at a Glance

```
Customer places order
    ↓
[T+0 min] → Email #1 (Confirmation) + SMS #1
[T+2–5 min] → Email #2 (Preparing) + SMS #3
[T+15–30 min] → Email #3 (Ready) + SMS #4
[T+Pickup-1hr] → SMS #2 (One-Hour Reminder)
[T+Pickup+30min] → Email #4 (Review Request)
```

---

## WooCommerce Status Flow

```
pending (unpaid) → confirmed (paid)
  └─ Trigger: Email #1 + SMS #1
  
confirmed (awaiting kitchen) → preparing (kitchen working)
  └─ Trigger: Email #2 + SMS #3
  
preparing (still cooking) → ready (waiting for customer)
  └─ Trigger: Email #3 + SMS #4
  
ready (customer here) → completed (customer left)
  └─ Trigger: Schedule Email #4 for +30 minutes
```

---

## Required Setup

### Email Provider (Choose One)
- **Option A (Recommended):** SendGrid
  - Sign up at sendgrid.com
  - Verify domain DNS records (SPF/DKIM)
  - Install: WooCommerce SendGrid plugin
  - Cost: £0.0005 per email, first 100/day free

- **Option B (Simpler):** MailPoet
  - Install MailPoet plugin from WordPress repo
  - No external account needed
  - Cost: £120/year for unlimited subscribers

### SMS Provider
- **Twilio** (both options above use Twilio for SMS)
  - Sign up at twilio.com
  - Claim UK phone number (e.g., +44 XXXX XXXXXX)
  - Install: WooCommerce Twilio plugin
  - Cost: £0.04–0.08 per SMS (UK)

### Customer Data Fields (Add to WooCommerce)
```
- billing_phone (at checkout, optional)
- email_preferences (dropdown: all, transactional_only, none)
- sms_enabled (checkbox: yes/no)
```

### Email Templates
- Copy 5 HTML templates from coconiczy-automation.md Section 2
- Merge fields: {{order_number}}, {{customer_first_name}}, {{pickup_time}}, etc.
- Test on mobile (iPhone 12, Samsung S20 minimum)

### SMS Templates
- Copy 5 SMS templates from coconiczy-automation.md Section 3
- All under 160 characters
- Include "Reply STOP to opt out" in every SMS

---

## Trigger Configuration Checklist

### Automation Platform
- **Best option:** WooCommerce Actions Scheduler (built-in)
- **Alternative:** Zapier (if WooCommerce plugins don't support all triggers)

### Specific Triggers to Wire

#### Trigger 1: Order Confirmed (Status: pending → confirmed)
```
Event: WooCommerce order status changes to "confirmed"
Actions:
  1. Send Email #1 via SendGrid/MailPoet
  2. Send SMS #1 via Twilio (if customer_phone provided)
Merge fields: {{order_number}}, {{customer_first_name}}, {{pickup_time}}, {{total_amount}}
```

#### Trigger 2: Kitchen Starts (Status: confirmed → preparing)
```
Event: WooCommerce order status changes to "preparing"
Actions:
  1. Send Email #2 via SendGrid/MailPoet
  2. Send SMS #3 via Twilio (if SMS enabled)
Merge fields: {{order_number}}, {{prep_time_remaining}}, {{started_time}}
```

#### Trigger 3: Order Ready (Status: preparing → ready)
```
Event: WooCommerce order status changes to "ready"
Actions:
  1. Send Email #3 via SendGrid/MailPoet
  2. Send SMS #4 via Twilio (if SMS enabled)
Merge fields: {{order_number}}, {{pickup_address}}, {{ready_time}}
```

#### Trigger 4: Review Request (Time-based, 30 min after completed)
```
Event: WooCommerce order status = "completed" AND order_age >= 30 minutes
Actions:
  1. Send Email #4 via SendGrid/MailPoet
Merge fields: {{customer_first_name}}, {{google_review_link}}, {{order_number}}
How to implement:
  - Option A: WooCommerce Actions Scheduler (schedule Email #4 when status → completed)
  - Option B: Zapier (delay 30 mins, then send)
```

#### Trigger 5: One-Hour Reminder (Scheduled, not status-based)
```
Event: Cron job runs every 60 minutes
Query: All orders where pickup_time = NOW + 60 minutes AND status in ["preparing", "ready"]
Actions:
  1. Send SMS #2 to each matching order (if SMS enabled)
How to implement:
  - Option A: WordPress cron (built-in, add custom function)
  - Option B: External cron service (e.g., EasyCron) + Zapier
  - Option C: WooCommerce Actions Scheduler (can do scheduled queries)
```

---

## Merge Fields Mapping

| Merge Field | Source | Example |
|---|---|---|
| {{order_number}} | order.order_id | #12345 |
| {{customer_first_name}} | order.customer_first_name | John |
| {{customer_email}} | order.customer_email | john@example.com |
| {{customer_phone}} | order.customer_phone | +447700900123 |
| {{pickup_time}} | order.meta['pickup_time'] | 6:00 PM |
| {{pickup_date}} | order.meta['pickup_date'] | Wednesday, June 29 |
| {{pickup_address}} | WooCommerce settings | coconiczy, 123 Food St |
| {{total_amount}} | order.total | £42.50 |
| {{items}} | order.items[] (loop) | Jollof Rice x2, Coleslaw x1 |
| {{prep_time}} | order.meta['prep_time_mins'] | 20 |
| {{ready_time}} | order.meta['ready_time'] | 5:58 PM |
| {{started_time}} | order.meta['started_time'] | 5:38 PM |
| {{google_review_link}} | hardcoded link | https://g.co/kgs/coconiczy |
| {{local_site_review_link}} | WooCommerce settings | https://coconiczy.com/reviews |

---

## Testing Checklist (Before Launch)

- [ ] Create 10 test orders (all statuses: pending, confirmed, preparing, ready, completed)
- [ ] Email #1: Arrives within 30 seconds? Check SendGrid dashboard for delivery status
- [ ] SMS #1: Arrives within 60 seconds? Check Twilio console for delivery logs
- [ ] Change status to "preparing" manually → Email #2 + SMS #3 send within 1 minute?
- [ ] Change status to "ready" manually → Email #3 + SMS #4 send within 1 minute?
- [ ] Wait 30 minutes for test "ready" order → Email #4 sends automatically?
- [ ] Click unsubscribe link in email footer → Are you removed from review email list?
- [ ] SMS opt-out: Reply "STOP" to SMS → Do you receive STOP confirmation? (Twilio sends auto-reply)
- [ ] Send 2nd SMS to same number → Does it fail/bounce (confirming STOP worked)?
- [ ] Check SendGrid dashboard:
  - [ ] Open rate: 25–35% (healthy)
  - [ ] Click rate: 5–10% (healthy)
  - [ ] Bounce rate: <1% (healthy)
  - [ ] Spam complaint rate: 0% (ideal)
- [ ] Mobile rendering: Open emails on iPhone + Android, text readable without zoom?
- [ ] Reply-to field: Does orders@coconiczy.com receive emails when you click "Reply"?

---

## Common Implementation Gotchas

| Problem | Solution |
|---|---|
| **Email #2 sends but Email #1 didn't** | Check: Did order.status actually change to "confirmed"? Is email valid in database? Run manual SendGrid test. |
| **SMS #1 arrives but phone number shows as "None"** | Check: Is customer_phone field collected at checkout? Is it stored correctly in WooCommerce order meta? |
| **Email #4 (review) never sends** | Check: Is Actions Scheduler enabled (not disabled)? Is order.status actually "completed"? Is 30-min delay configured correctly? |
| **Merge field shows {{variable}} instead of actual value** | Check: Merge field name spelled correctly? Is the field available in WooCommerce order object? Not all fields available to all templates. |
| **SMS says "Reply STOP to opt out" but STOP doesn't work** | Not your fault—Twilio handles STOP server-side. Make sure Twilio account is active and webhook enabled. |
| **Customers getting email but not SMS** | Likely: phone number not provided at checkout. Check order.customer_phone is blank. This is normal. |

---

## WooCommerce Plugin Recommendations

### For SendGrid Email Integration
- **Official SendGrid for WordPress Plugin** (free, official)
  - Download: wordpress.org/plugins/sendgrid-email-delivery-service/
  - Setup: 10 mins (API key + domain verification)
  - Supports: Custom templates, merge fields, transactional email

### For Twilio SMS Integration
- **Twilio SMS for WooCommerce** (free, community-maintained)
  - Or: Use Zapier (easier, no plugin needed)
  - Setup: 20 mins (Twilio API key + phone number)
  - Supports: Order triggers, custom templates

### For Scheduled Tasks
- **WooCommerce Actions Scheduler** (built-in to WooCommerce)
  - No plugin needed
  - Use for: 30-min delayed email, 1-hour reminder SMS
  - Edit: wp-content/plugins/woocommerce/includes/queue/class-actions.php (or use wp-cli)

### Backup: Zapier
- **Zapier** (paid, £19–50/month)
- Use if native plugins don't support your triggers
- Setup: 30 mins (no coding)
- Supports: Anything to anything (WooCommerce → SendGrid + Twilio)

---

## Database Schema (Custom Fields Needed)

Add these to WooCommerce order meta during checkout:

```sql
-- In order meta (or use ACF / WooCommerce custom fields):
order_meta {
  "customer_phone": "+447700900123",  -- User provides at checkout
  "email_preferences": "all",          -- "all", "transactional_only", "none"
  "sms_enabled": true,                 -- Checkbox
  "pickup_time": "2026-06-30 18:00",  -- From order scheduling
  "prep_time_mins": 20,                -- Fixed or estimated
  "started_time": "2026-06-30 17:50",  -- Staff marks when starting
  "ready_time": "2026-06-30 18:10",    -- Staff marks when ready
  "collected_time": null,              -- Staff marks when customer leaves
  "review_email_sent": false,          -- Track if review email sent (prevent duplicates)
}
```

---

## API Keys Needed

Gather these before setup week:

1. **SendGrid API Key**
   - Get from: sendgrid.com → Settings → API Keys
   - Permissions: Full Access (or Mail Send + Template Read)
   - Store in: .env file or WooCommerce plugin settings

2. **Twilio Account SID + Auth Token**
   - Get from: twilio.com → Account Info
   - Also get: Phone number (e.g., +44 XXXX XXXXXX)
   - Store in: .env file or WooCommerce plugin settings

3. **Domain Setup (for SendGrid)**
   - Add SPF record: `v=spf1 sendgrid.net ~all`
   - Add DKIM record: (SendGrid generates, you copy to DNS)
   - Verify: Takes 1–2 hours for DNS propagation

---

## Handover Checklist

Once everything is live, Ola (coconiczy owner) should know:

- [ ] How to change order status (confirmed → preparing → ready → completed)
- [ ] Where to monitor email delivery (SendGrid dashboard)
- [ ] Where to see SMS delivery logs (Twilio console)
- [ ] How to check customer preferences (email_tier, sms_enabled)
- [ ] How to resend a failed email manually
- [ ] How to manually send review email if needed
- [ ] Phone number to call if SendGrid/Twilio goes down (support numbers)
- [ ] Weekly metrics to monitor (open rate, bounce rate, review rate)

---

## Cost Summary

| Service | Monthly Cost | Notes |
|---|---|---|
| SendGrid | ~£0.25–2 | £0.0005/email, free tier 100/day |
| Twilio | ~£8–12 | £0.04–0.08/SMS, first 40 SMS free |
| MailPoet (if chosen instead) | £10/month | Instead of SendGrid, includes automation |
| WooCommerce plugins | Free | Native, no additional cost |
| Zapier (if needed) | £19–50 | Only if native plugins insufficient |
| **Total (Month 1, 30 orders/week)** | **~£10–15** | Scales with volume |

---

## Emergency Contacts

- **SendGrid Support:** support@sendgrid.com (24/7)
- **Twilio Support:** support.twilio.com (live chat, 24/7)
- **WooCommerce Community:** woocommerce.com/support/ (forum)
- **coconiczy Owner:** orders@coconiczy.com

---

## Files Included

1. **coconiczy-automation.md** (1,005 lines)
   - Full HTML email templates (5 × email)
   - SMS templates (5 × SMS)
   - Trigger logic (detailed pseudocode)
   - Unsubscribe/compliance procedures
   - Implementation checklist
   - Service recommendations

2. **coconiczy-automation-summary.md** (319 lines)
   - Executive summary
   - Business case
   - Timeline
   - Common Q&A
   - Success metrics

3. **coconiczy-automation-quick-ref.md** (this file)
   - Quick reference for developers
   - Trigger checklist
   - Merge fields
   - Testing procedures
   - Gotchas + solutions

---

## Ready? Start Here

**Week 1 Start:**
1. Pick email provider (SendGrid or MailPoet)
2. Create SendGrid account + get API key
3. Create Twilio account + claim UK phone number
4. Install plugins (SendGrid plugin, Twilio plugin or Zapier)
5. Copy email/SMS templates into SendGrid/MailPoet dashboard

**Week 2 Start:**
1. Create WooCommerce custom fields (phone, email_prefs, sms_enabled)
2. Wire triggers (status changes → send emails/SMS)
3. Test with 5 dummy orders

**Week 3 Start:**
1. Full test (10 orders, all statuses)
2. Debug any issues

**Week 4 Start:**
1. Go live with real customers
2. Monitor dashboards (open rate, delivery)

---

*For Ola (coconiczy) & Implementation Team*  
*June 29, 2026*
