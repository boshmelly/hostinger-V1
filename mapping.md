# Big Clean — File Organisation Plan

> **Status:** Sections A–E EXECUTED 2026-06-22. Section F (the ~2,137-file Downloads sweep) NOT run yet.
> Every move is logged in `move-log.txt` (same folder) — that's your undo trail.
> Nothing was deleted: junk sits staged in `~/Downloads/_Review-Delete/` (6.2 GB) for you to bin manually.
> Framework: **ACE** (Atlas = reference knowledge · Calendar = time-based · Efforts = active projects) + a `+Inbox` for anything uncertain.

---

## How the system works (read this first)

You have **two layers**, and they are kept deliberately separate:

| Layer | Lives in | Holds | Rule |
|-------|----------|-------|------|
| **Thinking space** (the vault) | `~/Knowledge/` | Notes + *important, small* reference docs | This is what Obsidian opens and Claude points at. Keep it light. |
| **Digital space** (raw OS files) | `~/Downloads/`, `~/Media/`, `~/Pictures/` | Big media, installers, transient downloads | Not in the vault. Photos and video never go in Knowledge. |

**Going forward (the habit that keeps it clean):**
- `~/Downloads/_Inbox/` = your single dumping ground. Everything new lands here.
- Once a year, sweep the whole of `~/Downloads/` into `_Archive-YYYY/`. Active space stays empty, history is never lost.
- `~/Downloads/_Review-Delete/` = staging bay for installers/junk you'll bin after a glance (the 10MB rule lives here).

---

## Section A — DELETE / REVIEW (reclaim ~6 GB)

These are software junk, not knowledge. Proposed move to `_Review-Delete/` so you can confirm, then bin in one action.

| Current Path | New Path | Reasoning |
|--------------|----------|-----------|
| `Downloads/[FTUApps.com] - Adobe Photoshop 2020...` | `Downloads/_Review-Delete/` | 2.6 GB pirated installer. Source of nearly all the `.dll/.pak/.8bf` noise. Delete. |
| `Downloads/ubuntu-26.04-live-server-arm64.iso` | `Downloads/_Review-Delete/` | 2.9 GB OS image. Re-downloadable anytime. Delete unless mid-install. |
| `Downloads/UTM (1).dmg`, `googlechrome.dmg`, `Telegram.dmg`, `tsetup.5.0.1.dmg` | `Downloads/_Review-Delete/` | App installers. Apps are already installed; the `.dmg` is dead weight. |
| `Downloads/tportable.2.4.7/`, `Telegram Desktop/`, `Microsoft Activation Scripts v1.4/` | `Downloads/_Review-Delete/` | Portable apps / activation scripts. Not knowledge. |

---

## Section B — MEDIA (photos & video → out of Downloads)

| Current Path | New Path | Reasoning |
|--------------|----------|-----------|
| `Downloads/Camera Roll/` (1.6 GB) | `Media/Photos/Camera Roll/` | Personal photo dump. Belongs with media, not Downloads. |
| `Downloads/Tenerife/` + `Tenerife.zip` | `Media/Photos/Tenerife/` | Trip photos. Unzip, keep one copy. |
| `Downloads/Brookhill Professional pictures/` | `Media/Photos/Brookhill/` | Property shoot. |
| `Downloads/VV507174-feeback-images/` (514 MB) | `Media/Photos/` or delete | Feedback images + a 440 MB `.mov`. Review — likely archive or bin. |
| `*.mov`, `*.mp4`, `*.MP4`, `*.MOV` loose in Downloads | `Media/Video/` | All loose video (road works, strategy calls, annotation videos) consolidated. |
| `Downloads/High Resolution Logo Files/` | `Knowledge/Atlas/Business & Systems/Brand Assets/` | Exception: brand logos ARE reference knowledge. Small, used often. |

---

## Section C — ATLAS (reference knowledge → the vault)

Static material you refer back to. Small files only.

| Current Path | New Path | Reasoning |
|--------------|----------|-----------|
| `Documents/Ola Seweje CV-IS.pdf`, `Olaitan Seweje CV-*.docx`, all CVs | `Knowledge/Atlas/Career & Credentials/CVs/` | All CV versions in one place. |
| `Documents/Olaitan Seweje, SWQR, Certs.pdf`, `Downloads/certificates/` | `Knowledge/Atlas/Career & Credentials/Certificates/` | SWQR, certs, qualifications. |
| `Downloads/PMP related/`, `Question_Bank/` | `Knowledge/Atlas/Career & Credentials/PMP/` | Certification study material. |
| `Downloads/Streetworks Supervisor/`, `Net work Co-ord/`, `Havering COuncil/` | `Knowledge/Atlas/Career & Credentials/Highways & Streetworks/` | TfL / highways career history + credibility evidence. |
| `Documents/*payband*.pdf`, `PAYE REG FORM`, `payslip_*` | `Knowledge/Atlas/Career & Credentials/Employment Records/` | Pay, PAYE, employment docs. |
| `Downloads/Ravi Documentations/` (103 MB) | `Knowledge/Atlas/Business & Systems/` or `+Inbox` | Unclear contents — needs a look. |
| `Documents/What is HMO management- FAQ.docx`, property reference docs | `Knowledge/Atlas/Property & Airbnb/Reference/` | HMO/property how-to knowledge. |

---

## Section D — EFFORTS (active projects → the vault)

Things in progress.

| Current Path | New Path | Reasoning |
|--------------|----------|-----------|
| `Downloads/Systems Business/` (53 MB), `Sales stuff/`, `VAs/` | `Knowledge/Efforts/RevenueDrive/` | Active business build — RevenueDrive / Systems With Melly. |
| `Desktop/Mr Melly/` (375 MB) | **stays put** (or symlink into `Efforts/Mr Melly Site/`) | Active codebase/git repo. Do NOT move a git project into a vault — link it instead. |
| `Downloads/Arete Lettings*`, `wetransfer_114-malmstone-ave*`, `wordsworth*`, `Flat 11 Centurion Court.zip`, `Le Pink London*.pdf` | `Knowledge/Efforts/Property Deals/<address>/` | One subfolder per property deal. |
| `Downloads/Al Airbnb_files/`, `SA UP North/` | `Knowledge/Efforts/Airbnb Audit Tool/` | Airbnb / short-let project material. |
| `Documents/22 Maria Street Schedule of Works..docx`, `More details for Bungalow.docx`, valuation reports | `Knowledge/Efforts/Property Deals/` | Live property work. |

---

## Section E — TEMPLATES & CALENDAR

| Current Path | New Path | Reasoning |
|--------------|----------|-----------|
| `Downloads/OneNote Work Templates Notebook/`, `Test test test Templates/`, `Documents/Working Template for.docx` | `Knowledge/Atlas/Templates & Reference/` | Reusable templates. |
| `Downloads/Activity _ Ola S _ LinkedIn_files/` | `Knowledge/Calendar/Meetings & Logs/` or delete | LinkedIn activity export. Time-based; likely archive. |
| Anything dated (meeting notes, daily logs) found during the move | `Knowledge/Calendar/` | Time-anchored notes only. |

---

## Section F — +INBOX (uncertain → manual review)

| Current Path | New Path | Reasoning |
|--------------|----------|-----------|
| `Downloads/Extras/`, `SA UP North/`, `16 test`, `ProjectFiles2x/`, `cowork-starter-pack/` | `Knowledge/+Inbox/` | Ambiguous. You decide where these land. |
| `Documents/Claude/`, `Fax/`, `Zoom/` | review in place | App-generated folders. Check before moving. |
| ~2,200 loose files in `Downloads/` root | `Downloads/_Inbox/` (triage in batches) | Too many to map individually. Sweep into `_Inbox`, then process by type in small batches. |
| Home-folder strays: `HS2.txt`, `Sketch.txt`, `Test.txt`, `Untitled.txt`, `log.txt` | `Knowledge/+Inbox/` or delete | Loose scratch files cluttering your home directory. |

---

## Suggested execution order

1. **Section A** (delete junk) — instant ~6 GB win, zero risk.
2. **Section B** (media out) — biggest space mover.
3. **Sections C–E** (file the valuable stuff into ACE).
4. **Section F** (inbox sweep) — ongoing, in batches.

Tell me which sections to run. I'll move only those, and nothing is ever deleted without you confirming the `_Review-Delete/` contents first.
