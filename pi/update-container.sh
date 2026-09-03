#!/bin/sh

set -eu

APP_DIRECTORY=/home/admin/ui-ecm.com
IMAGE=ghcr.io/wesleymethorst/ui-ecm.com:latest
CONTAINER=ui-ecm
ROLLBACK_IMAGE=ui-ecm:rollback
MAX_HEALTH_ATTEMPTS=30

cd "$APP_DIRECTORY"

# Prevent a manual run and the systemd timer from updating simultaneously.
exec 9>/tmp/ui-ecm-update.lock
if ! flock -n 9; then
  echo "Another ui-ecm update is already running; skipping."
  exit 0
fi

current_container_id=$(docker compose ps -q app 2>/dev/null || true)
previous_image_id=

if [ -n "$current_container_id" ]; then
  previous_image_id=$(docker inspect --format '{{.Image}}' "$current_container_id")
fi

echo "Checking GHCR for a new ui-ecm image..."

# If the Pi is offline or GHCR cannot be reached, leave the currently running
# container untouched. Offline mode is normal for this appliance, so it is not
# reported as a failed systemd service.
if ! docker compose pull app; then
  echo "GHCR is unavailable; keeping the current offline version."
  exit 0
fi

downloaded_image_id=$(docker image inspect --format '{{.Id}}' "$IMAGE")

if [ -n "$previous_image_id" ] && [ "$previous_image_id" = "$downloaded_image_id" ]; then
  echo "ui-ecm is already up to date."
  exit 0
fi

if [ -n "$previous_image_id" ]; then
  docker image tag "$previous_image_id" "$ROLLBACK_IMAGE"
fi

echo "Starting the new ui-ecm image..."
docker compose up -d --no-deps --force-recreate app

attempt=1
while [ "$attempt" -le "$MAX_HEALTH_ATTEMPTS" ]; do
  status=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$CONTAINER" 2>/dev/null || true)

  if [ "$status" = "healthy" ]; then
    echo "ui-ecm update completed successfully."
    exit 0
  fi

  if [ "$status" = "unhealthy" ] || [ "$status" = "exited" ] || [ "$status" = "dead" ]; then
    break
  fi

  sleep 2
  attempt=$((attempt + 1))
done

echo "The new image did not become healthy; rolling back." >&2

if [ -z "$previous_image_id" ]; then
  echo "No previous image is available for rollback." >&2
  exit 1
fi

docker image tag "$ROLLBACK_IMAGE" "$IMAGE"
docker compose up -d --no-deps --force-recreate app

rollback_status=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$CONTAINER" 2>/dev/null || true)
echo "Rollback container started with status: ${rollback_status:-unknown}" >&2
exit 1
