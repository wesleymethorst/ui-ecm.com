#!/bin/bash

# Switch the Pi's built-in WiFi from its current upstream network to the
# offline ui-ecm hotspot. The SSH connection over the upstream WiFi will drop
# when the hotspot is activated; reconnect to admin@10.42.0.1 afterwards.

set -euo pipefail

INTERFACE="${ECM_WIFI_INTERFACE:-wlan0}"
HOTSPOT_CONNECTION="ecm-hotspot"
SSID="ecm-project"
PASSWORD="${ECM_HOTSPOT_PASSWORD:-password}" # Temporary demo credential.
STATE_DIRECTORY="/home/admin/.local/state/ui-ecm"
UPSTREAM_FILE="$STATE_DIRECTORY/upstream-connection"

if ! command -v nmcli >/dev/null 2>&1; then
  echo "NetworkManager (nmcli) is required." >&2
  exit 1
fi

current_connection=$(nmcli -g GENERAL.CONNECTION device show "$INTERFACE")

if [ -n "$current_connection" ] && [ "$current_connection" != "--" ] && [ "$current_connection" != "$HOTSPOT_CONNECTION" ]; then
  mkdir -p "$STATE_DIRECTORY"
  printf '%s\n' "$current_connection" > "$UPSTREAM_FILE"
  echo "Saved upstream WiFi connection: $current_connection"
fi

if nmcli -t -f NAME connection show | grep -Fxq "$HOTSPOT_CONNECTION"; then
  echo "Updating existing hotspot connection..."
else
  echo "Creating hotspot connection..."
  sudo nmcli connection add \
    type wifi \
    ifname "$INTERFACE" \
    con-name "$HOTSPOT_CONNECTION" \
    autoconnect yes \
    ssid "$SSID"
fi

sudo nmcli connection modify "$HOTSPOT_CONNECTION" \
  connection.interface-name "$INTERFACE" \
  connection.autoconnect yes \
  802-11-wireless.mode ap \
  802-11-wireless.band bg \
  802-11-wireless.ssid "$SSID" \
  wifi-sec.key-mgmt wpa-psk \
  wifi-sec.psk "$PASSWORD" \
  ipv4.method shared \
  ipv4.addresses 10.42.0.1/24 \
  ipv6.method disabled

echo "Activating hotspot '$SSID'. This SSH connection will now close."
sudo nmcli connection up "$HOTSPOT_CONNECTION"
