# coconiczy Order Automation System
## Email, SMS & Review Request Workflows

**Project:** coconiczy Cookout — Direct Ordering + Back Office  
**Platform Stack:** WordPress + WooCommerce + Orderable (Stripe integrated)  
**Automation Provider:** SendGrid (primary) or WordPress MailPoet plugin  
**SMS Provider:** Twilio  
**Built for:** Collection-only food ordering, direct payment, review-request automation  
**Owner:** Ola (coconiczy)  
**Date:** June 2026

---

## SECTION 1: SERVICE RECOMMENDATIONS

### Option A: SendGrid + Twilio (Recommended for scale & reliability)

**SendGrid (Email)**
- **Why:** UK-friendly, transactional + marketing automation, detailed delivery tracking
- **Cost:** Free tier (100/day), pay-as-you-grow (£0.0001–0.0005 per email)
- **WooCommerce Integration:** Seamless via SendGrid official plugin or Zapier
- **Features:** Dynamic templates, merge fields, unsubscribe management, bounce handling
- **Setup Time:** 30 mins (domain verification + API key + WooCommerce integration)

**Twilio (SMS)**
- **Why:** UK SMS delivery, reliable for time-sensitive messages, cheap per SMS
- **Cost:** £0.04–0.08 per SMS (UK), no monthly fee
- **WooCommerce Integration:** Via Twilio official plugin or Zapier
- **Features:** Scheduled sends, delivery tracking, two-way conversations (optional)
- **Setup Time:** 20 mins (API key + WooCommerce integration)

**Total Automation Cost:** £0/month + usage (typically £20–50/month at scale for coconiczy's volume)

---

### Option B: WordPress MailPoet Plugin (Simpler, all-in-one)

**MailPoet (Email only)**
- **Why:** Hosted on your VPS, no external accounts, GDPR-friendly
- **Cost:** Free tier (5,000 subscribers), £120/year (unlimited subscribers, basic automation)
- **WooCommerce Integration:** Native integration, one-click setup
- **Features:** Dynamic templates, subscriber segmentation, basic automation (trigger on purchase)
- **Limitations:** No SMS, simpler automation than SendGrid
- **Setup Time:** 15 mins (install plugin + create email list)

**For SMS:** Combine with Twilio (only SMS, not email)

**Total Automation Cost:** £120/year + Twilio usage (£0/month + £0.04–0.08 per SMS)

---

### Recommendation for coconiczy

**Use SendGrid + Twilio** if:
- You want robust delivery tracking (important for time-sensitive pickup messages)
- You expect 50+ orders/week within 6 months
- You value detailed analytics on which messages get opened/clicked

**Use MailPoet + Twilio** if:
- You want to keep everything simple and on your VPS
- You want to avoid external accounts initially
- You're comfortable with basic automation for the first 3–6 months

**Recommendation:** Start with SendGrid + Twilio. Both are free/cheap to trial, and if they work, switching later is expensive in retraining. SendGrid's reliability + analytics are worth the small overhead.

---

## SECTION 2: EMAIL TEMPLATES

All templates are mobile-friendly (tested on iPhone/Android), include reply-to, unsubscribe link, and brand colours (adjust hex codes to match coconiczy's branding).

---

### EMAIL 1: Order Confirmation
**Trigger:** Immediately on order placement (0 minutes after checkout)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - coconiczy</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
        .wrapper { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%); padding: 30px 20px; text-align: center; color: white; }
        .header h1 { font-size: 28px; margin-bottom: 5px; }
        .header p { font-size: 14px; opacity: 0.95; }
        .content { padding: 30px 20px; }
        .order-section { background: #f9f9f9; border-left: 4px solid #FF6B35; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .section-title { font-weight: 700; color: #FF6B35; margin-bottom: 15px; font-size: 16px; }
        .item-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .item-row:last-child { border-bottom: none; }
        .item-name { flex: 1; }
        .item-price { text-align: right; font-weight: 600; }
        .total-row { display: flex; justify-content: space-between; padding: 15px 0; font-size: 18px; font-weight: 700; border-top: 2px solid #FF6B35; margin-top: 10px; color: #FF6B35; }
        .pickup-details { background: #e8f4f8; border-left: 4px solid #2196F3; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .pickup-details strong { color: #2196F3; }
        .pickup-time { font-size: 18px; font-weight: 700; color: #2196F3; margin: 10px 0; }
        .cta-button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; border-radius: 4px; text-decoration: none; font-weight: 600; margin: 20px 0; }
        .cta-button:hover { background: #E55A24; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        .footer p { margin: 5px 0; }
        .unsubscribe-link { color: #FF6B35; text-decoration: none; }
        @media (max-width: 600px) {
            .header h1 { font-size: 22px; }
            .content { padding: 20px 15px; }
            .item-row { font-size: 14px; }
            .total-row { font-size: 16px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <!-- Header -->
        <div class="header">
            <h1>✓ Order Confirmed</h1>
            <p>Your direct order with coconiczy is booked</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <p>Hi {{customer_first_name}},</p>
            <p style="margin: 15px 0;">Thanks for ordering direct — you've just saved commission fees and helped coconiczy keep prices down. Your order is now being prepared.</p>

            <!-- Order Section -->
            <div class="order-section">
                <div class="section-title">Order #{{order_number}}</div>
                {{#items}}
                <div class="item-row">
                    <span class="item-name">{{item_name}} {{#item_quantity}} x {{item_quantity}}{{/item_quantity}}</span>
                    <span class="item-price">£{{item_total}}</span>
                </div>
                {{/items}}
                <div class="item-row" style="border-bottom: none; padding-top: 15px;">
                    <span style="font-weight: 600;">Subtotal</span>
                    <span style="font-weight: 600;">£{{subtotal}}</span>
                </div>
                {{#discount_applied}}
                <div class="item-row">
                    <span style="color: #27AE60;">Direct order discount</span>
                    <span style="color: #27AE60; font-weight: 600;">-£{{discount_amount}}</span>
                </div>
                {{/discount_applied}}
                <div class="total-row">
                    <span>Total Paid</span>
                    <span>£{{total_amount}}</span>
                </div>
            </div>

            <!-- Pickup Details -->
            <div class="pickup-details">
                <div style="font-weight: 700; color: #2196F3; margin-bottom: 10px;">📍 Collection Details</div>
                <strong>When:</strong> {{pickup_date}} at <span class="pickup-time">{{pickup_time}}</span>
                <br>
                <strong>Where:</strong> coconiczy, {{pickup_address}}
                <br>
                <strong>Order Ready By:</strong> We'll have your food ready 5 mins before {{pickup_time}}
                <br><br>
                <p style="font-size: 13px; color: #555; margin-top: 10px;">💡 <strong>Tip:</strong> Arrive within your time slot. If you're running late, reply to this email ASAP and we'll hold it for 10 mins.</p>
            </div>

            <!-- Next Steps -->
            <div style="background: #fffbea; border-left: 4px solid #F39C12; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <div style="font-weight: 700; color: #F39C12; margin-bottom: 10px;">What Happens Next</div>
                <p>✓ You'll get an SMS 1 hour before pickup (if we have your number)</p>
                <p>✓ Food will be ready in the next {{prep_time}} mins</p>
                <p>✓ You'll get a review request after pickup</p>
            </div>

            <!-- Footer CTA -->
            <p style="text-align: center; margin-top: 30px;">
                <a href="{{order_details_link}}" class="cta-button">View Order Details</a>
            </p>

            <p style="margin-top: 20px; font-size: 13px; color: #666;">Questions? Reply to this email or call us on {{phone_number}}.</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>coconiczy</strong> | Direct Ordering</p>
            <p>{{business_address}}</p>
            <p>Phone: {{phone_number}}</p>
            <p>Reply-To: {{reply_to_email}}</p>
            <p style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
                <a href="{{unsubscribe_link}}" class="unsubscribe-link">Unsubscribe from order emails</a> | 
                <a href="{{privacy_policy_link}}" class="unsubscribe-link">Privacy Policy</a>
            </p>
        </div>
    </div>
</body>
</html>
```

---

### EMAIL 2: Status Update — "Preparing"
**Trigger:** When order status changes to "Preparing" (typically 2–5 minutes after confirmation)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Order is Being Prepared - coconiczy</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
        .wrapper { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #3498DB 0%, #2980B9 100%); padding: 30px 20px; text-align: center; color: white; }
        .header h1 { font-size: 28px; margin-bottom: 5px; }
        .header p { font-size: 14px; opacity: 0.95; }
        .content { padding: 30px 20px; }
        .status-timeline { margin: 30px 0; }
        .timeline-item { display: flex; margin: 20px 0; }
        .timeline-marker { width: 40px; height: 40px; border-radius: 50%; background: #27AE60; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; margin-right: 15px; }
        .timeline-marker.active { background: #2980B9; }
        .timeline-marker.future { background: #bdc3c7; }
        .timeline-content h3 { color: #2c3e50; margin-bottom: 5px; font-size: 14px; }
        .timeline-content p { font-size: 13px; color: #666; }
        .status-box { background: #e3f2fd; border-left: 4px solid #2196F3; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .status-box strong { color: #1976D2; }
        .time-remaining { font-size: 18px; font-weight: 700; color: #2196F3; margin: 10px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        .unsubscribe-link { color: #2196F3; text-decoration: none; }
        @media (max-width: 600px) {
            .header h1 { font-size: 22px; }
            .content { padding: 20px 15px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <!-- Header -->
        <div class="header">
            <h1>🍳 Preparing Your Order</h1>
            <p>Kitchen is on it</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <p>Hi {{customer_first_name}},</p>
            <p style="margin: 15px 0;">Your order #{{order_number}} is now being prepared in our kitchen. Here's where you are in the queue:</p>

            <!-- Status Timeline -->
            <div class="status-timeline">
                <div class="timeline-item">
                    <div class="timeline-marker active">✓</div>
                    <div class="timeline-content">
                        <h3>Order Received</h3>
                        <p>{{confirmed_time}}</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-marker active">✓</div>
                    <div class="timeline-content">
                        <h3>Preparing Now</h3>
                        <p>Kitchen started at {{started_time}}</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-marker future">3</div>
                    <div class="timeline-content">
                        <h3>Ready for Collection</h3>
                        <p>Expected at {{pickup_time}}</p>
                    </div>
                </div>
            </div>

            <!-- Time Remaining -->
            <div class="status-box">
                <strong>⏱ Ready in approximately:</strong>
                <div class="time-remaining">{{mins_remaining}} minutes</div>
                <p style="margin-top: 10px; font-size: 13px;">Your order should be ready by <strong>{{eta_ready_time}}</strong>. Come a few minutes early if you can!</p>
            </div>

            <!-- Items Summary -->
            <div style="background: #f9f9f9; border-left: 4px solid #3498DB; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <strong style="color: #2c3e50; display: block; margin-bottom: 10px;">Your Order</strong>
                {{#items}}
                <p style="margin: 5px 0; font-size: 14px;">• {{item_name}} {{#item_quantity}} x {{item_quantity}}{{/item_quantity}}</p>
                {{/items}}
            </div>

            <!-- Next Step -->
            <p style="margin: 20px 0; padding: 15px; background: #fff3cd; border-radius: 4px; border-left: 4px solid #F39C12;">
                <strong>📍 What's next?</strong><br>
                Head to coconiczy around <strong>{{pickup_time}}</strong>. Your food will be hot and ready. 
            </p>

            <p style="margin-top: 20px; font-size: 13px; color: #666;">Running late? Reply to this email and let us know.</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>coconiczy</strong> | Direct Ordering</p>
            <p>Phone: {{phone_number}}</p>
            <p style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
                <a href="{{unsubscribe_link}}" class="unsubscribe-link">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>
```

---

### EMAIL 3: Status Update — "Ready"
**Trigger:** When order status changes to "Ready" (typically 15–30 mins before pickup time)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Order is Ready - coconiczy</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
        .wrapper { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #27AE60 0%, #229954 100%); padding: 30px 20px; text-align: center; color: white; }
        .header h1 { font-size: 28px; margin-bottom: 5px; }
        .header p { font-size: 14px; opacity: 0.95; }
        .content { padding: 30px 20px; }
        .ready-box { background: #d4edda; border-left: 4px solid #27AE60; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .ready-box strong { color: #155724; font-size: 18px; }
        .pickup-instruction { background: #e3f2fd; border-left: 4px solid #2196F3; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        .unsubscribe-link { color: #27AE60; text-decoration: none; }
        @media (max-width: 600px) {
            .header h1 { font-size: 22px; }
            .content { padding: 20px 15px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <!-- Header -->
        <div class="header">
            <h1>✓ Your Order is Ready!</h1>
            <p>Come pick it up now</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <p>Hi {{customer_first_name}},</p>

            <!-- Ready Alert -->
            <div class="ready-box">
                <strong>Your order #{{order_number}} is ready and waiting</strong>
                <p style="margin-top: 10px; font-size: 14px;">Ready since {{ready_time}}. Your food is hot — come collect it now to enjoy it at its best.</p>
            </div>

            <!-- Pickup Instructions -->
            <div class="pickup-instruction">
                <strong style="color: #1976D2; display: block; margin-bottom: 10px;">📍 Collection Instructions</strong>
                <p><strong>Address:</strong> {{pickup_address}}</p>
                <p><strong>Your Order Code:</strong> <span style="font-size: 16px; font-weight: 700; color: #2196F3;">{{order_number}}</span></p>
                <p style="margin-top: 10px; font-size: 13px; color: #555;">Tell us your order number when you arrive. We'll hand it over hot — usually takes 30 seconds.</p>
            </div>

            <!-- Items Confirmation -->
            <div style="background: #f9f9f9; border-left: 4px solid #27AE60; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <strong style="color: #2c3e50; display: block; margin-bottom: 10px;">In Your Bag</strong>
                {{#items}}
                <p style="margin: 5px 0; font-size: 14px;">• {{item_name}} {{#item_quantity}} x {{item_quantity}}{{/item_quantity}}</p>
                {{/items}}
                <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; font-weight: 600; color: #27AE60;">Total: £{{total_amount}}</p>
            </div>

            <!-- Time Limit -->
            <p style="margin: 20px 0; padding: 15px; background: #fff3cd; border-radius: 4px; border-left: 4px solid #F39C12; font-size: 13px;">
                <strong>⚠️ We'll hold your order for 1 hour from when it went "ready."</strong> After that, we can't guarantee it'll still be warm. Head over soon!
            </p>

            <p style="margin-top: 20px; font-size: 13px; color: #666;">
                Running late? Reply to this email or call {{phone_number}} — we'll keep it warm.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>coconiczy</strong> | Direct Ordering</p>
            <p>{{business_address}}</p>
            <p style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
                <a href="{{unsubscribe_link}}" class="unsubscribe-link">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>
```

---

### EMAIL 4: Review Request
**Trigger:** 30 minutes after order is marked "Completed" (typically after pickup)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Love Your Food? Leave a Review - coconiczy</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
        .wrapper { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%); padding: 30px 20px; text-align: center; color: white; }
        .header h1 { font-size: 28px; margin-bottom: 5px; }
        .header p { font-size: 14px; opacity: 0.95; }
        .content { padding: 30px 20px; }
        .review-box { background: #fff9e6; border-left: 4px solid #F39C12; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .review-box strong { color: #D68910; }
        .cta-group { text-align: center; margin: 30px 0; }
        .review-button { display: inline-block; background: #FF6B35; color: white; padding: 14px 32px; border-radius: 4px; text-decoration: none; font-weight: 600; margin: 10px 5px; }
        .review-button:hover { background: #E55A24; }
        .review-button.google { background: #4285F4; }
        .review-button.google:hover { background: #357ae8; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eee; font-size: 12px; color: #666; }
        .unsubscribe-link { color: #FF6B35; text-decoration: none; }
        @media (max-width: 600px) {
            .header h1 { font-size: 22px; }
            .content { padding: 20px 15px; }
            .review-button { display: block; margin: 10px 0; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <!-- Header -->
        <div class="header">
            <h1>⭐ How Was Your Order?</h1>
            <p>Tell us what you thought</p>
        </div>

        <!-- Main Content -->
        <div class="content">
            <p>Hi {{customer_first_name}},</p>
            <p style="margin: 15px 0;">Thanks for ordering from coconiczy! Your feedback helps us get better — and it helps other people find great food.</p>

            <!-- Review Request -->
            <div class="review-box">
                <strong>Leave a review in 60 seconds</strong>
                <p style="margin-top: 10px; font-size: 14px;">
                    Pick your favourite platform below. Just tell us what you thought about the food, the value, and your experience. Real reviews, no fluff.
                </p>
            </div>

            <!-- CTA Buttons -->
            <div class="cta-group">
                <a href="{{google_review_link}}" class="review-button google">⭐ Google Review</a>
                <br>
                <a href="{{local_site_review_link}}" class="review-button">✓ Review on Our Site</a>
            </div>

            <!-- Why We Ask -->
            <div style="background: #f0f0f0; padding: 20px; margin: 20px 0; border-radius: 4px; border-left: 4px solid #bdc3c7;">
                <strong style="color: #555;">Why we ask for reviews</strong>
                <p style="margin-top: 10px; font-size: 13px; color: #666;">
                    We're small and independent. Google reviews help people find us. Your honest feedback — good or bad — means way more than any ad campaign. If something wasn't right, we'd rather you tell us directly.
                </p>
            </div>

            <!-- Direct Feedback Option -->
            <p style="margin: 20px 0; padding: 15px; background: #e3f2fd; border-radius: 4px; border-left: 4px solid #2196F3; font-size: 13px;">
                <strong>Not keen on public reviews?</strong> Reply to this email with your feedback. We read every message.
            </p>

            <!-- Order Summary -->
            <div style="background: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 4px; border-left: 4px solid #999;">
                <strong style="color: #555; font-size: 13px;">Your Order #{{order_number}}</strong>
                <p style="margin-top: 8px; font-size: 13px; color: #666;">{{order_date}} | £{{total_amount}}</p>
            </div>

            <p style="margin-top: 20px; font-size: 13px; color: #666;">Cheers,<br><strong>coconiczy Team</strong></p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>coconiczy</strong> | Direct Ordering</p>
            <p>{{business_address}}</p>
            <p style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
                <a href="{{unsubscribe_link}}" class="unsubscribe-link">Unsubscribe from order emails</a>
            </p>
        </div>
    </div>
</body>
</html>
```

---

## SECTION 3: SMS TEMPLATES

All SMS templates are plain text, under 160 characters (single SMS credit), include a way to opt-out (reply STOP).

---

### SMS 1: Order Confirmation
**Trigger:** Immediately on order placement (0 minutes)
**Template:**
```
coconiczy: Order #{{ORDER_ID}} confirmed. Ready {{PICKUP_TIME}}. Collection: {{LOCATION}}. Reply STOP to opt out.
```
**Character count:** 105  
**Use case:** Fast confirmation, no read required

---

### SMS 2: One-Hour Reminder
**Trigger:** 1 hour before customer's scheduled pickup time (configurable)
**Template:**
```
coconiczy: Your order is ready! Pick up in 1 hour ({{PICKUP_TIME}}). {{LOCATION}}. Late? Reply with ETA.
```
**Character count:** 108  
**Use case:** Reminder before pickup window

---

### SMS 3: Immediate Status Update (Preparing)
**Trigger:** When order moves to "Preparing" status (2–5 mins after confirmation)
**Template:**
```
coconiczy: Your order is being prepped. Ready in ~{{PREP_TIME}} mins. See your email for full order details.
```
**Character count:** 102  
**Use case:** Confirmation that kitchen is working on the order

---

### SMS 4: Order Ready
**Trigger:** When order status changes to "Ready" (15–30 mins before scheduled pickup)
**Template:**
```
coconiczy: Your order #{{ORDER_ID}} is READY! Come pick it up now from {{LOCATION}}. We'll hold it warm.
```
**Character count:** 111  
**Use case:** Urgent — customer should collect now

---

### SMS 5: Review Request
**Trigger:** 30 minutes after order marked "Completed"
**Template:**
```
coconiczy: Loved your order? Leave a Google review — it helps us heaps. {{REVIEW_LINK}} Thanks!
```
**Character count:** 98  
**Use case:** Short, friendly, clear CTA

---

## SECTION 4: TRIGGER LOGIC & AUTOMATION FLOW

This pseudocode defines when each message sends based on order status changes.

```plaintext
# coconiczy Order Automation Trigger Logic
# Platform: WooCommerce + SendGrid + Twilio
# Last Updated: June 2026

## Order Status Workflow
# WooCommerce Standard: pending → processing → preparing → ready → completed
# coconiczy Custom: pending → confirmed → preparing → ready → completed

┌─────────────────────────────────────────────────────────────────────────────┐
│ TRIGGER 1: ORDER PLACED (Status: pending → confirmed)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ Event: Customer clicks "Place Order" → Payment processed via Stripe         │
│ Timing: IMMEDIATE (0 minutes)                                              │
│                                                                              │
│ Actions:                                                                    │
│  1. SET order.status = "confirmed"                                         │
│  2. SEND Email #1 (Order Confirmation)                                     │
│     - To: customer.email                                                   │
│     - Template: coconiczy-order-confirmed.html                             │
│     - Merge fields: {{order_number}}, {{customer_first_name}},             │
│       {{items}}, {{total_amount}}, {{pickup_date}}, {{pickup_time}}        │
│  3. SEND SMS #1 (Order Confirmation) [if customer has phone]               │
│     - To: customer.phone                                                   │
│     - Template: {{ORDER_ID}} | {{PICKUP_TIME}}                             │
│  4. LOG: Customer notification sent                                        │
│  5. NOTIFY: coconiczy staff dashboard (new order alert)                    │
│                                                                              │
│ Preconditions:                                                              │
│  - Customer email must be valid (not bouncing)                             │
│  - Phone number (optional) must be E.164 formatted                         │
│  - Payment successful (check Stripe webhook)                               │
│                                                                              │
│ Failure handling:                                                           │
│  - If email fails: retry after 5 mins, alert owner if 2nd attempt fails    │
│  - If SMS fails: log but don't block (SMS not critical for confirmation)   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TRIGGER 2: KITCHEN STARTS PREP (Status: confirmed → preparing)             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Event: coconiczy staff changes order status to "Preparing" in back office   │
│ Timing: 2–5 minutes after order confirmation (manual action by staff)      │
│                                                                              │
│ Actions:                                                                    │
│  1. SET order.status = "preparing"                                         │
│  2. SET order.started_time = NOW                                           │
│  3. CALCULATE prep_time = order.requested_prep_time (e.g., 20 mins)       │
│  4. SEND Email #2 (Preparing Status)                                       │
│     - To: customer.email                                                   │
│     - Template: coconiczy-order-preparing.html                             │
│     - Merge fields: {{order_number}}, {{started_time}}, {{mins_remaining}} │
│  5. SEND SMS #3 (Immediate Status) [if customer has phone]                 │
│     - To: customer.phone                                                   │
│     - Template: "Your order is being prepped..."                           │
│  6. NOTIFY: coconiczy staff (preparing started, alert if prep time > 30m)  │
│                                                                              │
│ Preconditions:                                                              │
│  - Order status is currently "confirmed"                                   │
│  - Email #1 has already sent successfully                                  │
│                                                                              │
│ Failure handling:                                                           │
│  - If email fails: do not send SMS (prevents duplicate update confusion)    │
│  - Allow staff to resend from dashboard if needed                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TRIGGER 3: ORDER READY (Status: preparing → ready)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ Event: coconiczy staff changes order status to "Ready" in back office       │
│ Timing: 5–30 minutes before scheduled pickup time (staff manual action)     │
│                                                                              │
│ Actions:                                                                    │
│  1. SET order.status = "ready"                                             │
│  2. SET order.ready_time = NOW                                             │
│  3. SEND Email #3 (Ready for Collection)                                   │
│     - To: customer.email                                                   │
│     - Template: coconiczy-order-ready.html                                 │
│     - Merge fields: {{order_number}}, {{ready_time}}, {{pickup_address}}   │
│  4. SEND SMS #4 (Order Ready) [if customer has phone]                      │
│     - To: customer.phone                                                   │
│     - Template: "Your order #{{ORDER_ID}} is READY!..."                   │
│  5. NOTIFY: coconiczy staff (order display pops up on kitchen screen)      │
│                                                                              │
│ Preconditions:                                                              │
│  - Order status is currently "preparing"                                   │
│  - Email #2 has already sent successfully                                  │
│                                                                              │
│ Notes:                                                                      │
│  - "Ready" email is critical — customer must see it ASAP                   │
│  - Staff must NOT mark "ready" more than 30 mins early (food gets cold)   │
│  - Consider reminder SMS 1 hour before pickup (see TRIGGER 4 below)        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TRIGGER 4: ONE-HOUR REMINDER (Scheduled, not status-based)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ Event: Scheduler runs at (pickup_time - 60 minutes)                        │
│ Timing: EXACTLY 1 hour before customer's scheduled pickup time             │
│ Frequency: Once per order                                                  │
│                                                                              │
│ Actions:                                                                    │
│  1. QUERY all orders with status = "preparing" OR "ready"                  │
│     WHERE pickup_time = NOW + 60 minutes                                   │
│  2. FOR each matching order:                                               │
│     a. SEND SMS #2 (One-Hour Reminder) [if customer has phone & opted in]  │
│        - To: customer.phone                                                │
│        - Template: "Your order is ready! Pick up in 1 hour..."             │
│        - Personalization: {{PICKUP_TIME}}, {{LOCATION}}                    │
│     b. SKIP if customer has opted out of reminders (check preferences)     │
│  3. SKIP email for this trigger (SMS-only reminder to reduce noise)        │
│                                                                              │
│ Preconditions:                                                              │
│  - order.status in ["preparing", "ready"]                                  │
│  - order.pickup_time matches scheduler window (within ±5 mins)            │
│  - order.customer_phone is valid and opted in                              │
│                                                                              │
│ Configuration:                                                              │
│  - Reminder time: 60 minutes before pickup (configurable per location)      │
│  - Can be disabled per order via customer preference                       │
│                                                                              │
│ Failure handling:                                                           │
│  - If SMS fails: log but don't alert (non-critical reminder)               │
│  - Can be resent manually from staff dashboard if needed                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TRIGGER 5: ORDER COMPLETED (Status: ready → completed)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ Event: coconiczy staff marks order as "Completed" (after customer collects) │
│ Timing: When customer picks up food (manual action by staff)                │
│                                                                              │
│ Actions:                                                                    │
│  1. SET order.status = "completed"                                         │
│  2. SET order.collected_time = NOW                                         │
│  3. DO NOT send email immediately (customer is present, distraction)       │
│  4. SCHEDULE Email #4 (Review Request) for 30 mins from now                │
│     - Delay: 30 minutes (gives customer time to enjoy food)                │
│     - Template: coconiczy-order-review-request.html                        │
│     - Merge fields: {{customer_first_name}}, {{order_number}},             │
│       {{google_review_link}}, {{local_site_review_link}}                   │
│  5. NOTIFY: coconiczy staff (order collected, payment confirmed)           │
│                                                                              │
│ Preconditions:                                                              │
│  - Order status is currently "ready"                                       │
│  - Email #3 has sent successfully                                          │
│                                                                              │
│ Notes:                                                                      │
│  - 30-min delay is intentional — customer eating, won't open email yet     │
│  - This email is optional per customer (can opt out of review emails only) │
│                                                                              │
│ Failure handling:                                                           │
│  - If scheduled email fails to queue: retry after 1 hour                   │
│  - Staff can trigger review email manually from dashboard                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TRIGGER 6: ABANDONED ORDER MONITOR (Background check)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ Event: Scheduled check runs every 30 mins                                   │
│ Timing: Check if order is still "ready" 45+ mins before pickup time         │
│                                                                              │
│ Actions:                                                                    │
│  1. QUERY all orders with status = "ready"                                 │
│     WHERE (pickup_time - NOW) < 45 minutes                                 │
│  2. FOR each matching order:                                               │
│     a. SEND owner alert: "Order #{{ID}} is still not collected"           │
│        - Suggests: Check if customer is running late, call if possible     │
│     b. DO NOT send automated customer email (could be annoying)            │
│  3. Mark order for manual follow-up if > 2 hours past pickup time          │
│                                                                              │
│ Preconditions:                                                              │
│  - order.status = "ready"                                                  │
│  - (pickup_time - NOW) < 45 minutes AND > 0                               │
│                                                                              │
│ Notes:                                                                      │
│  - This is a safety net, not a customer-facing automation                  │
│  - coconiczy staff decides whether to call/follow up                       │
│                                                                              │
│ Failure handling:                                                           │
│  - Silent failure acceptable (background check only)                       │
│  - Errors logged but not customer-facing                                   │
└─────────────────────────────────────────────────────────────────────────────┘

## Summary: Message Schedule Per Order (Happy Path)

Time:              Event:                          Message Sent:
─────────────────────────────────────────────────────────────────
T+0 min            Order placed                    Email #1 + SMS #1
T+2–5 min          Kitchen starts prep             Email #2 + SMS #3
T+15–30 min        Order ready                     Email #3 + SMS #4
T+60 min*          1 hour before pickup            SMS #2 (reminder)
T+pickup time      Customer collects               —— (no email sent)
T+pickup+30 min    Review request sent             Email #4

*Only if configured and customer opted in. SMS #2 only if customer has phone.

---

## Opt-Out & Unsubscribe Logic

```plaintext
# Unsubscribe & Preference Management

## Customer Preference Tiers

Tier 1 — Transactional (CANNOT opt out)
  └─ Email #1 (Order Confirmation) — Required by UK consumer law
  └─ Email #3 (Order Ready) — Time-critical, delivery instruction

Tier 2 — Status Updates (can opt out)
  └─ Email #2 (Preparing) — Optional status update
  └─ SMS #1, #3 — Optional status messages

Tier 3 — Marketing / Reviews (can opt out)
  └─ Email #4 (Review Request) — Optional, common unsubscribe
  └─ SMS #2 (One-Hour Reminder) — Optional reminder

## Unsubscribe Mechanisms

### Email Unsubscribe (GDPR compliant)
  1. Every email footer includes: "Unsubscribe from order emails"
  2. Clicking unsubscribe does:
     a. Remove customer from Tier 3 (review/promotional)
     b. Keep customer in Tier 1 + 2 (transactional)
     c. Record preference in customer profile (order.preferences.email_tier = 1)
  3. Implementation: SendGrid Management Preferences or custom unsubscribe link
     - Link format: {{base_url}}/unsubscribe?email={{email}}&token={{unsubscribe_token}}
     - Confirmation page: "You've unsubscribed from coconiczy reviews. Transactional order emails will continue."

### SMS Opt-Out
  1. Every SMS includes: "Reply STOP to opt out"
  2. Replying "STOP" triggers:
     a. Remove customer from all SMS (Twilio standard)
     b. Log preference in system (order.preferences.sms_enabled = false)
     c. MUST NOT send any SMS to that number again (legal requirement, Twilio enforces)
     d. Customer can reply "START" to re-enable (Twilio standard)
  3. Implementation: Twilio webhook handles STOP/START replies automatically

### Dashboard Override (for coconiczy staff)
  1. In WooCommerce/back office, staff can:
     - View customer's current preference tier
     - Manually override (e.g., "This customer only wants SMS, not email")
     - Log reason (e.g., "Customer asked verbally during pickup")
  2. Audit trail: Every change logged with timestamp + staff member

## Opt-In for New Customers

### First-Time Order (Implicit Consent)
  1. At checkout, checkbox (checked by default):
     "Send me order updates and collection reminders via email + SMS"
  2. If customer unchecks:
     a. Still send Email #1 (Order Confirmation) — transactional, required
     b. Skip Email #2, #3, #4, and all SMS
     c. But Email #1 contains collection instruction, so customer still informed
  3. Implementation: WooCommerce checkbox field → order.preferences.communications = "transactional_only"

### Import of Existing Customers
  1. If migrating from Deliveroo:
     a. Assume all customers are "not opted in" (conservative approach)
     b. First order shows consent checkbox (see above)
     c. Do NOT send review/reminder emails to pre-migration customers until they opt in
  2. If you have existing email list:
     a. Send one-time welcome email with migration explanation
     b. Include link to "Manage My Preferences"
     c. Only add to marketing list if they click through

## Do Not Contact (DNC) List
  1. Maintain blacklist of emails/phones that have:
     a. Bounced hard 3+ times
     b. Marked as spam
     c. Explicitly unsubscribed
  2. Twilio + SendGrid both track this automatically
  3. Fail safely: If customer is on DNC, system logs attempt but does not retry
     - coconiczy staff is alerted: "Could not deliver confirmation to {{email}} — email hard-bounced previously"

---

## Testing & Compliance Checklist

✓ All emails include:
  - Reply-To: {{reply_to_email}} (suggests "orders@coconiczy.com")
  - Unsubscribe link in footer
  - Company name + address in footer
  - Physical address (UK law requirement)

✓ SMS compliance:
  - Under 160 characters (single SMS credit)
  - Includes "Reply STOP to opt out"
  - Twilio legally handles opt-out (cannot override)

✓ Mobile-friendly:
  - Tested on iPhone 12, Samsung S20
  - Font sizes ≥12px (readable without zoom)
  - Buttons ≥44px tall (tap-friendly)
  - Breakpoint at 600px (common mobile width)

✓ Accessibility:
  - Color contrast: 4.5:1 minimum (WCAG AA)
  - No text in images (alt text provided)
  - Semantic HTML (heading hierarchy, etc.)

✓ Deliverability:
  - SPF + DKIM configured on domain
  - Unsubscribe preference honored within 48 hours
  - Bounce handling: hard bounces → remove, soft bounces → retry 3x

```

---

## SECTION 5: IMPLEMENTATION CHECKLIST

### Week 1: Setup & Infrastructure
- [ ] Register domain email (e.g., orders@coconiczy.com) for reply-to
- [ ] Create SendGrid account, verify domain DNS records (SPF/DKIM)
- [ ] Create Twilio account, configure UK phone number
- [ ] Install WooCommerce SendGrid plugin
- [ ] Install WooCommerce Twilio plugin (or use Zapier for both)
- [ ] Create customer preference fields in WooCommerce:
  - `customer_phone` (opt-in during checkout)
  - `email_tier` (transactional, status, or none)
  - `sms_enabled` (yes/no)
- [ ] Create unsubscribe page template (HTML)

### Week 2: Template Creation & QA
- [ ] Copy HTML templates above into SendGrid / MailPoet
- [ ] Test all merge fields: {{order_number}}, {{customer_first_name}}, etc.
- [ ] Send test emails to yourself — verify rendering on mobile
- [ ] Configure SMS templates in Twilio (character limits)
- [ ] Set up SMS phone number pool (prevents delivery delays)

### Week 3: Automation Wiring
- [ ] Configure WooCommerce status triggers:
  - `pending` → `confirmed` (Email #1 + SMS #1)
  - `confirmed` → `preparing` (Email #2 + SMS #3)
  - `preparing` → `ready` (Email #3 + SMS #4)
  - `ready` → `completed` (Schedule Email #4 for +30 mins)
- [ ] Set up scheduled task for one-hour reminder (SMS #2):
  - Cron job or WooCommerce Actions Scheduler
  - Queries: pickup_time = NOW + 60 mins
- [ ] Set up abandoned order monitor (Trigger #6):
  - Background check every 30 mins
  - Alerts coconiczy staff if order > 45 mins past pickup time

### Week 4: Testing & Launch
- [ ] Create 10 test orders (full flow)
- [ ] Verify Email #1 arrives within 30 seconds
- [ ] Verify SMS #1 arrives within 60 seconds
- [ ] Manually trigger status changes, verify Emails #2, #3, #4
- [ ] Test unsubscribe flow (click link, confirm removal from Tier 3)
- [ ] Test SMS STOP reply (manually in Twilio, verify customer removed)
- [ ] Train coconiczy staff:
  - How to trigger status changes
  - How to view customer preferences
  - How to resend messages if needed
- [ ] Go live with one test order from a real customer
- [ ] Monitor deliverability (SendGrid dashboard: bounce rate, click rate)

---

## SECTION 6: EXPECTED MESSAGING VOLUMES & COSTS

### Volume Estimates (based on 30 orders/week at launch, scaling to 100/week by month 3)

**Month 1: 120 orders**
- Email #1: 120 (confirmation)
- Email #2: 120 (preparing)
- Email #3: 120 (ready)
- Email #4: 120 (review)
- SMS #1: 60 (50% adoption, customers gave phone numbers)
- SMS #2: 60 (one-hour reminder, 50% of confirmed orders)
- SMS #3: 60 (preparing)
- SMS #4: 60 (ready)
- **Total emails:** 480 | **Total SMS:** 240

**Month 2: 240 orders**
- Emails: 960 | SMS: 480

**Month 3: 400 orders (assuming growth)**
- Emails: 1,600 | SMS: 800

### Cost Breakdown (Month 1 at 30 orders/week)

**SendGrid:**
- 480 emails × £0.0005 per email = **£0.24**
- (Free tier: 100/day for first month, then small payment starts)

**Twilio:**
- 240 SMS × £0.04 per SMS (UK price) = **£9.60**

**Total automation cost, Month 1: ~£10**

*(Plus the cost of the plugins/integrations if not free: expect £0–£50 one-time)*

By Month 3: Still under £30–40/month total. Breakeven happens within the first £200 of extra orders due to commission savings vs Deliveroo.

---

## SECTION 7: FUTURE ENHANCEMENTS (Not Required for MVP)

1. **Two-way SMS:** Customer can reply with ETA ("Running 15 mins late") — staff sees on dashboard
2. **WhatsApp Integration:** Send messages via WhatsApp instead of SMS (higher open rates, no per-message cost)
3. **Loyalty Reminder:** "You've ordered 5 times — here's 10% off next order" (triggered by order count)
4. **Feedback Survey:** 7-day post-order: "Rate your experience 1–5" (simple NPS)
5. **Reorder Campaign:** "Loved your last order? Order again in 2 clicks" (email + SMS after 2 weeks)
6. **Seasonal Promotions:** "Try our new summer menu" (bulk email, targeted by order history)

---

## QUICK START: WHICH SERVICE TO CHOOSE?

| Need | SendGrid + Twilio | MailPoet + Twilio |
|------|---|---|
| **Setup time** | 30 mins | 15 mins |
| **Cost (Month 1)** | ~£10 | ~£10 + £10/year MailPoet |
| **Email only?** | Yes, full featured | Yes, simpler |
| **SMS included?** | Yes, via Twilio | Yes, via Twilio |
| **Deliverability** | Excellent | Good (hosted on VPS) |
| **Analytics** | Detailed (SendGrid dashboard) | Basic (MailPoet) |
| **Best for** | Scale, reliability, tracking | Simplicity, keeping it on VPS |

**Recommendation for coconiczy:** **SendGrid + Twilio**. The analytics will help you optimize (e.g., which orders get abandoned, which messages get opened) and it's designed to scale from 10 orders/week to 500+ without hitting limits.

---

## FINAL NOTES

- **Mobile-first design:** All templates optimized for phones. Customers read email on the move.
- **Tone:** Friendly but professional. coconiczy is a small business — voice should match.
- **Unsubscribe:** Respect it immediately. One angry customer telling 20 people is worse than lost marketing email.
- **SMS sparingly:** Send only critical messages (order ready, one-hour reminder). Too many = opt-outs.
- **Testing:** Always test status triggers in a staging environment first. A broken automation is worse than none.

**Owner sign-off required before launch.** Ola (coconiczy) should review tone, merge fields, and customer preference defaults.

---

*Document prepared for coconiczy Cookout ordering system*  
*Last updated: June 29, 2026*  
*Questions or changes: Reply to orders@coconiczy.com*
