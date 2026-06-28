// Data loader. JSON-first so the app runs on Vercel with zero config.
// If Supabase env vars are present, you can switch getIntel() to read from there
// (see supabase/load.mjs to push this same JSON into Postgres).

import intel from "../data/intel.json";
import type { Intel } from "./types";

export function getIntel(): Intel {
  return intel as unknown as Intel;
}
