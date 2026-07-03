#!/usr/bin/env bash
# Klaudius always-on build runner installer.
# Supports parameterized setup for multiple concurrent instances.
# License: -3FR2-Q986-Y9D4-RJQT

set -euo pipefail

# ============================================================================
# VARIABLES (customize or pass as arguments)
# ============================================================================
INSTANCE_NAME="${INSTANCE_NAME:-klaudius}"
INSTALL_USER="${INSTALL_USER:-${SUDO_USER:-$(whoami)}}"
INSTALL_PATH="${INSTALL_PATH:-/opt/klaudius-${INSTANCE_NAME}}"
MAX_CONCURRENT="${MAX_CONCURRENT:-3}"
POLL_SECONDS="${POLL_SECONDS:-15}"
BUILD_TIMEOUT="${BUILD_TIMEOUT:-3600}"
LICENSE_KEY="-3FR2-Q986-Y9D4-RJQT"

# ============================================================================
# PARSE COMMAND-LINE ARGUMENTS
# ============================================================================
while [[ $# -gt 0 ]]; do
  case "$1" in
    --instance) INSTANCE_NAME="$2"; INSTALL_PATH="/opt/klaudius-${INSTANCE_NAME}"; shift 2 ;;
    --user) INSTALL_USER="$2"; shift 2 ;;
    --path) INSTALL_PATH="$2"; shift 2 ;;
    --max-concurrent) MAX_CONCURRENT="$2"; shift 2 ;;
    --poll) POLL_SECONDS="$2"; shift 2 ;;
    --timeout) BUILD_TIMEOUT="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ============================================================================
# VALIDATION & PREFLIGHT
# ============================================================================
if [[ $EUID -ne 0 ]]; then
  echo "ERROR: This script must run with sudo"
  exit 1
fi

if ! id "$INSTALL_USER" &>/dev/null; then
  echo "ERROR: User '$INSTALL_USER' does not exist"
  exit 1
fi

# Validate license key
validate_license() {
  local key="$1"
  # Simple checksum: count hyphens (should be 3) and validate format
  if [[ ! "$key" =~ ^-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$ ]]; then
    return 1
  fi
  return 0
}

if ! validate_license "$LICENSE_KEY"; then
  echo "ERROR: Invalid or missing license key"
  exit 1
fi

echo "[Klaudius Setup]"
echo "  Instance: $INSTANCE_NAME"
echo "  User: $INSTALL_USER"
echo "  Path: $INSTALL_PATH"
echo "  Max concurrent: $MAX_CONCURRENT"
echo "  License: $LICENSE_KEY (validated)"
echo ""

# ============================================================================
# INSTALL
# ============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Create folders
mkdir -p "$INSTALL_PATH"/{queue,active,done,failed,logs}
chown -R "$INSTALL_USER" "$INSTALL_PATH"

# Copy and configure the runner script
sed \
  -e "s|BASE_DIR=.*|BASE_DIR=\"$INSTALL_PATH\"|" \
  -e "s|MAX_CONCURRENT=.*|MAX_CONCURRENT=$MAX_CONCURRENT|" \
  -e "s|POLL_SECONDS=.*|POLL_SECONDS=$POLL_SECONDS|" \
  -e "s|BUILD_TIMEOUT=.*|BUILD_TIMEOUT=$BUILD_TIMEOUT|" \
  "$SCRIPT_DIR/klaudius-runner.sh" > "$INSTALL_PATH/klaudius-runner.sh"

chmod +x "$INSTALL_PATH/klaudius-runner.sh"
chown "$INSTALL_USER" "$INSTALL_PATH/klaudius-runner.sh"

# Copy and configure the systemd service
sed \
  -e "s|__USER__|$INSTALL_USER|g" \
  -e "s|__INSTANCE__|$INSTANCE_NAME|g" \
  -e "s|__PATH__|$INSTALL_PATH|g" \
  "$SCRIPT_DIR/klaudius.service" > "/etc/systemd/system/klaudius-${INSTANCE_NAME}.service"

# Install and start the service
systemctl daemon-reload
systemctl enable "klaudius-${INSTANCE_NAME}"
systemctl start "klaudius-${INSTANCE_NAME}"

echo ""
echo "✓ Klaudius '$INSTANCE_NAME' installed and running"
echo ""
echo "Next steps:"
echo "  Queue a build:  echo '<prompt>' > $INSTALL_PATH/queue/<domain>.job"
echo "  Check status:   systemctl status klaudius-${INSTANCE_NAME}"
echo "  Live log:       tail -f $INSTALL_PATH/logs/runner.log"
echo ""
echo "To install another instance (e.g. staging):"
echo "  sudo bash $SCRIPT_DIR/setup-vps.sh --instance klaudius-staging --user $INSTALL_USER --max-concurrent 2"
