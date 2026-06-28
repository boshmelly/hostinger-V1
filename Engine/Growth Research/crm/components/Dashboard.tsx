"use client";

import { useMemo, useState } from "react";
import type { Intel, Lead, Contact } from "../lib/types";

type Tab = "leads" | "network" | "funding" | "playbook";

export default function Dashboard({ intel }: { intel: Intel }) {
  const [tab, setTab] = useState<Tab>("leads");
  const allLeads = useMemo(
    () => [...(intel.qualified || []), ...(intel.honourable || [])],
    [intel]
  );

  return (
    <main className="wrap">
      <header className="top">
        <div>
          <h1>Gap-Intel CRM</h1>
          <p className="sub">
            Weak-digital, sensible-margin SMEs · Ireland · Scotland · outer London ·
            generated {intel.generated_at || "—"}
          </p>
        </div>
        <div className="stat-row">
          <Stat n={intel.qualified?.length || 0} label="Qualified ≥7.5" tone="good" />
          <Stat n={intel.honourable?.length || 0} label="Honourable" tone="mid" />
          <Stat n={intel.brokers?.length || 0} label="Brokers" />
          <Stat n={intel.buyers?.length || 0} label="Buyers" />
        </div>
      </header>

      <nav className="tabs">
        <TabBtn t="leads" tab={tab} set={setTab}>Leads ({allLeads.length})</TabBtn>
        <TabBtn t="network" tab={tab} set={setTab}>Brokers &amp; Buyers</TabBtn>
        <TabBtn t="funding" tab={tab} set={setTab}>Funding</TabBtn>
        <TabBtn t="playbook" tab={tab} set={setTab}>Playbook &amp; Vault</TabBtn>
      </nav>

      {tab === "leads" && <Leads leads={allLeads} />}
      {tab === "network" && <Network brokers={intel.brokers || []} buyers={intel.buyers || []} />}
      {tab === "funding" && <Funding intel={intel} />}
      {tab === "playbook" && <Playbook />}
    </main>
  );
}

function Stat({ n, label, tone }: { n: number; label: string; tone?: "good" | "mid" }) {
  return (
    <div className={`stat ${tone || ""}`}>
      <div className="stat-n">{n}</div>
      <div className="stat-l">{label}</div>
    </div>
  );
}

function TabBtn({ t, tab, set, children }: { t: Tab; tab: Tab; set: (t: Tab) => void; children: React.ReactNode }) {
  return (
    <button className={tab === t ? "tab on" : "tab"} onClick={() => set(t)}>
      {children}
    </button>
  );
}

function Leads({ leads }: { leads: Lead[] }) {
  const [region, setRegion] = useState("all");
  const [tier, setTier] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Lead | null>(null);

  const regions = ["all", ...Array.from(new Set(leads.map((l) => l.region).filter(Boolean)))];

  const filtered = leads.filter((l) => {
    if (region !== "all" && l.region !== region) return false;
    if (tier !== "all" && l.tier !== tier) return false;
    if (q && !(`${l.name} ${l.sector} ${l.city} ${l.deal_model}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  return (
    <section>
      <div className="filters">
        <input placeholder="Search name / sector / city…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          {regions.map((r) => <option key={r} value={r}>{r === "all" ? "All regions" : r}</option>)}
        </select>
        <select value={tier} onChange={(e) => setTier(e.target.value)}>
          <option value="all">All tiers</option>
          <option value="qualified">Qualified ≥7.5</option>
          <option value="honourable">Honourable</option>
        </select>
        <span className="count">{filtered.length} shown</span>
      </div>

      <table className="grid">
        <thead>
          <tr>
            <th>Score</th><th>Business</th><th>Sector</th><th>Region</th>
            <th>Digital gap</th><th>Deal model</th><th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((l, i) => (
            <tr key={i} onClick={() => setOpen(l)} className="row">
              <td><Score v={l.score_total} tier={String(l.tier)} /></td>
              <td className="b">{l.name}</td>
              <td>{l.sector}</td>
              <td>{l.region}</td>
              <td className="dim">{l.digital_summary || (l.has_website ? "site, weak reviews" : "no website")}</td>
              <td className="dim">{l.deal_model}</td>
              <td className="dim">{l.phone || l.email || (l.website_url ? "web" : "—")}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={7} className="empty">No leads yet — seed data/intel.json from the workflow output.</td></tr>
          )}
        </tbody>
      </table>

      {open && <Drawer lead={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

function Score({ v, tier }: { v: number; tier: string }) {
  const cls = tier === "qualified" ? "score good" : "score mid";
  return <span className={cls}>{typeof v === "number" ? v.toFixed(1) : v}</span>;
}

function Drawer({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  return (
    <div className="drawer-bg" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose}>×</button>
        <div className="d-head">
          <Score v={lead.score_total} tier={String(lead.tier)} />
          <h2>{lead.name}</h2>
        </div>
        <p className="sub">{lead.sector} · {lead.city} · {lead.region} · confidence {lead.confidence}</p>

        <div className="d-scores">
          {[
            ["Digital gap", lead.score_digital_gap, 3],
            ["Margin", lead.score_margin, 2.5],
            ["Reach", lead.score_reachability, 1.5],
            ["Deal fit", lead.score_deal_fit, 2],
            ["Location", lead.score_location, 1],
          ].map(([k, v, max]) => (
            <div className="bar" key={k as string}>
              <span>{k}</span>
              <div className="track"><div className="fill" style={{ width: `${((Number(v) || 0) / Number(max)) * 100}%` }} /></div>
              <em>{Number(v) || 0}/{max}</em>
            </div>
          ))}
        </div>

        <Field label="Digital summary" v={lead.digital_summary} />
        <Field label="Best doorway" v={lead.best_doorway} />
        <Field label="Deal model" v={lead.deal_model} />
        <Field label="Opening approach" v={lead.opening_approach} />
        {lead.top_questions?.length ? (
          <div className="field">
            <label>Questions to ask</label>
            <ol>{lead.top_questions.map((qq, i) => <li key={i}>{qq}</li>)}</ol>
          </div>
        ) : null}
        <Field label="Free value hook" v={lead.free_value_hook} />
        <Field label="Problem-discovery question" v={lead.problem_discovery_question} />

        <div className="field">
          <label>Contact (public)</label>
          <div className="contact">
            {lead.phone && <span>📞 {lead.phone}</span>}
            {lead.email && <span>✉️ {lead.email}</span>}
            {lead.owner_name_public && <span>👤 {lead.owner_name_public}</span>}
            {lead.website_url && <a href={lead.website_url} target="_blank" rel="noreferrer">site ↗</a>}
          </div>
        </div>
        {lead.source_urls?.length ? (
          <div className="field">
            <label>Sources (verify before outreach)</label>
            <ul>{lead.source_urls.map((s, i) => <li key={i}><a href={s} target="_blank" rel="noreferrer">{s}</a></li>)}</ul>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function Field({ label, v }: { label: string; v?: string }) {
  if (!v) return null;
  return (
    <div className="field">
      <label>{label}</label>
      <p>{v}</p>
    </div>
  );
}

function Network({ brokers, buyers }: { brokers: Contact[]; buyers: Contact[] }) {
  const Card = (c: Contact, i: number) => (
    <div className="card" key={i}>
      <div className="card-h"><strong>{c.name}</strong><span className="pill">{c.type}</span></div>
      <p className="dim">{c.specialties}</p>
      {c.region && <p className="dim">📍 {c.region}</p>}
      {c.why_relevant && <p className="why">{c.why_relevant}</p>}
      <div className="contact">
        {c.phone && <span>📞 {c.phone}</span>}
        {c.email && <span>✉️ {c.email}</span>}
        {c.website && <a href={c.website} target="_blank" rel="noreferrer">site ↗</a>}
      </div>
    </div>
  );
  return (
    <section>
      <h3>Brokers &amp; advisors ({brokers.length}) — for 1c intros &amp; 2b funded deals</h3>
      <div className="cards">{brokers.map(Card)}</div>
      <h3>Buyers &amp; acquirers ({buyers.length}) — for finder-fee introductions</h3>
      <div className="cards">{buyers.map(Card)}</div>
      {brokers.length + buyers.length === 0 && <p className="empty">Network list seeds from the workflow output.</p>}
    </section>
  );
}

function Funding({ intel }: { intel: Intel }) {
  const regions = [intel.funding?.ireland, intel.funding?.ukScotland].filter(Boolean);
  return (
    <section>
      {regions.length === 0 && <p className="empty">Funding schemes seed from the workflow output.</p>}
      {regions.map((r, i) => (
        <div key={i}>
          <h3>{r!.region}</h3>
          {r!.sourcing_criteria && <p className="why">Sourcing criteria: {r!.sourcing_criteria}</p>}
          <table className="grid">
            <thead><tr><th>Scheme</th><th>Funds</th><th>Match / cap</th><th>How we use it</th></tr></thead>
            <tbody>
              {r!.schemes.map((s, j) => (
                <tr key={j}>
                  <td className="b">{s.source_url ? <a href={s.source_url} target="_blank" rel="noreferrer">{s.scheme}</a> : s.scheme}</td>
                  <td className="dim">{s.funds}</td>
                  <td>{s.match_or_cap}</td>
                  <td className="dim">{s.how_agency_uses_it}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}

function Playbook() {
  const vault = [
    ["\"I get all my work by word of mouth.\"", "You've earned the reputation — but 87% still Google you first and find nothing. We just make the reputation you already have show up."],
    ["\"I don't have time.\"", "You don't need any. We build it, we run it, you carry on. We just need ten minutes to hear what's slowing the business down."],
    ["\"Websites are a waste of money.\"", "A brochure site is. We don't sell pages, we sell booked jobs — and the first one's free."],
    ["\"How much will it cost me?\" (1a)", "Nothing up front. We build and market at our cost and take a slice of the leads we bring you. No work, no fee."],
    ["\"What's the catch with a free website?\"", "No catch. It's yours. We ask for an honest review and the one thing holding the business back — even if we can't fix it."],
    ["\"I'm thinking of selling soon.\"", "Then let's talk about that too. Tidy digital lifts your sale price — and I know the right brokers and buyers for a quiet intro."],
    ["\"AI / my nephew can do a free website.\"", "They do the page. They don't get you found, answer missed calls, chase reviews, or follow up leads. That's the bit that makes money."],
    ["\"I don't trust an outsider with my business.\"", "Fair — that's why we give first. Free build, no contract. You decide if we've earned the next conversation."],
  ];
  return (
    <section className="playbook">
      <h3>The five plays</h3>
      <ul className="plays">
        <li><b>1a</b> % of every lead we generate (high-ticket, zero up-front cost to them)</li>
        <li><b>1b</b> Free website → review → referral (volume / local)</li>
        <li><b>1c</b> Intro a seller to a buyer/broker → finder's fee</li>
        <li><b>2a</b> Free value → digital growth partner (rev-share / earn-in)</li>
        <li><b>2b</b> Broker the deal — funding stack + finder network</li>
      </ul>
      <h3>Objection-handling vault</h3>
      <div className="vault">
        {vault.map(([o, a], i) => (
          <div className="vrow" key={i}>
            <div className="obj">{o}</div>
            <div className="ans">{a}</div>
          </div>
        ))}
      </div>
      <p className="dim">Full system: see <code>Two-Doorway Operating System.md</code> in the vault.</p>
    </section>
  );
}
