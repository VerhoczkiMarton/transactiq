#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

REPO_BRANCH=$(git rev-parse --abbrev-ref HEAD)
BACKUP_DIR="./backups/deployments"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="./logs/deploy_${TIMESTAMP}.log"

mkdir -p "$BACKUP_DIR" ./logs

log() {
  local message="$1"
  local level=${2:-"INFO"}
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message" | tee -a "$LOG_FILE"
}

notify() {
  local message="$1"
  local status=${2:-"info"}
  local emoji="ℹ️"

  case "$status" in
    "success") emoji="✅" ;;
    "error") emoji="❌" ;;
    "warning") emoji="⚠️" ;;
    *) emoji="ℹ️" ;;
  esac

  log "$message" "${status^^}"

  # Send to Slack if webhook URL is configured
  if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -s -X POST -H 'Content-type: application/json' \
      --data "{\"text\":\"$emoji *TransactIQ Deployment*: $message\"}" \
      "$SLACK_WEBHOOK_URL" > /dev/null
  fi
}

rollback() {
  log "Starting rollback procedure..." "WARNING"

  if [ -f "$BACKUP_DIR/pre_deploy_${TIMESTAMP}.tar.gz" ]; then
    log "Restoring from backup..." "WARNING"
    tar -xzf "$BACKUP_DIR/pre_deploy_${TIMESTAMP}.tar.gz" -C /tmp

    cp -f /tmp/backup/docker-compose.production.yml ./docker-compose.production.yml

    log "Restarting previous version..." "WARNING"
    docker compose -f docker-compose.production.yml up -d

    notify "Deployment failed. Rolled back to previous version." "warning"
  else
    log "No backup found. Cannot rollback automatically." "ERROR"
    notify "Deployment failed. Manual intervention required." "error"
  fi

  exit 1
}

trap 'log "Deployment script interrupted." "ERROR"; rollback' ERR INT TERM

notify "Starting deployment of TransactIQ..." "info"

log "Running pre-deployment checks..."

if ! command -v git &> /dev/null; then
  notify "Git is not installed. Aborting deployment." "error"
  exit 1
fi

if ! docker info &> /dev/null; then
  notify "Docker is not running. Aborting deployment." "error"
  exit 1
fi

DISK_SPACE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_SPACE" -gt 90 ]; then
  notify "Low disk space (${DISK_SPACE}%). Deployment may fail." "warning"
fi

log "Creating backup of current state..."
mkdir -p /tmp/backup
cp -f docker-compose.production.yml /tmp/backup/
tar -czf "$BACKUP_DIR/pre_deploy_${TIMESTAMP}.tar.gz" -C /tmp backup

log "Pulling latest changes from Git..."
git fetch origin "$REPO_BRANCH"
git reset --hard "origin/$REPO_BRANCH"

log "Building and restarting Docker containers..."
docker compose -f docker-compose.production.yml up --build -d

log "Verifying deployment..."
sleep 10

if ! docker compose -f docker-compose.production.yml ps | grep -q "application.*running"; then
  notify "Application container failed to start. Rolling back..." "error"
  rollback
fi

log "Removing unused Docker images..."
docker image prune -f

log "Cleaning up old backups..."
ls -t "$BACKUP_DIR"/pre_deploy_*.tar.gz | tail -n +6 | xargs -r rm

notify "Deployment completed successfully!" "success"

trap - ERR INT TERM

exit 0
