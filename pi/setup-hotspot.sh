#!/bin/bash
# One-time setup: turns this Raspberry Pi into its own WiFi hotspot so
# phones can connect and reach the offline emergency-info map with no
# internet required anywhere in the chain.
#
# Run this once on the Pi itself (as a user with sudo), after Raspberry Pi OS
# (Bookworm or later) is flashed and booted. See
# FirstWeekHackathon/raspberry-pi-guide.md for the full OS-setup walkthrough.

set -e

SSID="Eindhoven-Info"
PASSWORD="changeme123"   # WPA2 needs at least 8 characters -- change before the demo

echo "Creating hotspot connection '$SSID'..."
sudo nmcli con add con-name hotspot ifname wlan0 type wifi ssid "$SSID"
sudo nmcli con modify hotspot wifi-sec.key-mgmt wpa-psk
sudo nmcli con modify hotspot wifi-sec.psk "$PASSWORD"
sudo nmcli con modify hotspot 802-11-wireless.mode ap 802-11-wireless.band bg ipv4.method shared

echo "Bringing the hotspot up..."
sudo nmcli con up hotspot

echo ""
echo "Done. Hotspot '$SSID' is live."
echo "The Pi should be reachable at 10.42.0.1 once a phone connects."
echo "Next: enable the map service with:"
echo "  sudo cp ecm-map.service /etc/systemd/system/"
echo "  sudo systemctl daemon-reload"
echo "  sudo systemctl enable --now ecm-map.service"
