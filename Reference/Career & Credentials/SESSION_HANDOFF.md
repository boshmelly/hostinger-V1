# Remote 2nd Job — Session Handoff
**Date:** 28 May 2026 | **User:** Olaitan Seweje (Ola) | **Email:** olamellila@gmail.com

---

## GOAL
7 fully remote job interviews within 30 days of May 2026. Second income minimum £1,000/month, target £2,000/month.

---

## JOB SEARCH PREFERENCES

- Fully remote only. No hybrid.
- Residency: Nigeria + UK — use whichever avoids overqualification.
- Sweet spot: middle management. Not operative, not project lead (unless pay is very strong).
- Search and present jobs in batches of 10–20. Ask 2 pre-qualifying questions before drafting applications.
- No job location needed in outputs.

### Target Roles (priority order)
1. Marketing Automation Manager (NOT social media)
2. AI Product Manager
3. Customer Success Manager / Team Leader
4. Implementation Manager (SaaS)
5. Construction remote — Roads/Highways, Airports, Data Centres, Residential ONLY
6. Airbnb / Short-Stay remote operations

---

## CANDIDATE PROFILE (from Master CV)

**File:** `Ola  Seweje Master CV PFQ.docx` (in project folder)

- 8+ years: customer success, programme coordination, implementation management
- CRM/Tools: **HubSpot ✓, Salesforce ✓**, Jira, Smartsheet, M365, SharePoint, Git
- NOT experienced in: Marketo, Klaviyo, Braze (but fast learner)
- No formal CSM metrics on CV, but has real-life customer success management experience
- Identified revenue opportunities → 25% departmental income increase
- Reduced support tickets 30%, missed SLAs 28%, processing time 17%, first-day queries 40%
- 95% client satisfaction sustained across multi-stakeholder programmes
- Enterprise clients: Thames Water, Cadent Gas
- Line managed: contractors, site teams (Islington functional management)
- Education: BA Business Administration, University of Greenwich
- Certs: NRSWA 301 & 321, CDM 2015, NHSS 12D M7, Lantra M7, CSCS

### Interview Preferences
- Answer architecture: **Claim → Proof (one example) → Traits → Close on why this role**
- 30-90 day framework: **MAPS (Meet, Assess, Plan, Show)**
- Avoid: generic openers. Lead with what you get called in to fix.

---

## CVs CREATED (all in project folder)

| File | Target Role |
|------|-------------|
| `Ola_Seweje_CV_Lifecycle_Marketing.docx` | Customer Lifecycle Marketing Manager |
| `Ola_Seweje_CV_CSM_TeamLeader.docx` | Customer Success Team Leader |
| `Ola_Seweje_CV_Enterprise_CSM.docx` | Enterprise CSM (Ultralytics / AI companies) |
| `Ola_Seweje_CV_Implementation_Manager.docx` | Implementation Manager (SaaS) |
| `Ola_Seweje_TM_Manager_HS2.docx` | TM Manager HS2 (already submitted) |
| `Ola_Seweje_Web_CV.html` | Web CV page with clickable apply links |

---

## ACTIVE APPLICATIONS & PIPELINE

**Data file:** `job-pipeline/data/all_jobs_log.csv`

### Applied / Applying (4 roles — batch 1, found 27 May)
| Role | Company | Score | Status |
|------|---------|-------|--------|
| Customer Lifecycle Marketing Manager | Michael Page Digital | 7 | Applying |
| Customer Success Team Leader | Euro London | 6 | Applying |
| Enterprise CSM | Ultralytics | 6 | Applying |
| Implementation Manager (SaaS) | Michael Page Sales | 5 | Applying |

### New Batch — Found 28 May (NOT YET ACTIONED — needs pre-qualifying questions)

These are in the CSV with status `found`, `draft`, or `no_contact`. High scorers to prioritise:

| Score | Role | Company | Link |
|-------|------|---------|------|
| 10 | Marketing Automation Manager (EMEA) | HiCareer | [LinkedIn](https://www.linkedin.com/jobs/view/marketing-automation-manager-at-hicareer-4195855128) |
| 9 | Customer Success Manager (Tech Startup) | Rankbreeze | [WWR](https://weworkremotely.com/remote-jobs/rankbreeze-customer-success-manager-tech-startup-1) |
| 9 | Head of Customer Success & Operations | Socialware | [WWR](https://weworkremotely.com/remote-jobs/socialware-head-of-customer-success-operations) |
| 9 | Technical CSM (EMEA) | PostHog | [Ashby](https://jobs.ashbyhq.com/posthog/0be1b52c-2401-4ae2-b7fc-5d018c1ff96f) |
| 9 | Senior Implementations Program Manager | Remote.com | [Greenhouse](https://job-boards.greenhouse.io/remotecom/jobs/7684296003) |
| 9 | Customer Success Manager | LeadSimple | [WWR](https://weworkremotely.com/remote-jobs/leadsimple-inc-customer-success-manager-1) |
| 8 | Senior CSM – HR/ER SaaS | RecruitmentRevolution | [Reed](https://www.reed.co.uk/jobs/senior-customer-success-manager-hr-er-saas-tech-remote-cheshire/56850851) |
| 8 | CRM Campaign & Lifecycle Manager | Michael Page Digital | [Reed](https://www.reed.co.uk/jobs/crm-campain-and-lifecycle-manager-uk-remote/56807074) |
| 8 | Product Manager (EMEA) | HiCareer | [LinkedIn](https://www.linkedin.com/jobs/view/product-manager-at-hicareer-4151309874) |
| 8 | CSM | ContentJet Inc. | [WWR](https://weworkremotely.com/remote-jobs/contentjet-inc-customer-success-manager-needed) |
| 8 | CSM and Leader | Tiller | [WWR](https://weworkremotely.com/remote-jobs/tiller-customer-success-manager-and-leader) |
| 7 | CSM – Coach Management Platform | Michael Page Sales | [Reed](https://www.reed.co.uk/jobs/customer-success-manager-coach-management-platform/56866656) |
| 7 | Manager CRM Email Marketing | Interview Kickstart | [Remotive](https://remotive.com/remote/jobs/marketing/manager-crm-email-marketing-4551273) |
| 7 | Implementation Manager | Relatient | [Remotive](https://remotive.com/remote/jobs/project-management/implementation-manager-4063897) |
| 7 | AI/ML Product Manager | TechStarsGroup | [Himalayas](https://himalayas.app/companies/techstarsgroup/jobs/ai-ml-product-manager) |

**ACTION NEEDED IN NEXT SESSION:** Ask Ola the 2 pre-qualifying questions for this batch, then draft tailored applications / outreach emails.

---

## INFRASTRUCTURE SET UP

### Scheduled Task
- **Name:** `remote-job-daily-scraper`
- **Schedule:** Every day at 4:00 AM
- **Action:** Scrapes Reed, LinkedIn, Indeed for remote jobs posted in last 24hrs, scores vs Ola's profile, drops under 5, saves to `job-pipeline/output/jobs_YYYY-MM-DD.md` and appends to `all_jobs_log.csv`
- **Location:** `/Users/user/Documents/Claude/Scheduled/remote-job-daily-scraper/SKILL.md`
- ⚠️ Run manually once from the Scheduled panel to pre-approve tools.

### Job Application Counter
- Current count: **4 applied** (batch 1)
- Update the CSV status column from `applying` → `applied` once Ola confirms submission
- Track interviews booked separately — target is 7

### Files & Folders
```
Remote 2nd Job/
├── job-pipeline/
│   ├── data/all_jobs_log.csv        ← master job log (update statuses here)
│   └── output/jobs_YYYY-MM-DD.md    ← daily scraper output
├── Ola_Seweje_CV_*.docx             ← 4 tailored CVs
├── Ola_Seweje_Web_CV.html           ← shareable web CV with apply links
├── HS2_Interview_Prep_Ola_Seweje.docx ← HS2 interview done (28 May)
└── SESSION_HANDOFF.md               ← this file
```

---

## HS2 INTERVIEW (COMPLETED)
- **Role:** Traffic Management Manager, Area East (Euston) — SCS JV (Skanska/Costain/Strabag)
- **Interview date:** 28 May 2026
- **Prep guide:** `HS2_Interview_Prep_Ola_Seweje.docx`
- **Tell Me About Yourself** and **30-90 day MAPS answer** drafted in previous session.

---

## PENDING / OPEN ITEMS
1. **Pre-qualify and apply — batch 2** (28 May jobs above, 15 roles score 7+)
2. **Dispatch chat deletion** — Ola asked to delete dispatch chats except: Ad Brief, Video Ad Script, £27 Funnel. Platform unknown — clarify in next session.
3. Update CSV status to `applied` as Ola confirms submissions
4. Track interview bookings — goal is 7 total
