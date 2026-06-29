# coconiczy Ordering System — Integration Plan & Go-Live Checklist

**Deployment Lead Role Documentation**  
**Status:** READY TO DEPLOY  
**Created:** 2026-06-29  
**Target:** Live collection-only ordering + Stripe payment on Hostinger VPS  

---

## Executive Summary

This document provides the **Deployment Lead** with the complete integration blueprint for bringing together the 4 parallel work streams (Menu, Order Flow, Stripe, Automation) into a live, tested ordering system. It covers infrastructure setup, smoke testing, and hand-off ops.

**Timeline:** 4–5 hours total  
**Go-live date:** Once all 4 agents deliver + integration complete  

---

## Part 1: System Architecture & Integration Points

### 1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     coconiczy Ordering System                   │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │   Front-End      │
                    │  (Customer UX)   │
                    └────────┬─────────┘
                             │
        ┌────────────┬────────┼────────┬──────────────┐
        │            │        │        │              │
        ▼            ▼        ▼        ▼              ▼
    ┌────────┐  ┌────────┐ ┌──────┐ ┌────────┐  ┌──────────┐
    │ Menu   │  │ Cart & │ │Order │ │Stripe  │  │ Customer │
    │ Browse │  │Checkout│ │Status│ │Payment │  │ Account  │
    └────┬───┘  └────┬───┘ └──┬───┘ └──┬─────┘  └──────────┘
         │            │       │        │
         └────────────┼───────┼────────┘
                      │       │
              ┌───────┴───────┴──────────┐
              │                          │
              ▼                          ▼
        ┌──────────────┐          ┌──────────────┐
        │   WordPress  │          │   Stripe     │
        │ + WooCommerce│◄────────►│   API        │
        │  + Orderable │          │ + Webhooks   │
        │  (Backend)   │          └──────────────┘
        └──────┬───────┘
               │
        ┌──────┴──────────────┐
        │                     │
        ▼                     ▼
    ┌─────────┐          ┌──────────────┐
    │ MySQL   │          │ Email Service│
    │ Order   │          │ (SendGrid/WP)│
    │ Tables  │          │ + SMS (opt)  │
    └─────────┘          └──────────────┘
               │
        ┌──────┴──────────────────────┐
        │                             │
        ▼                             ▼
    ┌─────────────────────┐   ┌──────────────────┐
    │ Admin Dashboard     │   │ Automation Hooks │
    │ (Mark Ready/Refund) │   │ (Email Triggers) │
    └─────────────────────┘   └──────────────────┘
```

### 1.2 Component Integration Points (Critical)

| Component | Source | How It Plugs In | Dependencies |
|-----------|--------|-----------------|--------------|
| **Menu JSON** | Agent 1 (Menu Architect) | WooCommerce product import (CSV or REST API) | WordPress + WooCommerce installed |
| **Order Flow** | Agent 2 (Collection Flow Engineer) | Custom checkout page or Orderable plugin config | Menu items imported; Stripe keys ready |
| **Stripe Integration** | Agent 3 (Stripe Specialist) | Webhook endpoint (`/api/webhooks/stripe`) + payment processing | Stripe test account created; webhook URL reachable |
| **Automation** | Agent 4 (Automation Builder) | Email/SMS triggers fired by order status changes | Email service configured; order status updates firing |
| **Deployment** | Agent 5 (This Guide) | Wire all 4 above; deploy to VPS; test end-to-end | All 4 agents delivered code/config |

### 1.3 Data Flow: Order Lifecycle

```
CUSTOMER JOURNEY:

1. BROWSE MENU
   Menu JSON (Agent 1) ──via WooCommerce────> Customer sees items, prices, modifiers
                                              ↓
2. ADD TO CART & CHECKOUT
   Order Flow (Agent 2) ──WooCommerce Checkout───> Customer enters:
                                                   - Name + phone
                                                   - Collection time slot
                                                   - Special requests
                                              ↓
3. PAYMENT
   Stripe Integration (Agent 3) ──Payment Intent──> Customer enters card
                                                    ↓
                                 Stripe processes ──> success/decline
                                                    ↓
4. ORDER CONFIRMATION
   Stripe Webhook ───fired on payment.succeeded──> Order status = "paid"
                                                    ↓
   Automation (Agent 4) ──sends email────────────> Customer gets confirmation
                                                    ↓
5. COCONICZY BACKEND
   Admin Dashboard ──coconiczy marks "ready"──────> Order status = "ready"
                                                    ↓
   Automation (Agent 4) ──sends email────────────> Customer notified
                                                    ↓
6. CUSTOMER PICKUP
   Customer picks up at collection time
                                                    ↓
   (After 1hr past pickup time)
   
   Automation (Agent 4) ──sends review request──> Google review link + on-site form
```

### 1.4 Integration Checklist: Code & Config Handoff

These are the **artifacts each agent must deliver** to the Deployment Lead:

#### Agent 1: Menu Architect
- **Deliverable:** `menu.json` (or CSV for WooCommerce import)
- **Format:** 
  ```json
  {
    "categories": [...],
    "items": [
      {
        "sku": "pulled-pork-001",
        "name": "Pulled Pork",
        "price": 12.99,
        "description": "...",
        "modifiers": [...],
        "photo_url": "https://..."
      }
    ]
  }
  ```
- **Integration step:** Import via WooCommerce REST API or CSV upload
- **Test:** Verify all items visible in customer frontend; prices correct; modifiers appear

#### Agent 2: Collection Flow Engineer
- **Deliverable:** Complete checkout flow code/config
  - If using **Orderable plugin:** exported config file + custom CSS overrides
  - If using **custom Next.js:** `/pages/checkout.js` + `/pages/order-status.js` + API routes
- **Must include:**
  - Time slot picker (30-min intervals, respects opening hours)
  - Collection address (hardcoded to coconiczy's location)
  - Customer name/phone fields (required)
  - Order notes field (optional)
  - Clear pickup time in confirmation
- **Integration step:** Deploy checkout code; test with test menu items
- **Test:** Complete test checkout, verify order created with correct fields

#### Agent 3: Stripe Integration Specialist
- **Deliverable:** Stripe webhook handler + payment intent creation code
  - Endpoint: `POST /api/webhooks/stripe` (or `/wp-json/coconiczy/v1/stripe-webhook`)
  - Handler file(s): webhook signature validation + order status updates
  - Payment creation code: triggered from checkout
- **Must include:**
  - Webhook signature validation (security-critical)
  - Error handling for declined/timeout payments
  - Metadata: order ID + customer email in payment intent
  - Test mode toggle (use test keys initially)
- **Integration step:** 
  - Wire payment button to Stripe SDK
  - Register webhook endpoint with Stripe
  - Test with Stripe test cards
- **Test:** Test card → payment succeeds → webhook fires → order marked "paid"

#### Agent 4: Automation Builder
- **Deliverable:** Email/SMS templates + trigger code
  - Email service: SendGrid API config OR WordPress MailPoet plugin
  - SMS: Twilio API (optional, if customer opts in)
  - Triggers: webhook-based (Agent 3) + cron (for delayed review request)
- **Templates:**
  - Order confirmation (sent immediately after payment)
  - Preparing notification (when coconiczy marks order "preparing")
  - Ready notification (when coconiczy marks order "ready")
  - Review request (1 hour after pickup time)
- **Must include:**
  - Reply-to address (coconiczy@...)
  - Unsubscribe link (every email, GDPR-required)
  - SMS opt-in logic (never send SMS without consent)
- **Integration step:** 
  - Wire order status changes to email service
  - Set up cron job for delayed review request
  - Test with real email (send to test account)
- **Test:** Create test order → confirm email arrives < 1 min

---

## Part 2: Hostinger VPS Deployment

### 2.1 Infrastructure Prerequisites

**Assumption:** coconiczy's Hostinger VPS already exists (shared with Klaudius/other projects) or a fresh one is provisioned.

#### 2.1.1 VPS Specs (Recommended)
- **OS:** Ubuntu 20.04 LTS or later
- **PHP:** 8.1+ (WooCommerce requirement)
- **MySQL:** 5.7+ or MariaDB 10.3+
- **Web Server:** Apache 2.4 + mod_rewrite enabled
- **SSL:** Auto-renew via Let's Encrypt (built into Hostinger)
- **Storage:** 20GB+ for WordPress + media
- **Bandwidth:** Sufficient for ~100 orders/day (not an issue)

#### 2.1.2 WordPress Installation Checklist

- [ ] **Fresh WordPress install** OR **integrate into existing WordPress**
  - Option A: Use Hostinger's one-click WordPress installer
  - Option B: Manual install (download latest WP core, run wp-config.php setup)
- [ ] **Database created** (MySQL database for this site)
  - Naming convention: `coconiczy_prod` or `coconiczy_orders`
  - Create dedicated DB user (not root)
  - Grant all privileges on coconiczy_* tables only
- [ ] **Admin user created** (for coconiczy to manage orders)
  - Username: `coconiczy_admin` or similar
  - Email: `coconiczy@... (her real email)
  - Password: Strong, stored securely (e.g., 1Password)
- [ ] **Plugins installed & activated:**
  - [ ] WooCommerce (core e-commerce plugin)
  - [ ] Orderable OR custom checkout plugin
  - [ ] Stripe for WooCommerce (or Stripe Payments by Stripe)
  - [ ] MailPoet (email automation) OR SendGrid integration
  - [ ] (Optional) Jetpack for backup + monitoring
- [ ] **Permalinks configured** to `/%postname%/` (required for clean URLs)
- [ ] **wp-config.php security:**
  - [ ] `WP_DEBUG` set to `false` in production
  - [ ] Salts + keys unique (regenerate at WordPress.org/security)
  - [ ] Database prefix changed from `wp_` to something random

#### 2.1.3 Domain Setup

**Two options:**

**Option A: Hostinger subdomain (faster, no registration delay)**
- URL: `coconiczy.hostinger-domain.com` or similar
- SSL: Automatically via Hostinger
- Time to live: < 5 minutes
- Downside: Not branded for coconiczy; harder to market

**Option B: Custom domain (recommended for professionalism)**
- Domain options:
  - `coconiczy.co.uk` (exact brand match)
  - `coco-cookout.co.uk` (shorter)
  - `order.coconiczy.co.uk` (subdomain of existing site if she has one)
- Registration: Use Hostinger registrar OR transfer existing domain
- DNS: Point to Hostinger nameservers
  - Nameservers: provided by Hostinger
  - A record: Hostinger VPS IP
  - MX records: If sending from custom domain email
- SSL: Let's Encrypt (free, auto-renew) via Hostinger
- Time to live: 24–48 hours for DNS propagation

**Domain Setup Checklist:**
- [ ] Domain registered or transferred to Hostinger
- [ ] DNS nameservers pointing to Hostinger
- [ ] A record pointing to VPS IP
- [ ] SSL certificate issued (Let's Encrypt)
- [ ] WordPress Site URL set to custom domain in `Settings > General`
- [ ] HTTPS enforced (Settings > General > Site Address = `https://...`)
- [ ] SSL test: https://www.ssllabs.com/ssltest/ (target A+ rating)

### 2.2 WordPress Configuration for coconiczy

#### 2.2.1 WooCommerce Core Setup

**Settings > WooCommerce > Settings**

- [ ] **General Tab:**
  - Store location: UK (England, London, or specific postcode)
  - Currency: GBP (£)
  - Currency position: left (£12.99)
  - Thousand separator: comma
  - Decimal: point

- [ ] **Products Tab:**
  - Enable reviews: YES (used for review requests in automation)
  - Allow reviews from logged-in: NO (allow anonymous)
  - Moderate reviews: YES (coconiczy approves before showing)

- [ ] **Checkout Tab:**
  - Checkout page: [Select collection-only flow page]
  - Order received page: [Select custom order confirmation page]
  - Enable guest checkout: YES (not requiring login)
  - Enable account creation: optional (not required)
  - Guest checkout allows account creation: optional

- [ ] **Shipping Tab:**
  - Enable shipping: **NO** (collection only, no shipping needed)

- [ ] **Payments Tab:**
  - Stripe enabled: YES
  - Stripe test mode: YES (initially)
  - Stripe test keys: [from Stripe account setup, Agent 3]
  - Stripe live keys: [added when coconiczy ready for live, **NOT NOW**)

- [ ] **Emails Tab:**
  - From address: `orders@coconiczy.co.uk` or similar
  - From name: "coconiczy Cookout"
  - Email notifications:
    - New order: Enable (coconiczy gets notified)
    - Order on-hold: Disable (no hold state)
    - Order processing: Disable (replaced by custom "Preparing" email)
    - Order completed: Disable (replaced by custom "Ready" email)
    - Order refunded: Enable (coconiczy refund notifications)

#### 2.2.1 Menu Import (Agent 1 Deliverable)

**Method A: WooCommerce CSV Import (Easiest)**

1. Agent 1 provides `menu.csv` with columns:
   ```
   ID,Name,Description,Price,Category,Images,Attributes
   1,Pulled Pork,Slow-smoked 8 hours,12.99,BBQ Mains,https://...jpg,Size|Regular:Large
   ...
   ```

2. Install **WooCommerce Product Importer** (built-in):
   - Menu > Import Products
   - Upload CSV
   - Map columns: Name → Product name, Price → Price, etc.
   - Run import

3. Verify in Admin Dashboard:
   - [ ] All items visible in Products > All Products
   - [ ] Prices correct (test a few)
   - [ ] Categories created correctly
   - [ ] Photos loaded (no broken image icons)
   - [ ] Modifiers/attributes showing in product detail

**Method B: WooCommerce REST API Import (If custom code)**

Agent 1 provides a PHP/Node script:
```php
// Pseudocode
foreach ($menu_items as $item) {
    $product = new WC_Product_Simple();
    $product->set_name($item['name']);
    $product->set_price($item['price']);
    $product->set_description($item['description']);
    $product->add_category($item['category']);
    $product->save();
}
```

Run script once during deployment.

#### 2.2.3 Order Status Workflow Setup

**Order statuses in WooCommerce (default):**
- Pending → order received, waiting for payment
- Processing → payment received, order being processed
- On-Hold → (not used, disable)
- Completed → order fulfilled
- Cancelled → order cancelled
- Refunded → order refunded
- Failed → payment failed

**For coconiczy, customize statuses:**

**Using a plugin:** Install **Custom Order Status** plugin

New statuses to add:
- `Paid` (payment received, waiting for coconiczy to start cooking)
- `Preparing` (coconiczy marking it as in-progress)
- `Ready` (ready for pickup)
- `Collected` (customer picked up)

OR use standard WooCommerce statuses with custom labels:
- Pending = "Order Received"
- Processing = "Paid" (Stripe webhook changes to this)
- On-Hold = "Preparing" (coconiczy marks manually)
- Completed = "Ready" (coconiczy marks manually)
- Cancelled = "Not Picked Up" / "Refunded"

**Flow in admin:**
1. Customer pays → Stripe webhook → Order status = "Processing" (displays as "Paid")
2. coconiczy logs in, sees order in dashboard
3. coconiczy marks "On-Hold" (displays as "Preparing")
4. coconiczy marks "Completed" (displays as "Ready")
5. Customer picks up
6. (optional) After 1 hour, order auto-marked "Collected" by cron job

#### 2.2.4 Checkout Flow Setup (Agent 2 Deliverable)

**If using Orderable plugin:**

1. Install Orderable from WordPress.org (free or paid tier)
2. Configure in Orderable settings:
   - Disable delivery completely
   - Enable collection mode
   - Collection address: coconiczy's address (hardcoded, no geo selection)
   - Time slots: set opening hours (e.g., 6pm–9pm daily)
   - Slot duration: 30 minutes
   - Lead time: 15 minutes (can't order for < 15 min from now)
3. Orderable creates custom checkout page; enable in WooCommerce > Settings > Checkout

**If using custom code (Agent 2 creates):**

1. Create custom checkout page template
   - Remove shipping address field
   - Add time slot selector (dropdown)
   - Collection address pre-filled/readonly
   - Customer name + phone (required)
   - Order notes (optional)

2. Custom Stripe payment handler on checkout button click

3. Test flow end-to-end before go-live

#### 2.2.5 Stripe Integration Setup (Agent 3 Deliverable)

**For WooCommerce + Stripe for WooCommerce plugin:**

1. Install **Stripe Payments** plugin by Stripe (official plugin)
2. Create Stripe account (coconiczy does this, shares API keys with you)
   - Go to stripe.com → Sign up (business account)
   - Provide: Business name, address, bank account details, tax ID
   - Stripe verifies (usually < 24 hours)
3. In WordPress:
   - Settings > WooCommerce > Payments
   - Add test keys (from Stripe dashboard > API keys)
   - Test mode: ON
4. Agent 3 configures webhook:
   - Stripe dashboard > Webhooks
   - Add endpoint: `https://coconiczy.co.uk/wp-json/wc-stripe/webhook`
   - Events: `payment_intent.succeeded`, `charge.refunded`
5. In WordPress: verify webhook signature validation enabled

**Test mode flow:**
- Use Stripe test cards: `4242 4242 4242 4242` (succeeds), `4000 0000 0000 0002` (declines)
- Test orders don't charge coconiczy's account
- Recommended: run 5+ test orders before go-live

#### 2.2.6 Email Automation Setup (Agent 4 Deliverable)

**Option A: MailPoet plugin (WordPress-native)**

1. Install **MailPoet** (free tier sufficient for coconiczy)
2. Configure:
   - From address: `orders@coconiczy.co.uk`
   - From name: "coconiczy Cookout"
3. Create email automations:
   - Trigger: Order status = Paid → Send "Order Confirmed" email
   - Trigger: Order status = Preparing → Send "Preparing" email
   - Trigger: Order status = Ready → Send "Ready for Pickup" email
   - Trigger: 1 hour after collection time → Send "Review Request" email
4. Email templates (provided by Agent 4):
   - Include order number, items, total, pickup time, pickup location
   - Include reply-to address
   - Include unsubscribe link

**Option B: SendGrid + custom webhook**

Agent 3 sets up webhook to call SendGrid API on order status change:

```php
// Pseudocode in webhook handler
if ($order_status == 'processing') { // 'Paid'
    sendgrid_send_email([
        'to' => $customer_email,
        'template_id' => env('SENDGRID_CONFIRM_TEMPLATE'),
        'variables' => [
            'order_number' => $order_id,
            'items' => $items,
            'total' => $total,
            'pickup_time' => $pickup_time,
        ]
    ]);
}
```

---

## Part 3: Smoke Test Scenarios

### 3.1 Pre-Go-Live Test Execution Plan

Run these tests **in order**, with Stripe in **test mode**, before switching to live keys.

#### Test 1: Menu Completeness

**Objective:** Verify all menu items loaded correctly, prices accurate, modifiers work.

**Steps:**
1. Open coconiczy site in browser
2. Navigate to menu page (or shop)
3. For each category:
   - [ ] Category name visible
   - [ ] Item count matches expected
   - [ ] Item price shown correctly (in GBP)
   - [ ] Item description readable
   - [ ] Product photo loads (no broken images)
4. Click into a few items with modifiers (e.g., pulled pork):
   - [ ] Modifiers dropdown visible (Size, Sauce, etc.)
   - [ ] All options selectable
   - [ ] Price updates correctly when modifier selected (if modifier charges extra)
5. Add item to cart:
   - [ ] Cart updates (item count visible)
   - [ ] Quantity selector works (+/- buttons)
   - [ ] Cart total recalculates

**Expected result:** All items visible, prices correct, no broken links or images.

#### Test 2: Order Flow & Collection Details

**Objective:** Verify checkout flow collects correct info, shows pickup time clearly.

**Steps:**
1. Add 2–3 items to cart (test with and without modifiers)
2. Click "Checkout" or "Proceed to Checkout"
3. **Checkout page:**
   - [ ] Cart summary visible (items, quantities, modifiers, total)
   - [ ] Customer name field present + required
   - [ ] Phone number field present + required
   - [ ] Collection address displayed (coconiczy's address, read-only)
   - [ ] Time slot selector visible (dropdown or picker)
   - [ ] Available time slots shown (should be current day + next day slots)
   - [ ] Lead time enforced (can't book for past time or < 15 min from now)
   - [ ] Order notes field present (optional)
   - [ ] All required fields marked with asterisk (*)
4. Fill in fields:
   - Name: "Test Customer"
   - Phone: "07777 123456"
   - Time slot: "Today 6:30 PM" (or earliest available)
   - Notes: "No ice in drinks"
5. Click "Place Order" or "Proceed to Payment"

**Expected result:** Checkout flow smooth, required info collected, collection address clear.

#### Test 3: Stripe Payment (Test Card)

**Objective:** Verify payment processing, webhook fires, order status updates.

**Steps:**
1. Stripe test card details form appears (or Stripe-hosted payment page)
2. Enter test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - Name: "Test Customer"
3. Click "Pay" or "Complete Payment"
4. **Expected:** Payment succeeds (redirects to confirmation page)
5. Check confirmation page:
   - [ ] Order number displayed (e.g., "#12345")
   - [ ] Items recap shown
   - [ ] Total charged shown
   - [ ] Pickup time + location prominent
   - [ ] "Thank you" message shown
   - [ ] Link to order status page present
6. Open coconiczy admin dashboard:
   - [ ] New order appears in **Orders** list
   - [ ] Order status = "Processing" (or "Paid")
   - [ ] Payment method = "Stripe"
   - [ ] Items + total correct
   - [ ] Customer name + phone captured
7. Check email:
   - [ ] Confirmation email arrives in customer inbox < 1 minute
   - [ ] Email contains: order number, items, total, pickup time, location
   - [ ] Email contains reply-to address
   - [ ] Email contains unsubscribe link

**Expected result:** Payment succeeds, order created, confirmation email sent, order visible in admin.

#### Test 4: Declined Payment (Error Handling)

**Objective:** Verify error flow when card is declined.

**Steps:**
1. Add items to cart again
2. Proceed to checkout, fill in customer details
3. Enter declined test card:
   - Card number: `4000 0000 0000 0002`
   - Expiry: Any future date
   - CVC: Any 3 digits
4. Click "Pay"
5. **Expected:** Payment declined; error message shown
6. Error message should say something like:
   - "Your card was declined. Please try another card."
   - NOT a generic "System error" or blank screen
7. Verify:
   - [ ] Cart still populated (can retry)
   - [ ] No order created in admin
   - [ ] No charge to coconiczy's account

**Expected result:** Graceful error handling, user can retry.

#### Test 5: Order Status Updates & Emails

**Objective:** Verify coconiczy can mark orders as "Preparing" and "Ready", and emails trigger.

**Steps:**
1. Use order from Test 3 (successful payment)
2. coconiczy admin logs in (WordPress admin dashboard)
3. Navigate to **Orders** > order #12345
4. Current status: "Processing" (or "Paid")
5. Change status to "On-Hold" (or custom "Preparing" status)
   - Click status dropdown
   - Select "On-Hold"
   - Click "Save"
6. Check customer email:
   - [ ] "Your order is being prepared" email arrives < 1 minute
   - [ ] Email contains order number + items
7. Change status to "Completed" (or custom "Ready" status)
   - Click status dropdown
   - Select "Completed"
   - Click "Save"
8. Check customer email:
   - [ ] "Your order is ready for pickup" email arrives < 1 minute
   - [ ] Email contains order number + pickup time + location

**Expected result:** Status changes trigger emails in real-time; emails delivered correctly.

#### Test 6: Refund Flow

**Objective:** Verify coconiczy can issue refunds from admin, customer notified.

**Steps:**
1. Use order from Test 5 (completed order)
2. coconiczy admin navigates to order
3. Scroll to **Refunds** section (or Stripe payment details)
4. Click "Refund" or "Issue Refund"
5. Enter refund amount: full order total (or partial for testing)
6. Click "Refund"
7. **Expected:** Refund processed (status changes to "Refunded")
8. Check Stripe dashboard:
   - [ ] Refund shows in payment history
   - [ ] Refund status = "Succeeded"
9. Check customer email:
   - [ ] Refund notification email arrives < 1 minute
   - [ ] Email confirms refund amount + method (back to card)
   - [ ] Estimated timeline for funds (3–5 business days typical)
10. Monitor coconiczy's Stripe account:
    - [ ] Refund deducted from next payout

**Expected result:** Refund succeeds, customer notified, refund appears in Stripe.

#### Test 7: Order Status Page (Customer-Facing)

**Objective:** Verify customer can track order status without logging in.

**Steps:**
1. From confirmation page (Test 3), click "Track Order" link
2. OR go directly to `https://coconiczy.co.uk/order-status?order_id=12345`
3. Page should show:
   - [ ] Order number
   - [ ] Items ordered
   - [ ] Current status (visual indicator, e.g., "Ready")
   - [ ] Pickup time + location
   - [ ] Last update timestamp
4. Go back to admin, change status to a different state
5. Refresh customer page:
   - [ ] Status updates without page reload (if real-time) OR on refresh
   - [ ] Customer sees latest status

**Expected result:** Customer can track order easily without account login.

#### Test 8: Mobile Responsiveness

**Objective:** Verify site works on mobile (important for customers on phones).

**Steps:**
1. Open coconiczy site on mobile phone (or browser mobile view)
2. Navigate menu (scrollable, touch-friendly)
3. Add items to cart
4. Checkout on mobile:
   - [ ] Checkout form is readable (text fields sized for mobile)
   - [ ] Dropdown menus work with touch
   - [ ] Stripe payment form renders correctly
5. Complete test payment on mobile
6. View confirmation page on mobile
7. Check email on mobile (if relevant)

**Expected result:** Mobile UX smooth, no broken layout, touch-friendly.

### 3.2 Test Execution Checklist

| Test # | Test Name | Pass | Notes | 
|--------|-----------|------|-------|
| 1 | Menu Completeness | [ ] | All items, prices, photos visible |
| 2 | Order Flow & Collection | [ ] | Checkout collects required info correctly |
| 3 | Payment Success | [ ] | Test card processed, email sent, order created |
| 4 | Payment Decline | [ ] | Error handled gracefully, no order created |
| 5 | Status Updates & Emails | [ ] | Preparing/Ready statuses trigger emails |
| 6 | Refund Flow | [ ] | Refund processed, customer notified |
| 7 | Order Status Page | [ ] | Customer can track without login |
| 8 | Mobile Responsiveness | [ ] | Mobile UX works, no broken layout |

**Sign-off:** When all 8 tests PASS, proceed to go-live.

---

## Part 4: Go-Live Checklist

### 4.1 Pre-Go-Live (While in Test Mode, Before Flipping Stripe Keys)

**Timeline: Days 0–1 (before going live)**

#### 4.1.1 Code & Configuration Review

- [ ] **Menu (Agent 1):**
  - [ ] Menu JSON provided and imported successfully
  - [ ] All items visible in WooCommerce
  - [ ] Prices match source (Deliveroo, if applicable)
  - [ ] Categories organized logically
  - [ ] Photos optimized (< 500KB each)
  - [ ] Modifiers configured (size, sauce, etc.)

- [ ] **Order Flow (Agent 2):**
  - [ ] Checkout page live and accessible
  - [ ] Time slot logic working (respects opening hours)
  - [ ] Collection address hardcoded + read-only
  - [ ] Customer name + phone required
  - [ ] Order notes optional field functional
  - [ ] Cart calculation correct (with modifiers)

- [ ] **Stripe (Agent 3):**
  - [ ] Stripe for WooCommerce plugin installed + activated
  - [ ] Test keys entered in WordPress settings
  - [ ] Webhook endpoint registered in Stripe dashboard
  - [ ] Webhook signature validation code in place
  - [ ] Payment intent creation code wired to checkout
  - [ ] Error handling for declined payments tested

- [ ] **Automation (Agent 4):**
  - [ ] Email service configured (MailPoet or SendGrid)
  - [ ] Email templates created (confirmation, preparing, ready, review request)
  - [ ] From address set to coconiczy branding
  - [ ] Unsubscribe link on all emails
  - [ ] Triggers set up (order status → email)
  - [ ] Test emails verified (sent to test account, arrived correctly)

#### 4.1.2 Infrastructure Review

- [ ] **Domain:**
  - [ ] Domain registered (custom domain or Hostinger subdomain)
  - [ ] DNS configured (A record pointing to VPS IP)
  - [ ] Domain accessible in browser
  - [ ] SSL certificate issued (Let's Encrypt)
  - [ ] HTTPS enforced (Settings > General > Site Address = `https://...`)
  - [ ] SSL test passes (https://www.ssllabs.com/ssltest/)

- [ ] **WordPress:**
  - [ ] WordPress running on Hostinger VPS
  - [ ] Admin user created for coconiczy
  - [ ] WooCommerce + required plugins installed
  - [ ] Database backed up (Hostinger auto-backup or manual via phpMyAdmin)
  - [ ] WP_DEBUG set to false in production
  - [ ] Error logging configured (wp-config.php)

- [ ] **Monitoring & Uptime:**
  - [ ] Uptime monitoring configured (Pingdom, Uptime Robot, or Hostinger monitoring)
  - [ ] Email alerts set up for downtime
  - [ ] Error logging configured (WordPress error log, Stripe event log)
  - [ ] Backup schedule confirmed (Hostinger daily backups)

- [ ] **Security:**
  - [ ] Firewall enabled (Hostinger or cloudflare)
  - [ ] WordPress login protected (limit login attempts plugin or .htaccess rule)
  - [ ] Database user privileges minimal (coconiczy_db user has only table-level access)
  - [ ] Stripe API keys not exposed in code (use environment variables / WordPress settings)
  - [ ] Webhook signature validation enabled (Agent 3)

#### 4.1.3 Smoke Test Results

- [ ] **All 8 smoke tests PASS** (see Part 3 above)
  - [ ] Test 1: Menu ✓
  - [ ] Test 2: Checkout flow ✓
  - [ ] Test 3: Payment (success) ✓
  - [ ] Test 4: Payment (decline) ✓
  - [ ] Test 5: Status updates & emails ✓
  - [ ] Test 6: Refund flow ✓
  - [ ] Test 7: Order status page ✓
  - [ ] Test 8: Mobile responsiveness ✓

#### 4.1.4 Documentation & Handoff

- [ ] **Documentation created:**
  - [ ] Admin dashboard walkthrough (coconiczy reference guide)
  - [ ] How to mark orders "Preparing" + "Ready"
  - [ ] How to issue refunds
  - [ ] How to add new menu items
  - [ ] How to check customer emails
  - [ ] How to view order history
  - [ ] Support contact info (who to call if something breaks)

- [ ] **coconiczy training:** 
  - [ ] Walkthrough of admin dashboard (screen share or in-person)
  - [ ] Practice: create test order, mark ready, review emails
  - [ ] Practice: issue refund, check customer notification
  - [ ] Practice: add new menu item
  - [ ] Q&A: answer all questions before go-live

### 4.2 Go-Live Day

**Timeline: Day 1, final steps to make site live with real payments**

#### 4.2.1 Stripe Live Keys Activation

**Prerequisites:**
- Stripe account fully verified (coconiczy's business details approved)
- All smoke tests PASSED with test keys
- coconiczy has explicitly approved going live

**Steps:**

1. coconiczy logs into Stripe dashboard (stripe.com)
2. Navigate to: Settings > API Keys
3. Reveal **Live Secret Key** + **Live Publishable Key**
4. **DO NOT SHARE LIVE SECRET KEY** via email; use secure method (1Password, in-person, encrypted message)
5. You (Deployment Lead) update WordPress settings:
   - Settings > WooCommerce > Payments
   - Switch "Test Mode" toggle to OFF
   - Replace test keys with live keys:
     - Live Publishable Key → "Publishable key" field
     - Live Secret Key → "Secret key" field
   - Click "Save"
6. Verify in WordPress:
   - [ ] Settings saved (no errors shown)
   - [ ] Test mode toggle now shows "OFF" or "Live Mode ON"
7. Stripe webhook endpoint:
   - Stripe dashboard > Webhooks
   - If separate webhook for live vs. test: create new endpoint for live mode
   - Endpoint URL: same as test (`https://coconiczy.co.uk/wp-json/...`)
   - Events: same as test
   - Verify endpoint is **live** (not test)

#### 4.2.2 Final System Check

- [ ] **Site accessibility:**
  - [ ] Open site in browser (https://coconiczy.co.uk)
  - [ ] Menu visible + prices in GBP
  - [ ] Add items to cart
  - [ ] Checkout page loads
  - [ ] No errors in console (browser Dev Tools > Console)

- [ ] **Payment gateway:**
  - [ ] Stripe live keys active (verify in WordPress settings)
  - [ ] Test payment with real test card:
    - Card: `4242 4242 4242 4242` (succeeds in live mode too)
    - Verify charge appears in Stripe Live dashboard (not test dashboard)
  - [ ] Order created in WordPress
  - [ ] Confirmation email sent
  - [ ] Refund test issued (verify in Stripe Live)

- [ ] **Email service:**
  - [ ] From address correct (`orders@coconiczy.co.uk`)
  - [ ] Emails delivering (check Gmail/Outlook spam folder if needed)
  - [ ] Reply-to address correct
  - [ ] Unsubscribe link working

- [ ] **coconiczy admin access:**
  - [ ] coconiczy logs in successfully
  - [ ] Can see live orders (from test payment above)
  - [ ] Can change order status
  - [ ] Can issue refund

#### 4.2.3 Comms & Announcements

- [ ] **Internal:**
  - [ ] Team (Ola, any support staff) notified that site is live
  - [ ] Share dashboard access info + support contact

- [ ] **External (coconiczy):**
  - [ ] Email sent to coconiczy with:
    - [ ] Site URL
    - [ ] Admin login credentials (stored securely)
    - [ ] Quick reference guide (see Part 5 below)
    - [ ] Support contact + emergency number
    - [ ] Link to full documentation
  - [ ] SMS/Slack/whatever: "Your ordering system is live!"

- [ ] **Marketing (if applicable):**
  - [ ] coconiczy ready to announce (social media, etc.)
  - [ ] Site live + accepting orders

#### 4.2.4 Post-Go-Live Monitoring (First 24–48 Hours)

- [ ] **Day 1 monitoring:**
  - [ ] Check every 2 hours: site up, orders coming through
  - [ ] Monitor Stripe dashboard: payments processing
  - [ ] Check email logs: confirmation emails sending
  - [ ] No error logs in WordPress
  - [ ] Be available for coconiczy questions/issues

- [ ] **First order:**
  - [ ] When coconiczy gets first real customer order:
    - [ ] Order appears in admin dashboard
    - [ ] Confirmation email sent to customer
    - [ ] coconiczy can mark as "Preparing" and "Ready"
    - [ ] Customer gets status update emails
    - [ ] Payment confirmed in Stripe (check live dashboard)
  - [ ] If issue: debug + fix immediately

- [ ] **Week 1 monitoring:**
  - [ ] Check site every day
  - [ ] Monitor error logs (Settings > Debug Log)
  - [ ] Track: orders, payments, refunds, emails sent
  - [ ] Ask coconiczy: any issues, questions, feedback?

---

## Part 5: Hand-Off Documentation for coconiczy

### 5.1 Admin Dashboard Quick Reference Guide

**URL:** `https://coconiczy.co.uk/wp-admin`  
**Username:** `coconiczy_admin` (or your chosen username)  
**Password:** [Stored securely in 1Password / shared via secure method]

#### Accessing Orders

1. Log in to WordPress admin
2. Left menu: **Orders** (or WooCommerce > Orders)
3. You'll see a list of all orders:
   - Order #
   - Customer name
   - Date
   - Total
   - Status (e.g., "Pending Payment", "Processing", "Completed", "Refunded")

#### Marking an Order as "Preparing"

1. Click on the order number to open order details
2. Scroll to **Order Status** section (top right or bottom left)
3. Current status shown in dropdown (e.g., "Processing")
4. Click dropdown, select **"On-Hold"** (this displays to customer as "Preparing")
5. Click **"Save Order"**
6. ✓ Customer automatically receives "Your order is being prepared" email

#### Marking an Order as "Ready for Pickup"

1. Same order details page
2. Order Status dropdown (currently "On-Hold")
3. Click dropdown, select **"Completed"** (displays as "Ready for Pickup")
4. Click **"Save Order"**
5. ✓ Customer automatically receives "Your order is ready" email

#### Issuing a Refund

1. Order details page
2. Scroll to **Refunds** section (near payment info)
3. Click **"Refund"** button
4. Enter refund amount:
   - Full refund: leave as total amount shown
   - Partial refund: enter specific amount
5. Reason for refund: add note (optional, for your records)
6. Click **"Refund"**
7. ✓ Refund processed in Stripe
8. ✓ Customer automatically receives refund notification email

**Important:** Refunds go back to customer's card (3–5 business days to appear in their account).

#### Adding a New Menu Item

1. Left menu: **Products** (or WooCommerce > Products)
2. Click **"Add New"**
3. Fill in:
   - **Product name:** (e.g., "Brisket Burnt Ends")
   - **Description:** (e.g., "Smoked brisket chunks, crispy tips")
   - **Price:** (e.g., £14.99)
   - **Product category:** (select existing, e.g., "BBQ Mains", or create new)
   - **Product image:** Upload photo (optional)
4. **Product data** section:
   - If item has modifiers (size, sauce), click **"Attributes"** and add:
     - Attribute name: "Size"
     - Options: "Regular", "Large"
   - Save attribute
5. Click **"Publish"** (or "Save Draft" to review first)
6. ✓ Item now appears on customer-facing menu

#### Checking Email Logs

1. Left menu: **Tools** (or **MailPoet** if using MailPoet plugin)
2. Find **Email Log** or **Sent Emails**
3. View recent emails sent:
   - Recipient email
   - Subject
   - Date sent
   - Status (Sent, Bounced, Opened, etc.)

#### Checking Server Errors

If something goes wrong (order doesn't appear, email doesn't send, etc.):

1. Left menu: **Tools > Site Health** (WordPress 5.2+)
2. Or check manually: 
   - File manager > `/wp-content/debug.log`
   - Look for recent errors (scroll to bottom for most recent)
3. Screenshot error message + send to support contact (see below)

#### Changing Store Information

1. Left menu: **Settings > General** (or **Customizer** in some themes)
2. Edit:
   - Store name
   - Store address (collection location)
   - Phone number
   - Email address
3. **Settings > WooCommerce > Checkout:**
   - Default pickup address (pre-filled for customers)
4. Click **"Save Changes"**

---

### 5.2 Common Tasks & Troubleshooting

#### "I have a refund request, how do I process it?"

1. Customer emails or texts: "I'd like a refund"
2. Log into WordPress admin > **Orders**
3. Find order by customer name or date
4. Click order to open
5. Click **"Refund"** (see instructions above)
6. Enter refund amount
7. Click **"Refund"**
8. Refund appears back to customer's card within 3–5 business days

#### "A customer says they didn't get a confirmation email"

1. Log into WordPress admin > **Orders**
2. Find order by customer name/date
3. Scroll to order notes section
4. Click **"Resend Order Confirmation"** button (if available) or:
   - Click **"Email"** tab
   - Look for "Order confirmation" email
   - Click **"Resend"**
5. Check customer's spam/junk folder (emails sometimes go there)
6. If still missing, contact support (see below)

#### "Why isn't my new menu item showing up?"

1. Add new product (see "Adding a New Menu Item" above)
2. **Common causes:**
   - Product status: Check if set to **"Publish"** (not "Draft")
   - Product visibility: Product data > **Visibility** tab, ensure "Shop" is checked
   - Inventory: If "Manage stock" enabled, ensure stock quantity > 0
3. Solution: 
   - Open product edit page
   - Check status = "Publish"
   - Check stock quantity > 0
   - Save changes
   - Refresh storefront in customer browser

#### "An order hasn't updated status in a while"

1. Log into WordPress admin > **Orders**
2. Find order
3. Check: is status stuck at "Processing" (Paid)?
   - You need to manually mark as "On-Hold" (Preparing) or "Completed" (Ready)
   - WooCommerce doesn't auto-advance; you must click the button
4. If status is "Failed" or "Cancelled":
   - Payment didn't go through
   - Contact customer to resubmit payment
5. Check **Order Notes** for any system messages

#### "I want to close orders for the day"

**Option 1: Disable checkout temporarily**

1. Left menu: **Settings > WooCommerce > Checkout**
2. Click **"Disable checkout"** or set **"Checkout available until"** to 6pm (example)
3. Customers see "Orders closed" message

**Option 2: Set opening hours**

1. If using **Orderable** plugin:
   - **Orderable > Settings > Hours of operation**
   - Set: Monday–Friday 6pm–9pm, Closed Sundays, etc.
   - Orderable auto-hides time slots outside these hours
2. Save

#### "A customer wants to modify their order"

**Current state:** No built-in modification (orders are paid + in-progress).

**How to handle:**
1. Customer contacts: "Can I add/remove an item?"
2. Check if order already "Preparing" or "Ready":
   - If Preparing (On-Hold status): might be too late to modify
   - If just paid (Processing status): may be possible
3. Options:
   - If quick: issue refund, ask customer to place new order
   - If busy: note in order comments, fulfill "best effort"
   - Future feature: "Allow modification for 5 minutes after payment"

---

### 5.3 Support & Escalation

#### Ola's Support Contact

- **Email:** [coconiczy@... your actual email]
- **Phone:** [your phone number]
- **Hours:** [your availability, e.g., Mon–Fri 9am–5pm, Sat 10am–2pm]
- **Emergency (order system down):** Call [phone number]

#### When to Contact Support

- Payment processing failing (orders not being created)
- Emails not sending (customers not getting confirmations)
- Site down / "500 error" shown
- Strange behavior in admin dashboard
- Need help adding large batch of menu items
- Questions about Stripe, refunds, or payment records

#### Troubleshooting Info to Provide

When contacting support, include:
- Order number(s) affected (if applicable)
- Customer email/name
- What happened / what should have happened
- Screenshot (if visual issue)
- Browser used (Chrome, Safari, etc.)
- When did this start?

---

### 5.4 Monthly Maintenance Checklist

**Once a month, log in to:**

- [ ] **WordPress admin:**
  - [ ] Check for plugin updates (Plugins > Updates)
  - [ ] Install updates (non-breaking, test first if nervous)
  - [ ] Verify no critical errors (Tools > Site Health)

- [ ] **Stripe dashboard:**
  - [ ] Review recent payouts (should deposit to your account weekly)
  - [ ] Check dispute/refund history
  - [ ] Verify API keys still valid (no rotation needed, but good to confirm)

- [ ] **Email logs:**
  - [ ] Spot-check that confirmation emails are delivering (random order)
  - [ ] Check bounce rate (shouldn't be > 1–2%)

- [ ] **Order summary:**
  - [ ] Review total orders, revenue for the month
  - [ ] Spot-check a few for accuracy
  - [ ] Note any patterns (peak hours, popular items)

---

## Part 6: Deployment Timeline & Effort

### 6.1 Parallel Execution (Ideal)

Assuming all 4 agents work in parallel:

| Phase | Duration | Agent(s) | Output |
|-------|----------|----------|--------|
| **Planning** | 30 min | All | Requirements, specs, templates |
| **Build** | 2–3 hours | Agent 1, 2, 3, 4 (parallel) | Menu JSON, checkout code, Stripe config, email setup |
| **Integration** | 1–2 hours | Deployment Lead | Wire components, deploy to VPS, config domain/SSL |
| **Smoke Testing** | 1–2 hours | Deployment Lead | Run 8 smoke tests, document results |
| **Go-Live** | 30 min | Deployment Lead + coconiczy | Activate Stripe live keys, final checks |
| **Handoff & Training** | 1 hour | Deployment Lead + coconiczy | Walk through admin dashboard, answer Q&A |
| **Post-Launch Monitoring** | 24–48 hours | Deployment Lead | Monitor first orders, respond to issues |

**Total timeline:** 5–8 hours spread over 1–2 days, plus 24–48 hour monitoring window.

### 6.2 Critical Path Dependencies

```
Agent 1 (Menu) ──┐
                 ├──> Agent 5 (Deployment Lead) ──> Smoke Tests ──> Go-Live
Agent 2 (Flow) ──┤
                 ├──> (wire components)
Agent 3 (Stripe) ┤
                 │
Agent 4 (Emails) ┘
```

**Critical items (can't start next phase without):**
1. Agent 1: Menu JSON must be valid JSON and importable to WooCommerce
2. Agent 2: Checkout flow must be deployable + functional (test locally first)
3. Agent 3: Stripe webhook endpoint must be registered + signature validation working
4. Agent 4: Email templates must be created + triggers configured

**Blockers to watch:**
- Stripe account setup (coconiczy must provide business details)
- Domain registration/DNS (24–48 hour propagation)
- SSL certificate issuance (usually < 5 min via Let's Encrypt)

### 6.3 Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Stripe account not verified** | Can't go live | Get coconiczy started on Stripe early (pre-build); use test mode until ready |
| **Menu photos missing/broken** | Bad UX | Use placeholders initially; coconiczy uploads real photos post-launch |
| **Email service down** | Customers don't get confirmations | MailPoet (WordPress-native) less risky than external SendGrid; test thoroughly |
| **Payment fails silently** | Orders not created, revenue lost | Webhook signature validation + error logging; monitor Stripe dashboard |
| **Domain DNS not propagating** | Site unreachable at custom domain | Use Hostinger subdomain as fallback until DNS resolves |
| **Mobile checkout broken** | Mobile customers can't order | Test on iPhone + Android before go-live |
| **Refund process buggy** | Customer service nightmare | Test refund flow thoroughly in smoke tests (Test 6) |

---

## Part 7: Integration Specs for Agents

### 7.1 Expected Input from Each Agent

#### Agent 1 (Menu Architect) Input Format

Agent 1 should deliver:

```json
{
  "metadata": {
    "version": "1.0",
    "created": "2026-06-29",
    "total_items": 24,
    "total_categories": 4
  },
  "categories": [
    {
      "id": "bbq-mains",
      "name": "BBQ Mains",
      "description": "Smoked meats, slow-cooked 8+ hours",
      "display_order": 1,
      "items": [
        {
          "id": "pulled-pork-001",
          "sku": "PP001",
          "name": "Pulled Pork",
          "description": "Slow-smoked 8 hours, tender & smoky",
          "price_gbp": 12.99,
          "image_url": "https://cdn.example.com/pulled-pork.jpg",
          "modifiers": [
            {
              "name": "Size",
              "type": "required",
              "options": [
                { "name": "Regular (300g)", "price_add": 0.00 },
                { "name": "Large (450g)", "price_add": 3.00 }
              ]
            },
            {
              "name": "Sauce",
              "type": "required",
              "options": [
                { "name": "Chipotle", "price_add": 0.00 },
                { "name": "Honey BBQ", "price_add": 0.00 },
                { "name": "Carolina Gold", "price_add": 0.00 }
              ]
            }
          ],
          "available": true,
          "stock_quantity": 999
        }
      ]
    }
  ]
}
```

**Deliverable:** `menu.json` (valid JSON) + `menu.csv` (for WooCommerce import if needed)

#### Agent 2 (Collection Flow Engineer) Input Format

Agent 2 should deliver:

- **Checkout page template** (HTML/PHP/React component):
  - Cart summary
  - Customer name + phone fields (required)
  - Collection address display (read-only, hardcoded)
  - Time slot selector
  - Order notes field (optional)
  - Payment button (triggers Agent 3's Stripe integration)

- **Order status page** (customer-facing):
  - Order details (number, items, total, pickup time)
  - Current status (visual: "Paid" → "Preparing" → "Ready")
  - Timeline/progress indicator
  - Contact info (coconiczy phone/email)

- **Time slot logic:**
  ```
  Function: getAvailableTimeSlots(opening_hours, lead_time_minutes)
    For today and tomorrow:
      For each 30-min interval within opening hours:
        If interval > (now + lead_time_minutes):
          Add to available slots
    Return slots
  ```

- **Database schema changes** (if using custom code):
  ```sql
  ALTER TABLE wp_posts ADD COLUMN pickup_time DATETIME;
  ALTER TABLE wp_postmeta ADD COLUMN customer_phone VARCHAR(20);
  ALTER TABLE wp_postmeta ADD COLUMN customer_notes TEXT;
  ```

**Deliverable:** Checkout page code + order status page code + time slot logic + any DB migrations

#### Agent 3 (Stripe Integration Specialist) Input Format

Agent 3 should deliver:

- **Webhook handler** (PHP/Node.js):
  ```php
  POST /wp-json/coconiczy/v1/stripe-webhook
  
  1. Verify Stripe signature (CRITICAL for security)
  2. Extract event type + order ID from webhook payload
  3. If event = "payment_intent.succeeded":
     - Find order in WordPress by order ID
     - Update order status to "Processing" (displays as "Paid")
     - Add order note: "Payment confirmed by Stripe"
  4. If event = "charge.refunded":
     - Find order by charge ID
     - Update order status to "Refunded"
     - Add order note: "Refunded by customer service"
  5. Return 200 OK to Stripe
  ```

- **Payment intent creation** (front-end, called on checkout):
  ```javascript
  async function createPaymentIntent(orderData) {
    const response = await fetch('/wp-json/coconiczy/v1/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({
        order_id: orderData.order_id,
        amount_cents: orderData.total * 100,
        currency: 'gbp',
        customer_email: orderData.email
      })
    });
    return response.json(); // { client_secret, payment_intent_id }
  }
  ```

- **Error handling:**
  - Declined card → show friendly error, allow retry
  - Timeout → queue for manual review, send coconiczy a notification
  - Network error → retry logic with exponential backoff

- **Test payloads** (for Agent 5 to use in smoke tests):
  ```json
  {
    "id": "evt_test123",
    "type": "payment_intent.succeeded",
    "data": {
      "object": {
        "id": "pi_test123",
        "amount": 3299,
        "currency": "gbp",
        "metadata": {
          "order_id": "coconiczy_12345"
        },
        "status": "succeeded"
      }
    }
  }
  ```

**Deliverable:** Webhook handler code + payment intent creation code + error handling + test payloads + Stripe API key config instructions

#### Agent 4 (Automation Builder) Input Format

Agent 4 should deliver:

- **Email templates** (HTML + plain text):
  1. **Order Confirmation**
     - Trigger: Stripe webhook `payment_intent.succeeded`
     - Delay: immediate
     - Subject: "Your coconiczy order is confirmed"
     - Content: order number, items, total, pickup time, location, status page link
  2. **Order Preparing**
     - Trigger: Order status change to "On-Hold"
     - Delay: immediate
     - Subject: "Your order is being prepared"
     - Content: order number, ETA (if available)
  3. **Order Ready**
     - Trigger: Order status change to "Completed"
     - Delay: immediate
     - Subject: "Your order is ready for pickup!"
     - Content: order number, location, hours open, contact info
  4. **Review Request**
     - Trigger: 1 hour after scheduled pickup time (cron job or delayed email)
     - Delay: 1 hour after pickup time
     - Subject: "How was your coconiczy order? Leave a review"
     - Content: Google review link (pre-formatted with business name), on-site review form link

- **Trigger logic** (webhook handlers or cron jobs):
  ```php
  // On Stripe webhook (payment.succeeded)
  send_email($customer_email, 'confirmation', $order_data);
  
  // On order status change (WordPress hook)
  add_action('woocommerce_order_status_changed', function($order_id, $old_status, $new_status) {
    if ($new_status == 'on-hold') { // Preparing
      send_email($order->get_billing_email(), 'preparing', $order);
    }
    if ($new_status == 'completed') { // Ready
      send_email($order->get_billing_email(), 'ready', $order);
    }
  });
  
  // Cron job (runs every 10 minutes)
  add_action('coconiczy_review_request_cron', function() {
    $orders_past_pickup = get_orders_where_pickup_time_was_1hr_ago();
    foreach ($orders_past_pickup as $order) {
      if (!$order->has_meta('review_request_sent')) {
        send_email($order->get_billing_email(), 'review_request', $order);
        $order->update_meta_data('review_request_sent', true);
      }
    }
  });
  ```

- **Google Review Link Format:**
  ```
  https://www.google.com/maps/place/coconiczy+Cookout+Address/@lat,lng,17z
  ```
  (Ola provides business name + address)

- **Configuration details:**
  - Email service: SendGrid API key OR MailPoet plugin config
  - From address: `orders@coconiczy.co.uk`
  - From name: "coconiczy Cookout"
  - Reply-to: Same as from address
  - Unsubscribe link: Required on every email (GDPR)
  - SMS (optional): Twilio account + config if customer opts in

**Deliverable:** Email template files (HTML) + trigger code + cron job setup + email service config + Google review link template

---

## Part 8: Post-Go-Live Operations

### 8.1 First Week Checklist

- [ ] **Daily monitoring (first 3 days):**
  - Site up + accessible
  - Orders flowing through (at least 1–2 test orders)
  - Payments processing (Stripe dashboard)
  - Emails sending (spot-check a few)
  - No error logs (WordPress debug.log)

- [ ] **coconiczy feedback:**
  - [ ] Is dashboard intuitive?
  - [ ] Can you mark orders as ready?
  - [ ] Do you understand how to issue refunds?
  - [ ] Any missing features?

- [ ] **Customer feedback:**
  - [ ] Monitor email replies to confirmation emails
  - [ ] Note any customer questions (builds FAQ)
  - [ ] Check Google review requests (are customers leaving reviews?)

- [ ] **Revenue verification:**
  - [ ] Check Stripe dashboard: payouts processing?
  - [ ] Compare test orders + real orders: numbers match?
  - [ ] Any failed transactions to investigate?

### 8.2 First Month Operational Goals

- [ ] **Stability:** Zero unplanned downtime
- [ ] **Accuracy:** 100% of payments successfully processed + refunded
- [ ] **Communication:** 100% of customers receive confirmation + status emails
- [ ] **Support:** < 2 hour response time to coconiczy issues
- [ ] **Growth:** 20–50 orders/week (typical for local food business)

### 8.3 Quarterly Review

- [ ] Review order stats + revenue
- [ ] Identify popular items (plan to increase stock)
- [ ] Identify unpopular items (plan to remove)
- [ ] Suggest menu updates (seasonal items, new offerings)
- [ ] Review customer feedback (FAQ, complaints)
- [ ] Plan next phase (SMS notifications, loyalty program, advanced features)

---

## Appendix: Stripe Test Cards

Use these test cards in Stripe test mode (not live):

| Scenario | Card Number | Expiry | CVC | ZIP |
|----------|-------------|--------|-----|-----|
| **Success (default)** | 4242 4242 4242 4242 | Any future (e.g., 12/25) | Any 3 digits | Any 5 digits |
| **Visa (success)** | 4111 1111 1111 1111 | Any future | Any 3 digits | Any 5 digits |
| **Declined (card declined)** | 4000 0000 0000 0002 | Any future | Any 3 digits | Any 5 digits |
| **Declined (lost card)** | 4000 0000 0000 9995 | Any future | Any 3 digits | Any 5 digits |
| **Declined (stolen card)** | 4000 0000 0000 9987 | Any future | Any 3 digits | Any 5 digits |
| **3D Secure (auth required)** | 4000 0025 0000 3155 | Any future | Any 3 digits | Any 5 digits |
| **Visa (token)** | 4007 7000 0000 0018 | Any future | Any 3 digits | Any 5 digits |
| **Mastercard (success)** | 5555 5555 5555 4444 | Any future | Any 3 digits | Any 5 digits |
| **American Express (success)** | 3782 822463 10005 | Any future | Any 4 digits | Any 5 digits |

**Expiry & CVC:** Can be any valid format (e.g., 12/25, 123)

**In test mode:** No real charges; orders are test orders visible in Stripe test dashboard.

**In live mode:** Real charges; use real cards only. Never test live mode with fake cards (Stripe will decline).

---

## Final Checklist: Ready to Deploy?

Before launching agents, confirm:

- [ ] All 4 agents have clear specs + acceptance criteria
- [ ] Hostinger VPS access confirmed (or new VPS provisioned)
- [ ] coconiczy has started Stripe account setup (parallel process)
- [ ] Domain decision made (custom or Hostinger subdomain)
- [ ] Team knows timeline + handoff process
- [ ] Deployment Lead (you) has access to all agent deliverables
- [ ] coconiczy available for training + go-live day

**Status:** ✓ READY TO DEPLOY

---

**Document version:** 1.0  
**Last updated:** 2026-06-29  
**Created by:** Deployment Lead  
**For:** coconiczy Cookout Direct Ordering System
