// Push data/intel.json into Supabase. Optional — the app runs without it.
// Usage:
//   1) create tables: run supabase/schema.sql in the Supabase SQL editor
//   2) set env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//   3) npm run load:supabase
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const intel = JSON.parse(readFileSync(join(__dirname, "../data/intel.json"), "utf8"));

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.");
  process.exit(1);
}

let createClient;
try {
  ({ createClient } = await import("@supabase/supabase-js"));
} catch {
  console.error("Run: npm i @supabase/supabase-js");
  process.exit(1);
}
const db = createClient(URL, KEY);

const leads = [...(intel.qualified || []), ...(intel.honourable || [])].map((l) => ({
  name: l.name, verified: l.verified, sector: l.sector, city: l.city, region: l.region,
  has_website: l.has_website, website_url: l.website_url, digital_summary: l.digital_summary,
  review_count: l.review_count, phone: l.phone, email: l.email, owner_name_public: l.owner_name_public,
  source_urls: l.source_urls, score_digital_gap: l.score_digital_gap, score_margin: l.score_margin,
  score_reachability: l.score_reachability, score_deal_fit: l.score_deal_fit, score_location: l.score_location,
  score_total: l.score_total, tier: l.tier, confidence: l.confidence, best_doorway: l.best_doorway,
  deal_model: l.deal_model, opening_approach: l.opening_approach, top_questions: l.top_questions,
  free_value_hook: l.free_value_hook, problem_discovery_question: l.problem_discovery_question,
}));

const contacts = [
  ...(intel.brokers || []).map((c) => ({ name: c.name, kind: c.type, specialties: c.specialties, region: c.region, website: c.website, phone: c.phone, email: c.email, why_relevant: c.why_relevant, source_url: c.source_url })),
  ...(intel.buyers || []).map((c) => ({ name: c.name, kind: c.type, specialties: c.specialties, region: c.region, website: c.website, phone: c.phone, email: c.email, why_relevant: c.why_relevant, source_url: c.source_url })),
];

const schemes = [intel.funding?.ireland, intel.funding?.ukScotland].filter(Boolean).flatMap((r) =>
  (r.schemes || []).map((s) => ({ region: r.region, scheme: s.scheme, body: s.body, funds: s.funds, match_or_cap: s.match_or_cap, eligibility: s.eligibility, how_agency_uses_it: s.how_agency_uses_it, source_url: s.source_url }))
);

for (const [table, rows] of [["leads", leads], ["contacts", contacts], ["funding_schemes", schemes]]) {
  if (!rows.length) { console.log(`skip ${table} (0 rows)`); continue; }
  const { error } = await db.from(table).insert(rows);
  if (error) console.error(`${table}:`, error.message);
  else console.log(`inserted ${rows.length} → ${table}`);
}
console.log("done.");
