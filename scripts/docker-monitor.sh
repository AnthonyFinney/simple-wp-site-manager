#!/usr/bin/env bash
set -euo pipefail

#
# Simple monitor script to run on the remote server.
# - Checks one or more Docker containers
# - Sends status to the app
# - Appends logs to /var/log/docker-monitor.log
#

APP_URL="${APP_URL:-https://your-app.example.com}"
MONITOR_TOKEN="${MONITOR_TOKEN:-changeme}"
LOG_FILE="/var/log/docker-monitor.log"

# SITE_MAP should look like "1:wp-site,2:wp-blog"
SITE_MAP="${SITE_MAP:-}"
SINGLE_ID="${SITE_ID:-}"
SINGLE_CONTAINER="${CONTAINER_NAME:-}"

if [[ -z "$SITE_MAP" && -n "$SINGLE_ID" && -n "$SINGLE_CONTAINER" ]]; then
  SITE_MAP="${SINGLE_ID}:${SINGLE_CONTAINER}"
fi

timestamp() {
  date +"%Y-%m-%dT%H:%M:%S%z"
}

log() {
  echo "$(timestamp) $1" >> "$LOG_FILE"
}

send_status() {
  local site_id="$1"
  local status="$2"

  curl -sS -X POST "${APP_URL}/monitor/sites/${site_id}" \
    -H "X-Monitor-Token: ${MONITOR_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"status\": \"${status}\"}" >/dev/null \
    || log "Failed to send status for site=${site_id}"
}

determine_status() {
  local container="$1"
  local state

  if ! command -v docker >/dev/null 2>&1; then
    echo "failed"
    return
  fi

  if ! state="$(docker inspect -f '{{.State.Status}}' "$container" 2>/dev/null)"; then
    echo "failed"
    return
  fi

  case "$state" in
    running) echo "running" ;;
    exited | created | paused | restarting) echo "stopped" ;;
    *) echo "failed" ;;
  esac
}

main() {
  if [[ -z "${SITE_MAP}" ]]; then
    log "No SITE_MAP configured (expected SITE_MAP=\"1:wp-site,2:wp-blog\")"
    exit 1
  fi

  IFS=',' read -ra entries <<< "$SITE_MAP"

  for entry in "${entries[@]}"; do
    [[ -z "$entry" ]] && continue

    IFS=':' read -r site_id container <<< "$entry"

    if [[ -z "$site_id" || -z "$container" ]]; then
      log "Skipping invalid site mapping '${entry}'"
      continue
    fi

    status="$(determine_status "$container")"
    log "site=${site_id} container=${container} status=${status}"
    send_status "$site_id" "$status"
  done
}

main "$@"
