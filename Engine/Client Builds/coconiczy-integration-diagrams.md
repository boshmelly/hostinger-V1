# coconiczy Ordering System — Integration Diagrams & Data Flow

**Supporting Reference for Deployment Lead**  
**Status:** SUPPORTING DOCUMENTATION  
**Created:** 2026-06-29  

---

## Diagram 1: System Architecture (Detailed)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    coconiczy Ordering System Architecture                │
└──────────────────────────────────────────────────────────────────────────┘

┌─ CUSTOMER LAYER ──────────────────────────────────────────────────────────┐
│                                                                            │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐            │
│  │   Browser    │      │   Mobile     │      │   Email      │            │
│  │  (Menu View) │      │  (Checkout)  │      │  (Tracking)  │            │
│  └──────┬───────┘      └──────┬───────┘      └──────┬───────┘            │
│         │                     │                     │                    │
│         └─────────────────────┼─────────────────────┘                    │
│                               │                                          │
└───────────────────────────────┼──────────────────────────────────────────┘
                                │
                    ┌───────────▼────────────┐
                    │  HTTPS / TLS           │
                    │  coconiczy.co.uk       │
                    │  (Custom Domain)       │
                    └───────────┬────────────┘
                                │
┌─ FRONTEND (WordPress) ────────┼──────────────────────────────────────────┐
│                               │                                          │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │ WordPress Theme / WooCommerce Frontend                       │       │
│  │ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │       │
│  │ │  Shop Page   │  │  Product     │  │  Cart Page   │         │       │
│  │ │ (Menu List)  │  │  Detail Page │  │  (Modifiers) │         │       │
│  │ └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │       │
│  │        │                 │                 │                 │       │
│  │ ┌──────┴─────────────────┴─────────────────┴──────────┐      │       │
│  │ │         Checkout Flow (Agent 2)                     │      │       │
│  │ │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │      │       │
│  │ │  │Customer Info │  │Collection    │  │Stripe      │ │      │       │
│  │ │  │(Name, Phone) │  │Address +     │  │Payment     │ │      │       │
│  │ │  │              │  │Time Slot     │  │Form        │ │      │       │
│  │ │  └──────────────┘  └──────────────┘  └─────┬──────┘ │      │       │
│  │ │                                            │        │      │       │
│  │ │                              (Orderable plugin or custom)   │      │
│  │ └────────────────────────────────────────────┬────────┘      │       │
│  │                                              │                │       │
│  └──────────────────────────────────────────────┼────────────────┘       │
│                                                 │                        │
└─────────────────────────────────────────────────┼────────────────────────┘
                                                  │
                        ┌─────────────────────────▼────────────────┐
                        │   Stripe Payment Processing (Agent 3)    │
                        │                                          │
                        │  ┌──────────────────────────────────┐   │
                        │  │  Payment Intent Creation         │   │
                        │  │  (Trigger from checkout)         │   │
                        │  │  - Collect card details          │   │
                        │  │  - Verify amount + metadata      │   │
                        │  │  - Create payment_intent in API  │   │
                        │  └──────────┬───────────────────────┘   │
                        │             │                           │
                        │  ┌──────────▼──────────────────────┐   │
                        │  │  Customer Completes Payment     │   │
                        │  │  - Card approved/declined       │   │
                        │  │  - Stripe returns status        │   │
                        │  └──────────┬───────────────────────┘   │
                        │             │                           │
                        │  ┌──────────▼──────────────────────┐   │
                        │  │  Stripe Webhook (Async)         │   │
                        │  │  - payment_intent.succeeded     │   │
                        │  │  - POST to WordPress endpoint   │   │
                        │  │  - Order status → "Processing"  │   │
                        │  └──────────┬───────────────────────┘   │
                        │             │                           │
                        └─────────────┼───────────────────────────┘
                                      │
┌─ BACKEND (WordPress) ─────────────────┼──────────────────────────────────┐
│                                       │                                  │
│         ┌─────────────────────────────▼──────────────────┐               │
│         │ MySQL Database (wp_posts, wp_postmeta, etc.)   │               │
│         │                                                │               │
│         │  Order table: (Webhook updates order status)   │               │
│         │  ┌───────────────────────────────────────────┐ │               │
│         │  │ ID: coconiczy_12345                       │ │               │
│         │  │ Status: processing (= "Paid")             │ │               │
│         │  │ Customer: Test Customer                   │ │               │
│         │  │ Phone: 07777 123456                       │ │               │
│         │  │ Items: Pulled Pork x2, Fries x1          │ │               │
│         │  │ Total: £32.99                             │ │               │
│         │  │ Pickup Time: 2026-06-29 18:30             │ │               │
│         │  │ Pickup Address: 123 High St, London       │ │               │
│         │  │ Payment Status: Paid (via Stripe)         │ │               │
│         │  │ Payment ID: pi_test123                    │ │               │
│         │  └───────────────────────────────────────────┘ │               │
│         └───────────────┬──────────────────────────────────┘               │
│                         │                                                 │
│         ┌───────────────┴────────────────────────────────┐               │
│         │ WordPress Order Hooks Fire (Status Changed)    │               │
│         │ - Trigger: Order status = processing           │               │
│         │ - Action: Send confirmation email (Agent 4)    │               │
│         │ - Action: Create order note                    │               │
│         │ - Action: Store payment metadata               │               │
│         └───────────────┬────────────────────────────────┘               │
│                         │                                                 │
└─────────────────────────┼────────────────────────────────────────────────┘
                          │
┌─ EMAIL / AUTOMATION ────┼──────────────────────────────────────────────────┐
│ (Agent 4 Triggers)      │                                                  │
│                         │                                                  │
│         ┌───────────────▼────────────────────────────────┐                │
│         │ Email Trigger 1: Order Confirmation            │                │
│         │ - Sends immediately when status = processing   │                │
│         │ - To: customer@email.com                       │                │
│         │ - Template: Order Confirmation                 │                │
│         │ - Content: Order #, items, total, pickup time  │                │
│         │ - Includes: Reply-to, unsubscribe              │                │
│         │ - Via: MailPoet or SendGrid API                │                │
│         └─────────────────────┬───────────────────────────┘                │
│                               │                                           │
│         ┌───────────────┬─────┴─────────────────────────┐                 │
│         │               │                               │                 │
│   ┌─────▼──────┐  ┌─────▼──────┐  ┌──────────────────┐  │                 │
│   │ coconiczy   │  │ coconiczy   │  │ Cron Job:       │  │                 │
│   │ marks order │  │ marks order │  │ Review Request  │  │                 │
│   │ "preparing" │  │ "ready"     │  │ (1hr after      │  │                 │
│   │ (On-Hold)   │  │(Completed)  │  │  pickup time)   │  │                 │
│   │             │  │             │  │                 │  │                 │
│   └─────┬───────┘  └─────┬───────┘  └────────┬────────┘  │                 │
│         │                │                   │            │                 │
│   ┌─────▼──────────────────┴───────────────────┴────────┐ │                 │
│   │ Email Trigger 2: Status Updates (Manual)            │ │                 │
│   │ - When coconiczy marks "On-Hold": Send "Preparing" │ │                 │
│   │ - When coconiczy marks "Completed": Send "Ready"   │ │                 │
│   │ - Also includes: Order #, location, hours         │ │                 │
│   │ - Via: MailPoet or SendGrid API                    │ │                 │
│   └─────┬──────────────────────────────────────────────┘ │                 │
│         │                                                │                 │
│   ┌─────▼──────────────────────────────────────────────┐ │                 │
│   │ Email Trigger 3: Review Request (Automated Cron)   │ │                 │
│   │ - Fires 1 hour after scheduled pickup time         │ │                 │
│   │ - Includes: Google review link + on-site form      │ │                 │
│   │ - Via: MailPoet or SendGrid API                    │ │                 │
│   └──────────────────────────────────────────────────────┘ │                 │
│                                                             │                 │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │ Customer Email    │
                    │ (Gmail/Outlook)   │
                    └───────────────────┘

┌─ ADMIN DASHBOARD (WordPress wp-admin) ─────────────────────────────────────┐
│                                                                              │
│  coconiczy logs in → Orders list → Order detail                            │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Order #12345 Detail Page                                            │  │
│  │                                                                      │  │
│  │ Status: [Processing ▼] → [On-Hold ▼] → [Completed ▼]             │  │
│  │ (coconiczy clicks dropdown to mark as "Preparing" or "Ready")      │  │
│  │                                                                      │  │
│  │ Customer: Test Customer                                            │  │
│  │ Phone: 07777 123456                                                │  │
│  │ Items:                                                             │  │
│  │  - Pulled Pork (Large, Chipotle) x2 ........................ £27.98│  │
│  │  - Loaded Fries x1 ........................................ £4.99│  │
│  │  Total .................................................... £32.99│  │
│  │                                                                      │  │
│  │ Pickup: Today 6:30 PM @ 123 High St, London                        │  │
│  │                                                                      │  │
│  │ Payment: Stripe (paid)                                             │  │
│  │  Stripe ID: pi_test123                                             │  │
│  │  [Refund ↓] (click to refund)                                      │  │
│  │                                                                      │  │
│  │ Order Notes:                                                       │  │
│  │  - 2026-06-29 17:05 Payment received via Stripe                   │  │
│  │  - 2026-06-29 17:06 Confirmation email sent                       │  │
│  │  - 2026-06-29 17:10 coconiczy marked "preparing"                  │  │
│  │  - 2026-06-29 17:28 "Preparing" email sent                        │  │
│  │  - 2026-06-29 17:55 coconiczy marked "ready"                      │  │
│  │  - 2026-06-29 17:56 "Ready" email sent                            │  │
│  │                                                                      │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  Other admin tasks:                                                         │
│  - Products: Add/edit menu items, set stock, prices                        │
│  - Settings: Store name, hours, email address                             │
│  - Reports: Order history, revenue, payment stats                          │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Diagram 2: Order Status State Machine

```
CUSTOMER JOURNEY - Order Lifecycle:

                    ┌─────────────┐
                    │    START    │
                    │ (Browse     │
                    │  Menu)      │
                    └──────┬──────┘
                           │
                           │ Add items to cart, checkout
                           ▼
                    ┌─────────────────────────────────┐
                    │ PAYMENT PENDING                 │
                    │ - Order created in WordPress    │
                    │ - Status: "Pending Payment"     │
                    │ - Stripe form shown             │
                    └──────┬──────────────────────────┘
                           │
                   ┌───────┴────────┐
                   │                │
         ┌─────────▼────────┐  ┌────▼──────────────┐
         │ PAYMENT SUCCESS  │  │ PAYMENT DECLINED  │
         │ (4242... card)   │  │ (4000... card)    │
         │                  │  │                   │
         └────────┬─────────┘  └────┬──────────────┘
                  │                 │
                  │ Stripe webhook  │ Error message
                  │ fired           │ shown, can retry
                  ▼                 │
         ┌─────────────────────────┐│
         │ PROCESSING ("Paid")     ││
         │ - Payment confirmed     ││
         │ - Webhook updated order ││
         │ - Confirmation email    ││
         │   sent to customer      ││
         └────────┬────────────────┘│
                  │                 │
                  │ coconiczy takes │
                  │ order & starts  │
                  │ cooking         │
                  ▼                 │
         ┌─────────────────────────┐│
         │ ON-HOLD ("Preparing")   ││
         │ - coconiczy marks via   ││
         │   admin dashboard       ││
         │ - "Preparing" email     ││
         │   sent to customer      ││
         │ - Customer waits        ││
         └────────┬────────────────┘│
                  │                 │
                  │ Food ready      │
                  │                 │
                  ▼                 │
         ┌─────────────────────────┐│
         │ COMPLETED ("Ready")     ││
         │ - coconiczy marks via   ││
         │   admin dashboard       ││
         │ - "Ready" email sent    ││
         │ - Customer picks up     ││
         └────────┬────────────────┘│
                  │                 │
                  │ Customer picks  │
                  │ up order        │
                  ▼                 │
         ┌─────────────────────────┐│
         │ END (Completed)         ││
         │ - 1 hour after pickup   ││
         │ - Review request email  ││
         │   sent to customer      ││
         └─────────────────────────┘│
                                    │
                    ┌───────────────┘
                    │
       ANY STATE ◄──┼── REFUND (customer service issues refund)
       (except      │
        START)      │
                    ▼
         ┌─────────────────────────┐
         │ REFUNDED                │
         │ - Stripe refund issued  │
         │ - Money back to card    │
         │ - Refund email sent     │
         │ - Order status changed  │
         └─────────────────────────┘
```

---

## Diagram 3: Component Integration Points (Checklist Table)

```
INTEGRATION POINTS — How Components Plug Together:

┌─────────────────────────────────────────────────────────────────────────────┐
│ Integration Point │ Agent Output │ WordPress Plugin/Code │ Data Flow        │
├─────────────────────────────────────────────────────────────────────────────┤
│ MENU IMPORT       │ Agent 1:     │ WooCommerce CSV      │ menu.json/CSV  │
│                   │ menu.json    │ Importer or REST API │ ──import──>    │
│                   │ + photos     │                      │ Products table  │
│                   │              │                      │                 │
│                   │ Acceptance:  │ All items visible in │ ✓ Test: view   │
│                   │ 20+ items,   │ shop, correct prices │   menu page    │
│                   │ 4+ categories│                      │                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ CHECKOUT FLOW     │ Agent 2:     │ Orderable plugin OR  │ Custom form    │
│                   │ Checkout     │ custom template +    │ ──submit──>    │
│                   │ page code +  │ API routes           │ create_order() │
│                   │ time slot    │                      │                 │
│                   │ logic        │ - Remove shipping    │ ✓ Test: fill   │
│                   │              │ - Add time slot      │   checkout,    │
│                   │              │ - Hardcode address   │   see order    │
│                   │              │ - Stripe button      │   created      │
│                   │              │                      │                 │
│                   │ Acceptance:  │ Time slots work,     │                 │
│                   │ 3-step flow, │ address correct      │                 │
│                   │ mobile-      │                      │                 │
│                   │ friendly     │                      │                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ STRIPE PAYMENT    │ Agent 3:     │ Stripe Payments      │ Card data      │
│                   │ Webhook      │ plugin + custom      │ ──encrypt──>   │
│                   │ handler +    │ JavaScript           │ Stripe API     │
│                   │ payment      │                      │ ──webhook──>   │
│                   │ intent code  │ - Payment intent     │ WordPress      │
│                   │              │ - Webhook handler    │ ──update──>    │
│                   │ Acceptance:  │ - Error handling     │ Order status   │
│                   │ Test payment │ - Refund endpoint    │                 │
│                   │ succeeds,    │                      │ ✓ Test: pay    │
│                   │ webhook      │ Webhook registered   │   with test    │
│                   │ fires, order │ in Stripe dashboard  │   card,        │
│                   │ updated      │                      │   verify       │
│                   │              │                      │   webhook      │
│                   │              │                      │   fired        │
├─────────────────────────────────────────────────────────────────────────────┤
│ EMAIL AUTOMATION  │ Agent 4:     │ MailPoet plugin OR   │ Order status   │
│                   │ Email        │ SendGrid API         │ change ────>   │
│                   │ templates +  │ integration          │ trigger email  │
│                   │ trigger code │                      │ ──send──>      │
│                   │              │ - Email template     │ Customer       │
│                   │ Acceptance:  │ - Automation trigger │ inbox          │
│                   │ Confirmation │ - Cron job (delayed) │                 │
│                   │ email within │ - Unsubscribe link   │ ✓ Test: create │
│                   │ 1min,        │ - From/Reply-to      │   order,       │
│                   │ status       │                      │   verify       │
│                   │ emails fire, │                      │   email        │
│                   │ review       │                      │   arrives      │
│                   │ request sent │                      │                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ DOMAIN + SSL      │ (Deployment  │ Hostinger VPS or     │ DNS records    │
│                   │ Lead)        │ Let's Encrypt        │ ──point──>     │
│                   │              │                      │ Hostinger VPS  │
│                   │              │ - Domain registered  │ ──issue──>     │
│                   │              │ - DNS pointed        │ SSL cert       │
│                   │              │ - SSL auto-renew     │                 │
│                   │              │                      │ ✓ Test: HTTPS  │
│                   │ Acceptance:  │ - WP Site URL =      │   works, A+    │
│                   │ Site live,   │   https://...        │   SSL rating   │
│                   │ SSL A+ rating│                      │                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ MONITORING +      │ (Deployment  │ WordPress + Hostinger│ Uptime monitor │
│ BACKUP            │ Lead)        │ plugins              │ ──alert──>     │
│                   │              │                      │ Team email     │
│                   │ Acceptance:  │ - Uptime monitoring  │                 │
│                   │ Alerts work, │ - Error logging      │ Backup ──copy→ │
│                   │ backups      │ - DB backups         │ Safe storage   │
│                   │ running      │ - Daily auto-backup  │                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Diagram 4: Webhook Data Flow (Critical Security Path)

```
STRIPE WEBHOOK FLOW — Secure Payment Verification:

┌────────────────────────────────────────────────────────────────────────────┐
│ CUSTOMER COMPLETES PAYMENT (Front-End)                                     │
└────────────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Customer clicks "Pay"
                                  │ (Stripe.js processes card)
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │ Stripe Processes Card       │
                    │ - Validates card            │
                    │ - Charges amount            │
                    │ - Creates payment_intent    │
                    │ - Status: succeeded         │
                    └────────────┬────────────────┘
                                 │
                                 │ Async: Stripe server
                                 │
                                 ▼
                    ┌─────────────────────────────────────┐
                    │ Stripe Fires Webhook Event          │
                    │ (ASYNCHRONOUS - not tied to page)   │
                    │                                     │
                    │ POST https://coconiczy.co.uk/      │
                    │     /wp-json/coconiczy/v1/         │
                    │     stripe-webhook                 │
                    │                                     │
                    │ Headers:                            │
                    │  - stripe-signature: [HMAC-SHA256]  │
                    │                                     │
                    │ Body (JSON):                        │
                    │ {                                   │
                    │   "id": "evt_test123",              │
                    │   "type": "payment_intent.succeeded"│
                    │   "data": {                         │
                    │     "object": {                     │
                    │       "id": "pi_test123",           │
                    │       "amount": 3299,               │
                    │       "currency": "gbp",            │
                    │       "status": "succeeded",        │
                    │       "metadata": {                 │
                    │         "order_id": "12345"         │
                    │       }                             │
                    │     }                               │
                    │   }                                 │
                    │ }                                   │
                    └────────────┬──────────────────────┘
                                 │
                                 │ Stripe posts to WordPress
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ WORDPRESS WEBHOOK HANDLER (Agent 3's Code)                                 │
│ File: /wp-content/plugins/coconiczy-orders/webhooks.php                   │
│                                                                             │
│ function handle_stripe_webhook() {                                         │
│   // CRITICAL: Verify webhook is truly from Stripe (not spoofed)           │
│   $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];                         │
│   $endpoint_secret = get_option('stripe_webhook_secret');  // From Stripe │
│                                                                             │
│   try {                                                                     │
│     $event = \Stripe\Webhook::constructEvent(                              │
│       $raw_body,                                           // Raw JSON     │
│       $sig_header,                                         // Signature    │
│       $endpoint_secret                                    // Secret key   │
│     );                                                                      │
│     // If above fails, webhook is NOT from Stripe                          │
│     // → Return 403 Forbidden                                              │
│                                                                             │
│   } catch (\Exception $e) {                                                │
│     http_response_code(403);                                               │
│     exit();                                                                 │
│   }                                                                         │
│                                                                             │
│   // Signature verified ✓ This is a real Stripe webhook                   │
│                                                                             │
│   // Check event type                                                      │
│   if ($event->type == 'payment_intent.succeeded') {                        │
│     $order_id = $event->data->object->metadata->order_id;                  │
│     $amount = $event->data->object->amount / 100; // Convert cents → GBP  │
│     $payment_id = $event->data->object->id;                                │
│                                                                             │
│     // Find order in WordPress                                             │
│     $order = wc_get_order($order_id);                                      │
│     if (!$order) {                                                          │
│       // Order not found - log error, return 500                           │
│       error_log("Webhook: Order $order_id not found");                     │
│       http_response_code(500);                                             │
│       exit();                                                               │
│     }                                                                       │
│                                                                             │
│     // Update order status                                                 │
│     $order->set_status('processing');  // 'Paid' status                    │
│     $order->set_payment_method_title('Stripe');                            │
│     $order->add_meta_data('stripe_payment_intent_id', $payment_id);        │
│     $order->add_order_note('Payment received via Stripe');                 │
│     $order->payment_complete($payment_id);                                 │
│     $order->save();                                                         │
│                                                                             │
│     // WordPress hooks fire automatically:                                 │
│     // - do_action('woocommerce_payment_complete', $order->get_id());      │
│     // - do_action('woocommerce_order_status_changed', ...);               │
│     // - Email trigger: "Order confirmation" sent to customer              │
│   }                                                                         │
│                                                                             │
│   // Always return 200 OK to Stripe (webhook received)                     │
│   http_response_code(200);                                                 │
│   die(json_encode(['success' => true]));                                   │
│ }                                                                           │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ WordPress updates order
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ WORDPRESS ORDER UPDATE                                                      │
│                                                                             │
│ MySQL: UPDATE wp_posts SET post_status = 'wc-processing'                   │
│        WHERE ID = 12345                                                    │
│                                                                             │
│ Metadata: stripe_payment_intent_id = 'pi_test123'                          │
│           _payment_method = 'stripe'                                       │
│           _paid_date = '2026-06-29 17:05:23'                              │
│                                                                             │
│ Order notes: "Payment received via Stripe"                                 │
│              (Visible to coconiczy in admin dashboard)                      │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ Order hooks fire
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ EMAIL TRIGGER (Agent 4 Integration)                                         │
│                                                                             │
│ Hook: do_action('woocommerce_payment_complete', $order_id)                 │
│       →  MailPoet automation: IF order_status == 'processing'              │
│          THEN send 'order_confirmation' template to customer               │
│                                                                             │
│ Email sent to: customer@email.com                                          │
│ Subject: "Your coconiczy order is confirmed"                               │
│ Content:                                                                    │
│   - Order #12345                                                           │
│   - Items: Pulled Pork x2, Fries x1                                       │
│   - Total: £32.99                                                          │
│   - Pickup: Today 6:30 PM @ 123 High St, London                           │
│   - Link to track order: https://coconiczy.co.uk/order-status?id=12345     │
│   - Reply-to: orders@coconiczy.co.uk                                       │
│   - Unsubscribe: [link]                                                    │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ Email delivered
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ CUSTOMER RECEIVES EMAIL (Gmail/Outlook/etc.)                               │
│                                                                             │
│ ✓ Order confirmation received                                              │
│ ✓ Customer knows order is paid & being prepared                           │
│ ✓ Customer can track order status via link                                │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘


KEY SECURITY POINTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Stripe Signature Verification (CRITICAL)
   - Every webhook includes: stripe-signature header (HMAC-SHA256)
   - WordPress must verify this signature using Stripe's webhook secret
   - If signature invalid → webhook is SPOOFED → reject immediately
   - WITHOUT this: attacker could fake webhook, create false orders, steal money

2. Webhook Secret Management
   - Secret NEVER exposed in code (use environment variable or WordPress option)
   - Secret NEVER committed to git
   - Secret NEVER shared via email
   - Retrieved from Stripe dashboard → stored in WordPress settings

3. Order Metadata Validation
   - Extract order_id from webhook metadata
   - Verify order exists in WordPress before updating
   - Verify amount matches order total (if possible)
   - Add audit trail: order notes + metadata

4. Error Handling
   - Always return 200 OK to Stripe (webhook received, processing queued)
   - Log errors to WordPress debug log (NOT visible to customer)
   - If update fails: create alert for coconiczy, retry logic

5. Idempotency
   - If same webhook fires twice (Stripe retry):
     - Check if order already has this payment_intent_id
     - Don't double-process payment
     - Return 200 OK (already handled)
```

---

## Diagram 5: Email Trigger Automation

```
EMAIL AUTOMATION FLOW — How Emails Trigger on Order Events:

┌─ TRIGGER POINT 1: Order Confirmation (Webhook-driven) ───────────────────┐
│                                                                             │
│  Event: Stripe webhook fires "payment_intent.succeeded"                    │
│  WordPress updates order status → "processing"                             │
│  Hook: do_action('woocommerce_payment_complete')                           │
│                                                                             │
│  MailPoet Automation:                                                      │
│  IF order_status == 'processing'                                           │
│     THEN send email template 'order_confirmation'                          │
│                                                                             │
│  Timing: < 1 minute after payment                                          │
│                                                                             │
│  Email sent to: {{customer.email}}                                         │
│  Subject: "Your coconiczy order is confirmed"                              │
│  From: orders@coconiczy.co.uk                                              │
│  Reply-to: orders@coconiczy.co.uk                                          │
│                                                                             │
│  Template Variables:                                                        │
│  - {{order.number}} → #12345                                               │
│  - {{order.items}} → Pulled Pork x2, Fries x1                             │
│  - {{order.total}} → £32.99                                                │
│  - {{order.pickup_time}} → Today 6:30 PM                                   │
│  - {{order.pickup_address}} → 123 High St, London N1 1XX                  │
│  - {{order.status_page_url}} → https://coconiczy.co.uk/order-status?id=12345
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─ TRIGGER POINT 2: Preparing Notification (Manual Status Change) ──────────┐
│                                                                             │
│  Event: coconiczy admin changes order status to "On-Hold" (Preparing)      │
│  WordPress hook: do_action('woocommerce_order_status_changed',             │
│                             order_id, 'processing', 'on-hold')             │
│                                                                             │
│  MailPoet Automation:                                                      │
│  IF order_status changed to 'on-hold'                                      │
│     THEN send email template 'order_preparing'                             │
│                                                                             │
│  Timing: Immediate (within 1 minute of status change)                      │
│                                                                             │
│  Email sent to: {{customer.email}}                                         │
│  Subject: "Your order is being prepared 👨‍🍳"                               │
│  From: orders@coconiczy.co.uk                                              │
│  Reply-to: orders@coconiczy.co.uk                                          │
│                                                                             │
│  Template Variables:                                                        │
│  - {{order.number}} → #12345                                               │
│  - {{order.items}} → Pulled Pork x2, Fries x1                             │
│  - {{order.pickup_time}} → Today 6:30 PM                                   │
│  - {{order.pickup_address}} → 123 High St, London N1 1XX                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─ TRIGGER POINT 3: Ready for Pickup (Manual Status Change) ────────────────┐
│                                                                             │
│  Event: coconiczy admin changes order status to "Completed" (Ready)        │
│  WordPress hook: do_action('woocommerce_order_status_changed',             │
│                             order_id, 'on-hold', 'completed')              │
│                                                                             │
│  MailPoet Automation:                                                      │
│  IF order_status changed to 'completed'                                    │
│     THEN send email template 'order_ready'                                 │
│                                                                             │
│  Timing: Immediate (within 1 minute of status change)                      │
│                                                                             │
│  Email sent to: {{customer.email}}                                         │
│  Subject: "Your order is ready for pickup! 🍖"                             │
│  From: orders@coconiczy.co.uk                                              │
│  Reply-to: orders@coconiczy.co.uk                                          │
│                                                                             │
│  Template Variables:                                                        │
│  - {{order.number}} → #12345                                               │
│  - {{order.pickup_time}} → Today 6:30 PM                                   │
│  - {{order.pickup_address}} → 123 High St, London N1 1XX                  │
│  - {{store.phone}} → 020 XXXX XXXX                                         │
│  - {{store.hours}} → Today until 9:00 PM                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─ TRIGGER POINT 4: Review Request (Delayed Cron Job) ─────────────────────┐
│                                                                             │
│  Event: Cron job runs every 10 minutes, checks for orders past pickup time│
│  WordPress: add_action('coconiczy_review_request_cron', function() { ... })
│                                                                             │
│  Cron Logic:                                                               │
│  FOR each order WHERE pickup_time < (now - 60 minutes)                     │
│      AND meta 'review_request_sent' != true                                │
│    DO:                                                                      │
│      Send 'order_review_request' email template                            │
│      Update order meta: 'review_request_sent' = true                       │
│                                                                             │
│  Timing: 1 hour after customer's scheduled pickup time                      │
│  (Example: Order for 6:30 PM → email at 7:30 PM)                          │
│                                                                             │
│  Email sent to: {{customer.email}}                                         │
│  Subject: "How was your coconiczy order? ⭐"                               │
│  From: orders@coconiczy.co.uk                                              │
│  Reply-to: orders@coconiczy.co.uk                                          │
│                                                                             │
│  Template Variables:                                                        │
│  - {{order.number}} → #12345                                               │
│  - {{google_review_url}} →                                                 │
│    https://www.google.com/maps/place/coconiczy+123+High+Street/…          │
│  - {{on_site_review_form}} →                                               │
│    https://coconiczy.co.uk/leave-review?order=12345                       │
│                                                                             │
│  Cron Job Setup:                                                           │
│  wp_schedule_event(time(), 'every_10_minutes', 'coconiczy_review_request_cron')
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─ EMAIL DELIVERABILITY BEST PRACTICES ────────────────────────────────────┐
│                                                                             │
│  From Address:                                                             │
│  - orders@coconiczy.co.uk (not wordpress@hostinger.com)                    │
│  - DNS: SPF, DKIM, DMARC records set up for coconiczy domain              │
│  - Hostinger should auto-configure SPF/DKIM if using their nameservers   │
│                                                                             │
│  Reply-To:                                                                 │
│  - Always set (emails to this address reach coconiczy, not bounced)       │
│                                                                             │
│  Unsubscribe:                                                              │
│  - Required by CAN-SPAM, GDPR                                              │
│  - MailPoet auto-adds: {{subscriber_unsubscribe_link}}                     │
│  - List-Unsubscribe header (one-click unsubscribe)                         │
│                                                                             │
│  Spam Score:                                                               │
│  - Test emails with MailTester (before go-live)                            │
│  - Avoid: all-caps, excessive punctuation, suspicious links               │
│  - Include plaintext + HTML versions                                       │
│                                                                             │
│  Bounces & Complaints:                                                     │
│  - MailPoet tracks bounces (invalid email)                                 │
│  - Suppress repeated bounces (remove from list)                            │
│  - Monitor complaint rate (should be < 0.1%)                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Summary: Integration Checklist for Deployment Lead

Once all 4 agents deliver their code/config, verify these integration points:

- [ ] **Agent 1 (Menu):** JSON valid, products import cleanly, photos load, modifiers work
- [ ] **Agent 2 (Flow):** Checkout page live, time slots functional, address hardcoded, cart calculates correctly
- [ ] **Agent 3 (Stripe):** Webhook endpoint registered, signature validation code in place, test cards work, order updates on payment
- [ ] **Agent 4 (Automation):** Email templates created, triggers configured, MailPoet/SendGrid hooked up, test emails deliver
- [ ] **Deployment (You):** Domain live, SSL verified, all 4 components wired together, 8 smoke tests PASS, go-live ready

**Status:** Ready for agents to deploy.

---

**Document version:** 1.0  
**Created:** 2026-06-29  
**For:** coconiczy Ordering System Deployment
