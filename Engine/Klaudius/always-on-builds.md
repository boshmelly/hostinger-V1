# Klaudius — Always-On Builds (close the laptop, builds continue)

> The fix for the interruption problem. Your builds die when the laptop closes because
> the build process is a child of your SSH session. Close laptop, SSH drops, process killed.
> The solution: the pipeline must live ON the VPS as a system service, not inside your SSH session.

## The one thing

Run the builder as a **systemd service on the VPS**. It starts at boot, restarts if it crashes, and never cares whether your laptop is open. Your laptop becomes a remote control, not the engine.

## Quick fix (today, 2 minutes)

If you just need tonight's batch to survive, use tmux before you kick off a build:

```bash
ssh youruser@your-vps
tmux new -s klaudius        # open a persistent session
# ... start your build command here ...
# then press Ctrl+b, then d   (detaches, build keeps running)
# close laptop, go away
```

Come back later: `ssh youruser@your-vps` then `tmux attach -t klaudius`.

tmux is the plaster. systemd is the cure. Set up the service below once and you never think about this again.

## Proper fix (once, 15 minutes)

Three files in `scripts/`:

| File | What it does |
|---|---|
| `klaudius-runner.sh` | The build loop. Watches a queue folder, runs max 3 builds at a time, logs everything |
| `klaudius.service` | systemd unit. Keeps the runner alive 24/7, restarts on crash, starts on boot |
| `setup-vps.sh` | One-shot installer. Creates folders, installs the service, starts it |

### Install

```bash
# from your laptop, copy the scripts up
scp -r Engine/Klaudius/scripts youruser@your-vps:/tmp/klaudius-scripts

# on the VPS
ssh youruser@your-vps
sudo bash /tmp/klaudius-scripts/setup-vps.sh
```

### Daily use

```bash
# queue a site (one file per site, filename = domain)
echo "Build a premium one-page site for Smith Electrical, Watford. Trade: electrician." \
  > /opt/klaudius/queue/smithelectrical.co.uk.job

# check status any time, from anywhere
systemctl status klaudius
ls /opt/klaudius/active   # what's building right now (max 3)
ls /opt/klaudius/done     # finished
ls /opt/klaudius/failed   # needs attention
tail -f /opt/klaudius/logs/runner.log
```

Queue 75 sites, close the laptop, fly to Lagos. The VPS works through them 3 at a time.

## Why max 3 concurrent

- A Hostinger VPS has limited CPU/RAM. More than 3 parallel Claude builds and everything slows down or the box swaps to death.
- Token burn is controlled and predictable: you can estimate weekly spend as (sites per day x tokens per site) instead of spiky bursts.
- Failures are cheap. If a prompt is broken you find out after 3 bad sites, not 40.

Change the cap in one place: `MAX_CONCURRENT=3` at the top of `klaudius-runner.sh`.

## How the builder gets called

The runner calls `BUILD_CMD` for each job. Default assumes Claude Code headless mode on the VPS:

```bash
claude -p "$(cat $JOB_FILE)" --permission-mode acceptEdits
```

If your Klaudius pipeline has its own entry script (Node, Python, whatever), point `BUILD_CMD` in `klaudius-runner.sh` at that instead. The runner does not care what the build command is, it only manages the queue, the concurrency cap, and the logs.

## What I could not do from here

- I have no SSH access to your VPS from this session, so I cannot install this for you directly. The scripts are ready, the install is two commands above.
- If you want me to drive the install, give me a session with VPS access (or run `setup-vps.sh` yourself and paste any errors here).

Related: [[interactive-experiences]] · [[service-display-loop]]
