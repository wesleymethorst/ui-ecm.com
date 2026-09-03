#!/bin/bash

# Leave hotspot mode and reconnect the upstream WiFi that was active when
# setup-hotspot.sh was last run. The SSH connection via 10.42.0.1 will drop.

set -euo pipefail

HOTSPOT_CONNECTION="ecm-hotspot"
UPSTREAM_FILE="/home/admin/.local/state/ui-ecm/upstream-connection"

if [ ! -s "$UPSTREAM_FILE" ]; then
  echo "No saved upstream WiFi connection was found." >&2
  echo "Use 'nmcli connection show' and activate it manually." >&2
  exit 1
fi

upstream_connection=$(cat "$UPSTREAM_FILE")

if ! nmcli -t -f NAME connection show | grep -Fxq "$upstream_connection"; then
  echo "Saved connection '$upstream_connection' no longer exists." >&2
  exit 1
fi

sudo nmcli connection modify "$HOTSPOT_CONNECTION" connection.autoconnect no
sudo nmcli connection modify "$upstream_connection" connection.autoconnect yes

echo "Reconnecting '$upstream_connection'. This SSH connection will now close."
sudo nmcli connection up "$upstream_connection"
