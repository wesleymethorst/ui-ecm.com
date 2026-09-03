# Raspberry Pi deployment

The Pi runs ui-ecm as a Docker Compose appliance. The complete map, location
data, images and fonts are contained in the image and work without internet.

## Start the application

```sh
docker compose pull app
docker compose up -d app
docker compose ps
```

The application is exposed on port 80 and the container restarts after a
crash or reboot.

## Automatic updates

Install the update service and timer once:

```sh
sudo cp pi/ui-ecm-update.service pi/ui-ecm-update.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now ui-ecm-update.timer
```

The timer checks GHCR about once a minute. Failed downloads leave the current
container untouched. A downloaded image is activated only when its health
check succeeds; otherwise the updater rolls back to the previous image.

Inspect the timer and logs with:

```sh
systemctl list-timers ui-ecm-update.timer
journalctl -u ui-ecm-update.service --no-pager
```

## Offline hotspot mode

With only one WiFi interface, activating the hotspot disconnects upstream
WiFi and the current SSH session:

```sh
./pi/setup-hotspot.sh
```

Connect a phone or laptop to `Eindhoven-Info`, then open
`http://10.42.0.1`. SSH is available again at `admin@10.42.0.1`.

To leave hotspot mode and reconnect the WiFi that was active during setup:

```sh
./pi/use-upstream-wifi.sh
```

This also disconnects SSH briefly. Automatic image downloads resume when the
upstream WiFi and internet are available again.

## Offline verification

While connected only to `Eindhoven-Info`, verify the map, markers, location
images and interface. External attribution links cannot open offline, but no
external service is required for the application itself.

## Kiosk display

Raspberry Pi OS uses the per-user Labwc autostart file to launch Chromium in
full-screen kiosk mode after its automatic login:

```sh
mkdir -p ~/.config/labwc
cp pi/labwc-autostart ~/.config/labwc/autostart
chmod +x pi/start-kiosk.sh
sudo reboot
```

The kiosk opens `http://127.0.0.1`, so it works in both upstream WiFi and
offline hotspot mode. The launcher waits until the Docker health endpoint is
available instead of showing Chromium's connection error page during boot.
