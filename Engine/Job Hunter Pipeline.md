# Job Hunter Pipeline

> Autonomous 12-hour job-hunting pipeline. Separate from the money engines — keep here so it isn't lost.
> Source: consolidated from scattered AI memory, 2026-06-25.

**Location:** `~/Desktop/Job Hunter Agent/02 Projects/Job Hunter Pipeline/`

**Flow:** scrape LinkedIn + Indeed → score via AI → generate tailored CV → enrich contacts → 3-email drip → halt on reply → HTML report.

**Scripts:** apify_integration.py, job_evaluator.py, cv_generator.py, contact_enricher.py, email_sequence.py, webhook_listener.py, reporter.py, main.py

**Run:** `python scripts/main.py` from pipeline root (`--dry-run` to test). GitHub Actions at `.github/workflows/job_hunter.yml` fires 06:00 and 18:00 UTC.

**Status (2026-05-21):** All scripts written and syntax-checked. Needs before live: ANTHROPIC_API_KEY, Gmail OAuth tokens, Calendar booking link in `config/.env`.
