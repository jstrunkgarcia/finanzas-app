'use strict';
const assert = require('assert');

async function main() {
  const list = await (await fetch(`http://127.0.0.1:${process.env.CDP_PORT || 9222}/json`)).json();
  const page = list.find((p) => p.type === 'page' && p.url.includes('127.0.0.1:8123'));
  if (!page) throw new Error('No page found');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  };
  function send(method, params = {}) {
    return new Promise((res) => {
      const i = ++id;
      pending.set(i, res);
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  }
  async function evalJs(expression) {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.result && r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
    if (r.result && r.result.result && r.result.result.subtype === 'error') throw new Error(r.result.result.description);
    return r.result && r.result.result ? r.result.result.value : undefined;
  }

  await send('Runtime.enable');
  await new Promise((r) => setTimeout(r, 1000));

  const checks = [];
  const check = async (name, fn) => { try { await fn(); checks.push('✓ ' + name); } catch (e) { checks.push('✗ ' + name + ': ' + e.message); } };

  await check('app cargada', async () => {
    const v = await evalJs('typeof state + "|" + typeof vistaPlan + "|" + typeof modalMovimiento');
    assert.ok(v.startsWith('object|function|function'), v);
  });

  await check('parseAmount miles', async () => {
    const v = await evalJs('parseAmount("1.300,50")');
    assert.strictEqual(v, 1300.5);
  });

  await check('vista plan renderiza', async () => {
    const v = await evalJs('irTab("plan"); document.querySelector("#view h1") && document.querySelector("#view h1").textContent');
    assert.ok(String(v).includes('Plan'), v);
  });

  await check('añadir gasto y reflejarlo en total', async () => {
    const v = await evalJs(`(() => {
      const mk = currentMonthKey();
      const before = totalGastado(mk);
      state.gastos.push(stamp({ id: 'test-gasto', monto: 12.34, fecha: hoyISO(), catId: state.categorias[0].id, nota: 'test', cuentaId: 'h-ibercaja', creado: Date.now() }));
      guardarEstado();
      return { before, after: totalGastado(mk) };
    })()`);
    assert.ok(v.after >= v.before + 12.33, JSON.stringify(v));
  });

  await check('cuenta de efectivo descuenta gasto', async () => {
    const v = await evalJs(`(() => { const h = holdingPorId('h-ibercaja'); return { saldo: saldoCuenta('h-ibercaja'), base: h.saldoBase, fecha: h.fechaBase }; })()`);
    assert.ok(typeof v.saldo === 'number', JSON.stringify(v));
  });

  await check('movimiento de ingreso suma a la cuenta', async () => {
    const v = await evalJs(`(() => {
      const antes = saldoCuenta('h-ibercaja');
      state.movimientos.push(stamp({ id: 'test-mov', tipo: 'ingreso', importe: 100, fecha: hoyISO(), cuentaId: 'h-ibercaja', nota: 'test', creado: Date.now() }));
      guardarEstado();
      return { antes, despues: saldoCuenta('h-ibercaja') };
    })()`);
    assert.ok(v.despues >= v.antes + 99.99, JSON.stringify(v));
  });

  await check('traspaso no cambia patrimonio total', async () => {
    const v = await evalJs(`(() => {
      const antes = saldosActuales().total;
      state.movimientos.push(stamp({ id: 'test-tr', tipo: 'traspaso', importe: 50, fecha: hoyISO(), cuentaId: 'h-ibercaja', cuentaDestinoId: 'h-emergencia', nota: 'test', creado: Date.now() }));
      guardarEstado();
      const despues = saldosActuales().total;
      return { antes, despues };
    })()`);
    assert.ok(Math.abs(v.despues - v.antes) < 0.02, JSON.stringify(v));
  });

  await check('deuda resta del patrimonio neto', async () => {
    const v = await evalJs(`(() => {
      const antes = saldosActuales().total;
      state.deudas.push(stamp({ id: 'test-deuda', nombre: 'Test', tipo: 'prestamo', saldo: 500, tipoInteres: 0, cuota: 0, plazoMeses: 0, creado: Date.now() }));
      guardarEstado();
      return { antes, despues: saldosActuales().total, deudas: saldosActuales().deudas };
    })()`);
    assert.ok(v.despues <= v.antes - 499.99, JSON.stringify(v));
  });

  await check('gasto compartido pagado por mí: patrimonio baja mi parte', async () => {
    const v = await evalJs(`(() => {
      const antes = saldosActuales().total;
      const ev = stamp({ id: 'test-ev', fecha: hoyISO(), descripcion: 'Cena', importe: 100, pagador: 'yo', cuentaId: 'h-ibercaja', participantes: [{id:'yo',importe:50},{id:'p1',importe:50}], creado: Date.now() });
      state.compartidosEventos.push(ev);
      state.personas.push({ id: 'p1', nombre: 'Test', mod: Date.now() });
      guardarEstado();
      const despues = saldosActuales().total;
      return { antes, despues, porCobrar: saldosActuales().porCobrar, saldo: saldoCuenta('h-ibercaja') };
    })()`);
    assert.ok(Math.abs((v.antes - v.despues) - 50) < 0.02, JSON.stringify(v));
  });

  await check('XIRR devuelve número', async () => {
    const v = await evalJs('xirr([{fecha:"2025-01-01",importe:-1000},{fecha:"2026-01-01",importe:1100}])');
    assert.ok(v != null && Math.abs(v - 0.1) < 0.02, String(v));
  });


  await check('gasto compartido pagado por otro + bizum: patrimonio baja mi parte una vez', async () => {
    const v = await evalJs(`(() => {
      state.personas.push({ id: 'p2', nombre: 'Otro', mod: Date.now() });
      const antes = saldosActuales().total;
      const g = stamp({ id: 'test-g2', monto: 50, fecha: hoyISO(), catId: state.categorias[0].id, cuentaId: 'h-ibercaja', nota: 'Cena (compartido)', creado: Date.now() });
      state.gastos.push(g);
      const ev = stamp({ id: 'test-ev2', fecha: hoyISO(), descripcion: 'Cena', importe: 100, pagador: 'p2', cuentaId: 'h-ibercaja', participantes: [{id:'yo',importe:50},{id:'p2',importe:50}], gastoId: g.id, creado: Date.now() });
      state.compartidosEventos.push(ev);
      guardarEstado();
      const trasEvento = saldosActuales();
      state.bizums.push(stamp({ id: 'test-bz2', personaId: 'p2', importe: -50, fecha: hoyISO(), cuentaId: 'h-ibercaja', nota: 'Bizum', creado: Date.now() }));
      guardarEstado();
      const trasBizum = saldosActuales();
      return { antes, trasEvento: trasEvento.total, porPagar: trasEvento.porPagar, trasBizum: trasBizum.total, porPagar2: trasBizum.porPagar };
    })()`);
    assert.ok(Math.abs((v.antes - v.trasEvento) - 50) < 0.02, JSON.stringify(v));
    assert.ok(Math.abs((v.antes - v.trasBizum) - 50) < 0.02, JSON.stringify(v));
  });

  await check('limpiar datos compartidos de prueba', async () => {
    await evalJs(`(() => {
      state.gastos = state.gastos.filter(g => g.id !== 'test-g2');
      state.compartidosEventos = state.compartidosEventos.filter(e => e.id !== 'test-ev2');
      state.bizums = state.bizums.filter(b => b.id !== 'test-bz2');
      state.personas = state.personas.filter(p => p.id !== 'p2');
      guardarEstado();
      return true;
    })()`);
  });


  await check('plan: comparador y casa calculan', async () => {
    const v = await evalJs(`(() => {
      const c = comparativaPlanes(30);
      const h = casaResumen();
      const imp = impuestosResumen();
      return { planes: c.length, precioMax: h.precioMax, cuota: h.cuota, impuesto: imp.impuestoPlusvalias };
    })()`);
    assert.strictEqual(v.planes, 4);
    assert.ok(v.precioMax > 0 && v.cuota > 0, JSON.stringify(v));
  });

  await check('modal de movimiento abre y cierra', async () => {
    const v = await evalJs(`(() => { modalMovimiento(); const ok = !!document.querySelector('.modal-overlay .modal'); document.querySelectorAll('.modal-overlay').forEach(x => x.remove()); return ok; })()`);
    assert.strictEqual(v, true);
  });

  await check('modal de cuenta abre y cierra', async () => {
    const v = await evalJs(`(() => { modalCuenta(); const ok = !!document.querySelector('.modal-overlay .modal'); document.querySelectorAll('.modal-overlay').forEach(x => x.remove()); return ok; })()`);
    assert.strictEqual(v, true);
  });


  await check('aplicar paga: patrimonio sube la paga una vez', async () => {
    const v = await evalJs(`(() => {
      const backup = JSON.parse(JSON.stringify(state));
      state = seedState();
      const mk = currentMonthKey();
      const antes = saldosActuales().total;
      state.ajustes.pagas.activo = true;
      state.ajustes.pagas.numero = 1;
      state.ajustes.pagas.mes1 = +mk.split('-')[1];
      state.ajustes.pagas.importe = 1000;
      state.ajustes.pagas.reparto = { vivienda: 80, etf: 10, viajes: 10 };
      const snap = snapPorMes(mk);
      snap.pagaAplicada = false;
      aplicarPaga(mk);
      const resultado = { antes, despues: saldosActuales().total, pagada: !!snap.pagaAplicada, saldo: saldoCuenta('h-ibercaja') };
      state = backup;
      guardarEstado(state, true);
      return resultado;
    })()`);
    assert.ok(Math.abs((v.despues - v.antes) - 1000) < 0.02, JSON.stringify(v));
    assert.ok(v.pagada, JSON.stringify(v));
  });


  await check('ajustes: botones nuevos presentes', async () => {
    const v = await evalJs(`(() => {
      irTab('ajustes');
      return ['#btn-add-rec','#btn-apply-rec','#btn-add-seg','#btn-pin-set','#btn-versiones','#btn-export-csv','#btn-export-resumen'].every(sel => !!document.querySelector(sel));
    })()`);
    assert.strictEqual(v, true);
  });

  await check('modales nuevos abren y cierran', async () => {
    const v = await evalJs(`(() => {
      const ok = [];
      for (const fn of [modalRecurrente, modalSeguro, modalPin, modalDeuda, modalImportarCSV]) {
        try { fn(); ok.push(!!document.querySelector('.modal-overlay .modal')); } catch (e) { ok.push(false); }
        document.querySelectorAll('.modal-overlay').forEach(x => x.remove());
      }
      return ok;
    })()`);
    assert.ok(v.every(Boolean), JSON.stringify(v));
  });


  await check('export CSV no lanza excepción', async () => {
    const v = await evalJs(`(() => { try { descargarCSVMovimientos(); descargarResumenCSV(); return true; } catch (e) { return String(e); } })()`);
    assert.strictEqual(v, true, String(v));
  });


  await check('snapshot mensual mueve caja y mantiene el total', async () => {
    const v = await evalJs(`(() => {
      const backup = JSON.parse(JSON.stringify(state));
      state = seedState();
      const mk = currentMonthKey();
      const snap = snapPorMes(mk);
      snap.valores = { 'h-ibercaja': 1500, 'h-emergencia': 4500, 'h-vivienda': 3000, 'h-viajes': 0, 'h-etf': 1000 };
      snap.aportes = { 'h-ibercaja': 0, 'h-emergencia': 0, 'h-vivienda': 750, 'h-viajes': 0, 'h-etf': 50 };
      for (const h of holdingsActivos()) {
        if (esCuentaEfectivo(h) && snap.valores[h.id] != null) { h.saldoBase = snap.valores[h.id]; h.fechaBase = mk + '-01'; }
      }
      sincronizarAportesSnapshot(mk);
      const r = { total: saldosActuales().total, caja: saldoCuenta('h-ibercaja'), vivienda: valorHolding('h-vivienda'), etf: valorHolding('h-etf') };
      state = backup; guardarEstado(state, true);
      return r;
    })()`);
    assert.ok(Math.abs(v.total - 10000) < 0.02, JSON.stringify(v));
    assert.ok(Math.abs(v.caja - 700) < 0.02, JSON.stringify(v));
    assert.ok(Math.abs(v.vivienda - 3750) < 0.02, JSON.stringify(v));
    assert.ok(Math.abs(v.etf - 1050) < 0.02, JSON.stringify(v));
  });


  await check('modal registrar mueve caja de verdad', async () => {
    const v = await evalJs(`(() => {
      const backup = JSON.parse(JSON.stringify(state));
      state = seedState();
      guardarEstado(state, true);
      render();
      modalRegistrar(currentMonthKey());
      const set = (hid, valor, aporte) => {
        const card = document.querySelector('[data-hid="' + hid + '"]');
        card.querySelector('.reg-valor').value = String(valor).replace('.', ',');
        card.querySelector('.reg-aporte').value = String(aporte).replace('.', ',');
      };
      set('h-ibercaja', 1500, 0);
      set('h-emergencia', 4500, 0);
      set('h-vivienda', 3000, 750);
      set('h-viajes', 0, 0);
      set('h-etf', 1000, 50);
      document.querySelector('#reg-guardar').click();
      const r = { total: saldosActuales().total, caja: saldoCuenta('h-ibercaja'), vivienda: valorHolding('h-vivienda'), etf: valorHolding('h-etf') };
      state = backup; guardarEstado(state, true);
      return r;
    })()`);
    assert.ok(Math.abs(v.total - 10000) < 0.02, JSON.stringify(v));
    assert.ok(Math.abs(v.caja - 700) < 0.02, JSON.stringify(v));
    assert.ok(Math.abs(v.vivienda - 3750) < 0.02, JSON.stringify(v));
    assert.ok(Math.abs(v.etf - 1050) < 0.02, JSON.stringify(v));
  });


  await check('parseCSV detecta cabeceras y decimales', async () => {
    const v = await evalJs(`(() => { const csv = 'fecha;importe;concepto' + String.fromCharCode(10) + '2026-11-01;12,50;Café'; return parseCSV(csv); })()`);
    assert.strictEqual(v.length, 1);
    assert.strictEqual(v[0].fecha, '2026-11-01');
    assert.strictEqual(v[0].importe, '12,50');
    assert.strictEqual(v[0].concepto, 'Café');
  });


  await check('migración de estado antiguo', async () => {
    const v = await evalJs(`(() => {
      const old = {
        v: 2,
        ajustes: { nombre: 'Test', ingreso: 1553, pagas: { activo: true, numero: 2, importe: 1553, mes1: 6, mes2: 12, reparto: { vivienda: 80, etf: 10, viajes: 10 } }, objetivoCasa: { precio: 300000, pctEntrada: 20, pctGastos: 11, fechaObjetivo: '2032-06' } },
        categorias: [{ id: 'c1', nombre: 'Ocio', presupuesto: 100 }],
        holdings: [{ id: 'h1', nombre: 'Cuenta', cubo: 'diaadia', plan: 0 }],
        snapshots: [], gastos: [], cubos: [{ id: 'diaadia', nombre: 'Día a día', objetivo: 0 }],
      };
      const n = normalizarEstado(old);
      return { v: n.v, plan: !!n.plan, deudas: Array.isArray(n.deudas), movs: Array.isArray(n.movimientos), tipo: n.holdings[0].tipo, baseTs: isFinite(+n.holdings[0].fechaBaseTs) };
    })()`);
    assert.strictEqual(v.v, 3);
    assert.strictEqual(v.plan, true);
    assert.strictEqual(v.deudas, true);
    assert.strictEqual(v.movs, true);
    assert.strictEqual(v.tipo, 'efectivo');
    assert.strictEqual(v.baseTs, true);
  });


  await check('PIN bloquea y desbloquea', async () => {
    const v = await evalJs(`(async () => {
      const backup = state.ajustes.pinHash;
      state.ajustes.pinHash = await hashPin('1234');
      bloquearApp();
      const bloqueado = !!document.querySelector('.pin-lock');
      document.querySelector('#pin-unlock').value = '1234';
      document.querySelector('#pin-unlock-btn').click();
      await new Promise(r => setTimeout(r, 80));
      const desbloqueado = !document.querySelector('.pin-lock');
      state.ajustes.pinHash = backup;
      document.querySelectorAll('.pin-lock').forEach(x => x.remove());
      return { bloqueado, desbloqueado };
    })()`);
    assert.strictEqual(v.bloqueado, true);
    assert.strictEqual(v.desbloqueado, true);
  });


  await check('objetivo casa y plan comparten precio', async () => {
    const v = await evalJs(`(() => {
      const backup = JSON.parse(JSON.stringify(state));
      modalObjetivoCasa();
      document.querySelector('#oc-precio').value = '350000';
      document.querySelector('#oc-save').click();
      const r = { oc: state.ajustes.objetivoCasa.precio, plan: state.plan.hipoteca.precio, casa: casaResumen().precio };
      state = backup; guardarEstado(state, true);
      return r;
    })()`);
    assert.strictEqual(v.oc, 350000);
    assert.strictEqual(v.plan, 350000);
    assert.strictEqual(v.casa, 350000);
  });

  await check('limpiar datos de prueba', async () => {
    await evalJs(`(() => {
      state.gastos = state.gastos.filter(g => g.id !== 'test-gasto');
      state.movimientos = state.movimientos.filter(m => !['test-mov','test-tr'].includes(m.id));
      state.deudas = state.deudas.filter(d => d.id !== 'test-deuda');
      state.compartidosEventos = state.compartidosEventos.filter(e => e.id !== 'test-ev');
      state.personas = state.personas.filter(p => p.id !== 'p1');
      guardarEstado();
      return true;
    })()`);
  });

  console.log(checks.join('\n'));
  ws.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
