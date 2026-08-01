---
name: vps-task-router
type: project
status: active
created: 2026-06-28
---

# VPS Task Router

> Problem it solves: scheduled tasks that run on Mac stop when the laptop closes.
> Fix: route any recurring background task to the VPS (72.61.18.158) via cron.

---

## Decision Rule (use this every time you set up a new task)

| Question | Yes | No |
|----------|-----|-----|
| Does this task need a browser open or a GUI? | → Mac only | → VPS candidate |
| Does this task need to run when my Mac is closed? | → VPS | → Mac OK |
| Is this a recurring background task (scraping, builds, outreach, monitoring, content posting)? | → VPS | → depends |
| Does this task need to respond in real time to user input? | → Mac | → VPS |
| Is this a one-off task I kick off manually? | → Mac | → n/a |

**Default: if it runs more than once a week and doesn't need a browser, put it on VPS cron.**

---

## How to Add a Task to VPS Cron

SSH to VPS first (once key is set up: `ssh klaudius-vps`):

```bash
ssh klaudius-vps
crontab -e
```

Cron format:
```
CRON_TZ=Europe/London
MIN HOUR * * * /command >> /root/my-agency/logs/taskname.log 2>&1
```

Common schedule patterns:
| Schedule | Cron expression |
|----------|----------------|
| Every day 07:00 UK | `0 7 * * *` |
| Every 4h between 06:30-18:30 UK | `30 6,10,14,18 * * *` |
| Mon-Fri 09:00 UK | `0 9 * * 1-5` |
| Every hour | `0 * * * *` |
| Every 2.5 days | `0 0 */3 * *` (approximate, use batch-monitor.py for precision) |

---

## Current VPS Cron Tasks (as of 2026-06-28)

| Task | Script | Schedule (UK) | Log |
|------|--------|---------------|-----|
| **TPS Monitor** (primary health + auto-scale) | `/root/my-agency/scripts/tps-monitor.py` | Every hour (`0 * * * *`) | `/root/my-agency/logs/tps-monitor.log` |
| Klaudius watchdog (Steve escalation backup) | `/root/my-agency/scripts/watchdog.py` | 06:30, 10:30, 14:30, 18:30 | `/root/my-agency/logs/watchdog.log` |
| Batch monitor (inline Python) | `/root/my-agency/scripts/batch-monitor.py` | always-on (process) | tmux window 1 |

### TPS Monitor State Files
| File | Purpose |
|------|---------|
| `/root/my-agency/tps-state.json` | Parallelism level, OOM events, retry timestamps |
| `/root/my-agency/tps-scale.txt` | Current approved parallel level (orchestrator reads this) |

---

## Tasks That Should Move to VPS (previously ran on Mac)

| Task | Why it failed on Mac | VPS fix |
|------|---------------------|---------|
| Job search scraper | Mac was closed for 3 days | Move to VPS cron + email results to Ola |
| Klaudius pipeline | Breaks on permission prompts | Now on VPS with watchdog |
| Content scheduling | If Claude Code local session times out | Use VPS cron + API-based poster |
| Email outreach | Depends on local Python env | Already on VPS via Klaudius orchestrator |

---

## VPS Task Script Template

```python
#!/usr/bin/env python3
"""
Task: [name]
Schedule: [cron expression]
Logs to: /root/my-agency/logs/[name].log
"""
import os, sys
from pathlib import Path

# Load env
def load_env():
    env_file = Path('/root/my-agency/.env')
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if '=' in line and not line.strip().startswith('#'):
                k, _, v = line.partition('=')
                os.environ.setdefault(k.strip(), v.strip().strip('"'))

load_env()

# Your task logic here

if __name__ == '__main__':
    main()
```

---

## Job Search Task — Move to VPS

The job search scheduler that died when the Mac closed needs to be rebuilt as a VPS cron job.

To migrate any Mac-based scheduled task:
1. Copy the task script to `/root/my-agency/scripts/[taskname].py`
2. Add cron entry (see above)
3. Test: `python3 /root/my-agency/scripts/[taskname].py`
4. Remove from Claude Code's local schedule

Tell Steve: "Move [task] to VPS" and Steve will write and deploy the cron job.

---

## Quick Command Reference

```bash
# SSH to VPS
ssh klaudius-vps

# Check all cron jobs
crontab -l

# Check logs
tail -50 /root/my-agency/logs/watchdog.log

# Check all running processes
ps aux | grep python3

# Check tmux sessions
tmux ls

# Attach to Klaudius
tmux attach -t klaudius
```
