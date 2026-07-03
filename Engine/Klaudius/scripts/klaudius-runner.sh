#!/usr/bin/env bash
# Klaudius build runner. Watches a queue folder and runs website builds
# with a hard concurrency cap, independent of any SSH session.
#
# Queue a build:   echo "<build prompt>" > /opt/klaudius/queue/<domain>.job
# Watch it:        tail -f /opt/klaudius/logs/runner.log

set -u

BASE_DIR="${KLAUDIUS_HOME:-/opt/klaudius}"
QUEUE_DIR="$BASE_DIR/queue"
ACTIVE_DIR="$BASE_DIR/active"
DONE_DIR="$BASE_DIR/done"
FAILED_DIR="$BASE_DIR/failed"
LOG_DIR="$BASE_DIR/logs"

MAX_CONCURRENT=3        # hard cap on parallel builds
POLL_SECONDS=15         # how often to check the queue
BUILD_TIMEOUT=3600      # kill a single build after 1 hour

# The command run for each job. $1 = path to the .job file (contains the prompt).
# Swap this for your own pipeline entry point if Klaudius has one.
run_build() {
  local job_file="$1"
  claude -p "$(cat "$job_file")" --permission-mode acceptEdits
}

mkdir -p "$QUEUE_DIR" "$ACTIVE_DIR" "$DONE_DIR" "$FAILED_DIR" "$LOG_DIR"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_DIR/runner.log"
}

active_count() {
  find "$ACTIVE_DIR" -maxdepth 1 -name '*.job' | wc -l
}

launch_job() {
  local job_path="$1"
  local name
  name="$(basename "$job_path")"
  local active_path="$ACTIVE_DIR/$name"

  mv "$job_path" "$active_path" || return

  (
    log "START $name"
    if timeout "$BUILD_TIMEOUT" bash -c "$(declare -f run_build); run_build '$active_path'" \
        >> "$LOG_DIR/${name%.job}.log" 2>&1; then
      mv "$active_path" "$DONE_DIR/$name"
      log "DONE  $name"
    else
      mv "$active_path" "$FAILED_DIR/$name"
      log "FAIL  $name (see logs/${name%.job}.log)"
    fi
  ) &
}

log "Runner started (cap: $MAX_CONCURRENT concurrent builds)"

# Recover jobs stranded in active/ by a previous crash or reboot
for stranded in "$ACTIVE_DIR"/*.job; do
  [ -e "$stranded" ] || continue
  mv "$stranded" "$QUEUE_DIR/$(basename "$stranded")"
  log "REQUEUED stranded job $(basename "$stranded")"
done

while true; do
  while [ "$(active_count)" -lt "$MAX_CONCURRENT" ]; do
    next_job="$(find "$QUEUE_DIR" -maxdepth 1 -name '*.job' -printf '%T@ %p\n' 2>/dev/null \
                | sort -n | head -1 | cut -d' ' -f2-)"
    [ -n "$next_job" ] || break
    launch_job "$next_job"
  done
  sleep "$POLL_SECONDS"
done
