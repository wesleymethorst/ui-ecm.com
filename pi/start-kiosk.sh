#!/bin/bash

set -euo pipefail

APP_URL="http://127.0.0.1"
PROFILE_DIRECTORY="/home/admin/.local/state/ui-ecm/chromium"

mkdir -p "$PROFILE_DIRECTORY"

# Docker may still be starting after boot. Keep the screen out of an error
# page and launch Chromium as soon as the local application responds.
until curl --fail --silent --output /dev/null "$APP_URL"; do
  sleep 2
done

exec chromium \
  --kiosk \
  --no-first-run \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-background-networking \
  --disable-component-update \
  --disable-features=Translate \
  --password-store=basic \
  --user-data-dir="$PROFILE_DIRECTORY" \
  "$APP_URL"

