# skill-map.md — What AI Tools I Have and When to Use Them

> The third core Library of Tools file (after `mi.md` and `vault-map.md`).
> Tells any AI which skills, plugins, and agents exist here, and WHEN to reach for each.
> Don't open every agent file. Use the buckets below to pick, then load only what you need.
> Updated: 2026-06-22.

---

## Skills (slash-invokable, installed locally + via plugins)

| Skill | What it does | Reach for it when |
|-------|--------------|-------------------|
| **Stitch trio** (stitch-design, stitch-build, stitch-utilities) | Google design-to-code. Generate screens, convert code↔design, build React/Vite/shadcn | Building or migrating a UI; turning a mockup into real components |
| **frontend-design** | Production-grade, non-generic frontend code | Any landing page, dashboard, or web component |
| **ui-ux-pro-max** | UI/UX intelligence: 67 styles, palettes, font pairings, charts, stacks | Choosing look/feel, palette, type, or reviewing UI code |
| **higgsfield-generate** | Images + video (GPT Image 2, Seedance, Marketing Studio ads/UGC) | "Make an image/video/ad", animate a photo, brand clip |
| **higgsfield-soul-id** | Train a model on a face (digital twin) | Want Ola's face consistent across generated media |
| **higgsfield-product-photoshoot** | Brand-quality product/lifestyle shots | Product photos, hero banners, ad creative |
| **higgsfield-marketplace-cards** | Compliant marketplace listing images | Amazon/Etsy/marketplace product cards |
| **small-business (SMB) suite** | cash-flow, invoice-chase, month-end, business-pulse, lead-triage, margin, content-strategy, contract-review, canva-creator | Running the back office: money in, money out, close, leads, pricing |
| **sales** (account-research, call-prep, pipeline-review, forecast, draft-outreach, create-an-asset) | Full sales cycle support | Prospecting, prepping calls, building a sales asset, forecasting |
| **marketing** (campaign-plan, seo-audit, email-sequence, content-creation, performance-report) | Campaign and content marketing | Planning a campaign, SEO, email nurture |
| **brand-voice** (discover, generate-guidelines, enforce-voice) | Capture and apply a brand voice | Locking Melly voice, keeping content on-brand |
| **operations** (runbook, risk-assessment, process-doc, process-optimization) | Document and tighten processes | Turning a repeatable task into an SOP/runbook |
| **product-management** (write-spec, roadmap, sprint-planning, brainstorm) | Product specs and planning | Speccing a tool/feature, planning a build |
| **data** (analyze, build-dashboard, sql, create-viz) | Data analysis + dashboards | Crunching numbers, building a report/dashboard |
| **design** (design-system, ux-copy, accessibility, design-handoff) | Design system + handoff | Spec sheets for a builder, a11y checks |
| **Docs** (anthropic-skills: docx, pptx, pdf, xlsx) | Generate Word/PowerPoint/PDF/Excel files | Producing a polished deliverable file |
| **fractional-business-partner-advisor** | Strategy advisor, business-partner lens | High-level "what should I do" calls — Ola's positioning |
| **skill-creator** | Build new reusable skills | Packaging a repeatable workflow into a skill |
| **schedule** | Cron / scheduled cloud agents | "Run this every Monday", recurring routines |
| **cowork-starter-pack / productivity** | Workspace setup, tasks, memory, daily brief | Standing up a workspace, task tracking, good-morning/EOD |

---

## Agents — 153 in `~/.claude/agents/`, bucketed

Most are a library to pull from, not daily drivers. Buckets, counts, and when to use:

| Bucket | Count | Use when |
|--------|------:|----------|
| **Orchestration / PM** (agents-orchestrator, project-manager-senior, specialized-chief-of-staff, project-management-*, specialized-workflow-architect) | ~9 | Running a multi-step build, coordinating, breaking spec into tasks |
| **Sales** (sales-* : deal-strategist, coach, pipeline-analyst, outbound-strategist, proposal, discovery, engineer, account-strategist, offer-lead-gen) | ~13 | Anything in the sales cycle, from offer design to deal review |
| **Marketing / Content** (marketing-* : seo, social, linkedin, email, content-creator, growth-hacker, podcast, plus China platforms douyin/weibo/xiaohongshu/bilibili/wechat/etc.) | ~40 | Content, SEO, social. China specialists = ignore unless targeting China |
| **GIS / Geospatial** (gis-*) | ~13 | Not relevant to current business. Park it |
| **Security** (security-*) | ~10 | Pen-test, cloud security, compliance audit — only if a build needs it |
| **Testing / QA** (testing-*) | ~9 | Validating a build before ship; evidence + reality checks |
| **Finance** (chief-financial-officer, support-finance-tracker, specialized-pricing-analyst, accounts-payable, loan-officer) | ~5 | Pricing, cash, payments, financial modelling |
| **Operations** (operations-manager, studio-operations, workflow-optimizer, supply-chain, change-management, automation-governance) | ~7 | Process design, efficiency, automation governance |
| **Product** (product-manager, sprint-prioritizer, feedback-synthesizer, trend-researcher, behavioral-nudge) | ~5 | Building/refining a tool or offer |
| **Customer / Support** (customer-service, customer-success, support-*, hospitality-guest-services, retail-returns) | ~9 | Client support, success, guest ops (Airbnb angle) |
| **Legal / Compliance** (legal-*, data-privacy-officer, compliance-auditor) | ~6 | Contract review, intake, privacy, compliance |
| **Real estate / Property** (real-estate-buyer-seller, specialized-civil-engineer, loan-officer-assistant) | ~3 | Property deals, BRRR, structural/finance angles |
| **Engineering / XR / macOS** (xr-*, visionos, macos-*, lsp-index, terminal-integration, specialized-mcp-builder, specialized-salesforce) | ~12 | Niche dev work. mcp-builder is the useful one (custom integrations) |
| **Strategy / Specialist** (business-strategist, specialized-strategy-duel, executive-summary-generator, organizational-psychologist, personal-growth-mentor, document-generator) | ~8 | Strategy calls, exec summaries, growth coaching, doc generation |
| **HR / Training / Misc** (hr-onboarding, recruitment, corporate-training, grant-writer, study-abroad, language-translator, healthcare-*, China business navigators) | ~14 | Edge cases. Pull only when the exact need lands |

---

## Ola's go-to stack — offers mapped to the assets that deliver them

| Offer | Lead with | Back up with |
|-------|-----------|--------------|
| **£30 Digital Business Audit** | fractional-business-partner-advisor + executive-summary-generator | docx/pdf skill for the deliverable; business-pulse for SMB data pulls |
| **£200 "Be Claude Ready in 72 Hours"** | operations runbook + process-doc; skill-creator | specialized-mcp-builder for tool wiring; senior-project-manager to scope |
| **£3K RevenueDrive Back Office AI Stack** | agents-orchestrator + project-manager-senior | sales bucket (deal-strategist, pipeline-analyst), automation-governance-architect, operations-manager, data/dashboard skills |
| **Content / Profile (KPI Publish + Profile)** | marketing-linkedin-content-creator + brand-voice (enforce) | higgsfield-generate for media, canva-creator for posts |
| **Property deals** | real-estate-buyer-seller + specialized-pricing-analyst | contract-review skill, specialized-civil-engineer for surveys |
| **Airbnb audit tool** | product-manager + write-spec | hospitality-guest-services for ops; pdf skill for the checker output |

**Daily drivers:** agents-orchestrator, project-manager-senior, business-strategist, fractional-business-partner-advisor, the sales bucket, operations-manager, marketing-linkedin-content-creator. Everything else is a library — pull on demand, don't load by default.
