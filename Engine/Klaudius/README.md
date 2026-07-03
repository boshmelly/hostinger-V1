# Klaudius — Always-On Website Builder for SMEs

**License:** `-3FR2-Q986-Y9D4-RJQT`

Klaudius is an autonomous website builder for SMEs (target: 1000 sites, 75 built so far). It runs 24/7 on your VPS, independent of your laptop. Queue sites and close the laptop; the VPS works through them 3 at a time.

## Quick start

```bash
# On your laptop
scp -r Engine/Klaudius/scripts ubuntu@your-vps:/tmp/klaudius-scripts

# SSH to the VPS
ssh ubuntu@your-vps

# Run the installer (validates license, checks system, starts the service)
sudo bash /tmp/klaudius-scripts/setup-vps.sh \
  --instance klaudius-prod \
  --user ubuntu \
  --max-concurrent 3

# Queue a build
echo "Build a premium electrician site for Smith Electrical, Watford..." \
  > /opt/klaudius-prod/queue/smithelectrical.co.uk.job

# Watch it run
tail -f /opt/klaudius-prod/logs/runner.log

# Check what's done
ls /opt/klaudius-prod/done
```

That's it. Close the laptop. The VPS runs the queue 24/7.

## What you have

| File | What it does |
|---|---|
| **DEPLOYMENT-TEMPLATE.md** | Copy-paste guide for new VPS/laptop setups. Variables, multi-instance support, troubleshooting. |
| **always-on-builds.md** | How the system works. Why it survives laptop close (systemd service). Daily use commands. |
| **interactive-experiences.md** | 6 premium patterns for SME sites: brand games, quote estimators, before/after, reveals, counters. Ranked by conversion value. |
| **brand-website-design.md** | Bespoke animated sites from a brief. Real copy, real visuals, no wireframes. Claude Design workflow. |
| **service-display-loop.md** | 4-beat service carousel (name / show / prove / ask). Runs on website or fullscreen on in-store screens. |
| **ponytail-integration.md** | Minimal code discipline (YAGNI ladder). Pre-built patterns. QA review workflow. |
| **PR-GLOSSARY.md** | What shipped in each PR, commit history, deployment checkpoints. |
| **scripts/klaudius-runner.sh** | The queue watcher. Runs max 3 builds, logs per-site, auto-recovers from crashes. |
| **scripts/setup-vps.sh** | One-command installer. Parameterized for multiple instances. Validates license + system. |
| **scripts/preflight-check.sh** | Pre-install checks: license, bash, disk, systemd, claude CLI, network. |
| **scripts/klaudius.service** | systemd unit. Keeps the runner alive 24/7, restarts on crash, starts on boot. |

## The workflow

1. **Install once on the VPS** (15 minutes): `setup-vps.sh` creates folders, installs the systemd service, starts it running.

2. **Queue a build** (30 seconds): One line to drop a `.job` file in the queue folder.

3. **Builder runs 24/7** (unattended): Watches the queue, processes max 3 at a time, logs everything, auto-recovers if it crashes.

4. **Check results anytime** (1 second): SSH to the VPS, check the queue status, read logs, inspect failures.

5. **Scale to multiple instances** (optional): Run `klaudius-prod`, `klaudius-staging`, `klaudius-test` on the same box. Each has its own queue, logs, and systemd unit.

## Multiple concurrent instances (on one VPS)

```bash
# Install prod (3 concurrent)
sudo bash /tmp/klaudius-scripts/setup-vps.sh \
  --instance klaudius-prod --user ubuntu --max-concurrent 3

# Install staging (2 concurrent)
sudo bash /tmp/klaudius-scripts/setup-vps.sh \
  --instance klaudius-staging --user ubuntu --max-concurrent 2

# Install test (1 concurrent, for quick validation)
sudo bash /tmp/klaudius-scripts/setup-vps.sh \
  --instance klaudius-test --user ubuntu --max-concurrent 1

# All three run independently
systemctl status klaudius-prod
systemctl status klaudius-staging
systemctl status klaudius-test

# Each has its own queue, active, done, failed folders
ls /opt/klaudius-prod/queue
ls /opt/klaudius-staging/queue
ls /opt/klaudius-test/queue
```

## Next phase

Once the runner is live and you've queued your first batch:

1. **Templatise the components.** Build reusable Next.js components for the 6 interactive patterns. The build prompt picks which one to use.

2. **Integrate ponytail-review.** Chain it into the pipeline so every site is QA'd against the YAGNI ladder before it's marked done.

3. **Higgsfield video reuse.** Feed the service loop data through Higgsfield to auto-generate vertical videos for TikTok.

4. **Brand game generation.** Use ponytail examples + Fable 5 to generate per-client sliding puzzles.

## Troubleshooting

| Problem | Command |
|---|---|
| Service won't start | `sudo systemctl status klaudius-prod` |
| Builds aren't running | `ls /opt/klaudius-prod/queue` — are `.job` files there? |
| Check what's active | `ls /opt/klaudius-prod/active` |
| Check what's done | `ls /opt/klaudius-prod/done` |
| Watch the log | `tail -f /opt/klaudius-prod/logs/runner.log` |
| Inspect a failure | `cat /opt/klaudius-prod/failed/site.job` then `cat /opt/klaudius-prod/logs/site.log` |
| Restart the service | `sudo systemctl restart klaudius-prod` |
| Stop the service | `sudo systemctl stop klaudius-prod` |
| Uninstall | `sudo systemctl disable klaudius-prod && sudo rm -rf /opt/klaudius-prod /etc/systemd/system/klaudius-prod.service` |

## License & deployment history

**License key:** `-3FR2-Q986-Y9D4-RJQT` (validated on every install)

See `PR-GLOSSARY.md` for what shipped in each PR and how to reference this setup in the future.

---

**Index:** Start with [[DEPLOYMENT-TEMPLATE.md]] for install. Then [[always-on-builds.md]] for daily use. Then the design specs (interactive, branding, loops). Then [[ponytail-integration.md]] for code discipline.

←  Back to [[Engine]]
