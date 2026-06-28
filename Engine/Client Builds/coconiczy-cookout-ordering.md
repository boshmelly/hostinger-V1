# coconiczy's Cookout — Direct Ordering + Back Office

> Build spec. Turns a Deliveroo-dependent food vendor into a commission-free direct-order site.
> Stack: our Hostinger VPS (same one Klaudius runs on). Owner-manageable after handover.
> Status: SCOPED, not built. Verify her current site stack + Deliveroo contract before build.

## The ask (from Ola)

Menu + back office where customers order direct, she takes payment (Stripe), and asks for reviews directly. Collection only, priced £2 cheaper than Deliveroo. Can the menu / skin / availability be duplicated from Deliveroo?

## Verdict: YES, all of it. None of this is new ground for our stack.

| Requirement | Doable? | How |
|---|---|---|
| Menu (items, photos, modifiers, prices) | Yes | WooCommerce + Orderable (or RestroPress) on the VPS |
| Online ordering, collection only | Yes | Collection mode on, delivery off, pickup time slots |
| Take payment directly | Yes | Stripe. UK cards ~1.5% + 20p. vs Deliveroo 14-30% commission |
| Back office (manage orders) | Yes | Order dashboard: new → preparing → ready. Live on phone |
| Daily availability | Yes | Per-item "sold out" toggle, opening hours, "pause orders" when slammed |
| Ask for reviews directly | Yes | Auto email/SMS on order complete → Google review link + on-site review |
| £2 cheaper than Deliveroo | Yes commercially | Saved commission funds the discount many times over |

## Duplicate from Deliveroo — the honest answer

- **No one-click import.** Deliveroo gives merchants no clean export/API to pull their own menu out.
- **But a fast rebuild.** We copy the menu (items, descriptions, prices, photos, modifiers) from her Deliveroo page in one pass and recreate it. ~1-2 hours, looks the same.
- **"Skin"** = we recreate the look/branding, not literally import it. Better: we make it on-brand, not Deliveroo-generic.
- **Availability** = set the same item availability + opening hours once, she manages it going forward.

## The one real landmine — price parity

Deliveroo has historically used "no cheaper elsewhere" (wide MFN) clauses, scrutinised by the CMA/EU. Before she publicly advertises "£2 cheaper than Deliveroo":
- Check her current Deliveroo merchant contract for a parity clause.
- Risk if breached: delisting from Deliveroo.
- **Safer framing:** "Order direct — skip the fees" / loyalty perks, rather than a headline undercut. Same commercial win, no contract risk.

## Economics (why this is a no-brainer for her)

- Deliveroo skims ~14-30% per order. Stripe takes ~1.5% + 20p.
- On a £20 collection order: Deliveroo ~£3-6 gone vs Stripe ~50p.
- She can be £2 cheaper to the customer AND keep more per order. Everyone wins except Deliveroo.

## Recommended build

WordPress + WooCommerce + Orderable, Stripe, collection-only, pickup slots, auto review-request email. All on our Hostinger VPS = zero per-order platform fee. Menu rebuilt from her Deliveroo page in one sitting.

## Next actions

1. Confirm coconiczy's current site stack (log it — not in the vault yet).
2. Check her Deliveroo contract for a price-parity clause. (Decides the discount framing.)
3. Get her Stripe onboarded (business details + bank, ~1 day).
4. Build menu from Deliveroo page, wire collection + slots + Stripe.
5. Turn on review-request automation.

Related: [[mi]] · [[revenue-drive-website-build]]
