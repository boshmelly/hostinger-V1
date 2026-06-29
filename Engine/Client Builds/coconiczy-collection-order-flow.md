# coconiczy Collection-Only Order Flow — Complete Design

> **Role:** Collection Flow Engineer
> **Scope:** Cart → Collection Details + Time Slot → Payment → Confirmation & Status Tracking
> **Context:** coconiczy Cookout, collection-only, no delivery, Stripe payment, order status machine
> **Target:** Mobile-friendly, clear UX, complete schema + flow logic

---

## Table of Contents

1. [Checkout Flow (3-Step)](##-1-checkout-flow-3-step-ui)
2. [SQL Schema](##-2-sql-schema)
3. [Time Slot Logic](##-3-time-slot-logic)
4. [Order Status State Machine](##-4-order-status-state-machine)
5. [Integration Points](##-5-integration-points)
6. [Mobile UX Patterns](##-6-mobile-ux-patterns)

---

## 1. Checkout Flow (3-Step UI)

### Step 1: Cart Review

**Screen:** `/checkout/cart`

**Purpose:** Confirm items, quantities, modifiers, and total before moving to collection details.

**Mobile Layout:**
```
┌─────────────────────────┐
│   coconiczy Cookout     │
│   Your Order            │
├─────────────────────────┤
│                         │
│  Pulled Pork (Large)    │
│  Chipotle sauce x1      │
│  £12.99                 │
│  [─ ○ +]  [✕]           │
│                         │
│  Loaded Fries x2        │
│  £7.98                  │
│  [─ ○ +]  [✕]           │
│                         │
│  Coleslaw x1            │
│  £3.99                  │
│  [─ ○ +]  [✕]           │
│                         │
├─────────────────────────┤
│  Subtotal       £24.96  │
│  Service fee    £1.00   │
├─────────────────────────┤
│  Total          £25.96  │
├─────────────────────────┤
│                         │
│  [Continue to Pickup]   │
│                         │
└─────────────────────────┘
```

**Elements:**
- Item card: name, modifiers (displayed), quantity, price
- Quantity picker: [-] [count] [+] buttons
- Remove button: [✕]
- Subtotal + service fee breakdown (transparent)
- CTA: "Continue to Pickup" (large, full-width)
- "Continue Shopping" link (optional, returns to menu)

**Validation:**
- Min 1 item to proceed
- Quantity > 0 for each item
- No expired items in cart

**State:** `cart_items` array in session/localStorage:
```javascript
{
  item_id: "pulled-pork",
  name: "Pulled Pork",
  price: 1299, // pence
  quantity: 1,
  modifiers: [
    { name: "Size", value: "Large", price_adjustment: 0 },
    { name: "Sauce", value: "Chipotle", price_adjustment: 50 }
  ]
}
```

---

### Step 2: Pickup Details + Time Slot

**Screen:** `/checkout/pickup-details`

**Purpose:** Collect customer info, confirm pickup location, select time slot.

**Mobile Layout:**
```
┌─────────────────────────┐
│   Pickup Details        │
│   Step 2 of 3           │
├─────────────────────────┤
│                         │
│  Your Details           │
│  ─────────────────────  │
│                         │
│  Full Name *            │
│  [________________]     │
│                         │
│  Phone Number *         │
│  [________________]     │
│  (for pickup call)      │
│                         │
│  Email *                │
│  [________________]      │
│  (order confirmation)   │
│                         │
├─────────────────────────┤
│  Pickup Location        │
│  ─────────────────────  │
│                         │
│  coconiczy Cookout      │
│  123 High Street        │
│  London N1 1XX          │
│  ✓ Fixed location       │
│                         │
├─────────────────────────┤
│  Pickup Time *          │
│  ─────────────────────  │
│                         │
│  Date:                  │
│  [Today      ▼]         │
│                         │
│  Time slot:             │
│  ○ 5:30 PM - 6:00 PM   │
│  ○ 6:00 PM - 6:30 PM   │
│  ● 6:30 PM - 7:00 PM   │
│  ○ 7:00 PM - 7:30 PM   │
│  ○ 7:30 PM - 8:00 PM   │
│                         │
│  Order notes (optional) │
│  [________________]     │
│  e.g. extra napkins     │
│                         │
├─────────────────────────┤
│  [Cancel]  [Review Pay] │
│                         │
└─────────────────────────┘
```

**Elements:**

**Customer Details Section:**
- Full Name (text input, required)
- Phone Number (tel input, required, E.164 format)
- Email (email input, required)

**Pickup Location Section:**
- Fixed location display (read-only):
  - coconiczy Cookout
  - 123 High Street, London N1 1XX
  - Map link (optional Google Maps embed)

**Pickup Time Section:**
- Date picker: Today, Tomorrow, +2 days, +3 days, etc.
  - Disable past dates
  - Max 7 days ahead
- Time slots (radio buttons):
  - Generated from opening hours (e.g., 5:30 PM – 9:00 PM in 30-min slots)
  - Show availability: "only 3 slots left today" warning
  - Grey out sold-out or past slots
  - Format: "H:MM AM/PM" (12-hour, UK friendly)

**Order Notes Section:**
- Optional text area (max 200 chars)
- Placeholder: "e.g. extra napkins, allergies"

**Navigation:**
- [Cancel]: Back to cart
- [Review & Pay]: Proceed to Step 3

**Validation:**
```
if !name.trim() → "Full name is required"
if !phone.match(/^\+?[0-9]{10,15}$/) → "Valid phone required"
if !email.match(RFC5322) → "Valid email required"
if !pickup_date → "Pickup date is required"
if !pickup_time → "Pickup time is required"
if pickup_time is in the past → "This time has passed"
if pickup_time is after closing → "Pickup after closing hours"
```

**State:** `checkout_form` in session:
```javascript
{
  customer_name: "John Smith",
  customer_phone: "+447700123456",
  customer_email: "john@example.com",
  pickup_location: "coconiczy_main",
  pickup_date: "2026-06-29", // ISO 8601
  pickup_time_slot: "18:30-19:00",
  order_notes: "Extra napkins please"
}
```

---

### Step 3: Review & Payment

**Screen:** `/checkout/payment`

**Purpose:** Final review of order, customer details, and payment with Stripe.

**Mobile Layout:**
```
┌─────────────────────────┐
│   Review & Pay          │
│   Step 3 of 3           │
├─────────────────────────┤
│                         │
│  Order Summary          │
│  ─────────────────────  │
│                         │
│  Pulled Pork (L)        │
│  Chipotle sauce x1      │
│          £12.99         │
│                         │
│  Loaded Fries x2        │
│          £7.98          │
│                         │
│  Coleslaw x1            │
│          £3.99          │
│                         │
├─────────────────────────┤
│  Pickup Details         │
│  ─────────────────────  │
│                         │
│  Name: John Smith       │
│  Phone: +447700...      │
│  Email: john@ex...      │
│  [Edit]                 │
│                         │
│  Location:              │
│  123 High Street        │
│  London N1 1XX          │
│                         │
│  Pickup: Today 6:30 PM  │
│  [Edit]                 │
│                         │
│ "Extra napkins please"  │
│                         │
├─────────────────────────┤
│  Subtotal      £24.96   │
│  Service fee   £1.00    │
├─────────────────────────┤
│  TOTAL         £25.96   │
├─────────────────────────┤
│                         │
│  Payment Method         │
│  ─────────────────────  │
│                         │
│  ┌─────────────────────┐│
│  │ [Stripe Card Form]  ││
│  │                     ││
│  │ Card number         ││
│  │ [________________]  ││
│  │                     ││
│  │ Expiry    CVC       ││
│  │ [____]    [___]     ││
│  │                     ││
│  │ Name on card        ││
│  │ [________________]  ││
│  │                     ││
│  │ Billing postcode    ││
│  │ [________________]  ││
│  │                     ││
│  └─────────────────────┘│
│                         │
│  ☐ I agree to terms    │
│                         │
│  [Cancel]               │
│  [Confirm Payment]      │
│                         │
└─────────────────────────┘
```

**Sections:**

**Order Summary:**
- Read-only item list with prices
- Subtotal + service fee breakdown
- Grand total (highlighted)

**Pickup Details (Read-Only):**
- Customer name, phone (masked), email (masked)
- Location (static, uneditable)
- Pickup date + time
- Order notes
- Edit button: links back to Step 2

**Payment Section:**
- Stripe Embedded Form or Card Element
  - Card number
  - Expiry (MM/YY)
  - CVC
  - Cardholder name
  - Billing postcode
- Terms & conditions checkbox (required)
- Payment buttons:
  - [Cancel]: Back to Step 2
  - [Confirm Payment]: Submits to Stripe

**Error Handling:**
```
Payment declined:
  ┌─────────────────────┐
  │ ❌ Payment Failed   │
  │                     │
  │ Your card was       │
  │ declined. Please    │
  │ try another card.   │
  │                     │
  │ Error: [specific]   │
  │                     │
  │ [Retry]  [Cancel]   │
  └─────────────────────┘

Network timeout:
  ┌─────────────────────┐
  │ ⏳ Payment Pending  │
  │                     │
  │ We're processing    │
  │ your payment.       │
  │ Don't close this.   │
  │                     │
  │ [Wait]  [Help]      │
  └─────────────────────┘
```

**State:** `payment_intent` in backend:
```javascript
{
  stripe_payment_intent_id: "pi_xxxxx",
  order_id: "coconiczy_2026062901",
  amount: 2596, // pence
  currency: "gbp",
  customer_email: "john@example.com",
  status: "requires_payment_method" // → "succeeded"
}
```

---

## 2. SQL Schema

### Orders Table

```sql
CREATE TABLE orders (
  -- Primary & metadata
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(32) UNIQUE NOT NULL,  -- coconiczy_2026062901
  
  -- Customer info
  customer_name VARCHAR(128) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,  -- E.164 format
  customer_email VARCHAR(255) NOT NULL,
  
  -- Pickup details
  pickup_location_id INT UNSIGNED NOT NULL,  -- Foreign key: locations table
  pickup_date DATE NOT NULL,  -- ISO 8601, e.g., 2026-06-29
  pickup_time_slot VARCHAR(11) NOT NULL,  -- "HH:MM-HH:MM", e.g., "18:30-19:00"
  order_notes TEXT,
  
  -- Pricing (in pence, to avoid float precision issues)
  subtotal_pence INT UNSIGNED NOT NULL,  -- e.g., 2496
  service_fee_pence INT UNSIGNED NOT NULL,  -- e.g., 100
  total_pence INT UNSIGNED NOT NULL,  -- subtotal + service_fee
  
  -- Payment & status
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  order_status ENUM('pending', 'paying', 'preparing', 'ready', 'collected', 'cancelled') DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_charge_id VARCHAR(255) UNIQUE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  paid_at TIMESTAMP NULL,  -- When payment succeeded
  marked_ready_at TIMESTAMP NULL,  -- When staff marked ready
  collected_at TIMESTAMP NULL,  -- When customer picked up (manual)
  
  -- Indexes for query performance
  INDEX idx_order_number (order_number),
  INDEX idx_customer_email (customer_email),
  INDEX idx_pickup_date (pickup_date),
  INDEX idx_order_status (order_status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at),
  INDEX idx_pickup_datetime (pickup_date, pickup_time_slot)
);
```

### Order Items Table

```sql
CREATE TABLE order_items (
  -- Primary & foreign key
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  
  -- Item reference (denormalized for audit trail — don't rely on menu updates)
  menu_item_id INT UNSIGNED NOT NULL,  -- Reference to menu_items table
  menu_item_name VARCHAR(255) NOT NULL,  -- "Pulled Pork" (snapshot)
  menu_item_price_pence INT UNSIGNED NOT NULL,  -- £12.99 = 1299
  
  -- Quantity and modifiers
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  
  -- Modifiers (stored as JSON for flexibility)
  modifiers JSON,  -- Example:
                   -- [
                   --   {"name": "Size", "value": "Large", "price_adjustment_pence": 0},
                   --   {"name": "Sauce", "value": "Chipotle", "price_adjustment_pence": 50}
                   -- ]
  
  -- Line item total (price_pence * quantity + modifier adjustments)
  line_total_pence INT UNSIGNED NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_menu_item_id (menu_item_id)
);
```

### Locations Table (Reference)

```sql
CREATE TABLE locations (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,  -- "coconiczy Cookout Main"
  address_line_1 VARCHAR(255) NOT NULL,  -- "123 High Street"
  address_line_2 VARCHAR(255),
  city VARCHAR(128) NOT NULL,  -- "London"
  postal_code VARCHAR(20) NOT NULL,  -- "N1 1XX"
  country VARCHAR(2) DEFAULT 'GB',
  phone VARCHAR(20),
  email VARCHAR(255),
  
  -- Pickup hours (times in HH:MM 24-hour format)
  opening_time TIME NOT NULL,  -- "17:30"
  closing_time TIME NOT NULL,  -- "22:00"
  time_slot_interval_minutes INT DEFAULT 30,  -- Generate 30-min slots
  
  -- Capacity & settings
  max_orders_per_slot INT,  -- NULL = unlimited
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Example Data

```sql
-- Locations
INSERT INTO locations (name, address_line_1, city, postal_code, opening_time, closing_time, time_slot_interval_minutes)
VALUES (
  'coconiczy Cookout',
  '123 High Street',
  'London',
  'N1 1XX',
  '17:30',  -- 5:30 PM
  '22:00',  -- 10:00 PM
  30
);

-- Orders
INSERT INTO orders (order_number, customer_name, customer_phone, customer_email, pickup_location_id, pickup_date, pickup_time_slot, subtotal_pence, service_fee_pence, total_pence, payment_status, order_status, stripe_payment_intent_id)
VALUES (
  'coconiczy_2026062901',
  'John Smith',
  '+447700123456',
  'john@example.com',
  1,
  '2026-06-29',
  '18:30-19:00',
  2496,
  100,
  2596,
  'pending',
  'paying',
  'pi_1234567890abcdef'
);

-- Order Items
INSERT INTO order_items (order_id, menu_item_id, menu_item_name, menu_item_price_pence, quantity, modifiers, line_total_pence)
VALUES
  (1, 101, 'Pulled Pork', 1299, 1, '[{"name":"Size","value":"Large","price_adjustment_pence":0},{"name":"Sauce","value":"Chipotle","price_adjustment_pence":50}]', 1349),
  (1, 102, 'Loaded Fries', 399, 2, '[]', 798),
  (1, 103, 'Coleslaw', 399, 1, '[]', 399);
```

---

## 3. Time Slot Logic

### Slot Generation Algorithm

**Input:**
- Location: coconiczy Cookout (opens 5:30 PM, closes 10:00 PM, 30-min slots)
- Selected date: 2026-06-29

**Output:**
- Array of available time slots, with availability flags

```pseudocode
function generateTimeSlots(location, selected_date):
  
  // Get location settings
  opening_time = location.opening_time      // 17:30
  closing_time = location.closing_time      // 22:00
  interval_minutes = location.time_slot_interval_minutes  // 30
  max_orders = location.max_orders_per_slot  // null = unlimited
  
  slots = []
  current_time = opening_time
  
  while current_time < closing_time:
    slot_end = add_minutes(current_time, interval_minutes)
    slot_key = format_time_range(current_time, slot_end)  // "17:30-18:00"
    
    // Check: is this slot in the past?
    slot_datetime = combine_date_time(selected_date, current_time)
    if slot_datetime <= NOW():
      slot.is_past = true
      slot.is_available = false
      slot.reason = "This time has already passed"
    else:
      slot.is_past = false
    
    // Check: is this slot after closing?
    if slot_end > closing_time:
      slot.is_after_hours = true
      slot.is_available = false
      slot.reason = "Pickup after closing time"
    else:
      slot.is_after_hours = false
    
    // Check: slot capacity (if limit set)
    if max_orders is not null:
      booked_count = count_orders(location, selected_date, slot_key)
      if booked_count >= max_orders:
        slot.is_full = true
        slot.is_available = false
        slot.reason = "This slot is fully booked"
        slot.booked_of_max = "5/5"
      else:
        slot.is_full = false
        slot.booked_of_max = "${booked_count}/${max_orders}"
    else:
      slot.is_full = false
      slot.booked_of_max = null
    
    // Aggregate availability
    if !slot.is_past and !slot.is_after_hours and !slot.is_full:
      slot.is_available = true
    
    // Add user-friendly label
    slot.label = format_12hour(current_time) + " - " + format_12hour(slot_end)  // "5:30 PM - 6:00 PM"
    
    slots.append({
      time_slot_key: slot_key,
      label: slot.label,
      is_available: slot.is_available,
      is_past: slot.is_past,
      is_after_hours: slot.is_after_hours,
      is_full: slot.is_full,
      booked_of_max: slot.booked_of_max,
      reason: slot.reason
    })
    
    current_time = slot_end
  
  return slots
```

### Date Selection Rules

```pseudocode
function generateAvailableDates(location):
  available_dates = []
  
  // Start from today
  current_date = TODAY()
  
  for day_offset in range(0, 7):  // Up to 7 days ahead
    check_date = current_date + day_offset
    
    // Is the location open on this date?
    // (Example: closed Mondays, or closed during holidays)
    if location.is_closed_on(check_date):
      continue
    
    // Check if at least one slot is available on this date
    has_available_slot = false
    for slot in generateTimeSlots(location, check_date):
      if slot.is_available:
        has_available_slot = true
        break
    
    if has_available_slot:
      available_dates.append({
        date: check_date,
        label: format_date(check_date)  // "Today", "Tomorrow", "Tuesday, Jun 30"
      })
  
  return available_dates
```

### Backend Validation (Before Order Creation)

```pseudocode
function validatePickupTime(location, pickup_date, pickup_time_slot):
  
  // Reconstruct the time from slot string "HH:MM-HH:MM"
  [start_time, end_time] = parse_time_slot(pickup_time_slot)
  slot_datetime = combine_date_time(pickup_date, start_time)
  
  // 1. Is this time in the future?
  if slot_datetime <= NOW():
    raise ValidationError("Pickup time cannot be in the past")
  
  // 2. Is the location open at this time?
  if start_time < location.opening_time or end_time > location.closing_time:
    raise ValidationError("Pickup time is outside business hours")
  
  // 3. Is the slot capacity exceeded?
  if location.max_orders_per_slot is not null:
    booked_count = count_orders(
      location_id = location.id,
      pickup_date = pickup_date,
      pickup_time_slot = pickup_time_slot,
      status = ['paying', 'paid', 'preparing', 'ready']  // Active orders only
    )
    if booked_count >= location.max_orders_per_slot:
      raise ValidationError("This time slot is fully booked")
  
  // 4. Is the location closed on this date?
  if location.is_closed_on(pickup_date):
    raise ValidationError("Location is closed on this date")
  
  return true
```

### SQL Queries for Slot Availability

```sql
-- Count booked orders in a time slot
SELECT COUNT(*) as booked_count
FROM orders
WHERE pickup_location_id = ?
  AND pickup_date = ?
  AND pickup_time_slot = ?
  AND order_status IN ('paying', 'paid', 'preparing', 'ready');

-- Find all available slots on a date
SELECT DISTINCT pickup_time_slot
FROM (
  SELECT TIME_FORMAT(SEC_TO_TIME(opening_seconds + (n * interval_seconds)), '%H:%i') as start_time
  FROM (
    SELECT 
      TIME_TO_SEC(TIME(locations.opening_time)) as opening_seconds,
      TIME_TO_SEC(TIME(locations.closing_time)) as closing_seconds,
      locations.time_slot_interval_minutes * 60 as interval_seconds
    FROM locations
    WHERE id = ?
  ) as times
  CROSS JOIN (
    SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
    UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
  ) as numbers
  WHERE opening_seconds + (n * interval_seconds) < closing_seconds
) as slots
LEFT JOIN orders ON orders.pickup_location_id = ?
  AND orders.pickup_date = ?
  AND orders.pickup_time_slot = CONCAT(start_time, '-', TIME_FORMAT(SEC_TO_TIME(TIME_TO_SEC(TIME(start_time)) + interval_seconds), '%H:%i'))
  AND orders.order_status IN ('paying', 'paid', 'preparing', 'ready')
GROUP BY start_time
HAVING COUNT(orders.id) < COALESCE(?, 999999);
```

---

## 4. Order Status State Machine

### Status Diagram

```
                      ┌─────────────────────────────────────┐
                      │         Order Created               │
                      │     (pending / payment pending)     │
                      └────────────────┬────────────────────┘
                                       │
                 ┌─────────────────────┴──────────────────────┐
                 │                                            │
          [Customer pays via Stripe]              [Payment fails or timeout]
                 │                                            │
                 ▼                                            ▼
        ┌─────────────────┐                         ┌──────────────────┐
        │ paying / paid    │                         │ pending / failed  │
        │ (order confirmed)│                         │ (auto-cancel     │
        └────────┬────────┘                          │  after 30 min)   │
                 │                                   └──────────────────┘
                 │
        [Staff marks ready]
                 │
                 ▼
        ┌─────────────────┐
        │   preparing     │
        │  (in progress)  │
        └────────┬────────┘
                 │
        [Staff marks ready]
                 │
                 ▼
        ┌─────────────────┐
        │     ready       │
        │ (waiting for    │
        │  collection)    │
        └────────┬────────┘
                 │
        [Customer picks up]
                 │
                 ▼
        ┌─────────────────┐
        │   collected     │
        │  (completed)    │
        └─────────────────┘

Any state → refunded (customer service issues refund via dashboard)
Any state → cancelled (customer cancels, staff cancels, system timeout)
```

### State Table

| From State | To State | Trigger | Conditions | Notes |
|---|---|---|---|---|
| `pending` | `paying` | Stripe Payment Intent created | Customer enters card, submits | Payment UI shows |
| `paying` | `paid` | `payment_intent.succeeded` webhook | Stripe confirms payment | Email sent, kitchen notified |
| `paying` | `failed` | `payment_intent.payment_failed` webhook OR timeout (30 min) | Card declined or network error | Offer retry or cancel |
| `failed` | `paying` | Customer retries payment | Form resubmitted | Same as original flow |
| `failed` | `cancelled` | Auto-cancel or customer cancels | Order expired (30 min) | No refund needed |
| `paid` | `preparing` | Staff marks in dashboard | Order page shows status | No email sent (paid → preparing auto) |
| `preparing` | `ready` | Staff marks in dashboard | Order page shows status | Email sent: "Your order is ready" |
| `ready` | `collected` | Staff marks in dashboard (manual) | Order completed | Review request email (after 1 hour) |
| Any | `refunded` | Customer service issues refund | Stripe refund webhook fires | Update `payment_status = refunded` |
| Any | `cancelled` | Customer/staff cancels | Before pickup time | Refund if paid |

### State Transitions: Pseudocode

```pseudocode
class OrderStatusMachine:
  
  function transitionState(order, new_status, trigger_data):
    current_status = order.order_status
    current_payment_status = order.payment_status
    
    // Validate transition is allowed
    if !isValidTransition(current_status, new_status):
      raise InvalidTransitionError("Cannot go from ${current_status} to ${new_status}")
    
    // Pre-transition logic
    match (new_status):
      case "paying":
        // Create Stripe Payment Intent
        payment_intent = stripe.paymentIntents.create({
          amount: order.total_pence,
          currency: "gbp",
          customer_email: order.customer_email,
          metadata: { order_id: order.order_number }
        })
        order.stripe_payment_intent_id = payment_intent.id
        
      case "paid":
        // Mark paid timestamp
        order.paid_at = NOW()
        order.payment_status = "paid"
        
        // Send confirmation email
        sendOrderConfirmationEmail(order)
        
        // Notify kitchen (optional: push to kitchen display system)
        notifyKitchen(order)
        
      case "preparing":
        // No email sent; status update to kitchen only
        
      case "ready":
        // Mark ready timestamp
        order.marked_ready_at = NOW()
        
        // Send "ready for pickup" email
        sendReadyNotificationEmail(order)
        
        // (Optional) SMS to customer
        if order.customer_opted_in_sms:
          sendSMS(order.customer_phone, "Your order is ready for pickup")
        
      case "collected":
        // Mark collected timestamp
        order.collected_at = NOW()
        
        // Schedule review request email (1 hour after pickup time)
        scheduleReviewRequestEmail(order, delay = 1 hour)
        
      case "cancelled":
        // If paid, trigger refund
        if order.payment_status == "paid":
          stripe.refunds.create({
            payment_intent: order.stripe_payment_intent_id
          })
          // Status updated on refund webhook
        
      case "refunded":
        order.payment_status = "refunded"
    
    // Update order
    order.order_status = new_status
    order.updated_at = NOW()
    order.save()
    
    // Audit log
    logTransition(order.id, current_status, new_status, trigger_data)
    
    return order
  
  function isValidTransition(from_state, to_state):
    allowed = {
      "pending": ["paying", "cancelled"],
      "paying": ["paid", "failed", "cancelled"],
      "failed": ["paying", "cancelled"],
      "paid": ["preparing", "refunded", "cancelled"],
      "preparing": ["ready", "refunded", "cancelled"],
      "ready": ["collected", "refunded", "cancelled"],
      "collected": ["refunded"]
    }
    return to_state in allowed[from_state]
  
  function autoTimeoutUnpaidOrders():
    // Run every 5 minutes (cron job or queue)
    expired_orders = db.query("""
      SELECT * FROM orders
      WHERE order_status IN ('pending', 'paying', 'failed')
        AND created_at < NOW() - INTERVAL 30 MINUTE
    """)
    
    for order in expired_orders:
      transitionState(order, "cancelled", { reason: "auto_timeout" })
```

### Order Confirmation Email Triggers

```pseudocode
function sendOrderConfirmationEmail(order):
  email_html = render_template("order_confirmation_email.html", {
    order_number: order.order_number,
    items: order.items,
    total: format_currency(order.total_pence / 100),
    pickup_date: format_date(order.pickup_date),
    pickup_time_slot: order.pickup_time_slot,
    location: order.location,
    status_page_url: generate_order_status_url(order.id, order.customer_email),
    order_notes: order.order_notes
  })
  
  send_email({
    to: order.customer_email,
    subject: "Your coconiczy Cookout order is confirmed (#" + order.order_number + ")",
    html: email_html,
    reply_to: "coconiczy@example.com",
    tracking: true
  })

function sendReadyNotificationEmail(order):
  email_html = render_template("order_ready_email.html", {
    order_number: order.order_number,
    location: order.location,
    status_page_url: generate_order_status_url(order.id, order.customer_email)
  })
  
  send_email({
    to: order.customer_email,
    subject: "Your order #" + order.order_number + " is ready for pickup!",
    html: email_html,
    reply_to: "coconiczy@example.com"
  })

function scheduleReviewRequestEmail(order, delay):
  // Schedule to send 1 hour after pickup_time_slot ends
  pickup_datetime = combine_date_time(
    order.pickup_date, 
    parse_time_slot(order.pickup_time_slot).end_time
  )
  send_time = pickup_datetime + delay
  
  queue_email({
    to: order.customer_email,
    subject: "How was your coconiczy Cookout order?",
    template: "review_request_email.html",
    template_data: {
      order_number: order.order_number,
      google_review_url: generate_google_review_url(),
      on_site_review_url: generate_review_form_url()
    },
    send_at: send_time,
    priority: "normal"
  })
```

---

## 5. Integration Points

### Stripe Webhook Handling

**Endpoint:** `POST /api/webhooks/stripe`

**Handler Logic:**

```pseudocode
function handleStripeWebhook(webhook_event):
  
  // Verify webhook signature (security-critical)
  if !verifyStripeSignature(webhook_event, request.headers["stripe-signature"]):
    return 403 Forbidden
  
  match webhook_event.type:
    case "payment_intent.succeeded":
      payment_intent = webhook_event.data.object
      order = orders.findBy(stripe_payment_intent_id = payment_intent.id)
      
      if order.order_status == "paying":
        order_machine.transitionState(order, "paid", {
          trigger: "stripe_webhook",
          payment_intent_id: payment_intent.id,
          charge_id: payment_intent.charges.data[0].id
        })
    
    case "payment_intent.payment_failed":
      payment_intent = webhook_event.data.object
      order = orders.findBy(stripe_payment_intent_id = payment_intent.id)
      
      if order.order_status in ["paying", "pending"]:
        order_machine.transitionState(order, "failed", {
          trigger: "stripe_webhook",
          error: payment_intent.last_payment_error.message
        })
    
    case "charge.refunded":
      charge = webhook_event.data.object
      order = orders.findBy(stripe_charge_id = charge.id)
      
      if charge.refunded:
        order_machine.transitionState(order, "refunded", {
          trigger: "stripe_webhook_refund",
          refund_id: charge.refunds.data[0].id
        })
  
  return 200 OK
```

### Staff Dashboard (Order Management)

**Endpoint:** `GET/POST /dashboard/orders`

**Staff Actions:**
1. View all orders for today + upcoming days (filtered by status)
2. Mark order as "preparing" (transition: `paid` → `preparing`)
3. Mark order as "ready" (transition: `preparing` → `ready`)
4. Mark order as "collected" (transition: `ready` → `collected`)
5. Cancel or refund order (transition: any → `cancelled` / `refunded`)

**UI Mock:**
```
coconiczy Order Dashboard

Today's Orders: 12

Status Filters:
[All] [Paying] [Paid] [Preparing] [Ready] [Collected]

┌─────────────────────────────────────────────────────────────┐
│ Order #coconiczy_2026062901  |  John Smith  |  6:30 PM      │
├─────────────────────────────────────────────────────────────┤
│ Status: Paid (paid 2 min ago)                               │
├─────────────────────────────────────────────────────────────┤
│ Items:                                                      │
│  • Pulled Pork (L, Chipotle) x1                             │
│  • Loaded Fries x2                                          │
│  • Coleslaw x1                                              │
│ Total: £25.96                                               │
├─────────────────────────────────────────────────────────────┤
│ Notes: Extra napkins please                                 │
├─────────────────────────────────────────────────────────────┤
│ [Mark Preparing]  [Mark Ready]  [Mark Collected]  [Refund]  │
└─────────────────────────────────────────────────────────────┘
```

### Customer Order Status Page

**Endpoint:** `GET /orders/:order_id?email=:email`

**Purpose:** Customer can check status without login

**Query string:** `?order_id=coconiczy_2026062901&email=john@example.com` (validates owner)

**Status Display:**
```
Your Order #coconiczy_2026062901

┌──────────────────┐
│   Confirmed      │ ✓ (Paid £25.96)
└──────────────────┘
         │
         ▼
┌──────────────────┐
│  Being prepared  │ ⏳ (since 3 min ago)
└──────────────────┘
         │
         ▼
┌──────────────────┐
│     Ready!       │ ⭕
└──────────────────┘

Pickup: Today at 6:30 PM
Location: 123 High Street, London N1 1XX
Phone: +44 (0)20 XXXX XXXX (to notify when ready)

[View order details]
```

---

## 6. Mobile UX Patterns

### Layout: Mobile-First Design

```css
/* Breakpoints */
mobile:       < 640px (default)
tablet:       640px - 1024px
desktop:     > 1024px

/* Mobile: Full-width, single column */
@media (max-width: 639px) {
  .checkout-container {
    width: 100%;
    padding: 0 16px;
    max-width: 100%;
  }
}

/* Tablet & up: Centered content */
@media (min-width: 640px) {
  .checkout-container {
    max-width: 500px;
    margin: 0 auto;
  }
}
```

### Touch-Friendly Components

```
Button sizing (minimum):
- Touch target: 44px x 44px
- Padding between buttons: 12px

Spacing:
- Section padding: 16px
- Item padding: 12px
- Input height: 48px

Text:
- Body: 16px (readable without zoom)
- Labels: 14px
- Buttons: 16px, bold

Form inputs:
- Input type="tel" for phone (numeric keyboard)
- Input type="email" for email (email keyboard)
- Input type="date" for date picker (native picker)
```

### Input Validation & Error States

**Mobile Error Pattern:**
```
┌─────────────────────────┐
│ Full Name *             │
│ [________________]      │ ❌
│ Full name is required   │
│ (red text)              │
└─────────────────────────┘
```

**Real-time Validation:**
- Phone: validate format as user types
- Email: basic @ check as user types
- Name: require > 2 characters
- Show error below field (not modal)

### Loading & Async States

```
Submitting payment:
┌─────────────────────────┐
│  [Confirm Payment]      │ (disabled, loading spinner)
│  Processing payment...  │
│                         │
│  Don't close this page  │
└─────────────────────────┘

Success toast (bottom):
┌─────────────────────────┐
│ ✓ Order confirmed!      │ (auto-dismiss, 3s)
└─────────────────────────┘

Error toast (bottom, red):
┌─────────────────────────┐
│ ❌ Payment failed       │ (stays until dismissed)
│ Try another card        │
│ [Dismiss]               │
└─────────────────────────┘
```

### Back Button Behavior

- Step 1 (Cart) → [Cancel] goes to menu
- Step 2 (Details) → [Cancel] goes to Step 1 (cart preserved)
- Step 3 (Payment) → [Cancel] goes to Step 2 (form preserved)

**Browser back button:** Same as [Cancel] — preserve form state

---

## 7. Implementation Checklist

### Database
- [ ] Create `orders` table with indexes
- [ ] Create `order_items` table with JSON modifier support
- [ ] Create `locations` table with hours + capacity
- [ ] Add sample data (coconiczy location)

### Cart (Step 1)
- [ ] Implement cart state (session/localStorage)
- [ ] Display items with modifiers + quantity controls
- [ ] Calculate subtotal + service fee
- [ ] Remove item functionality
- [ ] Validation before proceeding

### Pickup Details (Step 2)
- [ ] Form fields: name, phone, email
- [ ] Date picker (today → +7 days)
- [ ] Time slot generation from location hours
- [ ] Past/after-hours slot filtering
- [ ] Capacity checking (if limit set)
- [ ] Order notes textarea
- [ ] Form validation + error display

### Payment (Step 3)
- [ ] Review section (read-only order summary)
- [ ] Edit links back to Step 2
- [ ] Stripe Card Element / Embedded Form
- [ ] Terms & conditions checkbox
- [ ] Payment submission
- [ ] Error handling (declined, timeout, network)
- [ ] Success screen with order #

### Webhooks & Backend
- [ ] Stripe webhook endpoint (/api/webhooks/stripe)
- [ ] Webhook signature verification
- [ ] Payment intent creation flow
- [ ] Order status transitions (paying → paid)
- [ ] Email service integration (SendGrid/MailPoet)
- [ ] Order confirmation email
- [ ] Ready notification email
- [ ] Review request email (scheduled)

### Staff Dashboard
- [ ] Order list view (filtered by status)
- [ ] Order detail view
- [ ] Action buttons (mark preparing, ready, collected)
- [ ] Refund button + confirmation
- [ ] Real-time status updates (optional: WebSocket)

### Customer Status Page
- [ ] Public status page (email-based access)
- [ ] Status timeline visualization
- [ ] Pickup details display
- [ ] Real-time status updates

### Testing
- [ ] End-to-end test: cart → payment → confirmation
- [ ] Test time slot logic (past times, after hours, capacity)
- [ ] Test order state machine (all transitions)
- [ ] Test Stripe webhook handling (test key)
- [ ] Test email sending (confirmation, ready, review)
- [ ] Mobile responsiveness (all breakpoints)
- [ ] Form validation (all fields)

---

## 8. Technical Notes

### Why This Design?

1. **3-Step Checkout:** Reduces cognitive load, mobile-optimized, each step focused
2. **Time Slot Pre-generation:** Prevents booking conflicts, handles capacity, respects hours
3. **State Machine:** Clear order progression, prevents invalid transitions, audit trail
4. **JSON Modifiers:** Flexible, searchable (if needed later), immutable per-order record
5. **Webhook-Driven Status:** Stripe is source of truth for payment, orders react to events
6. **Email on Every Status:** Keeps customer informed, reduces support questions

### Security Considerations

- **Payment Intent Metadata:** Only store `order_id`, no sensitive customer data in Stripe
- **Webhook Signature Verification:** Always validate stripe-signature header
- **Customer Data Isolation:** Order status page requires email verification (basic auth)
- **Service Fee Non-Negotiable:** Calculated server-side, never client-submitted
- **Rate Limiting:** Protect webhook endpoint, checkout API, status page lookup

### Performance Optimizations

- **Indexes:** `pickup_date`, `order_status`, `payment_status`, `created_at` for fast queries
- **Caching:** Location hours + time slots cached (5 min TTL)
- **Async Email:** Queue email tasks, don't send synchronously on request
- **Batch Webhook Processing:** If high volume, use queue instead of direct DB update

### Future Enhancements

1. **SMS Notifications:** Twilio integration for confirmation + ready alerts
2. **Live Order Tracking:** WebSocket for kitchen display system + customer live status
3. **Loyalty Rewards:** Track repeat customers, offer discounts
4. **Advance Orders:** Book pickup weeks ahead (with deposit)
5. **Multi-Location:** Expand to multiple coconiczy Cookout sites
6. **Waitlist:** When slot capacity full, add to waitlist with auto-notification
7. **Analytics:** Track popular items, peak times, customer lifetime value

---

## Files to Create/Update

```
Backend:
  /database/schema.sql                    (orders, order_items, locations tables)
  /api/orders/create.php                  (create order, validate time slot)
  /api/orders/[id]/status.php             (get order status, public endpoint)
  /api/webhooks/stripe.php                (webhook handler)
  /services/StripeService.php             (payment intent, refund logic)
  /services/EmailService.php              (send confirmation, ready, review emails)
  /services/TimeSlotService.php           (generate slots, validate)
  /cron/timeout_unpaid_orders.php         (auto-cancel after 30 min)

Frontend:
  /checkout/cart.html                     (Step 1)
  /checkout/pickup-details.html           (Step 2)
  /checkout/payment.html                  (Step 3)
  /checkout/confirmation.html             (After payment)
  /orders/status.html                     (Customer status page)
  /js/checkout.js                         (Cart state, form validation)
  /js/time-slots.js                       (Slot generation, availability)
  /js/stripe-integration.js               (Payment Intent, error handling)
  /css/checkout.css                       (Mobile-first styling)

Staff:
  /dashboard/orders.php                   (Order list + detail)
  /dashboard/orders/[id]/actions.php      (Mark ready, collected, refund)
```

---

## Summary

This collection-only order flow provides:

1. **Clear 3-step checkout** optimized for mobile with cart review, pickup details, and payment
2. **Robust time slot logic** that prevents overbooking, respects location hours, and blocks past times
3. **Complete SQL schema** with proper indexing for performance and audit trail
4. **State machine** that enforces valid order progression (pending → paying → preparing → ready → collected)
5. **Email automation** triggered on payment, status changes, and review requests
6. **Security-first webhook handling** with signature verification
7. **Mobile-friendly UX** with touch-friendly inputs, real-time validation, and clear error states

Ready to hand off to the Deployment Lead for integration with WooCommerce + WordPress on Hostinger VPS.

---

**Design by:** Collection Flow Engineer
**Date:** 2026-06-29
**Status:** Ready for Implementation
**Next Agent:** Stripe Integration Specialist (webhook + payment logic) → Automation Builder (emails) → Deployment Lead (integration)
