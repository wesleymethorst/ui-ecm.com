# Deploying to the Raspberry Pi

Runbook for whoever has physical access to the Pi. Everything through step 2
can be done on any laptop -- nothing here needs Node installed on the Pi
itself, only Python (which Raspberry Pi OS already includes).

## Prerequisites
- Raspberry Pi OS flashed and booted, reachable over SSH -- see
  `FirstWeekHackathon/raspberry-pi-guide.md` for the full walkthrough
  (headless setup via Raspberry Pi Imager, no monitor/keyboard needed).

## 1. Build the app (on a laptop, not the Pi)
```
npm install
npm run build
```
This produces a `dist/` folder containing the whole app, pmtiles map file
included -- self-contained, no internet needed to load it.

## 2. Copy `dist/` onto the Pi
From the laptop:
```
scp -r dist pi@<pi-hostname-or-ip>.local:~/ui-ecm.com-dist
```
(Swap `<pi-hostname-or-ip>` for whatever hostname you set during headless
setup.)

## 3. On the Pi: install the range-request server
The pmtiles map file is read via HTTP range requests, which Python's plain
`http.server` doesn't support -- this one-line swap does:
```
pip install rangehttpserver
```

## 4. Set the hotspot up (one-time)
Copy `setup-hotspot.sh` and `ecm-map.service` from this `pi/` folder onto the
Pi (same `scp` approach as step 2), then on the Pi:
```
chmod +x setup-hotspot.sh
./setup-hotspot.sh
```
Before running it, open `ecm-map.service` and point `WorkingDirectory=` at
wherever you actually copied `dist/` to in step 2 -- the checked-in file
uses a placeholder path (`/home/pi/ui-ecm.com-dist`).

## 5. Enable the map service
```
sudo cp ecm-map.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now ecm-map.service
```
From now on the Pi serves the map automatically on every boot -- no SSH
needed during the actual demo.

## 6. Verify
On a phone: forget every other WiFi, connect to the hotspot SSID from
`setup-hotspot.sh`, open a browser to `http://10.42.0.1`. The map should load
with zero internet anywhere in the chain -- test this with the Pi's own
upstream internet actually disconnected, not just "phone on hotspot", since
that's the check most likely to embarrass you if skipped.
