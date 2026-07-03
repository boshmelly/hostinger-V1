#!/usr/bin/env bash
# One-shot installer for the Klaudius always-on build runner.
# Run on the VPS:  sudo bash setup-vps.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_USER="${SUDO_USER:-$(whoami)}"

echo "Installing Klaudius runner (service user: $RUN_USER)..."

mkdir -p /opt/klaudius/{queue,active,done,failed,logs}
cp "$SCRIPT_DIR/klaudius-runner.sh" /opt/klaudius/klaudius-runner.sh
chmod +x /opt/klaudius/klaudius-runner.sh
chown -R "$RUN_USER" /opt/klaudius

sed "s/__USER__/$RUN_USER/" "$SCRIPT_DIR/klaudius.service" > /etc/systemd/system/klaudius.service
systemctl daemon-reload
systemctl enable --now klaudius

echo ""
echo "Done. The runner now survives laptop close, SSH drop, and VPS reboot."
echo ""
echo "  Queue a build:  echo '<build prompt>' > /opt/klaudius/queue/<domain>.job"
echo "  Status:         systemctl status klaudius"
echo "  Live log:       tail -f /opt/klaudius/logs/runner.log"
