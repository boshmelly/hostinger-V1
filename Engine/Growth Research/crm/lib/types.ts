// Shape of the intelligence data produced by the gap-intel-pilot workflow.

export type Tier = "qualified" | "honourable";

export interface Lead {
  name: string;
  verified: boolean;
  verify_notes?: string;
  sector?: string;
  city?: string;
  region: string; // Ireland | Scotland | London
  has_website?: boolean;
  website_url?: string;
  digital_summary?: string;
  review_count?: string;
  phone?: string;
  email?: string;
  owner_name_public?: string;
  source_urls?: string[];
  score_digital_gap?: number;
  score_margin?: number;
  score_reachability?: number;
  score_deal_fit?: number;
  score_location?: number;
  score_total: number;
  tier: Tier | string;
  confidence?: string;
  best_doorway?: string;
  deal_model?: string;
  opening_approach?: string;
  top_questions?: string[];
  free_value_hook?: string;
  problem_discovery_question?: string;
  // CRM working fields (default-seeded, editable in app/Supabase)
  status?: string; // new | contacted | value-delivered | in-talks | won | lost
  next_action?: string;
}

export interface Contact {
  name: string;
  type: string; // business broker | M&A advisor | buyer/acquirer | search fund | funding broker
  specialties?: string;
  region?: string;
  website?: string;
  phone?: string;
  email?: string;
  why_relevant?: string;
  source_url?: string;
}

export interface FundingScheme {
  scheme: string;
  body?: string;
  funds?: string;
  match_or_cap?: string;
  eligibility?: string;
  how_agency_uses_it?: string;
  source_url?: string;
}

export interface FundingRegion {
  region: string;
  schemes: FundingScheme[];
  sourcing_criteria?: string;
}

export interface Intel {
  generated_for: string;
  generated_at?: string;
  counts: Record<string, number>;
  qualified: Lead[];
  honourable: Lead[];
  brokers: Contact[];
  buyers: Contact[];
  funding: { ireland: FundingRegion | null; ukScotland: FundingRegion | null };
}
