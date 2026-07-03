#!/usr/bin/env bash
# Preflight checks before Klaudius deployment.
# Validates license, system prerequisites, and deployment readiness.
# License: -3FR2-Q986-Y9D4-RJQT

set -u

LICENSE_KEY="-3FR2-Q986-Y9D4-RJQT"
CHECKS_PASSED=0
CHECKS_FAILED=0

check() {
  local name="$1"
  local cmd="$2"
  if eval "$cmd" &>/dev/null; then
    echo "✓ $name"
    ((CHECKS_PASSED++))
  else
    echo "✗ $name"
    ((CHECKS_FAILED++))
  fi
}

echo "Klaudius Preflight Check"
echo "========================"
echo ""

# License validation
echo "License:"
if [[ "$LICENSE_KEY" =~ ^-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$ ]]; then
  echo "✓ License format valid ($LICENSE_KEY)"
  ((CHECKS_PASSED++))
else
  echo "✗ License format invalid"
  ((CHECKS_FAILED++))
fi
echo ""

# System checks
echo "System:"
check "bash 4+" "bash -c '[[ \${BASH_VERSINFO[0]} -ge 4 ]]'"
check "curl or wget" "command -v curl || command -v wget"
check "systemd available" "command -v systemctl"
check "sudo access" "sudo -n true 2>/dev/null"
echo ""

# Disk space
echo "Disk:"
DISK_AVAILABLE=$(df / | awk 'NR==2 {print $4}')
if [[ $DISK_AVAILABLE -gt 512000 ]]; then
  echo "✓ Disk space available ($(( DISK_AVAILABLE / 1024 ))MB)"
  ((CHECKS_PASSED++))
else
  echo "✗ Disk space low ($(( DISK_AVAILABLE / 1024 ))MB, need 500MB+)"
  ((CHECKS_FAILED++))
fi
echo ""

# Claude/build tool
echo "Build tools:"
check "claude CLI installed" "command -v claude"
check "Node/npm available" "command -v node || command -v npm"
echo ""

# Network
echo "Network:"
check "Outbound HTTPS" "curl -s https://www.google.com 2>&1 | head -1 | grep -q '.' && echo ok"
echo ""

# Summary
echo "========================"
echo "Passed: $CHECKS_PASSED"
echo "Failed: $CHECKS_FAILED"
echo ""

if [[ $CHECKS_FAILED -eq 0 ]]; then
  echo "✓ All checks passed. Ready to deploy Klaudius."
  exit 0
else
  echo "✗ Some checks failed. Review above and install missing prerequisites."
  exit 1
fi
