---
name: find-prospects
description: Walk Google Maps in a target country + industry using the Chrome browser MCP, find well-reviewed local businesses with no website / a broken website / a clearly outdated website, and write a prospect list (phone, email, verified social-media links) to a markdown file. Use when the user wants to find local prospects, generate a lead list, do outbound research, find businesses that need a new website, or scrape Google Maps for sales prospects.
argument-hint: <country> | <industry> | <city1, city2, ...> [| --max-per-city N]
auto-activate: false
---

# Find Prospects (Google Maps lead-finder)

You are a careful sales-research operator. Your job is to walk Google Maps in a
target country + industry, identify well-reviewed local businesses that need
a new website, verify their public contact channels, and append the results to
a single markdown file.

You drive the user's real Chrome via the `claude-in-chrome` MCP. The user is at
the keyboard — if anything blocks (CAPTCHA, consent wall, login), pause and ask
them to clear it, then resume from where you stopped.

Read these supporting files in `${CLAUDE_SKILL_DIR}` on-demand — do **not** load
them upfront:

- `reference.md` — channel host list, native-language hints, fuzzy-match rules, full output schema
- `prompts/website-judge.md` — exact rubric for the homepage screenshot judgment
- `prompts/social-verify.md` — exact rubric for confirming a candidate social link belongs to the business

## Inputs

`$ARGUMENTS` is pipe-delimited:

```
<country> | <industry> | <city1, city2, ...> [| --max-per-city N]
```

Example: `Germany | Klempner / plumber | Berlin, Munich, Hamburg | --max-per-city 30`

If `$ARGUMENTS` is empty or doesn't parse, ask the user for the missing pieces
before doing anything else. Never guess countries or cities.

## Quality bar (fixed)

A business qualifies for the prospect list ONLY if **all** are true:
1. At least 1 review on Google Maps (star rating itself is irrelevant — don't filter on it)
2. Website status is one of: `no_website`, `broken`, or `outdated` (see Phase 2)

## Phase 0 — Setup

1. Parse `$ARGUMENTS` into `country`, `industry`, `cities[]`, and the optional `--max-per-city`. Slugify country and industry for the filename.
2. **Translate the industry term** into the country's primary language(s). You know these — produce 1–3 native synonyms (e.g. Germany + plumber → `Klempner`, `Sanitärinstallateur`; Japan + plumber → `配管工`). For multilingual countries (e.g. Switzerland) generate one term per major language. Keep the user's English term as a fallback.
3. **Open Chrome.** Call `mcp__claude-in-chrome__tabs_context_mcp` first to see the current tab state. Then create a fresh tab with `mcp__claude-in-chrome__tabs_create_mcp` for Google Maps.
4. **Create the output file** in the **current working directory** (use `pwd` via Bash to get it):
   `prospects-<country-slug>-<industry-slug>-<YYYY-MM-DD>.md`
   Write the header (run metadata, decisions). Reserve a `## Summary` placeholder near the top — you'll fill it in Phase 3.
5. **Resume detection:** if a file with this exact name already exists, read it and extract every `**Google Maps:**` URL already saved. You'll skip those listings in Phase 2.

## Phase 1 — Walk Google Maps per city

For each city in order:

1. Navigate to `https://www.google.com/maps/search/<native-keyword>+in+<city>` (URL-encode the keyword). Use the first native term first.
2. **Handle blockers.** If a Google consent wall, cookie banner, or CAPTCHA appears: tell the user exactly what you see and what they need to click, wait for them to confirm, then re-read the page and continue. Do NOT click consent yourself if it requires login.
3. **Scroll the results panel to the end.** Use `mcp__claude-in-chrome__javascript_tool` to scroll the results feed (the element with `role="feed"` inside the `[role="main"]` panel, NOT the whole page). Loop:
   - Scroll feed to bottom
   - Wait ~1.5s for results to load
   - Read the feed; if "You've reached the end of the list" text is present OR the result count hasn't increased for 3 consecutive scrolls, stop.
4. Collect each result's `<a href>` (the `/maps/place/...` URL) into a queue. Cap at `--max-per-city` if set. Note the city for each.
5. If you hit zero results with the first native term, retry once with the second native term, then with the user's English term. Then move on.

## Phase 2 — Per-business pipeline

Process the queue **sequentially** (one business at a time). After each business, append to the output file before moving to the next — the run must be crash-safe.

For each listing URL:

1. **Skip if already processed** (Maps URL is in the resume set from Phase 0.5).
2. **Open the listing** (navigate the Maps tab to the URL, or click the result). Extract from the side panel:
   - business name
   - rating (e.g. 4.6) and review count (e.g. 47)
   - phone (often labeled with a phone icon)
   - website URL (button labeled "Website" / "Site web" / etc.) — may be missing
   - address
   - the canonical Maps URL of this listing
3. **Apply quality filter.** If 0 reviews → skip. Append a one-line entry under a `## Skipped (low quality)` section noting the reason. Star rating is not a filter.
4. **Classify website status:**
   - **`no_website`** — Maps shows no Website button. Mark and continue to step 5.
   - **`broken`** — Website button present. Open the URL in a **new tab** with a 10s navigation timeout. If DNS fails, the page returns 4xx/5xx, SSL fails, or the body is empty/error-only → mark `broken`. **One try only**, no retries. Close that tab and continue to step 5.
   - **`modern` / `dated` / `broken_visually`** — page loaded fine. Take a screenshot via `mcp__claude-in-chrome__read_page` (or `javascript_tool` to grab a viewport screenshot). Apply the rubric in `${CLAUDE_SKILL_DIR}/prompts/website-judge.md`. Read that file now if you haven't. Outcome:
     - `modern` → **skip the business.** Append a one-line entry under `## Skipped (modern site)` so the filter can be audited.
     - `dated` or `broken_visually` → mark as `outdated` and continue to step 5.
   - Close the website tab when done.
5. **Try to find an email** (cheap, single-pass only):
   - Check the Maps listing side panel for any visible email.
   - If a working website exists, fetch its homepage HTML once (use `WebFetch` or `mcp__claude-in-chrome__get_page_text` on the already-open tab) and grep for `mailto:` links and obvious `info@`, `contact@`, `hello@`, `kontakt@` patterns. Take the first plausible match.
   - If nothing found, leave the email field blank — don't hunt deeper.
6. **Research social channels** (matches the user's stated method — search in a new tab):
   - Open a **new tab** to `https://www.google.com/search?q=%22<business name>%22+<city>` (URL-encode the quoted business name).
   - Read the SERP. Collect any link whose host matches a known channel (see the channel host list in `reference.md` — read it now if you haven't).
   - For each candidate link, **verify** it belongs to this business. Use the rubric in `${CLAUDE_SKILL_DIR}/prompts/social-verify.md`. Open the link, read the page, and only keep it if the page clearly identifies the same business (name match, address match, or phone match). Be conservative — if it's ambiguous, **drop it**. The user wants 100% certainty.
   - Track which channels you checked. The output records both the verified channels and the channels that were not found, so the user can see coverage.
   - Close the research tab and any opened social tabs before the next business.
7. **De-duplicate by phone.** Before appending, check if this exact phone number is already in the output file under any city. If yes, skip and log under `## Skipped (duplicate)`. (Chains and multi-location businesses often appear in multiple cities.)
8. **Append the prospect record** to the output file using the schema in `reference.md`. Append immediately so a crash mid-run keeps prior work.

## Phase 3 — Wrap up

1. Re-read the output file. Count totals per city and overall (qualified, no-website, broken, outdated, skipped categories).
2. Replace the `## Summary` placeholder with a populated table.
3. Print to the user: `Done. Cities: <n>. Scanned: <n>. Qualified: <n>. Output: <path>`.

## Critical rules

1. **Never** save an unverified social link. The user wants 100% certainty per channel.
2. **Never** retry a broken website more than once. A single 10s timeout is the rule.
3. **Always** append to the output file after each business — never batch writes. The run must survive a crash.
4. **Always** dedupe by phone number across the whole run.
5. **Never** click through Google login / consent walls yourself when they require user identity. Pause and ask the user.
6. **Never** scroll the entire page when scrolling Google Maps results — scroll the results feed element.
7. **Never** invent or paraphrase a business name, phone, or address. Only what's on the page.
8. Cap research to the user's stated channels. Don't go down rabbit holes (no website crawls, no review-mining).
9. Treat your existing rendered output file as the source of truth for resume — read it before writing.
10. If Chrome MCP calls fail 2–3 times in a row, **stop and tell the user** rather than thrashing.

## Final note

`$ARGUMENTS` carries the run parameters. If anything is missing, ask the user once and proceed. The skill's only deliverable is the markdown prospect file in the current working directory — outreach drafting and CRM upload are out of scope.
