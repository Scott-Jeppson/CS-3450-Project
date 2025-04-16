handle_exit() {
    kill -TERM "$dashboard_pid" "$simulation_pid" 2>/dev/null
}

trap handle_exit TERM INT

mkdir -p /streamlined/logs/dashboard
mkdir -p /streamlined/logs/simulation

DASHBOARD_LOGFILE="/streamlined/logs/dashboard/$(date +%Y%m%d%H%M%S)-dashboard.log"
SIMULATION_LOGFILE="/streamlined/logs/simulation/$(date +%Y%m%d%H%M%S)-simulation.log"
ERROR_LOGFILE="/streamlined/logs/error.log"

source /streamlined/venv/bin/activate || echo "Failed to activate venv" >> "$ERROR_LOGFILE"

echo "Starting dashboard.py..."
/streamlined/venv/bin/python /streamlined/backend/dashboard.py >"$DASHBOARD_LOGFILE" 2>&1 &
dashboard_pid=$!

echo "Starting simulation.py..."
/streamlined/venv/bin/python /streamlined/sumo/simulation.py >"$SIMULATION_LOGFILE" 2>&1 &
simulation_pid=$!

wait "$dashboard_pid" "$simulation_pid"