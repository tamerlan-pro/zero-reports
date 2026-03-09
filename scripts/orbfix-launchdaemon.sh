#!/usr/bin/env bash
#
# Called by LaunchDaemon at macOS boot.
# Waits for OrbStack, then adds route for the VM subnet.
#
LOG="/tmp/orbstack-route-fix.log"
VM_NAME="zero-reports"
BRIDGE="bridge100"

exec >> "$LOG" 2>&1
echo "--- $(date) ---"

for i in $(seq 1 30); do
  if command -v orb &>/dev/null && orb list &>/dev/null; then
    break
  fi
  echo "Waiting for OrbStack... (${i}/30)"
  sleep 2
done

VM_IP=$(orb list 2>/dev/null | awk -v vm="$VM_NAME" '$1 == vm {print $NF}')
if [[ -z "$VM_IP" || "$VM_IP" == "$VM_NAME" ]]; then
  echo "VM ${VM_NAME} not running or no IP. Exiting."
  exit 0
fi

SUBNET=$(echo "$VM_IP" | sed 's/\.[0-9]*$/.0\/24/')
echo "VM IP: ${VM_IP}, adding route ${SUBNET} -> ${BRIDGE}"
route add -net "$SUBNET" -interface "$BRIDGE" 2>&1 || true

# Update /etc/hosts
sed -i '' "/${VM_NAME}.orb.local/d" /etc/hosts 2>/dev/null || true
printf '\n%s  %s.orb.local\n' "$VM_IP" "$VM_NAME" >> /etc/hosts
echo "/etc/hosts updated"
echo "Done."
