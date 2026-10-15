#!/usr/bin/env bash
# Lanza la app de Finanzas Personal + el servidor de sincronización.
cd "$(dirname "$0")"
PORT_APP="${1:-8000}"
PORT_SYNC="${2:-8750}"

trap 'kill $(jobs -p) 2>/dev/null' EXIT

python3 sync_server.py "$PORT_SYNC" &
sleep 0.3

IP=$(hostname -I 2>/dev/null | awk '{print $1}')
echo ""
echo "Abre en tu navegador:   http://localhost:$PORT_APP"
echo "Desde el móvil (misma red):  http://${IP}:${PORT_APP}"
echo "Sync para el móvil:  http://${IP}:${PORT_SYNC}   (cópiala en Ajustes → Sincronizar)"
echo "Ctrl+C para parar todo."
echo ""
python3 -m http.server "$PORT_APP"
