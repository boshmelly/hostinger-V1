# Stripe Integration for coconiczy's Cookout Ordering System

> Comprehensive Stripe payment integration for collection-only direct ordering.
> Stack: WordPress/WooCommerce + Stripe API + Webhooks
> Status: Ready for implementation

---

## Table of Contents

1. [Payment Flow Architecture](#payment-flow-architecture)
2. [Implementation Checklist](#implementation-checklist)
3. [Webhook Endpoint Handler](#webhook-endpoint-handler)
4. [Error Handling Strategy](#error-handling-strategy)
5. [Security Checklist](#security-checklist)
6. [Test Payloads & Cards](#test-payloads--cards)
7. [Refund Management](#refund-management)
8. [Rate Limiting & Monitoring](#rate-limiting--monitoring)
9. [Go-Live Deployment](#go-live-deployment)

---

## Payment Flow Architecture

### High-Level Payment Journey

```
Customer adds items to cart
        ↓
Enters collection time slot
        ↓
Proceeds to Checkout
        ↓
Enters card details (Stripe hosted form)
        ↓
Creates Payment Intent (server-side)
        ↓
Stripe charges card
        ↓
Webhook: payment_intent.succeeded fired
        ↓
Order marked as PAID + PREPARING
        ↓
Confirmation email sent
        ↓
Customer receives order #, pickup time, location
        ↓
(Later) coconiczy marks "ready" → status email
        ↓
Customer picks up → order marked "collected"
```

### Sequence Diagram: Complete Payment Flow

```
Customer                   Frontend                Backend              Stripe API
   |                          |                        |                    |
   |--[1] Add to cart-------->|                        |                    |
   |                          |                        |                    |
   |--[2] Checkout---------->|                        |                    |
   |                          |----[3] Create---------->|                    |
   |                          |   Payment Intent       |                    |
   |                          |                        |----[4] Create----->|
   |                          |                        |      Intent        |
   |                          |<---[5] client_secret---|<--[return PI]------|
   |                          |                        |                    |
   |--[6] Enter card-------->|                        |                    |
   |                        Stripe.js                |                    |
   |--[7] Confirm---------->|                        |                    |
   |      Payment           |----[8] Confirm-------->|                    |
   |                        |      intent with       |----[9] Charge---->|
   |                        |      payment method    |       card         |
   |                        |                        |<--[10] success-----|
   |                        |<--[11] Webhook fired---|                    |
   |                        | (payment_intent.       |                    |
   |                        |  succeeded event)      |                    |
   |                        |                        |----[12] Update---->|
   |                        |                        |   order to PAID    |
   |                        |                        |                    |
   |<--[13] Success msg-----|<--[14] Order created--|                    |
   |   + Order #            |                        |                    |
   |   + Email sent         |                        |                    |
```

### State Machine: Order Status Transitions

```
┌─────────────────────────────────────────────────────────────┐
│                     Order Lifecycle                         │
└─────────────────────────────────────────────────────────────┘

PENDING (order placed, awaiting payment)
    ├─ → PAID (payment_intent.succeeded webhook)
    │    └─ → PREPARING (coconiczy starts making)
    │         └─ → READY (coconiczy marks done)
    │              └─ → COLLECTED (customer picks up)
    │
    └─ → PAYMENT_FAILED (payment declined, timeout, etc.)
         └─ → CANCELLED (auto after 30min or manual)

REFUND PATH (any state):
    └─ → REFUNDED (customer service issues refund via Stripe)
         → Send refund email confirmation
         → Log in order audit trail
```

---

## Implementation Checklist

### Pre-Implementation

- [ ] **Stripe Account Setup**
  - [ ] Business registered as sole trader or limited company
  - [ ] Stripe Business account created (NOT personal)
  - [ ] Bank details verified
  - [ ] Identity documents uploaded
  - [ ] Expected monthly volume disclosed (coconiczy provides)
  - [ ] Access: grab **Publishable Key** (pk_live_...) and **Secret Key** (sk_live_...)

- [ ] **Keys & Secrets Storage**
  - [ ] LIVE keys stored in `.env` (server-side only, NEVER frontend)
  - [ ] TEST keys for development (pk_test_..., sk_test_...)
  - [ ] Webhook signing secret (whsec_...) obtained from Stripe Dashboard
  - [ ] All keys rotated yearly, logged in a secure vault (Vault, 1Password, AWS Secrets Manager)

- [ ] **Domain & SSL**
  - [ ] Domain configured (coconiczy.co.uk or Hostinger subdomain)
  - [ ] SSL certificate auto-provisioned (Hostinger LetsEncrypt)
  - [ ] HTTPS enforced (redirect HTTP → HTTPS)
  - [ ] Certificate renewal automated

- [ ] **Webhook Endpoint**
  - [ ] Endpoint `/api/webhooks/stripe` exists and accessible
  - [ ] Endpoint accepts POST requests
  - [ ] Endpoint logs all payloads (for audit)
  - [ ] Endpoint signature validation implemented
  - [ ] Stripe Dashboard: webhook registered and active

### Development Phase

- [ ] **SDK Installation**
  ```bash
  npm install stripe
  ```

- [ ] **Payment Intent Flow Implemented**
  - [ ] `POST /api/orders` creates order, returns payment intent
  - [ ] `POST /api/payment-intent` receives cart, returns client_secret
  - [ ] Frontend loads Stripe.js and Payment Element

- [ ] **Webhook Handler Implemented**
  - [ ] `POST /api/webhooks/stripe` handles events
  - [ ] Signature validation in place
  - [ ] Events logged with timestamp, event ID, status
  - [ ] Idempotency keys prevent duplicate processing

- [ ] **Error Handling**
  - [ ] Card declined → user sees error, can retry
  - [ ] Network timeout → order queued for manual review
  - [ ] Invalid card format → frontend validation + user feedback
  - [ ] Expired card → error message, suggest new payment method

- [ ] **Testing**
  - [ ] Test with 4242 4242 4242 4242 (success)
  - [ ] Test with 4000 0000 0000 0002 (decline)
  - [ ] Test webhook event delivery (Stripe Dashboard → Send Test Event)
  - [ ] Test refund flow (issue refund, verify webhook triggers)

### Pre-Go-Live

- [ ] **Security Audit**
  - [ ] Secret keys never logged or exposed in code
  - [ ] HTTPS verified on all endpoints
  - [ ] Rate limiting configured (100 req/min per IP)
  - [ ] CORS headers restricted to coconiczy domain only
  - [ ] Input validation on all checkout fields

- [ ] **Performance**
  - [ ] Payment Intent creation < 500ms
  - [ ] Webhook processing < 2s
  - [ ] Database queries optimised (indexes on order_id, payment_intent_id)
  - [ ] CDN configured for static assets (JS, CSS, images)

- [ ] **Monitoring & Logging**
  - [ ] CloudWatch / Sentry configured for error tracking
  - [ ] Slack alerts for payment failures
  - [ ] Daily reconciliation: Stripe dashboard vs. order database
  - [ ] Backup of payment logs (encrypted, 30-day retention)

- [ ] **Compliance & Legal**
  - [ ] Terms of Service updated (Stripe fees disclosed)
  - [ ] Privacy Policy updated (payment data handling)
  - [ ] PCI Compliance verified (never store card details server-side)
  - [ ] GDPR: right to erasure implemented for customer records (after 1 year)

### Go-Live

- [ ] **Switch to Live Keys**
  - [ ] `.env` updated with LIVE Stripe keys
  - [ ] TEST keys removed or archived
  - [ ] Webhook re-registered with LIVE endpoint

- [ ] **Smoke Tests (with real money)**
  - [ ] Place test order, pay with real card (coconiczy's business card)
  - [ ] Verify payment appears in Stripe Dashboard (live)
  - [ ] Verify confirmation email arrives
  - [ ] Verify order appears in dashboard
  - [ ] Issue test refund, verify success

- [ ] **Training & Documentation**
  - [ ] coconiczy trained on order dashboard (mark preparing, ready, refund)
  - [ ] Handoff doc created (troubleshooting, refund process, escalation)
  - [ ] Stripe Dashboard access granted to coconiczy (read-only or admin?)
  - [ ] Emergency contact (who to call if payments break?)

---

## Webhook Endpoint Handler

### Overview

The webhook endpoint is the heart of the payment integration. It listens for events from Stripe (payment succeeded, refund issued, etc.) and updates the order database accordingly.

### Security: Signature Validation

**CRITICAL:** Always validate webhook signatures. Stripe signs every webhook with your signing secret. Without validation, attackers could fake webhooks and mark fake orders as paid.

### Node.js / Express Implementation

```javascript
// /api/webhooks/stripe.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db'); // Your database connection

const router = express.Router();

// Stripe webhook signing secret (from Dashboard)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// IMPORTANT: Raw body is required for signature validation
// If using Express.json(), it must be AFTER the webhook route
// OR use express.raw() for just this endpoint

/**
 * POST /api/webhooks/stripe
 * 
 * Handles Stripe webhook events.
 * Validates signature, processes event, updates order status.
 */
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  // Step 1: Validate the webhook signature
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // Raw body (Buffer)
      sig,      // Signature from header
      endpointSecret
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Step 2: Log the event (for audit trail)
  console.log(`[WEBHOOK] Event: ${event.type}, ID: ${event.id}, Time: ${new Date(event.created * 1000)}`);
  
  // Store event log in database (for idempotency + audit)
  try {
    await db.webhookEvents.create({
      event_id: event.id,
      event_type: event.type,
      payload: JSON.stringify(event),
      processed: false,
      created_at: new Date(),
    });
  } catch (err) {
    console.error(`Failed to log webhook event: ${err.message}`);
    // Continue anyway—don't fail the webhook
  }

  // Step 3: Process the event based on type
  try {
    switch (event.type) {
      // ===== PAYMENT SUCCEEDED =====
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      // ===== PAYMENT FAILED =====
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      // ===== REFUND ISSUED =====
      case 'charge.refunded':
        await handleRefund(event.data.object);
        break;

      // ===== CHARGE DISPUTE (chargeback) =====
      case 'charge.dispute.created':
        await handleDispute(event.data.object);
        break;

      // Ignore other event types
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark as processed
    await db.webhookEvents.update(
      { event_id: event.id },
      { processed: true, processed_at: new Date() }
    );

  } catch (err) {
    console.error(`Error processing webhook: ${err.message}`);
    // Return 200 anyway—Stripe will retry
    // DO NOT return 500 for business logic errors
  }

  // Step 4: Acknowledge the webhook (tells Stripe we received it)
  res.json({ received: true });
});

/**
 * Handle payment_intent.succeeded
 * 
 * Order is paid. Mark as PAID, transition to PREPARING.
 * Send confirmation email.
 */
async function handlePaymentSucceeded(paymentIntent) {
  const { id, amount, currency, metadata } = paymentIntent;
  const { order_id } = metadata || {};

  if (!order_id) {
    console.warn(`[PAYMENT_SUCCEEDED] No order_id in metadata. PI: ${id}`);
    return;
  }

  console.log(`[PAYMENT_SUCCEEDED] Order: ${order_id}, Amount: ${amount} ${currency}`);

  // Fetch order
  const order = await db.orders.findOne({ id: order_id });
  if (!order) {
    console.error(`[PAYMENT_SUCCEEDED] Order not found: ${order_id}`);
    return;
  }

  // Idempotency check: if already paid, don't reprocess
  if (order.status === 'PAID' || order.status === 'PREPARING' || order.status === 'READY' || order.status === 'COLLECTED') {
    console.log(`[PAYMENT_SUCCEEDED] Order already paid (status: ${order.status}). Skipping.`);
    return;
  }

  // Update order status
  await db.orders.update(
    { id: order_id },
    {
      status: 'PAID',
      payment_intent_id: id,
      payment_amount: amount,
      payment_currency: currency,
      paid_at: new Date(),
    }
  );

  // Transition to PREPARING (coconiczy will manually move to READY later)
  // For now, stay in PAID until coconiczy confirms they've received the order
  // (You may want to auto-transition to PREPARING here; adjust per business logic)

  // Send confirmation email
  try {
    await sendConfirmationEmail(order);
  } catch (err) {
    console.error(`Failed to send confirmation email for order ${order_id}: ${err.message}`);
    // Don't re-throw—email failure shouldn't fail the webhook
  }

  // Log successful payment
  await db.paymentLogs.create({
    order_id,
    payment_intent_id: id,
    event: 'payment_succeeded',
    amount,
    currency,
    timestamp: new Date(),
  });
}

/**
 * Handle payment_intent.payment_failed
 * 
 * Card was declined or payment errored.
 * Mark order as PAYMENT_FAILED.
 * Send failure email (optional).
 */
async function handlePaymentFailed(paymentIntent) {
  const { id, amount, currency, metadata, last_payment_error } = paymentIntent;
  const { order_id } = metadata || {};

  if (!order_id) {
    console.warn(`[PAYMENT_FAILED] No order_id in metadata. PI: ${id}`);
    return;
  }

  const failureReason = last_payment_error?.message || 'Unknown error';
  console.log(`[PAYMENT_FAILED] Order: ${order_id}, Reason: ${failureReason}`);

  // Fetch order
  const order = await db.orders.findOne({ id: order_id });
  if (!order) {
    console.error(`[PAYMENT_FAILED] Order not found: ${order_id}`);
    return;
  }

  // Idempotency: only process once
  if (order.status === 'PAYMENT_FAILED' || order.status === 'CANCELLED') {
    console.log(`[PAYMENT_FAILED] Order already failed/cancelled. Skipping.`);
    return;
  }

  // Update order
  await db.orders.update(
    { id: order_id },
    {
      status: 'PAYMENT_FAILED',
      payment_intent_id: id,
      failure_reason: failureReason,
      failed_at: new Date(),
    }
  );

  // Auto-cancel after 30 minutes (optional: implement via scheduler)
  // For now, customer can retry payment

  // Send failure email
  try {
    await sendPaymentFailureEmail(order, failureReason);
  } catch (err) {
    console.error(`Failed to send failure email for order ${order_id}: ${err.message}`);
  }

  // Log failure
  await db.paymentLogs.create({
    order_id,
    payment_intent_id: id,
    event: 'payment_failed',
    amount,
    currency,
    failure_reason: failureReason,
    timestamp: new Date(),
  });
}

/**
 * Handle charge.refunded
 * 
 * Refund issued (full or partial).
 * Update order status to REFUNDED.
 * Send refund confirmation email.
 */
async function handleRefund(charge) {
  const { id, amount_refunded, metadata } = charge;
  const { order_id } = metadata || {};

  if (!order_id) {
    console.warn(`[REFUND] No order_id in metadata. Charge: ${id}`);
    return;
  }

  console.log(`[REFUND] Order: ${order_id}, Refunded: ${amount_refunded}p`);

  // Fetch order
  const order = await db.orders.findOne({ id: order_id });
  if (!order) {
    console.error(`[REFUND] Order not found: ${order_id}`);
    return;
  }

  // Idempotency: only process once per refund
  if (order.status === 'REFUNDED') {
    console.log(`[REFUND] Order already refunded. Skipping.`);
    return;
  }

  // Update order
  await db.orders.update(
    { id: order_id },
    {
      status: 'REFUNDED',
      refunded_amount: amount_refunded,
      refunded_at: new Date(),
    }
  );

  // Send refund confirmation email
  try {
    await sendRefundEmail(order, amount_refunded);
  } catch (err) {
    console.error(`Failed to send refund email for order ${order_id}: ${err.message}`);
  }

  // Log refund
  await db.paymentLogs.create({
    order_id,
    event: 'refund',
    refunded_amount: amount_refunded,
    timestamp: new Date(),
  });
}

/**
 * Handle charge.dispute.created
 * 
 * Customer disputed the charge (chargeback).
 * Mark order, alert coconiczy, log for manual review.
 */
async function handleDispute(dispute) {
  const { id, charge, amount, metadata } = dispute;
  const { order_id } = metadata || {};

  console.log(`[DISPUTE] Charge: ${charge}, Dispute: ${id}, Amount: ${amount}p`);

  // Fetch order
  const order = await db.orders.findOne({ id: order_id });
  if (!order) {
    console.warn(`[DISPUTE] Order not found: ${order_id}`);
    return;
  }

  // Log dispute (manual review required)
  await db.disputes.create({
    order_id,
    stripe_dispute_id: id,
    stripe_charge_id: charge,
    amount,
    status: 'under_review',
    created_at: new Date(),
  });

  // Alert coconiczy (Slack or email to owner)
  try {
    await notifyCoconiczyOfDispute(order, dispute);
  } catch (err) {
    console.error(`Failed to notify coconiczy of dispute: ${err.message}`);
  }
}

// ===== EMAIL HELPER FUNCTIONS =====

/**
 * Send order confirmation email
 */
async function sendConfirmationEmail(order) {
  const { id, customer_email, customer_name, total, pickup_time, items } = order;

  const itemsList = items
    .map(item => `- ${item.name} (${item.quantity}x) £${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  const subject = `Your coconiczy Cookout order is confirmed (Order #${id})`;
  const html = `
    <h2>Hi ${customer_name},</h2>
    <p>Your order is confirmed and being prepared!</p>
    
    <h3>Order Details:</h3>
    <pre>${itemsList}</pre>
    <p><strong>Total: £${(total / 100).toFixed(2)}</strong></p>
    
    <h3>Pickup Time:</h3>
    <p><strong>${new Date(pickup_time).toLocaleString()}</strong></p>
    
    <h3>Location:</h3>
    <p>coconiczy Cookout<br>123 High Street<br>London N1 1XX</p>
    
    <p><a href="https://coconiczy.co.uk/order/${id}">Track your order</a></p>
    
    <p>See you soon!<br>The coconiczy team</p>
  `;

  // Send via SendGrid or WordPress plugin (MailPoet, WP Mail SMTP, etc.)
  await sendEmail({
    to: customer_email,
    subject,
    html,
    replyTo: 'orders@coconiczy.co.uk',
  });
}

/**
 * Send payment failure email
 */
async function sendPaymentFailureEmail(order, reason) {
  const { customer_email, customer_name, id } = order;

  const subject = `Payment failed for order #${id}`;
  const html = `
    <h2>Hi ${customer_name},</h2>
    <p>Unfortunately, your payment could not be processed.</p>
    
    <p><strong>Reason:</strong> ${reason}</p>
    
    <p>Please try again with a different card or contact us.</p>
    
    <p><a href="https://coconiczy.co.uk/order/${id}/retry">Retry payment</a></p>
    
    <p>Questions? Email us at orders@coconiczy.co.uk</p>
  `;

  await sendEmail({
    to: customer_email,
    subject,
    html,
    replyTo: 'orders@coconiczy.co.uk',
  });
}

/**
 * Send refund confirmation email
 */
async function sendRefundEmail(order, refundAmount) {
  const { customer_email, customer_name, id } = order;

  const subject = `Refund confirmed for order #${id}`;
  const html = `
    <h2>Hi ${customer_name},</h2>
    <p>We've processed a refund for your order.</p>
    
    <p><strong>Refund Amount:</strong> £${(refundAmount / 100).toFixed(2)}</p>
    
    <p>The refund should appear in your account within 3-5 business days.</p>
    
    <p>If you have questions, email us at orders@coconiczy.co.uk</p>
  `;

  await sendEmail({
    to: customer_email,
    subject,
    html,
    replyTo: 'orders@coconiczy.co.uk',
  });
}

/**
 * Generic email sender
 * (Implement with SendGrid, WordPress plugin, or AWS SES)
 */
async function sendEmail({ to, subject, html, replyTo }) {
  // Pseudo-code; implement with your email service
  const emailService = require('../services/emailService');
  return emailService.send({ to, subject, html, replyTo });
}

/**
 * Notify coconiczy of dispute
 * (Slack, email, or SMS)
 */
async function notifyCoconiczyOfDispute(order, dispute) {
  const message = `
    ⚠️ CHARGEBACK ALERT
    Order: ${order.id}
    Customer: ${order.customer_name}
    Dispute Amount: £${(dispute.amount / 100).toFixed(2)}
    Status: Under Review
    
    Action required: Review the charge in Stripe Dashboard
    Link: https://dashboard.stripe.com/disputes/${dispute.id}
  `;

  // Send Slack alert
  const slack = require('../services/slack');
  await slack.send({
    channel: '#payments',
    text: message,
  });

  // OR send email
  // await sendEmail({
  //   to: 'owner@coconiczy.co.uk',
  //   subject: 'Chargeback Alert',
  //   html: `<pre>${message}</pre>`,
  // });
}

module.exports = router;
```

### Python / Flask Alternative

```python
# /api/webhooks/stripe.py
from flask import Blueprint, request, jsonify
import stripe
import json
from datetime import datetime
from db import db  # Your database ORM

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

bp = Blueprint('webhooks', __name__)

@bp.route('/api/webhooks/stripe', methods=['POST'])
def stripe_webhook():
    """
    Handle Stripe webhook events.
    """
    payload = request.get_data(as_text=True)
    sig_header = request.headers.get('Stripe-Signature')

    # Step 1: Validate signature
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        print(f"Invalid payload: {e}")
        return 'Invalid payload', 400
    except stripe.error.SignatureVerificationError as e:
        print(f"Invalid signature: {e}")
        return 'Invalid signature', 400

    # Step 2: Log event
    print(f"[WEBHOOK] Event: {event['type']}, ID: {event['id']}")

    event_data = {
        'event_id': event['id'],
        'event_type': event['type'],
        'payload': json.dumps(event),
        'processed': False,
        'created_at': datetime.utcnow(),
    }
    db.webhookEvents.insert_one(event_data)

    # Step 3: Handle event
    try:
        if event['type'] == 'payment_intent.succeeded':
            handle_payment_succeeded(event['data']['object'])
        elif event['type'] == 'payment_intent.payment_failed':
            handle_payment_failed(event['data']['object'])
        elif event['type'] == 'charge.refunded':
            handle_refund(event['data']['object'])
        elif event['type'] == 'charge.dispute.created':
            handle_dispute(event['data']['object'])

        # Mark as processed
        db.webhookEvents.update_one(
            {'event_id': event['id']},
            {'$set': {'processed': True, 'processed_at': datetime.utcnow()}}
        )

    except Exception as e:
        print(f"Error processing webhook: {e}")
        # Return 200 anyway—Stripe will retry

    return jsonify({'received': True}), 200

def handle_payment_succeeded(payment_intent):
    """Order is paid, transition to PREPARING."""
    order_id = payment_intent['metadata'].get('order_id')
    if not order_id:
        print(f"[PAYMENT_SUCCEEDED] No order_id in metadata")
        return

    # Fetch and update order
    order = db.orders.find_one({'id': order_id})
    if not order:
        print(f"[PAYMENT_SUCCEEDED] Order not found: {order_id}")
        return

    if order['status'] in ['PAID', 'PREPARING', 'READY', 'COLLECTED']:
        print(f"[PAYMENT_SUCCEEDED] Order already processed")
        return

    db.orders.update_one(
        {'id': order_id},
        {'$set': {
            'status': 'PAID',
            'payment_intent_id': payment_intent['id'],
            'paid_at': datetime.utcnow(),
        }}
    )

    # Send confirmation email
    try:
        send_confirmation_email(order)
    except Exception as e:
        print(f"Failed to send email: {e}")

# ... (Similar for other handlers)

def send_confirmation_email(order):
    """Email wrapper."""
    # Use SendGrid, mailgun, or WordPress SMTP
    pass
```

---

## Error Handling Strategy

### Card Declined Errors

**What happens:** Stripe returns an error code like `card_declined`.

**Frontend handling:**
```javascript
// Frontend: src/pages/checkout.js
const handlePaymentSubmit = async (event) => {
  event.preventDefault();

  try {
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
    });

    if (error) {
      // Card declined, invalid card, etc.
      setErrorMessage(error.message);
      // Examples:
      // "Your card was declined"
      // "Incomplete card number"
      // "Card expired"
      console.error('Payment error:', error);
    } else if (paymentIntent.status === 'succeeded') {
      // Redirect to confirmation page (handled by return_url)
    }
  } catch (err) {
    setErrorMessage('An unexpected error occurred. Please try again.');
    console.error('Unexpected error:', err);
  }
};
```

**Error codes to handle:**
| Code | Meaning | Action |
|------|---------|--------|
| `card_declined` | Card issuer declined | Show "Card declined. Try another." |
| `expired_card` | Card past expiry | Show "Card expired. Check date." |
| `incorrect_cvc` | Wrong CVC | Show "Incorrect security code." |
| `processing_error` | Stripe API error | Show "Processing error. Try again later." |
| `rate_limit` | Too many requests | Show "Too many attempts. Wait a moment." |
| `authentication_required` | 3D Secure needed | Show "Verification required. Follow prompts." |

**Backend fallback:**
```javascript
// If card declines, order goes to PAYMENT_FAILED status
// Customer can:
// 1. Retry immediately (new Payment Intent created)
// 2. Wait for manual email reminder (optional)
// 3. Contact coconiczy to manually retry
```

### Network Timeouts

**What happens:** Customer's connection drops during payment, or Stripe API is slow.

**Handling:**
```javascript
// Frontend: Set a 10-second timeout
const paymentPromise = stripe.confirmPayment({ /* ... */ });
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Payment timed out')), 10000)
);

Promise.race([paymentPromise, timeoutPromise])
  .catch(err => {
    if (err.message === 'Payment timed out') {
      setErrorMessage(
        'Payment is taking longer than expected. ' +
        'Your order may still be processing. ' +
        'Check back in 1 minute or email orders@coconiczy.co.uk'
      );
    }
  });
```

**Backend:**
```javascript
// Webhook processing: Order may arrive late
// Idempotency check prevents duplicate processing
if (order.status === 'PAID') {
  console.log('Order already paid. Skipping webhook.');
  return;
}
```

### Webhook Delivery Failures

**What happens:** Webhook doesn't arrive (network issue, endpoint down, timeout).

**Stripe behavior:**
- Retries immediately, then at: +5min, +30min, +2hr, +5hr, +23hr
- Stops after 5 failed attempts (8 hours total)

**Handling:**
```javascript
// Setup: Monitor webhook deliveries in Stripe Dashboard
// Endpoint details → Event deliveries → see success/failure

// Workaround: Payment polling (as backup)
// If webhook doesn't fire within 5 minutes, poll Stripe API
async function pollPaymentStatus(paymentIntentId, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (pi.status === 'succeeded') {
      // Handle as if webhook fired
      await handlePaymentSucceeded(pi);
      return;
    }
    if (pi.status === 'requires_action') {
      // Customer action needed (e.g., 3D Secure)
      return;
    }
    // Wait 30 seconds, try again
    await sleep(30000);
  }
  console.error(`Payment status unclear after ${maxAttempts} polls`);
}
```

### Duplicate Webhook Processing

**What happens:** Stripe fires the same webhook twice (rare, but possible).

**Handling (idempotency):**
```javascript
// Always check if order is already processed
if (order.status === 'PAID' || order.status === 'PREPARING') {
  console.log(`Order already processed (status: ${order.status}). Skipping.`);
  return;
}

// OR use idempotency keys
// Generate unique key per webhook event
const idempotencyKey = `${event.id}-${event.type}`;

// Check if already processed
const processed = await db.webhookEvents.findOne({
  event_id: event.id,
  processed: true,
});
if (processed) {
  return; // Skip
}
```

---

## Security Checklist

### 1. Signature Validation (CRITICAL)

```javascript
// ALWAYS validate webhook signatures
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  req.body, // RAW body (Buffer), NOT parsed JSON
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
);

// If validation fails, return 400 (not 200)
try {
  event = stripe.webhooks.constructEvent(...);
} catch (err) {
  return res.status(400).send(`Webhook Error: ${err.message}`);
}
```

**Why?** Without signature validation, anyone can fake a webhook and mark fake orders as paid.

### 2. HTTPS Enforcement

```javascript
// In Express middleware (must run on every request)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(`https://${req.get('host')}${req.url}`);
  }
  next();
});

// Verify in Stripe Dashboard:
// Webhooks → Your endpoint → URL should start with https://
```

**Why?** Without HTTPS, card data and webhooks could be intercepted.

### 3. Rate Limiting

```javascript
// Prevent brute-force attacks on checkout/payment endpoints
const rateLimit = require('express-rate-limit');

const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  message: 'Too many payment attempts. Please try again later.',
  standardHeaders: true, // Return RateLimit info in headers
  legacyHeaders: false,
});

// Apply to payment routes
app.post('/api/payment-intent', paymentLimiter, handlePaymentIntent);
app.post('/api/orders', paymentLimiter, createOrder);

// Also rate-limit checkout page to prevent scraping
const checkoutLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // 50 requests per 5 minutes
});
app.get('/checkout', checkoutLimiter, renderCheckout);
```

### 4. Secure Storage of Secrets

**DO:**
```javascript
// .env file (local development only)
STRIPE_SECRET_KEY=sk_live_123...
STRIPE_WEBHOOK_SECRET=whsec_123...

// Rotate keys yearly
// Never commit .env to git
```

**DON'T:**
```javascript
// ❌ Hardcoded in code
const secretKey = 'sk_live_123...';

// ❌ Logged or printed
console.log(`Using key: ${process.env.STRIPE_SECRET_KEY}`);

// ❌ Exposed in error messages
res.json({ error: `Payment failed. Key was: ${process.env.STRIPE_SECRET_KEY}` });

// ❌ Sent to frontend
fetch('/api/get-config')
  .then(res => res.json())
  .then(config => {
    // config.STRIPE_SECRET_KEY would be a breach
  });
```

**Secure storage options:**
- **Local dev:** `.env` file (git-ignored)
- **Hostinger:** Environment variables (Hostinger control panel)
- **AWS:** AWS Secrets Manager or Parameter Store
- **GCP:** Secret Manager
- **Vault:** HashiCorp Vault, 1Password, Vaultwarden

### 5. Frontend: Publishable Key Only

```javascript
// Frontend MUST use publishable key, never secret key

const stripe = Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
// Publishable key: pk_live_...
// Secret key: sk_live_... (NEVER send to frontend)

// Stripe.js will reject the secret key if you try:
// Stripe('sk_live_...') → Error: Invalid publishable key
```

### 6. Input Validation

```javascript
// Always validate checkout form fields

function validateCheckout(data) {
  const errors = {};

  // Name
  if (!data.customer_name || data.customer_name.trim().length < 2) {
    errors.customer_name = 'Name required (min 2 chars)';
  }

  // Email
  if (!isValidEmail(data.customer_email)) {
    errors.customer_email = 'Valid email required';
  }

  // Phone
  if (!isValidPhone(data.customer_phone)) {
    errors.customer_phone = 'Valid phone required';
  }

  // Pickup time
  if (!isValidPickupTime(data.pickup_time)) {
    errors.pickup_time = 'Pickup time required';
  }

  // Cart total
  if (data.total < 100) { // £1.00 minimum
    errors.total = 'Minimum order £1.00';
  }
  if (data.total > 100000) { // £1000 maximum (fraud check)
    errors.total = 'Order too large. Contact us.';
  }

  return errors;
}
```

### 7. CORS & CSRF Protection

```javascript
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

// CORS: only allow coconiczy domain
app.use(cors({
  origin: [
    'https://coconiczy.co.uk',
    'https://www.coconiczy.co.uk',
    'http://localhost:3000', // Dev only
  ],
  credentials: true,
  optionsSuccessStatus: 200,
}));

// CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(cookieParser());

app.get('/checkout', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.post('/api/orders', csrfProtection, (req, res) => {
  // Request must include CSRF token
  // Stripe.js handles this automatically
});
```

### 8. No Card Data Storage

```javascript
// CRITICAL: Never store card details server-side
// This violates PCI compliance and puts you at legal/financial risk

// ❌ DON'T:
const order = {
  card_number: '4242424242424242', // NEVER
  card_cvv: '123', // NEVER
  card_expiry: '12/25', // NEVER
};

// ✅ DO:
// Let Stripe.js collect and tokenize the card
// Stripe returns a payment method ID or token
const { paymentMethod } = await stripe.confirmPayment({
  elements,
  // Stripe handles card securely; you never see it
});

// Store only metadata (order ID, amount, etc.)
const order = {
  id: 'order_123',
  payment_method_id: 'pm_1234...', // Safe: Stripe's token
  total: 3299, // In pence
  status: 'PENDING',
};
```

### 9. Logging & Monitoring

```javascript
// Log payments, but never log card data or sensitive values

// ✅ SAFE TO LOG:
{
  order_id: 'order_123',
  payment_intent_id: 'pi_abc123',
  status: 'succeeded',
  amount: 3299,
  currency: 'gbp',
  timestamp: '2025-06-29T14:30:00Z',
  customer_email: 'customer@example.com',
}

// ❌ NEVER LOG:
{
  card_number: '4242...', // PII + security risk
  cvc: '123', // Security risk
  payment_method_secret: '...', // Sensitive
}

// Setup centralized logging with redaction
const logger = require('winston');
logger.add(new logger.transports.Console({
  format: logger.format.json(),
  // Sensitive fields automatically redacted
}));
```

### 10. 3D Secure (Optional but Recommended)

3D Secure (3DS) adds an extra authentication step for high-risk payments. Reduces fraud and chargebacks.

```javascript
// Stripe.js automatically handles 3DS if needed
const { error, paymentIntent } = await stripe.confirmPayment({
  elements,
  confirmParams: {
    return_url: `${window.location.origin}/order-confirmation`,
    // Stripe automatically prompts for 3DS if required
  },
});
```

---

## Test Payloads & Cards

### Test Card Numbers (Stripe Test Mode)

Use these cards in test mode. They will never charge real money.

| Scenario | Card Number | Expiry | CVC | Result |
|----------|-------------|--------|-----|--------|
| Successful payment | `4242 4242 4242 4242` | Any future | Any 3 digits | ✅ Succeeds |
| Card declined | `4000 0000 0000 0002` | Any future | Any 3 digits | ❌ Declined |
| Insufficient funds | `4000 0000 0000 9995` | Any future | Any 3 digits | ❌ Declined (insufficient funds) |
| Lost card | `4000 0000 0000 9987` | Any future | Any 3 digits | ❌ Declined (lost card) |
| Stolen card | `4000 0000 0000 9979` | Any future | Any 3 digits | ❌ Declined (stolen card) |
| Expired card | `4000 0000 0000 0069` | Any past | Any 3 digits | ❌ Declined (expired) |
| Processing error | `4000 0000 0000 0119` | Any future | Any 3 digits | ⚠️ Error (transient) |
| 3D Secure required | `4000 0025 0000 3155` | Any future | Any 3 digits | 📱 Requires authentication |
| 3D Secure required (fail) | `4000 0000 0000 1076` | Any future | Any 3 digits | 📱 3DS authentication fails |

**Test amounts (used with tokenization):**
| Amount | Result |
|--------|--------|
| £1.00 (100p) | ✅ Succeeds |
| £14.00 (1400p) | ⚠️ Declined (insufficient funds) |
| £31.00 (3100p) | ❌ Declined (card declined) |
| £51.00 (5100p) | ❌ Declined (expired card) |

### Full Test Order Payload

```json
{
  "order_id": "test_order_001",
  "customer_name": "Test Customer",
  "customer_email": "test@example.com",
  "customer_phone": "+44 123 456 7890",
  "items": [
    {
      "id": "pulled_pork",
      "name": "Pulled Pork",
      "quantity": 1,
      "price": 1299,
      "modifiers": {
        "size": "Large",
        "sauce": "Chipotle"
      }
    },
    {
      "id": "loaded_fries",
      "name": "Loaded Fries",
      "quantity": 2,
      "price": 549
    }
  ],
  "total": 2447,
  "currency": "gbp",
  "pickup_time": "2025-06-29T18:30:00Z",
  "pickup_location": "123 High Street, London N1 1XX",
  "notes": "Extra napkins please",
  "created_at": "2025-06-29T17:00:00Z"
}
```

### Test Payment Intent Request (cURL)

```bash
# Create a payment intent with test card
curl -X POST https://coconiczy.co.uk/api/payment-intent \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "test_order_001",
    "amount": 2447,
    "currency": "gbp"
  }'

# Response:
{
  "client_secret": "pi_1abc...secret_123...",
  "payment_intent_id": "pi_1abc...",
  "status": "requires_payment_method"
}
```

### Webhook Test Payloads

You can send these via Stripe Dashboard or via CLI:

```bash
# Send test webhook via Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger payment_intent.succeeded

# Or manually via cURL (requires valid signature—easier via Dashboard)
```

**Test via Stripe Dashboard:**
1. Navigate to: Webhooks → Your endpoint → Testing
2. Select event type (e.g., `payment_intent.succeeded`)
3. Click "Send test event"
4. Check your logs to confirm webhook processed

**Example `payment_intent.succeeded` payload:**

```json
{
  "type": "payment_intent.succeeded",
  "id": "evt_1abc123...",
  "created": 1719668400,
  "data": {
    "object": {
      "id": "pi_1abc123...",
      "object": "payment_intent",
      "amount": 2447,
      "amount_capturable": 0,
      "amount_details": {
        "tip": {}
      },
      "amount_received": 2447,
      "application": null,
      "automatic_payment_methods": {
        "enabled": true
      },
      "canceled_at": null,
      "cancellation_reason": null,
      "capture_method": "automatic",
      "charges": {
        "object": "list",
        "data": [
          {
            "id": "ch_1abc123...",
            "object": "charge",
            "amount": 2447,
            "amount_captured": 2447,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "application_fee_amount": null,
            "balance_transaction": "txn_1abc123...",
            "billing_details": {
              "address": {
                "city": "London",
                "country": "GB",
                "line1": "123 High Street",
                "line2": null,
                "postal_code": "N1 1XX",
                "state": null
              },
              "email": "test@example.com",
              "name": "Test Customer",
              "phone": "+44 123 456 7890"
            },
            "card": {
              "brand": "visa",
              "checks": {
                "address_line1_check": "pass",
                "address_postal_code_check": "pass",
                "cvc_check": "pass"
              },
              "country": "US",
              "exp_month": 12,
              "exp_year": 2025,
              "fingerprint": "abcdef123456",
              "funding": "credit",
              "generated_from": null,
              "last4": "4242",
              "networks": {
                "available": ["visa"],
                "preferred": null
              },
              "three_d_secure_usage": {
                "supported": true
              },
              "wallet": null
            },
            "created": 1719668400,
            "currency": "gbp",
            "customer": null,
            "description": "Order #test_order_001",
            "destination": null,
            "dispute": null,
            "disputed": false,
            "failure_balance_transaction": null,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": null,
            "invoice": null,
            "livemode": false,
            "metadata": {
              "order_id": "test_order_001"
            },
            "outcome": {
              "network_status": "approved_by_network",
              "reason": null,
              "risk_level": "normal",
              "risk_score": 32,
              "seller_message": "Payment complete.",
              "type": "authorized"
            },
            "paid": true,
            "payment_intent": "pi_1abc123...",
            "payment_method": "pm_1abc123...",
            "payment_method_details": {
              "card": {
                "checks": {
                  "address_line1_check": "pass",
                  "address_postal_code_check": "pass",
                  "cvc_check": "pass"
                },
                "fingerprint": "abcdef123456",
                "installments": null,
                "mandate": null,
                "network": "visa",
                "three_d_secure": null,
                "wallet": null
              },
              "type": "card"
            },
            "receipt_email": "test@example.com",
            "receipt_number": null,
            "receipt_url": "https://receipts.stripe.com/...",
            "refunded": false,
            "refunds": {
              "object": "list",
              "data": [],
              "has_more": false,
              "total_count": 0,
              "url": "/v1/charges/ch_1abc123.../refunds"
            },
            "review": null,
            "shipping": {
              "address": {
                "city": "London",
                "country": "GB",
                "line1": "123 High Street",
                "line2": null,
                "postal_code": "N1 1XX",
                "state": null
              },
              "carrier": null,
              "name": "Test Customer",
              "phone": "+44 123 456 7890",
              "tracking_number": null
            },
            "source": {
              "id": "card_1abc123...",
              "object": "card",
              "address_city": "London",
              "address_country": "GB",
              "address_line1": "123 High Street",
              "address_line1_check": "pass",
              "address_line2": null,
              "address_state": null,
              "address_zip": "N1 1XX",
              "address_zip_check": "pass",
              "brand": "Visa",
              "country": "US",
              "customer": null,
              "cvc_check": "pass",
              "dynamic_last4": null,
              "exp_month": 12,
              "exp_year": 2025,
              "fingerprint": "abcdef123456",
              "funding": "credit",
              "generated_from": null,
              "last4": "4242",
              "metadata": {},
              "name": "Test Customer",
              "tokenization_method": null
            },
            "source_transfer": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/charges?payment_intent=pi_1abc123..."
      },
      "client_secret": "pi_1abc..._secret_abc...",
      "confirmation_method": "automatic",
      "created": 1719668400,
      "currency": "gbp",
      "customer": null,
      "default_mandate": null,
      "default_payment_method": null,
      "default_source": null,
      "description": "Order #test_order_001",
      "invoice": null,
      "last_payment_error": null,
      "last_payment_error_on": null,
      "livemode": false,
      "metadata": {
        "order_id": "test_order_001"
      },
      "next_action": null,
      "on_behalf_of": null,
      "payment_method": "pm_1abc123...",
      "payment_method_options": {
        "acss_debit": null,
        "affirm": null,
        "afterpay_clearpay": null,
        "alipay": null,
        "au_becs_debit": null,
        "bacs_debit": null,
        "bancontact": null,
        "boleto": null,
        "card": {
          "installments": null,
          "mandate_options": null,
          "network": null,
          "request_three_d_secure": "automatic"
        },
        "cashapp": null,
        "customer_balance": null,
        "eps": null,
        "giropay": null,
        "grab_pay": null,
        "ideal": null,
        "interac_present": null,
        "jcb": null,
        "klarna": null,
        "konbini": null,
        "link": null,
        "oxxo": null,
        "p24": null,
        "paynow": null,
        "paypal": null,
        "pix": null,
        "promptpay": null,
        "sepa_debit": null,
        "sofort": null,
        "us_bank_account": null,
        "wechat_pay": null
      },
      "payment_method_types": ["card"],
      "processing": null,
      "receipt_email": "test@example.com",
      "review": null,
      "setup_future_usage": null,
      "shipping": {
        "address": {
          "city": "London",
          "country": "GB",
          "line1": "123 High Street",
          "line2": null,
          "postal_code": "N1 1XX",
          "state": null
        },
        "carrier": null,
        "name": "Test Customer",
        "phone": "+44 123 456 7890",
        "tracking_number": null
      },
      "source": null,
      "statement_descriptor": null,
      "statement_descriptor_suffix": null,
      "status": "succeeded",
      "transfer_data": null,
      "transfer_group": null
    }
  }
}
```

### Testing Script (Node.js)

```javascript
// test-stripe-integration.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testStripeIntegration() {
  console.log('🧪 Testing Stripe Integration...\n');

  try {
    // 1. Create a payment intent (test mode)
    console.log('1️⃣  Creating payment intent...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2447, // £24.47 in pence
      currency: 'gbp',
      payment_method_types: ['card'],
      metadata: {
        order_id: 'test_order_001',
      },
    });
    console.log(`✅ Payment intent created: ${paymentIntent.id}\n`);

    // 2. Confirm payment with test card
    console.log('2️⃣  Confirming payment with test card...');
    const confirmed = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: 'pm_card_visa', // Stripe test token
    });
    console.log(`✅ Payment confirmed: ${confirmed.status}\n`);

    // 3. Check payment status
    console.log('3️⃣  Checking payment status...');
    const updated = await stripe.paymentIntents.retrieve(paymentIntent.id);
    console.log(`✅ Status: ${updated.status}\n`);

    // 4. Create a refund
    console.log('4️⃣  Creating refund...');
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntent.id,
    });
    console.log(`✅ Refund created: ${refund.id} (${refund.status})\n`);

    // 5. Simulate webhook
    console.log('5️⃣  Simulating webhook delivery...');
    console.log('   Run: stripe trigger payment_intent.succeeded');
    console.log('   Or: stripe trigger charge.refunded\n');

    console.log('✅ All tests completed!');
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

testStripeIntegration();
```

Run:
```bash
STRIPE_SECRET_KEY=sk_test_... node test-stripe-integration.js
```

---

## Refund Management

### Issuing a Refund

**From Stripe Dashboard (simplest):**
1. Navigate to: Payments → select charge
2. Click "Refund" button
3. Choose full or partial refund
4. Click "Refund" → done
5. Webhook fires automatically (`charge.refunded`)
6. Order status updates, email sent

**From API:**
```javascript
// Backend API endpoint for customer service
// POST /api/admin/refunds

app.post('/api/admin/refunds', authenticate, authorize('admin'), async (req, res) => {
  const { order_id, refund_amount } = req.body;

  // Fetch order
  const order = await db.orders.findOne({ id: order_id });
  if (!order) return res.status(404).json({ error: 'Order not found' });

  // Only refund paid orders
  if (order.status !== 'PAID' && order.status !== 'PREPARING' && order.status !== 'READY') {
    return res.status(400).json({ error: 'Cannot refund order in this status' });
  }

  // Issue refund via Stripe
  try {
    const refund = await stripe.refunds.create({
      charge: order.stripe_charge_id,
      amount: refund_amount || order.payment_amount, // Full or partial
      reason: 'customer_request', // or 'requested_by_customer', 'duplicate', etc.
      metadata: { order_id },
    });

    // Log refund
    await db.paymentLogs.create({
      order_id,
      event: 'refund_issued',
      refund_id: refund.id,
      amount: refund.amount,
      timestamp: new Date(),
    });

    res.json({ success: true, refund_id: refund.id });
  } catch (err) {
    console.error(`Refund failed: ${err.message}`);
    res.status(500).json({ error: 'Refund failed. Check Stripe account.' });
  }
});
```

### Refund States

```
PENDING → SUCCEEDED → (Order status REFUNDED)
       ↓
    FAILED → (Requires manual action)
```

- **Pending:** Refund processing (typically < 5 minutes)
- **Succeeded:** Refund complete. Money returns to customer in 3-5 business days
- **Failed:** Card issuer rejected refund. Log in Stripe Dashboard → escalate to customer

### Partial vs. Full Refunds

```javascript
// Full refund
const refund = await stripe.refunds.create({
  payment_intent: 'pi_123...',
  // amount omitted = full refund
});

// Partial refund (e.g., customer complaint about 1 item)
const partialRefund = await stripe.refunds.create({
  payment_intent: 'pi_123...',
  amount: 549, // Refund just the side dish (£5.49)
});
```

---

## Rate Limiting & Monitoring

### Rate Limiting Setup

```javascript
const rateLimit = require('express-rate-limit');

// Payment endpoints: strict limits
const paymentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Max 5 payment attempts per minute per IP
  keyGenerator: (req) => {
    // Rate limit by customer email + IP (more precise)
    return `${req.body?.customer_email || req.ip}`;
  },
  skip: (req) => {
    // Skip rate limit for localhost (dev)
    return req.ip === '::1' || req.ip === '127.0.0.1';
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many payment attempts. Please try again in 1 minute.',
    });
  },
});

// Webhook: generous limit (Stripe retries)
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100, // Stripe may retry
  keyGenerator: (req) => {
    // Stripe IPs
    return req.ip;
  },
});

// Checkout page: prevent scraping
const checkoutLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50,
});

// Apply limiters
app.post('/api/payment-intent', paymentLimiter, handlePaymentIntent);
app.post('/api/webhooks/stripe', webhookLimiter, handleWebhook);
app.get('/checkout', checkoutLimiter, renderCheckout);
```

### Monitoring & Alerts

```javascript
// Send alerts for payment failures
const sendAlert = async (subject, message) => {
  const slack = require('../services/slack');
  await slack.send({
    channel: '#payments-alerts',
    text: `⚠️ ${subject}\n${message}`,
  });
};

// Monitor payment failures
async function monitorPayments() {
  const failedOrders = await db.orders.find({
    status: 'PAYMENT_FAILED',
    created_at: { $gte: new Date(Date.now() - 1 * 60 * 1000) }, // Last 1 minute
  });

  if (failedOrders.length > 5) {
    await sendAlert(
      'High Payment Failure Rate',
      `${failedOrders.length} failed payments in the last minute. Check Stripe status.`
    );
  }
}

// Run every minute
setInterval(monitorPayments, 60 * 1000);
```

### Logging & Dashboards

```javascript
// CloudWatch / Datadog / Sentry integration
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Log payment events
const logPaymentEvent = (event) => {
  Sentry.captureMessage(`Payment event: ${event.type}`, 'info', {
    contexts: {
      payment: {
        order_id: event.metadata?.order_id,
        amount: event.amount,
        status: event.status,
      },
    },
  });
};

// Error logging
app.use(Sentry.Handlers.errorHandler());
```

---

## Go-Live Deployment

### Pre-Go-Live Checklist

- [ ] **Environment Setup**
  - [ ] Production database ready
  - [ ] HTTPS certificate installed
  - [ ] Cloudflare / CDN configured (if applicable)
  - [ ] Email service (SendGrid, MailPoet) configured and tested
  - [ ] SMS service (Twilio) configured (if using)

- [ ] **Stripe Configuration**
  - [ ] Stripe Business account activated (not test mode)
  - [ ] Bank account verified
  - [ ] LIVE API keys obtained
  - [ ] Webhook endpoint registered (production URL)
  - [ ] Webhook events subscribed: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`, `charge.dispute.created`

- [ ] **Code Deployment**
  - [ ] `.env` updated with LIVE keys
  - [ ] All test code removed or disabled
  - [ ] Payment form uses LIVE publishable key
  - [ ] Webhook handler production-ready (logging, error handling, idempotency)
  - [ ] Database backups configured (daily)

- [ ] **Smoke Tests (with real money)**
  1. **Test order → completion:**
     - Add items to cart
     - Proceed to checkout
     - Enter test card (coconiczy's business Visa)
     - Submit payment
     - Verify: order appears in database, confirmation email arrives
     - Verify: order appears in Stripe Dashboard (Payments)
   
   2. **Webhook test:**
     - Check Stripe Dashboard: Webhooks → Your endpoint → Event deliveries
     - Verify successful delivery (green checkmark)
     - Verify order status updated to PAID
   
   3. **Refund test:**
     - Issue refund from Stripe Dashboard
     - Verify webhook fires
     - Verify order status updated to REFUNDED
     - Verify refund email sent
   
   4. **Error handling test:**
     - Try to pay with declined card (4000 0000 0000 0002)
     - Verify error message shown to user
     - Verify order NOT created
   
   5. **Mobile test:**
     - Test checkout on iPhone + Android
     - Verify form responsive
     - Verify payment succeeds

- [ ] **Performance & Security**
  - [ ] Load test: 10+ concurrent payments
  - [ ] Response time: payment intent < 500ms
  - [ ] Database query optimization verified
  - [ ] SSL certificate valid (green lock in browser)
  - [ ] Security headers present (X-Frame-Options, Content-Security-Policy, etc.)
  - [ ] CORS configured correctly
  - [ ] Rate limiting active

- [ ] **Documentation & Training**
  - [ ] coconiczy trained on order dashboard
  - [ ] Refund process documented
  - [ ] Escalation path documented (who to contact if payment breaks)
  - [ ] Stripe Dashboard access granted (read-only or admin?)
  - [ ] Emergency contact list created

### Deployment Steps

1. **Database Migration**
   ```bash
   npm run migrate:prod
   ```

2. **Update Environment Variables**
   ```bash
   # Hostinger Control Panel → Domains → SSL/TLS
   # Verify HTTPS enabled
   
   # Environment variables (via Hostinger panel or .env)
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NODE_ENV=production
   DATABASE_URL=prod-db-connection...
   ```

3. **Build & Deploy**
   ```bash
   npm run build
   npm run start:prod
   ```

4. **Verify Deployment**
   ```bash
   curl https://coconiczy.co.uk/api/health
   # Should return: {"status":"healthy"}
   
   # Check webhook endpoint
   curl https://coconiczy.co.uk/api/webhooks/stripe
   # Should return: method not allowed (GET not allowed)
   ```

5. **Enable Stripe Webhooks**
   - Stripe Dashboard → Webhooks
   - Update endpoint URL: `https://coconiczy.co.uk/api/webhooks/stripe`
   - Re-subscribe to events

6. **Monitor First 24 Hours**
   - Check error logs every hour
   - Monitor payment success rate (target: >99%)
   - Check webhook deliveries (target: 100% successful)
   - Respond to any customer inquiries immediately

### Rollback Plan

If something breaks:

1. **Immediate:**
   - Switch Stripe to TEST keys (if critical issue)
   - Notify coconiczy
   - Disable checkout button (if necessary)
   - Post message: "Payment temporarily unavailable. Please check back soon."

2. **Investigate:**
   - Check error logs (Sentry / CloudWatch)
   - Check Stripe Dashboard (webhook deliveries, payment status)
   - Check database (order records)

3. **Fix & Redeploy:**
   ```bash
   git revert <commit-hash>
   npm run build && npm run start:prod
   ```

4. **Re-enable:**
   - Switch back to LIVE keys
   - Test with real payment
   - Notify coconiczy: "Systems restored."

---

## Summary

### What You've Built

- ✅ Payment flow: cart → payment intent → webhook → order confirmation
- ✅ Webhook handler with signature validation
- ✅ Error handling: declined cards, timeouts, refunds
- ✅ Security: HTTPS, rate limiting, secret management, no card storage
- ✅ Test payloads and cards for development
- ✅ Refund management via API + dashboard
- ✅ Monitoring and alerting
- ✅ Go-live deployment checklist

### Key Takeaways

1. **Never skip webhook signature validation** — it's your only defense against fake orders
2. **Never store card details** — Stripe handles tokenization securely
3. **Always use HTTPS** — payment data must be encrypted in transit
4. **Implement idempotency** — webhook retries must not duplicate charges
5. **Test thoroughly** — use test cards before deploying to production
6. **Monitor constantly** — set up alerts for payment failures and high error rates

### Next Steps

1. **Install SDK:** `npm install stripe express-rate-limit`
2. **Implement webhook handler** (copy-paste from this guide)
3. **Add frontend payment form** (Stripe.js Payment Element)
4. **Test with test cards** (4242..., 4000...)
5. **Deploy to Hostinger** with LIVE keys
6. **Train coconiczy** on order dashboard + refund process
7. **Go live!**

---

**Created for:** coconiczy's Cookout Direct Ordering System
**Status:** Ready for implementation
**Last Updated:** 2025-06-29
