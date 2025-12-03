#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/scripts/docker-monitor.env"
SCRIPT="${ROOT_DIR}/scripts/docker-monitor.sh"
LOG_FILE="/var/log/docker-monitor.log"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing env file at $ENV_FILE (copy scripts/docker-monitor.env.example)" >&2
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

if [ ! -x "$SCRIPT" ]; then
  echo "Monitor script not executable: $SCRIPT" >&2
  exit 1
fi

exec "$SCRIPT" >> "$LOG_FILE" 2>&1
