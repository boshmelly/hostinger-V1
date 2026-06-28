# Gap-Intel CRM

A Vercel-ready dashboard for the gap-intelligence pilot: scored weak-digital SME leads
(Ireland / Scotland / outer London), brokers & buyers, regional funding, and the
two-doorway playbook + objection-handling vault.

**Runs JSON-first** — deploy with zero config and it reads `data/intel.json`.
**Supabase optional** — add the database when you want a live, editable, multi-user CRM.

## What's inside
- **Leads** — filter by region / tier / search; click a row for the full score breakdown, the opening approach, the questions to ask, the free-value hook, contact details, and the source URLs to verify before outreach.
- **Brokers & Buyers** — your network for 1c finder-fee intros and 2b funded deals.
- **Funding** — Ireland (LEO Trading Online Voucher etc.) and UK/Scotland schemes, with how to use each.
- **Playbook & Vault** — the five plays and the objection-handling lines.

## Run locally
```bash
cd "Engine/Growth Research/crm"
npm install
npm run dev      # http://localhost:3000
```

## Deploy to Vercel
1. Push this repo (or this subfolder) to GitHub.
2. In Vercel: **New Project** → import → set **Root Directory** to `Engine/Growth Research/crm` → Deploy.
3. No env vars needed for the JSON-first version.

## Optional: Supabase (live CRM)
1. Create a Supabase project. In the SQL editor, run `supabase/schema.sql`.
2. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your shell.
3. `npm run load:supabase` — pushes `data/intel.json` into the `leads`, `contacts`, and `funding_schemes` tables.
4. Edit/track leads in Supabase's table editor, or extend `lib/data.ts` to read from Supabase for a live read path. The `interactions` table logs every touch (the "support" layer).

## Updating the data
`data/intel.json` is produced by the `gap-intel-pilot` workflow. Replace the file and redeploy (or re-run `load:supabase`) to refresh.

> ⚠️ **Verify before outreach.** Lead contact details and digital-gap assessments are AI-researched from public sources with a confidence flag. Re-check each before you contact anyone, and follow the PECR/GDPR notes in `Two-Doorway Operating System.md`.
