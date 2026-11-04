#!/usr/bin/env bash
# Publica la APP (no los datos) en GitHub Pages: gratis, HTTPS, accesible desde fuera.
#
# Uso:
#   1) Crea en GitHub un repo PÚBLICO (ej.: tuusuario/finanzas-app) — el código no
#      contiene datos personales; tus datos van a un repo PRIVADO aparte.
#   2) ./publicar_github.sh https://github.com/tuusuario/finanzas-app.git
#   3) En GitHub: Settings → Pages → "Deploy from a branch" → main / (root)
#   4) La app quedará en https://tuusuario.github.io/finanzas-app/
#      Instálala en el móvil desde esa URL. Datos → Ajustes → Nube GitHub (repo privado).
set -e
REPO_URL="${1:?Falta la URL del repo. Uso: ./publicar_github.sh https://github.com/USUARIO/REPO.git}"
cd "$(dirname "$0")"

git rev-parse --git-dir > /dev/null 2>&1 || git init -q
# identidad de git necesaria para el commit (solo local a esta carpeta)
git config user.name >/dev/null 2>&1 || git config user.name "finanzas-app"
git config user.email >/dev/null 2>&1 || git config user.email "finanzas-app@users.noreply.github.com"
git add index.html styles.css app.js sw.js manifest.json icons iniciar.sh sync_server.py instalar_servicio.sh
git commit -m "Finanzas Personal: publicación" --allow-empty
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
echo ""
echo "Si te pide credenciales al subir:"
echo "  username:  tu usuario de GitHub (ej. jstrunkgarcia)"
echo "  password:  PEGA AQUÍ tu TOKEN de GitHub (un token vale como contraseña)"
echo ""
git push -u origin main --force

echo ""
echo "✔ Código publicado. Falta el paso 3: activar Pages (una sola vez)."
