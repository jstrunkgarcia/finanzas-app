#!/usr/bin/env bash
# Verificación rápida antes de publicar.
set -e
cd "$(dirname "$0")"

echo "· Sintaxis JS"
node --check lib.js
node --check app.js
node --check sw.js

echo "· Sintaxis Python"
python3 -m py_compile sync_server.py

echo "· Sintaxis shell"
bash -n iniciar.sh instalar_servicio.sh publicar_github.sh

echo "· Tests de utilidades"
node tests/lib.test.js

echo "· Comprobaciones de estructura"
grep -q "lib.js" index.html
grep -q "vistaPlan" app.js
grep -q "modalMovimiento" app.js
grep -q "X-Sync-Token" sync_server.py

echo ""
echo "✔ Todo correcto"
