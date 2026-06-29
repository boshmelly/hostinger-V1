# Coconiczy's Cookout — Website + Ordering/Stripe Build (START HERE)

> **Obvious-name entry point.** Everything about Coco's direct-order + Stripe build lives here or is linked from here.
> Purpose: so when you pull from GitHub, you have ONE coherent place — no duplicated folders.
> Created by Steve, 2026-06-29.

---

## 🔗 The key link (the thing that was hard to find)

**Coco's existing live website (built by Klaudius, hosted on Vercel):**
### → https://coconiczys-cookout.vercel.app/

- It is **NOT local-only** — it's live on **Vercel**.
- The Vercel project is almost certainly wired to a **GitHub repo inside the Klaudius / `my-agency` account** (not this `hostinger-V1` vault, and not `boshmelly`). That repo is where the deploy should land.

---

## 📍 Where things actually live (so nothing gets re-built twice)

| Thing | Location | Reachable from cloud session? |
|---|---|---|
| Coco's live site | Vercel: coconiczys-cookout.vercel.app | ❌ (egress policy blocks vercel.app) |
| Coco's site source code | GitHub repo under Klaudius / my-agency account | ❌ (this session scoped to `boshmelly/hostinger-v1` only) |
| Coco's outreach email + CRM record | **Inside the Klaudius platform's built-in CRM** (not Gmail) | ❌ |
| **This Stripe/ordering build** | `coco-order-demo/index.html` (this folder) + branch `claude/coconiczy-order-system-ysjz7p` | ✅ |
| Full specs (menu, flow, Stripe, automation, go-live) | `Engine/Client Builds/` (this repo) | ✅ |

**Confirmed dead-ends (so you don't repeat the hunt):**
- Coco's sent email is **not** in the connected Gmail (`ola.sewe10@gmail.com`) — that mailbox only holds the Klaudius account threads. Her email was sent from inside Klaudius.
- This cloud session has **no access** to your Mac (`~/Documents/Mr Melly/Businesses/Kladius/...`), the VPS, the Klaudius platform, or the open web.

---

## 🧱 What's in this folder (the working build)

`index.html` — a **self-contained, working prototype** of the customer ordering journey (no build step, opens in any browser):

1. Menu — 25 items, 4 categories (BBQ Mains, Sides, Drinks, Desserts), prices in GBP, modifiers
2. Add to cart → slide-up cart bar → order drawer with qty controls
3. **Collection-only checkout** — name, phone, fixed pickup location, 30-min pickup slots, notes
4. **Stripe payment (TEST MODE placeholder)** — card `4242 4242 4242 4242` simulates success
5. Order confirmation — order number + pickup time

Screenshots: `preview-home.png`, `preview-cart.png`, `preview-checkout.png`, `preview-confirmed.png`
(These are the payment-page screenshots to attach to Coco's follow-up.)

> ⚠️ This prototype is **standalone** — it does NOT yet use Coco's Vercel theme/colours. It is the *functionality*, to be merged INTO her existing site, not a replacement.

---

## ✅ Deployment plan (for when you can reach the Klaudius/Vercel repo)

Do this from a session that can read Coco's Vercel repo (your Mac/iPhone Claude Code, or give a session access to that repo):

1. **Pull** Coco's site repo (the one behind coconiczys-cookout.vercel.app).
2. **Merge** the ordering build from `coco-order-demo/index.html` into her existing components, re-skinned to her **theme + colours** (don't keep this standalone HTML — port the logic into her stack).
3. **Stripe account:** create/connect Coco's Stripe account (business details + bank). Swap the TEST placeholder for real keys. Wire the webhook (`payment_intent.succeeded` → order paid).
4. **Collection settings:** confirm pickup address + opening hours so the 30-min slot generator is correct.
5. **Deploy** to Vercel (push to her repo → auto-deploy). Smoke-test with Stripe test card first, then go live.
6. **Reviews/automation:** wire the post-order Google review request (see `Engine/Client Builds/coconiczy-automation.md`).

Full detail for each step: `Engine/Client Builds/coconiczy-integration-and-go-live.md`.

---

## 📚 Spec docs (already in this repo — do not duplicate)

In `Engine/Client Builds/`:
- `coconiczy-cookout-ordering.md` — business spec + economics (£2-cheaper, parity-clause warning)
- `coconiczy-collection-order-flow.md` — order flow + DB schema + time slots
- `STRIPE-INTEGRATION-GUIDE.md` — payment, webhooks, security, go-live
- `coconiczy-automation.md` (+ summary / quick-ref) — email/SMS + review automation
- `coconiczy-integration-and-go-live.md` — integration blueprint + 8 smoke tests
- `coconiczy-integration-diagrams.md` — architecture diagrams
- `EXECUTION-SUMMARY.md` — overview of the whole build

---

## ⏳ Follow-up to Coco — staged, pending two inputs

The payment-page screenshots are ready to attach. To actually send, still needed:
1. **Coco's email address** (in the Klaudius CRM — not reachable from this session).
2. **Marketing copy** (marketing manager to supply).
3. Send from the **revenuedrive / Klaudius mailbox**, CC `melly@revenuedrive.co.uk` — not the Gmail connected here.

Draft copy ready to use is in `Engine/Client Builds/coconiczy-cookout-ordering.md` / chat history.
