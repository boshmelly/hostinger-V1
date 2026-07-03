# Klaudius Deployment Template

> License: -3FR2-Q986-Y9D4-RJQT
> Deploy Klaudius on any VPS or laptop. Supports multiple concurrent instances on the same machine.

## The Approach: Always-On Independent of SSH

**Why:** Your builds die when you close the laptop because they run inside your SSH session. If SSH drops, the process dies.

**The fix:** Run the builder as a systemd service on the VPS itself. It starts at boot, restarts on crash, survives SSH drops and laptop close. Your laptop controls it remotely; it runs independently.

**What it does:**
- Watches a queue folder (`/opt/klaudius-{INSTANCE}/queue/`)
- Processes max 3 builds concurrently (configurable)
- Logs per-build to individual files
- Auto-recovers stranded jobs if the service crashes or reboots
- Runs hands-off 24/7

## Prerequisites

- VPS with systemd (Hostinger, DigitalOcean, Linode, AWS, etc.)
- SSH access and sudo
- `bash` 4+
- Claude CLI (`claude` command) or custom build script on the VPS
- ~500MB disk for queue + logs

## Architecture

```
/opt/klaudius-{INSTANCE}/
├── queue/           # Drop .job files here to build
├── active/          # Currently building (temp)
├── done/            # Completed builds
├── failed/          # Failed builds (inspect logs)
├── logs/            # Per-build logs + runner.log
└── klaudius-runner.sh  # The queue watcher

/etc/systemd/system/
└── klaudius-{INSTANCE}.service  # systemd unit (survives reboot)
```

For multiple instances on the same VPS, each gets its own folder and service:
- `klaudius-prod` + `klaudius-prod.service`
- `klaudius-staging` + `klaudius-staging.service`
- `klaudius-test` + `klaudius-test.service`

## Variables (customize before install)

| Variable | Default | What it is |
|---|---|---|
| `INSTANCE_NAME` | `klaudius` | Name for this deployment (prod, staging, test, etc.) |
| `INSTALL_USER` | `$SUDO_USER` | VPS user who owns the process |
| `INSTALL_PATH` | `/opt/klaudius-{INSTANCE_NAME}` | Where the runner lives |
| `MAX_CONCURRENT` | `3` | Max builds running at the same time |
| `POLL_SECONDS` | `15` | How often to check the queue |
| `BUILD_TIMEOUT` | `3600` | Seconds before a hung build is killed (1 hour) |
| `BUILD_CMD` | `claude -p "$(cat $JOB_FILE)" --permission-mode acceptEdits` | The command that runs each build |

## One-Command Install

```bash
# On your laptop, customize these:
export INSTANCE_NAME="klaudius-prod"
export INSTALL_USER="ubuntu"
export MAX_CONCURRENT=3

# Copy scripts up
scp -r Engine/Klaudius/scripts YOUR_VPS_USER@YOUR_VPS_IP:/tmp/klaudius-scripts

# SSH in
ssh YOUR_VPS_USER@YOUR_VPS_IP

# Run the installer (one command, on the VPS)
sudo bash /tmp/klaudius-scripts/setup-vps.sh \
  --instance "$INSTANCE_NAME" \
  --user "$INSTALL_USER" \
  --max-concurrent $MAX_CONCURRENT
```

The installer:
1. Validates the license key
2. Checks system prerequisites
3. Creates folders and sets permissions
4. Installs the systemd service
5. Starts the runner

## Daily Use

From your laptop, queue a build:

```bash
# SSH into the VPS
ssh ubuntu@your-vps

# Queue a single build
echo "Build a premium electrician site for Smith Electrical, Watford..." \
  > /opt/klaudius-prod/queue/smithelectrical.co.uk.job

# Check what's running
systemctl status klaudius-prod
ls /opt/klaudius-prod/active

# Watch the log live
tail -f /opt/klaudius-prod/logs/runner.log

# Check what's done
ls /opt/klaudius-prod/done

# Inspect a failure
cat /opt/klaudius-prod/failed/site.job
cat /opt/klaudius-prod/logs/site.log
```

## Multiple Instances on One VPS

If you run prod + staging + test on the same box:

```bash
# Install prod (uses max 3 concurrent)
sudo bash /tmp/klaudius-scripts/setup-vps.sh \
  --instance klaudius-prod --user ubuntu --max-concurrent 3

# Install staging (separate service, separate queue, uses max 2)
sudo bash /tmp/klaudius-scripts/setup-vps.sh \
  --instance klaudius-staging --user ubuntu --max-concurrent 2

# Install test (max 1, for quick validation)
sudo bash /tmp/klaudius-scripts/setup-vps.sh \
  --instance klaudius-test --user ubuntu --max-concurrent 1

# All three run independently:
systemctl status klaudius-prod
systemctl status klaudius-staging
systemctl status klaudius-test

# Each has its own queue and logs:
ls /opt/klaudius-prod/queue
ls /opt/klaudius-staging/queue
ls /opt/klaudius-test/queue
```

## Emergency: Revert or Uninstall

```bash
# Stop the service
sudo systemctl stop klaudius-prod

# Disable autostart
sudo systemctl disable klaudius-prod

# Remove the service file
sudo rm /etc/systemd/system/klaudius-prod.service
sudo systemctl daemon-reload

# Remove the installation folder
sudo rm -rf /opt/klaudius-prod
```

## Troubleshooting

| Problem | Check |
|---|---|
| Service won't start | `sudo systemctl status klaudius-prod` — look at the error |
| Builds aren't running | `ls /opt/klaudius-prod/queue` — are .job files there? |
| Build hangs forever | It will auto-kill after `BUILD_TIMEOUT` (default 1 hour). Check `/opt/klaudius-prod/logs/runner.log` |
| Permission denied on queue | `sudo chown -R ubuntu /opt/klaudius-prod` |
| Preflight check fails | Run `/tmp/klaudius-scripts/preflight-check.sh` to see what's missing |

## Next Steps

1. Customize the variables above for your setup
2. Run the installer on your VPS
3. Queue your first test build
4. Monitor with `tail -f /opt/klaudius-prod/logs/runner.log`
5. Once stable, automate: write a script that reads your lead list and queues builds

## License

License key: `-3FR2-Q986-Y9D4-RJQT`

This template is part of the Klaudius always-on build system. Deploy on any number of VPS instances; each instance validates the license on install.

---

Related: [[always-on-builds]] · [[ponytail-integration]] · [[DELIVERY]]
