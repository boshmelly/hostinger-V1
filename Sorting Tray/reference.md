# find-prospects — Reference

Detail that doesn't belong in the always-loaded `SKILL.md`. Read on-demand.

## Channel host list

Use these host patterns to recognize candidate social links on the SERP. Match
against the link's hostname (not the URL string) so subdomains are handled
correctly.

| Channel | Host pattern(s) | Notes |
|---|---|---|
| Instagram | `instagram.com`, `www.instagram.com` | Profile URL: `instagram.com/<handle>`. Skip post URLs (`/p/`, `/reel/`). |
| Facebook page | `facebook.com`, `www.facebook.com`, `m.facebook.com`, `fb.com` | Profile/page URL: `facebook.com/<handle>` or `facebook.com/p/<name>-<id>`. Skip `/groups/`, `/posts/`, `/photo/`. |
| WhatsApp | `wa.me`, `api.whatsapp.com`, `chat.whatsapp.com` | `wa.me/<phone>` is the canonical click-to-chat link. `chat.whatsapp.com/<code>` is a group invite — usually fine. |
| Yelp | `yelp.com`, `yelp.<tld>` (e.g. `yelp.dk`, `yelp.de`) | Business URL: `yelp.com/biz/<slug>`. |
| TikTok | `tiktok.com`, `www.tiktok.com` | Profile URL: `tiktok.com/@<handle>`. Skip individual videos (`/video/<id>`). |
| LinkedIn | `linkedin.com`, `www.linkedin.com` | Company page: `linkedin.com/company/<slug>`. Skip `/in/<person>` (those are individuals, not the business). |
| X / Twitter | `twitter.com`, `x.com`, `www.twitter.com`, `www.x.com` | Profile URL: `x.com/<handle>`. Skip status URLs (`/status/<id>`). |
| YouTube | `youtube.com`, `www.youtube.com`, `m.youtube.com` | Channel URL: `youtube.com/@<handle>`, `/channel/<id>`, `/c/<name>`, or `/user/<name>`. Skip individual `/watch?v=`. |
| Pinterest | `pinterest.com`, `<cc>.pinterest.com` (e.g. `dk.pinterest.com`) | Profile URL: `pinterest.com/<handle>`. Skip `/pin/<id>`. |
| Threads | `threads.net`, `www.threads.net` | Profile URL: `threads.net/@<handle>`. |

**Always normalize before saving:**
- Strip query strings except for `wa.me/<phone>?text=...` (keep the phone, drop everything else).
- Strip URL fragments (`#...`).
- Strip tracking params (`fbclid`, `utm_*`, `igshid`, `si`).
- Use the canonical form (`https://`, no `www.` for the social hosts above except where it's part of the canonical handle).

## Native-language hints

You (Claude) generally know industry terms in any language — use that
knowledge directly. The list below is just reference for the most common
prospect industries to sanity-check against. **If the user's country isn't
listed, generate the term yourself; don't refuse.**

| Country (lang) | "plumber" | "electrician" | "bakery" | "barber/salon" | "cleaner" |
|---|---|---|---|---|---|
| Germany (de) | Klempner / Sanitärinstallateur | Elektriker | Bäckerei | Friseur / Friseursalon | Reinigung |
| France (fr) | Plombier | Électricien | Boulangerie | Coiffeur / Salon de coiffure | Nettoyage |
| Spain (es) | Fontanero | Electricista | Panadería | Peluquería / Barbería | Limpieza |
| Italy (it) | Idraulico | Elettricista | Panetteria / Forno | Parrucchiere / Barbiere | Pulizie |
| Denmark (da) | Blikkenslager / VVS | Elektriker | Bager / Bageri | Frisør | Rengøring |
| Sweden (sv) | Rörmokare / VVS | Elektriker | Bageri | Frisör | Städ |
| Norway (no) | Rørlegger | Elektriker | Bakeri | Frisør | Renhold / Vaskehjelp |
| Netherlands (nl) | Loodgieter | Elektricien | Bakkerij | Kapper / Kapsalon | Schoonmaak |
| Poland (pl) | Hydraulik | Elektryk | Piekarnia | Fryzjer | Sprzątanie |
| Portugal/Brazil (pt) | Encanador | Eletricista | Padaria | Cabeleireiro / Barbearia | Limpeza |
| Japan (ja) | 配管工 | 電気工事 | パン屋 / ベーカリー | 美容室 / 床屋 | 清掃 |
| China (zh) | 水管工 | 电工 | 面包店 | 理发店 / 美发店 | 保洁 |
| Korea (ko) | 배관공 | 전기공 | 빵집 / 베이커리 | 미용실 / 이발소 | 청소 |
| Turkey (tr) | Tesisatçı | Elektrikçi | Fırın / Pastane | Kuaför / Berber | Temizlik |
| Greece (el) | Υδραυλικός | Ηλεκτρολόγος | Φούρνος | Κομμωτήριο | Καθαρισμός |

For multilingual countries pick the dominant language(s) for the city:
- Switzerland: de (Zürich, Bern, Basel), fr (Geneva, Lausanne), it (Lugano)
- Belgium: nl (Antwerp, Ghent), fr (Brussels — use both, Liège, Charleroi)
- Canada: en (most), fr (Montreal, Quebec City — use both)
- Spain: es default, ca for Barcelona/Valencia (also try Catalan term)
- Finland: fi default, sv for Vaasa/Turku coast (try both)

## Fuzzy-match rules (for verification)

Used by `prompts/social-verify.md` and the phone-dedupe step in Phase 2.7.

**Business-name match** (link → Maps name):
- Compare lowercased, accent-stripped, whitespace/punctuation-normalized strings.
- Strip common business suffixes before comparing: `gmbh`, `gmbh & co kg`, `ag`, `ltd`, `llc`, `inc`, `bv`, `sa`, `sas`, `srl`, `oy`, `ab`, `aps`, `as`, `sl`, `kft`, `s.r.o.`, `co.`, `& sons`.
- Treat as match if either:
  - The normalized strings are equal, OR
  - One is a prefix or suffix of the other AND the shared part is ≥ 60% of the shorter string, OR
  - All non-stopword tokens of the Maps name appear in the link page's title/H1/meta-description.
- Reject if the link page shows a different city or a clearly different brand even when one name contains the other.

**Phone match** (for dedupe):
- Strip everything except digits.
- Strip the country calling code if present (so `+49 30 12345678` and `030 12345678` match).
- Two phones match if the remaining 7+ trailing digits are equal.

**Address match** (used as a tiebreaker when the name is ambiguous):
- Match the **street name** plus the **house number** (lowercased, accent-stripped). City alone is not enough.

## Output `.md` schema

The skill produces exactly this structure. Section headers are stable so the
file can be parsed/diffed by other tools.

```markdown
# Prospects: <industry> in <country>

- **Run date:** YYYY-MM-DD
- **Cities:** <city1>, <city2>, ...
- **Native keywords used:** <term1>, <term2>, ...
- **Quality bar:** ≥ 1 review (no star-rating filter)
- **Output file:** <relative path>

## Summary
<filled in Phase 3 — leave the placeholder line `<!-- summary placeholder -->` until then>

| City | Scanned | No website | Broken | Outdated | Total qualified |
|---|---|---|---|---|---|
| <city> | <n> | <n> | <n> | <n> | <n> |
| **Total** | <n> | <n> | <n> | <n> | <n> |

---

## <City>

### <Business Name>

- **Why qualifies:** no_website | broken | outdated (judged: dated|broken_visually)
- **Phone:** <e.164 or local>
- **Email:** <or empty if not found>
- **Address:** <street, postal, city>
- **Rating:** <X.X>★ (<n> reviews)
- **Google Maps:** <listing URL>
- **Website (current):** <URL or "none">
- **Channels (verified):**
  - Instagram: <URL>
  - Facebook: <URL>
  - WhatsApp: <URL>
  - <only list channels that were verified>
- **Channels (not found):** <comma-separated list of channels checked but not confirmed>

### <next business>
...

---

## <Next City>
...

---

## Skipped (low quality)
- <Business> — <city> — <reason: 0 reviews>

## Skipped (modern site)
- <Business> — <city> — <website URL> (judged: modern)

## Skipped (duplicate)
- <Business> — <city> — same phone as <other business>
```

Notes on the schema:
- Per-business sections use `### <Business Name>` so they're easy to grep.
- The `Channels (not found)` line is filled with the channels you actually checked but couldn't verify — leave channels you didn't check off the list entirely. This makes coverage explicit without bloat.
- Always include the `<!-- resume-key: <name>|<address> -->` HTML comment on the line directly above each `### <Business Name>` heading — it's the resume key. The Maps URL is no longer captured (it cost too many round-trips for too little value).
- "Why qualifies" is the most important field for downstream outreach (it sets the pitch). Keep it short.
