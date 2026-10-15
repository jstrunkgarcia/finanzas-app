#!/usr/bin/env bash
# Instala la app y la sincronización como servicios de usuario de systemd:
# arrancan automáticamente al encender el PC, sin abrir terminal.
set -e

RUTA_APP=$(cd "$(dirname "$0")" && pwd)
DIR_SERVICIOS="$HOME/.config/systemd/user"
PORT_APP="${PORT_APP:-8000}"
PORT_SYNC="${PORT_SYNC:-8750}"

if ! command -v systemctl >/dev/null 2>&1; then
  echo "Este sistema no usa systemd; usa ./iniciar.sh manualmente." >&2
  exit 1
fi

mkdir -p "$DIR_SERVICIOS"

cat > "$DIR_SERVICIOS/finanzas-app.service" <<EOF
[Unit]
Description=Finanzas Personal - web de la app (puerto $PORT_APP)
After=network.target

[Service]
WorkingDirectory=$RUTA_APP
ExecStart=/usr/bin/python3 -m http.server $PORT_APP --bind 0.0.0.0
Restart=always
RestartSec=3

[Install]
WantedBy=default.target
EOF

cat > "$DIR_SERVICIOS/finanzas-sync.service" <<EOF
[Unit]
Description=Finanzas Personal - sincronización SQLite (puerto $PORT_SYNC)
After=network.target

[Service]
WorkingDirectory=$RUTA_APP
ExecStart=/usr/bin/python3 $RUTA_APP/sync_server.py $PORT_SYNC
Restart=always
RestartSec=3

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload
systemctl --user enable --now finanzas-app.service finanzas-sync.service

# Para que los servicios de usuario arranquen SIN que haya sesión abierta:
loginctl enable-linger "$USER" 2>/dev/null || echo "(no pude activar linger; los servicios arrancarán al iniciar sesión)"

IP=$(hostname -I 2>/dev/null | awk '{print $1}')
echo ""
echo "✔ Servicios instalados y activados (arrancan al encender el PC):"
systemctl --user --no-pager --plain list-units 'finanzas-*'
echo ""
echo "   App (PC):         http://localhost:$PORT_APP"
echo "   App (móvil):      http://${IP:-./0.}:$PORT_APP"
echo "   Sync para móvil:  http://${IP:-./0.}:$PORT_SYNC   → Ajustes → Sincronizar"
echo ""
echo "Comandos útiles:"
echo "   systemctl --user status finanzas-app finanzas-sync"
echo "   systemctl --user restart finanzas-app finanzas-sync"
echo "   systemctl --user disable --now finanzas-app finanzas-sync   (desactivar)"
