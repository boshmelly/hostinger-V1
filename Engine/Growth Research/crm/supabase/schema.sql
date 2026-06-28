-- Gap-Intel CRM — Supabase / Postgres schema
-- Run in the Supabase SQL editor (or `psql`) to create the tables.
-- The app runs JSON-first without this; use Supabase when you want a live,
-- editable, multi-user CRM. Load data with: npm run load:supabase

create table if not exists leads (
  id            bigint generated always as identity primary key,
  name          text not null,
  verified      boolean default false,
  sector        text,
  city          text,
  region        text,                       -- Ireland | Scotland | London
  has_website   boolean,
  website_url   text,
  digital_summary text,
  review_count  text,
  phone         text,
  email         text,
  owner_name_public text,
  source_urls   jsonb,
  score_digital_gap numeric,
  score_margin      numeric,
  score_reachability numeric,
  score_deal_fit    numeric,
  score_location    numeric,
  score_total       numeric,
  tier          text,                        -- qualified | honourable
  confidence    text,
  best_doorway  text,
  deal_model    text,
  opening_approach text,
  top_questions jsonb,
  free_value_hook text,
  problem_discovery_question text,
  -- working CRM fields
  status        text default 'new',          -- new | contacted | value-delivered | in-talks | won | lost
  next_action   text,
  owner_user    text,                         -- who on your team owns it
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create table if not exists contacts (
  id            bigint generated always as identity primary key,
  name          text not null,
  kind          text,                         -- business broker | M&A advisor | buyer | search fund | funding broker
  specialties   text,
  region        text,
  website       text,
  phone         text,
  email         text,
  why_relevant  text,
  source_url    text,
  created_at    timestamptz default now()
);

create table if not exists funding_schemes (
  id            bigint generated always as identity primary key,
  region        text,                         -- Ireland | UK & Scotland
  scheme        text not null,
  body          text,
  funds         text,
  match_or_cap  text,
  eligibility   text,
  how_agency_uses_it text,
  source_url    text
);

-- Pipeline / interaction log — every touch on a lead (the "support" layer)
create table if not exists interactions (
  id            bigint generated always as identity primary key,
  lead_id       bigint references leads(id) on delete cascade,
  type          text,                         -- call | email | visit | value-delivered | review-received
  notes         text,
  outcome       text,
  occurred_at   timestamptz default now()
);

create index if not exists idx_leads_tier on leads(tier);
create index if not exists idx_leads_region on leads(region);
create index if not exists idx_leads_status on leads(status);
