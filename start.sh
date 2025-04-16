#!/bin/bash
set -e

handle_exit() {
  echo "Shutting down…" >&2
  kill -TERM "$dashboard_pid" "$frontend_pid" "$simulation_pid" 2>/dev/null || true
}

trap handle_exit TERM INT

# make our log dirs
mkdir -p /streamlined/logs/{dashboard,frontend,simulation}

TIMESTAMP=$(date +%Y%m%d%H%M%S)
DASHBOARD_LOG="/streamlined/logs/dashboard/${TIMESTAMP}-dashboard.log"
FRONTEND_LOG="/streamlined/logs/frontend/${TIMESTAMP}-frontend.log"
SIM_LOG="/streamlined/logs/simulation/${TIMESTAMP}-simulation.log"
ERROR_LOG="/streamlined/logs/error.log"

# activate Python venv
source /streamlined/venv/bin/activate || echo "Failed to activate venv" >>"$ERROR_LOG"

# 1) dashboard (equivalent to your backend service)
echo "Starting dashboard on :8080…"  
/streamlined/venv/bin/hypercorn dashboard:app \
  --bind 0.0.0.0:8080 --workers 1 \
  >"$DASHBOARD_LOG" 2>&1 &
dashboard_pid=$!

# 2) frontend (equivalent to your frontend service)
echo "Starting frontend on :5173…"
(
  cd /streamlined/frontend
  # ensure deps are there (optional if already done in build)
  npm ci
  npm run dev -- --host \
    >"$FRONTEND_LOG" 2>&1
) &
frontend_pid=$!

# 3) simulation (equivalent to your sumo service)
echo "Starting simulation on :5000…"
/streamlined/venv/bin/python /streamlined/sumo/simulation.py \
  >"$SIM_LOG" 2>&1 &
simulation_pid=$!

# wait for any of them to exit
wait "$dashboard_pid" "$frontend_pid" "$simulation_pid"