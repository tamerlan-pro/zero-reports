#!/usr/bin/env bash
set -euo pipefail

VM_NAME="zero-reports"
DOMAIN="${VM_NAME}.orb.local"
BRIDGE="bridge100"
HOSTS_FILE="/etc/hosts"

red()   { printf '\033[0;31m%s\033[0m\n' "$*"; }
green() { printf '\033[0;32m%s\033[0m\n' "$*"; }
blue()  { printf '\033[0;34m%s\033[0m\n' "$*"; }

if ! command -v orb &>/dev/null; then
  red "orb CLI not found. Is OrbStack installed?"
  exit 1
fi

blue "=== OrbStack Network Fix for ${VM_NAME} ==="

# --- 1. Ensure VM is running ---
VM_STATUS=$(orb list 2>/dev/null | awk -v vm="$VM_NAME" '$1 == vm {print $2}')
if [[ "$VM_STATUS" != "running" ]]; then
  blue "Starting VM ${VM_NAME}..."
  orb start "$VM_NAME"
  sleep 3
fi

# --- 2. Get current VM IP ---
VM_IP=$(orb list 2>/dev/null | awk -v vm="$VM_NAME" '$1 == vm {print $NF}')
if [[ -z "$VM_IP" || "$VM_IP" == "$VM_NAME" ]]; then
  red "Cannot determine IP for ${VM_NAME}. Is the VM running?"
  exit 1
fi
SUBNET=$(echo "$VM_IP" | sed 's/\.[0-9]*$/.0\/24/')
green "VM IP: ${VM_IP}  Subnet: ${SUBNET}"

# --- 3. Add macOS route to VM subnet ---
EXISTING_ROUTE=$(netstat -rn 2>/dev/null | grep "$(echo "$VM_IP" | sed 's/\.[0-9]*$//')" | head -1 || true)
if [[ -n "$EXISTING_ROUTE" ]]; then
  green "Route to ${SUBNET} already exists"
else
  blue "Adding route ${SUBNET} -> ${BRIDGE}..."
  osascript -e "do shell script \"route add -net ${SUBNET} -interface ${BRIDGE}\" with administrator privileges"
  green "Route added"
fi

# --- 4. Update /etc/hosts ---
CURRENT_ENTRY=$(grep "$DOMAIN" "$HOSTS_FILE" 2>/dev/null | tail -1 || true)
if [[ "$CURRENT_ENTRY" == *"$VM_IP"* ]]; then
  green "/etc/hosts already has ${VM_IP} ${DOMAIN}"
else
  blue "Updating /etc/hosts: ${VM_IP} -> ${DOMAIN}..."
  if grep -q "$DOMAIN" "$HOSTS_FILE" 2>/dev/null; then
    osascript -e "do shell script \"sed -i '' '/${DOMAIN}/d' ${HOSTS_FILE}\" with administrator privileges"
  fi
  osascript -e "do shell script \"printf '\\n${VM_IP}  ${DOMAIN}\\n' >> ${HOSTS_FILE}\" with administrator privileges"
  green "/etc/hosts updated"
fi

# --- 5. Add reverse route on VM ---
blue "Ensuring reverse route on VM..."
orb run -m "$VM_NAME" sudo bash -c \
  'ip route add 192.168.128.0/24 dev eth0 2>/dev/null && echo "Reverse route added" || echo "Reverse route already exists"'

# --- 6. Verify ---
blue "Verifying connectivity..."
if ping -c 1 -t 3 "$VM_IP" &>/dev/null; then
  green "Ping OK"
else
  red "Ping FAILED — check bridge100 interface"
  exit 1
fi

HEALTH=$(curl -s --connect-timeout 5 "http://${DOMAIN}/api/health" 2>/dev/null || true)
if [[ "$HEALTH" == *'"status":"ok"'* ]]; then
  green "Health OK: ${HEALTH}"
else
  blue "Health endpoint not responding (containers may need starting)"
  blue "Run: orb run -m ${VM_NAME} bash -c 'cd /home/tamerlan/zero-reports && docker compose -f docker-compose.dev.yml up -d'"
fi

echo ""
green "=== Done ==="
green "  VM:     ${VM_NAME} (${VM_IP})"
green "  URL:    http://${DOMAIN}/"
green "  API:    http://${DOMAIN}/api/health"
