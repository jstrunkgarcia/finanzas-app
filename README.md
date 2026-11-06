# Finanzas Personal

PWA local-first para controlar gastos, patrimonio, inversión, objetivos, deudas y planificación financiera. Los datos se guardan en el navegador; la sincronización es opcional (GitHub privado o servidor local SQLite).

## Arranque rápido

```bash
./iniciar.sh          # app en http://localhost:8000 + sync en :8750
```

Abre la URL, instala la PWA y configura la nube en **Ajustes → Nube GitHub** o el servidor local.

## Qué incluye

- Gastos por categorías, presupuesto mensual e histórico de presupuestos.
- Análisis de gastos con mediana, desviación, tendencias, propuestas y confianza.
- Patrimonio neto: activos, efectivo, inversión, inmuebles, deudas y derechos de cobro.
- Cuentas de efectivo conciliables: saldo base + nóminas + gastos + bizums + traspasos.
- Movimientos: ingresos, traspasos, aportaciones, retiradas, pagos de deuda y devoluciones.
- Cartera: entidad, clase de activo, ISIN, unidades, precio, comisión y XIRR.
- Objetivos con fecha, aporte necesario y aviso de “en plazo / fuera de plazo”.
- Plan financiero: supuestos, proyección a 30 años, comparador de planes, casa/hipoteca, impuestos, FIRE.
- Gastos compartidos y Bizum con derechos de cobro y obligaciones.
- Recurrentes, importación CSV, exportación JSON/CSV e informes imprimibles.
- Sincronización por registro con tombstones, historial de versiones y restauración.
- PIN local y token opcional para el servidor de sincronización.

## Seguridad

- No subas `finanzas_sync.db` ni los planes personales al repositorio de la app: están en `.gitignore`.
- Para el servidor local, define un token:

```bash
SYNC_TOKEN=mi-token-secreto ./iniciar.sh
```

y pega el mismo token en **Ajustes → Sincronizar dispositivos en red local**.

- El PIN se guarda hasheado en el dispositivo; no se sincroniza.
- El token de GitHub y el token del servidor se guardan solo en el dispositivo y no se exportan.

## Verificación

```bash
./verificar.sh
```

Incluye comprobaciones de sintaxis y tests de utilidades (`tests/lib.test.js`). El smoke test de UI (`tests/ui-smoke.js`) requiere Chrome con CDP y un servidor local:

```bash
google-chrome --headless=new --remote-debugging-port=9222 --user-data-dir=/tmp/finanzas-cdp http://localhost:8000/#gastos
CDP_PORT=9222 node tests/ui-smoke.js
```

## Estructura

- `index.html`, `styles.css`, `app.js`, `lib.js`: interfaz y lógica.
- `sync_server.py`: servidor SQLite con fusión, historial y token.
- `sw.js`, `manifest.json`, `icons/`: PWA.
- `tests/`: utilidades y smoke test.
