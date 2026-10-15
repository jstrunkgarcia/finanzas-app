#!/usr/bin/env python3
"""Servidor de sincronización con base de datos SQLite para Finanzas Personal.

Cada subida (POST) se FUSIONA registro por registro con el estado guardado
(marca temporal 'mod' por registro y lápidas de borrado), así que varios
dispositivos pueden subir sin pisarse entre ellos. Toda versión queda en el
historial de finanzas_sync.db.

  GET  /api/state            -> última versión guardada
  GET  /api/state?id=N       -> versión concreta del historial
  POST /api/state            -> fusiona el cuerpo con lo guardado; devuelve el resultado
  POST /api/restore          -> {"id": N} restaura esa versión (la copia como última)
  GET  /api/versions         -> lista del historial [{id, ts, bytes}, ...]
"""
import json
import os
import socket
import sqlite3
import sys
import threading
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

DIR = os.path.dirname(os.path.abspath(__file__))
DB_RUTA = os.path.join(DIR, 'finanzas_sync.db')
JSON_VIEJO = os.path.join(DIR, 'sync_data.json')

COLECCIONES = ('gastos', 'snapshots', 'categorias', 'holdings', 'cubos')
TUMBA_MAX_MS = 90 * 24 * 3600 * 1000  # las lápidas de borrado viven 90 días

bloqueo = threading.Lock()
con = sqlite3.connect(DB_RUTA, check_same_thread=False)
con.execute('CREATE TABLE IF NOT EXISTS estados (id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT NOT NULL, cuerpo BLOB NOT NULL)')
con.commit()


def ahora_ms():
    return datetime.now(timezone.utc).timestamp() * 1000


def fusionar(cliente, servidor):
    """Fusiona el estado del cliente con el estado autoritativo del servidor.

    Regla: registro por registro gana el que tenga 'mod' (ms) más reciente.
    Sin 'mod' (datos antiguos) cuenta como 0. Los id nuevos se suman; los
    borrados (lápidas) eliminan registros cuya mod sea anterior a la lápida.
    """
    res = {**servidor}

    # 1) lápidas combinadas (gana la más reciente por (tipo, id))
    tumbas = {}
    for t in (servidor.get('eliminados') or []) + (cliente.get('eliminados') or []):
        clave = (t.get('t'), t.get('id'))
        prev = tumbas.get(clave)
        if prev is None or (t.get('mod') or 0) > (prev.get('mod') or 0):
            tumbas[clave] = {'t': t.get('t'), 'id': t.get('id'), 'mod': t.get('mod') or 0}

    # 2) colecciones id- negligible: mezcla por id respetando el orden del servidor
    for col in COLECCIONES:
        lista_srv = servidor.get(col) or []
        mapa = {x['id']: x for x in lista_srv if isinstance(x, dict) and 'id' in x}
        orden = [x['id'] for x in lista_srv if isinstance(x, dict) and 'id' in x]
        for x in (cliente.get(col) or []):
            if not (isinstance(x, dict) and 'id' in x):
                continue
            viejo = mapa.get(x['id'])
            if viejo is None or (x.get('mod') or 0) >= (viejo.get('mod') or 0):
                if viejo is None:
                    orden.append(x['id'])
                mapa[x['id']] = x
        # 3) aplicar lápidas de esta colección
        for (t, idr), tumba in tumbas.items():
            if t == col and idr in mapa and (mapa[idr].get('mod') or 0) < (tumba['mod'] or 0):
                del mapa[idr]
        res[col] = [mapa[i] for i in orden if i in mapa]

    # 4) ajustes: gana el bloque con 'mod' más reciente
    aj_s = servidor.get('ajustes') or {}
    aj_c = cliente.get('ajustes') or {}
    res['ajustes'] = aj_c if (aj_c.get('mod') or 0) > (aj_s.get('mod') or 0) else aj_s

    # 5) lápidas finales: purgar antiguas (>90 días) y conservar como mucho 200
    ahora = ahora_ms()
    vivas = [t for t in tumbas.values() if (ahora - t['mod']) < TUMBA_MAX_MS]
    vivas.sort(key=lambda x: x['mod'], reverse=True)
    res['eliminados'] = vivas[:200]
    return res


# Migración: si existía un sync_data.json de la versión anterior y la BD está vacía, se importa
def _migrar_json_antiguo():
    with bloqueo:
        n = con.execute('SELECT COUNT(*) FROM estados').fetchone()[0]
        if n == 0 and os.path.exists(JSON_VIEJO):
            try:
                with open(JSON_VIEJO, 'rb') as f:
                    crudo = f.read()
                json.loads(crudo)
                ts = datetime.now(timezone.utc).isoformat()
                con.execute('INSERT INTO estados (ts, cuerpo) VALUES (?, ?)', (ts, crudo))
                con.commit()
                os.remove(JSON_VIEJO)
                print(f'[migración] importado sync_data.json como primera versión ({len(crudo)} bytes)')
            except (json.JSONDecodeError, UnicodeDecodeError):
                pass

_migrar_json_antiguo()


class Manejador(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.0'

    def _json(self, datos, status=200):
        if isinstance(datos, bytes):
            crudo = datos
        else:
            crudo = json.dumps(datos).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Length', str(len(crudo)))
        self.end_headers()
        self.wfile.write(crudo)

    def _vacio(self, status):
        self.send_response(status)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Length', '0')
        self.end_headers()

    def do_OPTIONS(self):
        self._vacio(204)

    def _leer_cuerpo(self):
        try:
            n = int(self.headers.get('Content-Length', 0))
        except ValueError:
            return b''
        return self.rfile.read(n) if n > 0 else b''

    def do_GET(self):
        partes = urlparse(self.path)
        q = parse_qs(partes.query)
        if partes.path == '/api/state':
            row = None
            with bloqueo:
                if 'id' in q:
                    try:
                        id_req = int(q['id'][0])
                        row = con.execute('SELECT ts, cuerpo FROM estados WHERE id = ?', (id_req,)).fetchone()
                    except ValueError:
                        row = None
                else:
                    row = con.execute('SELECT ts, cuerpo FROM estados ORDER BY id DESC LIMIT 1').fetchone()
            if row is None:
                self._json(b'{}')
                return
            self._json(row[1])
            return

        if partes.path == '/api/versions':
            with bloqueo:
                filas = con.execute('SELECT id, ts, LENGTH(cuerpo) FROM estados ORDER BY id DESC LIMIT 100').fetchall()
            self._json([{'id': r[0], 'ts': r[1], 'bytes': r[2]} for r in filas])
            return

        self.send_error(404)

    def do_POST(self):
        if self.path == '/api/state':
            crudo = self._leer_cuerpo()
            try:
                cliente = json.loads(crudo)
            except (json.JSONDecodeError, UnicodeDecodeError):
                self.send_response(400)
                self.send_header('Content-Length', '0')
                self.end_headers()
                return
            if not isinstance(cliente, dict):
                self.send_response(400)
                self.send_header('Content-Length', '0')
                self.end_headers()
                return
            with bloqueo:
                fila = con.execute('SELECT ts, cuerpo FROM estados ORDER BY id DESC LIMIT 1').fetchone()
                servidor = json.loads(fila[1].decode('utf-8')) if fila else {}
                merged = fusionar(cliente, servidor)
                merged['syncT'] = datetime.now(timezone.utc).isoformat()
                guardado = json.dumps(merged, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
                cur = con.execute('INSERT INTO estados (ts, cuerpo) VALUES (?, ?)', (merged['syncT'], guardado))
                con.commit()
            print(f'[fusionado] versión #{cur.lastrowid} ({len(guardado)} bytes) a las {merged["syncT"]}')
            self._json(guardado)
            return

        if self.path == '/api/restore':
            crudo = self._leer_cuerpo()
            try:
                id_req = int(json.loads(crudo).get('id', 0))
            except (ValueError, json.JSONDecodeError):
                id_req = 0
            if id_req <= 0:
                self.send_error(400)
                return
            with bloqueo:
                fila = con.execute('SELECT cuerpo FROM estados WHERE id = ?', (id_req,)).fetchone()
                if fila is None:
                    self.send_error(404)
                    return
                ts = datetime.now(timezone.utc).isoformat()
                cur = con.execute('INSERT INTO estados (ts, cuerpo) VALUES (?, ?)', (ts, fila[0]))
                con.commit()
            print(f'[restaurado] la versión #{id_req} es ahora la última (##{cur.lastrowid})')
            self._json({'ok': True, 'id': cur.lastrowid})
            return

        self.send_error(404)

    def log_message(self, formato, *args):
        print('[sincronización]', formato % args)


def ip_local():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except OSError:
        return '127.0.0.1'


def main():
    puerto = int(sys.argv[1]) if len(sys.argv) > 1 else 8750
    servidor = ThreadingHTTPServer(('0.0.0.0', puerto), Manejador)
    print('== Servidor de sincronización (SQLite) escuchando ==')
    print('   en este PC:     http://localhost:%d/api/state' % puerto)
    print('   desde el móvil: http://%s:%d  (misma red WiFi o VPN)' % (ip_local(), puerto))
    print('   base de datos:  %s' % DB_RUTA)
    print('   historial:      GET /api/versions · recuperar: POST /api/restore {"id":N}')
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print('\nSincronización detenida')
    finally:
        con.close()


if __name__ == '__main__':
    main()
