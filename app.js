/* Finanzas Personal — app de gastos, inversión y patrimonio (PWA, datos en localStorage) */
'use strict';

/* ============ Utilidades ============ */
const $ = (sel, root = document) => root.querySelector(sel);
const uid = () =>
  (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2));

const PALETA = ['#8b5cf6', '#38bdf8', '#f59e0b', '#10b981', '#f43f5e', '#22d3ee', '#a78bfa', '#fb923c', '#4ade80', '#e879f9'];

function parseAmount(v) {
  if (typeof v === 'number') return isFinite(v) ? Math.round(v * 100) / 100 : null;
  const s = String(v || '').trim().replace(/\s/g, '').replace(',', '.');
  if (!s) return null;
  const n = parseFloat(s);
  return isFinite(n) ? Math.round(n * 100) / 100 : null;
}

const eur = (n, decimales = 2) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: decimales, maximumFractionDigits: decimales }).format(n || 0);

const eur0 = (n) => eur(n, 0);

function fmtPct(p, { conSigno = true, decimales = 2 } = {}) {
  if (p == null || !isFinite(p)) return '—';
  const s = (p * 100).toFixed(decimales).replace('.', ',');
  return conSigno && p > 0 ? `+${s} %` : `${s} %`;
}

function pctClass(p) {
  if (p == null || !isFinite(p)) return '';
  return p <= 0.70 ? 'pct-good' : p <= 1.0 ? 'pct-warn' : 'pct-bad';
}

/* Meses */
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const currentMonthKey = () => monthKey(new Date());
const prevMonthKey = (mk) => { const [y, m] = mk.split('-').map(Number); return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`; };
const nextMonthKey = (mk) => { const [y, m] = mk.split('-').map(Number); return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`; };

function fmtMes(mk) {
  const [y, m] = mk.split('-').map(Number);
  return `${MESES[m - 1].charAt(0).toUpperCase() + MESES[m - 1].slice(1)} ${y}`;
}

function fmtDia(iso) {
  const d = new Date(iso + 'T12:00:00');
  const hoy = new Date();
  const dia = `${d.getDate()} ${MESES_CORTOS[d.getMonth()]}`;
  if (d.getFullYear() === hoy.getFullYear()) return dia;
  return `${dia} ${d.getFullYear()}`;
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function toast(msg, tipo = '') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = `show ${tipo}`;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { t.className = ''; }, 2600);
}

/* ============ Estado ============ */
const STORAGE_KEY = 'finanzas-personal-v2';
const STORAGE_KEY_VIEJA = 'finanzas-personal-v1';

function seedState() {
  const mk = currentMonthKey();
  return {
    v: 2,
    ajustes: {
      ingreso: 1553.23,
      pagas: {
        activo: true,
        numero: 2,          // 1 o 2 pagas al año
        importe: 1553.23,   // importe neto por paga
        mes1: 6,            // junio (o julio: cámbialo)
        mes2: 12,           // diciembre
        reparto: { vivienda: 80, etf: 10, viajes: 10 }, // % de cada paga; el resto va a día a día
      },
      objetivoCasa: {
        precio: 300000,   // precio orientativo de la vivienda
        pctEntrada: 20,   // parte que paga el banco no
        pctGastos: 11,    // impuestos y gastos de compra (10–12 % según el informe)
        margen: 0,        // margen mensual que pasas al fondo (informe: hasta 223,23 €)
        extraAnual: 2485.17, // compatibilidad; ahora se calcula desde «pagas»
        fechaObjetivo: '2032-06',
      },
    },
    categorias: [
      { id: 'c-ocio', nombre: 'Ocio social: amigos y pareja', presupuesto: 250, color: PALETA[0] },
      { id: 'c-comidas', nombre: 'Comidas, cafés y pequeños gastos diarios', presupuesto: 90, color: PALETA[3] },
      { id: 'c-transporte', nombre: 'Transporte, móvil y fijos', presupuesto: 30, color: PALETA[2] },
      { id: 'c-compras', nombre: 'Compras personales y caprichos', presupuesto: 100, color: PALETA[1] },
      { id: 'c-viajes', nombre: 'Viajes, regalos e irregulares', presupuesto: 50, color: PALETA[4] },
    ],
    gastos: [],
    cubos: [
      { id: 'diaadia', nombre: 'Día a día', objetivo: 0 },
      { id: 'emergencia', nombre: 'Emergencia', objetivo: 0 },
      { id: 'vivienda', nombre: 'Vivienda', objetivo: 0 },
      { id: 'viajes', nombre: 'Viajes y regalos', objetivo: 0 },
      { id: 'jubilacion', nombre: 'Jubilación', objetivo: 0 },
    ],
    holdings: [
      { id: 'h-ibercaja', nombre: 'Día a día (Ibercaja)', cubo: 'diaadia', plan: 0 },
      { id: 'h-emergencia', nombre: 'Emergencia (Trade Republic · efectivo)', cubo: 'emergencia', plan: 0 },
      // Vivienda y emergencia comparten cuenta en Trade Republic: la app lleva el reparto anotado
      { id: 'h-vivienda', nombre: 'Vivienda (Trade Republic · efectivo)', cubo: 'vivienda', plan: 750 },
      // La partida de viajes no se pasa a vivienda: se acumula «anotada como viajes»
      { id: 'h-viajes', nombre: 'Viajes y regalos (Trade Republic · efectivo)', cubo: 'viajes', plan: 50 },
      { id: 'h-etf', nombre: 'ETF FTSE All-World (jubilación)', cubo: 'jubilacion', plan: 50 },
    ],
    // Primer registro: valores iniciales del plan (capital base). Editable desde la app.
    snapshots: [
      { id: mk, month: mk, inicial: true, valores: { 'h-ibercaja': 1500, 'h-emergencia': 4500, 'h-vivienda': 3000, 'h-viajes': 0, 'h-etf': 1000 }, aportes: { 'h-ibercaja': 0, 'h-emergencia': 0, 'h-vivienda': 0, 'h-viajes': 0, 'h-etf': 0 } },
    ],
    eliminados: [],
  };
}

let state; // se inicializa tras la declaración de funciones
let ui = { tab: 'gastos', month: currentMonthKey() };
let deferredInstall = null;

state = cargarEstado();

/* Marcas para la fusión por registro en el servidor */
function stamp(x) { x.mod = Date.now(); return x; }

function tumba(tipo, id) {
  state.eliminados = state.eliminados || [];
  state.eliminados.push({ t: tipo, id, mod: Date.now() });
}

function cargarEstado() {
  try { localStorage.removeItem(STORAGE_KEY_VIEJA); } catch (e) {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && Array.isArray(s.categorias)) {
        s.ajustes.objetivoCasa = s.ajustes.objetivoCasa || seedState().ajustes.objetivoCasa;
        s.ajustes.pagas = s.ajustes.pagas || seedState().ajustes.pagas;
        s.eliminados = Array.isArray(s.eliminados) ? s.eliminados : [];
        for (const sn of s.snapshots || []) if (!sn.id) sn.id = sn.month;
        // Migración informe v3 (15-oct-2026): vivienda 750 €, presupuestos reales, nueva bolsa de viajes
        if (!s.cubos.some((c) => c.id === 'viajes')) s.cubos.push({ id: 'viajes', nombre: 'Viajes y regalos', objetivo: 0 });
        if (!s.holdings.some((h) => h.id === 'h-viajes')) {
          s.holdings.push({ id: 'h-viajes', nombre: 'Viajes y regalos (Trade Republic · efectivo)', cubo: 'viajes', plan: 50 });
        }
        for (const h of s.holdings || []) {
          if (h.id === 'h-vivienda' && /cuenta remunerada/i.test(h.nombre)) h.nombre = 'Vivienda (Trade Republic · efectivo)';
          if (h.id === 'h-emergencia' && /Fondo de emergencia/i.test(h.nombre)) h.nombre = 'Emergencia (Trade Republic · efectivo)';
          // 450 era el plan del informe anterior; si no lo has tocado, subir a 750
          if (h.id === 'h-vivienda' && (+h.plan || 0) === 450) h.plan = 750;
        }
        for (const c of s.categorias || []) {
          // solo si siguen con los valores por defecto del informe anterior
          if (c.id === 'c-transporte' && (+c.presupuesto || 0) === 180) c.presupuesto = 30;
          if (c.id === 'c-comidas' && (+c.presupuesto || 0) === 150) c.presupuesto = 90;
          if (c.id === 'c-viajes' && (+c.presupuesto || 0) === 150) c.presupuesto = 50;
        }
        // los meses ya registrados también deben incluir la nueva bolsa de viajes (0 €)
        for (const sn of s.snapshots || []) {
          if (sn.valores && sn.valores['h-viajes'] == null) { sn.valores['h-viajes'] = 0; sn.aportes['h-viajes'] = 0; }
        }
        return s;
      }
    }
  } catch (e) { /* estado corrupto: se reseed */ }
  const s = seedState();
  guardarEstado(s);
  return s;
}

function guardarEstado(s = state, silencioso = false) {
  state = s;
  try {
    state.syncT = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { toast('Error al guardar', 'error'); }
  if (!silencioso) syncProgramar();
}

/* ============ Derivados: gastos ============ */
function gastosDelMes(mk) {
  return state.gastos.filter((g) => g.fecha.startsWith(mk)).sort((a, b) => b.fecha.localeCompare(a.fecha) || b.creado - a.creado);
}

function catPorId(id) { return state.categorias.find((c) => c.id === id); }
function cuboPorId(id) { return state.cubos.find((c) => c.id === id); }

function totalGastado(mk) {
  return gastosDelMes(mk).reduce((a, g) => a + g.monto, 0);
}

function presupuestoTotal() {
  return state.categorias.reduce((a, c) => a + (+c.presupuesto || 0), 0);
}

/* ============ Derivados: análisis multi-mes ============ */
function analisisPeriodo(n) {
  const meses = [];
  for (let i = n - 1; i >= 0; i--) meses.push(addMonths(currentMonthKey(), -i));
  return meses.map((mk) => {
    const gastos = gastosDelMes(mk);
    const porCat = { __none: 0 };
    for (const c of state.categorias) porCat[c.id] = 0;
    let total = 0;
    for (const g of gastos) {
      const id = state.categorias.some((c) => c.id === g.catId) ? g.catId : '__none';
      porCat[id] = (porCat[id] || 0) + g.monto;
      total += g.monto;
    }
    return { mk, porCat, total, n: gastos.length };
  });
}

function mediana(nums) {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function etiquetaMes(mk) {
  return `${MESES_CORTOS[+mk.split('-')[1] - 1]} ${mk.slice(2, 4)}`;
}

/* ============ Derivados: inversión ============ */
function snapPorMes(mk) { return state.snapshots.find((s) => s.month === mk); }

function mesesRegistrados() {
  return state.snapshots.map((s) => s.month).sort();
}

function holdingPorId(id) { return state.holdings.find((h) => h.id === id); }

/* Serie por holding: [{month, valor (antes aporte), aporte, post}] */
function serieHolding(hid) {
  return mesesRegistrados()
    .filter((mk) => snapPorMes(mk).valores[hid] != null)
    .map((mk) => {
      const s = snapPorMes(mk);
      const valor = +s.valores[hid] || 0;
      const aporte = +s.aportes[hid] || 0;
      return { month: mk, valor, aporte, post: valor + aporte };
    });
}

function statsHolding(hid) {
  const serie = serieHolding(hid);
  if (!serie.length) return { valorActual: 0, aportado: 0, roi: null, serie };
  const primero = serie[0];
  const ultimo = serie[serie.length - 1];
  const aportado = primero.valor + serie.reduce((a, s) => a + s.aporte, 0);
  const valorActual = ultimo.post;
  const roi = aportado > 0 ? (valorActual - aportado) / aportado : null;
  return { valorActual, aportado, roi, serie, ultimo, primero };
}

/* Rendimiento mensual de un holding: variación del valor descontando aportaciones */
function perfHolding(hid, mk) {
  const serie = serieHolding(hid);
  const i = serie.findIndex((s) => s.month === mk);
  if (i <= 0) return null;
  const prevPost = serie[i - 1].post;
  if (prevPost <= 0) return null;
  return (serie[i].valor - prevPost) / prevPost;
}

/* Serie agregada del patrimonio */
function seriePatrimonio() {
  const meses = mesesRegistrados();
  return meses.map((mk) => {
    const s = snapPorMes(mk);
    let post = 0, pre = 0;
    for (const h of state.holdings) {
      const v = s.valores[h.id];
      if (v != null) { pre += +v || 0; post += (+v || 0) + (+s.aportes[h.id] || 0); }
    }
    return { month: mk, valor: pre, post };
  });
}

function statsPatrimonio() {
  const serie = seriePatrimonio();
  if (!serie.length) return { total: 0, aportado: 0, roi: null, perfMes: null, serie };
  const primero = serie[0];
  const ultimo = serie[serie.length - 1];
  let aportado = primero.valor;
  for (const mk of mesesRegistrados()) {
    const s = snapPorMes(mk);
    for (const h of state.holdings) if (s.valores[h.id] != null) aportado += +s.aportes[h.id] || 0;
  }
  const roi = aportado > 0 ? (ultimo.post - aportado) / aportado : null;
  const perfMes = serie.length > 1 && serie[serie.length - 2].post > 0
    ? (ultimo.valor - serie[serie.length - 2].post) / serie[serie.length - 2].post
    : null;
  return { total: ultimo.post, aportado, roi, perfMes, serie, ultimo, primero };
}

function distribucionCubos() {
  const stats = statsPatrimonio();
  return state.cubos.map((cubo) => {
    let total = 0;
    for (const h of state.holdings) {
      if (h.cubo !== cubo.id) continue;
      total += statsHolding(h.id).valorActual;
    }
    return { ...cubo, total, pct: stats.total > 0 ? total / stats.total : 0 };
  }).filter((b) => b.total > 0 || true);
}

/* Saldos actuales agrupados por entidad y por función */
function saldosActuales() {
  const val = (hid) => statsHolding(hid).valorActual;
  const sumCubos = (ids) => state.holdings.filter((h) => ids.includes(h.cubo)).reduce((a, h) => a + val(h.id), 0);
  const diaadia = sumCubos(['diaadia']);
  const colchon = sumCubos(['emergencia']);
  const vivienda = sumCubos(['vivienda']);
  const viajes = sumCubos(['viajes']);
  const inversion = sumCubos(['jubilacion']);
  const ahorro = vivienda + viajes;
  const efectivoTR = colchon + ahorro;
  const conocidos = ['diaadia', 'emergencia', 'vivienda', 'viajes', 'jubilacion'];
  const otros = state.holdings.filter((h) => !conocidos.includes(h.cubo)).reduce((a, h) => a + val(h.id), 0);
  const tr = efectivoTR + inversion + otros;
  return { diaadia, colchon, vivienda, viajes, ahorro, inversion, efectivoTR, otros, tr, total: diaadia + tr };
}

/* ============ Objetivo: casa ============ */
function addMonths(mk, n) {
  let [y, m] = mk.split('-').map(Number);
  m += n;
  while (m > 12) { m -= 12; y++; }
  while (m < 1) { m += 12; y--; }
  return `${y}-${String(m).padStart(2, '0')}`;
}

function monthsBetween(mkA, mkB) {
  const [y1, m1] = mkA.split('-').map(Number);
  const [y2, m2] = mkB.split('-').map(Number);
  return (y2 - y1) * 12 + (m2 - m1);
}

/* ============ Pagas extra ============ */
function pagasConfig() {
  return state.ajustes.pagas || { activo: false };
}

function mesesDePagas() {
  const p = pagasConfig();
  if (!p.activo) return [];
  const numero = Math.min(Math.max(+p.numero || 2, 1), 2);
  const m1 = +p.mes1 || 6;
  return numero === 2 ? [m1, +p.mes2 || 12] : [m1];
}

function esMesDePaga(mk) {
  return mesesDePagas().includes(+mk.split('-')[1]);
}

/* Reparto de una paga por cubos → posiciones concretas */
function repartoPaga(monto) {
  const p = pagasConfig();
  if (!p.activo) return [];
  const r = p.reparto || {};
  let pct = {
    vivienda: Math.max(0, +r.vivienda || 0),
    jubilacion: Math.max(0, +r.etf || 0),
    viajes: Math.max(0, +r.viajes || 0),
  };
  const suma = pct.vivienda + pct.jubilacion + pct.viajes;
  if (suma > 100) {
    const f = 100 / suma;
    pct = { vivienda: pct.vivienda * f, jubilacion: pct.jubilacion * f, viajes: pct.viajes * f };
  } else {
    pct.diaadia = 100 - suma;
  }
  const out = [];
  for (const [cubo, pctCubo] of Object.entries(pct)) {
    if (pctCubo <= 0) continue;
    const hs = state.holdings.filter((h) => h.cubo === cubo);
    if (!hs.length) continue;
    const importeCubo = (monto * pctCubo) / 100;
    for (const h of hs) out.push({ hid: h.id, monto: Math.round((importeCubo / hs.length) * 100) / 100, cubo, pct: pctCubo });
  }
  return out;
}

function aplicarPaga(mk) {
  const p = pagasConfig();
  if (!p.activo) return toast('Las pagas extra están desactivadas', 'error');
  const importe = +p.importe || 0;
  if (importe <= 0) return toast('Configura el importe de la paga', 'error');
  const snap = snapPorMes(mk);
  if (!snap) return modalRegistrar(mk);
  if (snap.pagaAplicada) return toast('La paga ya está aplicada a ese mes');
  for (const r of repartoPaga(importe)) {
    snap.valores[r.hid] = Math.round(((+snap.valores[r.hid] || 0) + r.monto) * 100) / 100;
    snap.aportes[r.hid] = Math.round(((+snap.aportes[r.hid] || 0) + r.monto) * 100) / 100;
  }
  snap.pagaAplicada = true;
  stamp(snap);
  guardarEstado();
  toast(`Paga extra aplicada a ${fmtMes(mk)}`);
  render();
}

function extraAnualVivienda() {
  const p = pagasConfig();
  if (!p.activo) return 0;
  const numero = Math.min(Math.max(+p.numero || 2, 1), 2);
  return numero * (+p.importe || 0) * ((+((p.reparto || {}).vivienda) || 0) / 100);
}

function fondoViviendaActual() {
  return state.holdings
    .filter((h) => h.cubo === 'vivienda')
    .reduce((a, h) => a + statsHolding(h.id).valorActual, 0);
}

function datosVivienda() {
  const o = state.ajustes.objetivoCasa || {};
  const precio = +o.precio || 0;
  const pctEntrada = +o.pctEntrada || 0;
  const pctGastos = +o.pctGastos || 0;
  const objetivo = precio * (pctEntrada + pctGastos) / 100;
  const fondo = fondoViviendaActual();
  const planMes = state.holdings.filter((h) => h.cubo === 'vivienda').reduce((a, h) => a + (+h.plan || 0), 0);
  const margen = +o.margen || 0;
  const extraAnual = extraAnualVivienda();
  const aporteMes = planMes + margen + extraAnual / 12;
  const faltan = Math.max(objetivo - fondo, 0);
  const meses = faltan > 0 && aporteMes > 0 ? faltan / aporteMes : null;
  const llegada = meses != null ? addMonths(currentMonthKey(), Math.ceil(meses)) : null;
  const fechaObj = o.fechaObjetivo || null;
  const mesesHastaObj = fechaObj ? Math.max(monthsBetween(currentMonthKey(), fechaObj), 0) : null;
  const fondoEnFecha = mesesHastaObj != null ? fondo + aporteMes * mesesHastaObj : null;
  const cumple = mesesHastaObj != null && objetivo > 0 ? fondoEnFecha >= objetivo : null;
  return { o, precio, pctEntrada, pctGastos, objetivo, fondo, planMes, margen, extraAnual, aporteMes, faltan, meses, llegada, fechaObj, mesesHastaObj, fondoEnFecha, cumple };
}

/* ============ Gráficos SVG ============ */
function lineaChart(valores, etiquetasX, { alto = 190, color = '#10b981' } = {}) {
  const ancho = 600;
  valores = valores.map((v) => v || 0);
  if (!valores.length) return '';
  let min = Math.min(...valores), max = Math.max(...valores);
  if (min === max) { min = min * 0.95 - 1; max = max * 1.05 + 1; }
  const padL = 8, padR = 8, padT = 18, padB = 24;
  const px = (i) => padL + (i * (ancho - padL - padR)) / Math.max(valores.length - 1, 1);
  const py = (v) => padT + (1 - (v - min) / (max - min)) * (alto - padT - padB);
  const pts = valores.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const area = `${padL},${alto - padB} ${pts} ${ancho - padR},${alto - padB}`;
  const gid = 'grad-' + uid();
  const xLabels = etiquetasX.map((t, i) => {
    const step = Math.ceil(etiquetasX.length / 7);
    if (i % step !== 0 && i !== etiquetasX.length - 1) return '';
    const anchor = i === 0 ? 'start' : i === etiquetasX.length - 1 ? 'end' : 'middle';
    return `<text x="${px(i)}" y="${alto - 6}" text-anchor="${anchor}" font-size="10" fill="#64748b">${escapeHtml(t)}</text>`;
  }).join('');
  const yLabels =
    `<text x="${padL}" y="12" font-size="10" fill="#64748b">${eur0(max).replace(/\u00a0/g, ' ')}</text>` +
    `<text x="${padL}" y="${alto - padB - 4}" font-size="10" fill="#64748b">${eur0(min).replace(/\u00a0/g, ' ')}</text>`;
  const last = valores.length - 1;
  return `<svg viewBox="0 0 ${ancho} ${alto}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="gráfico de evolución">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
    </linearGradient></defs>
    <polygon points="${area}" fill="url(#${gid})"/>
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${px(last)}" cy="${py(valores[last])}" r="4" fill="${color}"/>
    ${yLabels}${xLabels}
  </svg>`;
}

function sparkDatos(valores, { w = 96, h = 30 } = {}) {
  valores = valores.map((v) => v || 0);
  if (valores.length < 2) return '';
  const min = Math.min(...valores), max = Math.max(...valores);
  const px = (i) => (i * (w - 4)) / Math.max(valores.length - 1, 1) + 2;
  const py = (v) => min === max ? h / 2 : 2 + (1 - (v - min) / (max - min)) * (h - 4);
  const pts = valores.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const sube = valores[valores.length - 1] >= valores[0];
  const color = sube ? '#22c55e' : '#f43f5e';
  return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${px(valores.length - 1)}" cy="${py(valores[valores.length - 1])}" r="2.5" fill="${color}"/>
  </svg>`;
}

/* ============ App shell ============ */
function irTab(tab) {
  ui.tab = tab;
  try { history.replaceState(null, '', '#' + tab); } catch (e) {}
  document.querySelectorAll('#tabs .tab').forEach((b) => { b.classList.toggle('active', b.dataset.tab === tab); });
  render();
  window.scrollTo({ top: 0 });
}

function render() {
  const view = $('#view');
  if (ui.tab === 'gastos') return vistaGastos(view);
  if (ui.tab === 'objetivo') return vistaObjetivo(view);
  if (ui.tab === 'inversion') return vistaInversion(view);
  if (ui.tab === 'patrimonio') return vistaPatrimonio(view);
  if (ui.tab === 'analisis') return vistaAnalisis(view);
  if (ui.tab === 'ajustes') return vistaAjustes(view);
}

function cabecera(titulo, conMes = true) {
  return `
    <header class="view-header">
      <h1>${titulo}</h1>
      ${conMes ? `
      <div class="month-nav" aria-label="Cambiar de mes">
        <button id="mes-prev" type="button" aria-label="Mes anterior">‹</button>
        <span class="month-label">${fmtMes(ui.month)}</span>
        <button id="mes-next" type="button" aria-label="Mes siguiente">›</button>
      </div>` : ''}
    </header>`;
}

function cablearMesNav() {
  const p = $('#mes-prev'), n = $('#mes-next');
  if (p) p.onclick = () => { ui.month = prevMonthKey(ui.month); render(); };
  if (n) n.onclick = () => { ui.month = nextMonthKey(ui.month); render(); };
}

/* ============ Vista: Gastos ============ */
function vistaGastos(view) {
  const gastos = gastosDelMes(ui.month);
  const total = totalGastado(ui.month);
  const presupuesto = presupuestoTotal();
  const pctGlobal = presupuesto > 0 ? total / presupuesto : null;
  const quedan = presupuesto - total;
  const saldos = saldosActuales();

  const resumen = gastos.length ? gastos.reduce((a, g) => a + g.monto, 0) / gastos.length : 0;

  const filasCategorias = state.categorias
    .map((c) => {
      const gastado = gastos.filter((g) => g.catId === c.id).reduce((a, g) => a + g.monto, 0);
      return { ...c, gastado };
    })
    .sort((a, b) => b.gastado - a.gastado)
    .map((c) => {
      const pct = c.presupuesto > 0 ? c.gastado / c.presupuesto : null;
      const cls = pctClass(pct);
      let barra = '';
      if (c.presupuesto > 0) {
        const sobre = pct > 1;
        barra = `<div class="progress ${pct > 1 ? 'over' : pct > 0.7 ? 'warn' : ''}"><span style="width:${Math.min(pct * 100, 100)}%"></span></div>`;
        return `
          <div class="cat-row">
            <span class="cat-name"><span class="dot" style="background:${c.color}"></span>${escapeHtml(c.nombre)}</span>
            <span class="pct ${cls}">${pct == null ? '' : fmtPct(pct, { conSigno: false, decimales: 0 })}</span>
            <span class="cat-amounts"><strong>${eur(c.gastado)}</strong> de ${eur(c.presupuesto, 0)}${sobre ? '' : ` · quedan ${eur(Math.max(c.presupuesto - c.gastado, 0), 0)}`}</span>
            ${barra}
          </div>`;
      }
      return `
        <div class="cat-row">
          <span class="cat-name"><span class="dot" style="background:${c.color}"></span>${escapeHtml(c.nombre)}</span>
          <span></span>
          <span class="cat-amounts"><strong>${eur(c.gastado)}</strong> · sin presupuesto</span>
        </div>`;
    })
    .join('');

  const dias = {};
  for (const g of gastos) (dias[g.fecha] = dias[g.fecha] || []).push(g);

  const lista = Object.keys(dias).length === 0
    ? `<div class="empty"><span class="big">🗂️</span>Aún no hay gastos en ${fmtMes(ui.month).toLowerCase()}.<br>Usa el botón de abajo para añadir el primero.</div>`
    : Object.keys(dias).sort().reverse().map((d) => `
      <div class="day-group">
        <div class="day-label">${fmtDia(d)}</div>
        ${dias[d].map((g) => {
          const cat = catPorId(g.catId);
          return `
          <div class="exp-item" data-edit="${g.id}" role="button" tabindex="0" aria-label="Editar gasto">
            <span class="dot" style="background:${cat ? cat.color : '#64748b'}"></span>
            <div class="exp-main">
              <div class="exp-note">${escapeHtml(g.nota || 'Gasto')}</div>
              <div class="exp-cat">${escapeHtml(cat ? cat.nombre : 'Sin categoría')}</div>
            </div>
            <span class="exp-amount">${eur(g.monto)}</span>
          </div>`;
        }).join('')}
      </div>`).join('');

  view.innerHTML = `
    ${cabecera('Gastos')}
    <div class="row-split" style="margin:0 4px 8px">
      <h2>Tu dinero ahora</h2>
      <button class="btn secondary small" id="mini-ver" type="button" style="padding:5px 10px;font-size:0.75rem">Ver desglose ›</button>
    </div>
    <div class="stat-grid" style="margin-bottom:14px">
      <div class="stat"><div class="label">Ibercaja</div><div class="value">${eur0(saldos.diaadia)}</div><div class="hint" style="margin-top:2px">día a día</div></div>
      <div class="stat"><div class="label">Trade Republic · efectivo</div><div class="value">${eur0(saldos.efectivoTR)}</div><div class="hint" style="margin-top:2px">colchón ${eur0(saldos.colchon)} · ahorro ${eur0(saldos.ahorro)}</div></div>
      <div class="stat"><div class="label">Trade Republic · inversión</div><div class="value">${eur0(saldos.inversion)}</div><div class="hint" style="margin-top:2px">ETF en cartera</div></div>
    </div>
    <div class="card">
      <div class="card-title"><span>Presupuesto del mes</span><span class="${pctClass(pctGlobal)}" style="text-transform:none;font-size:1rem">${pctGlobal == null ? '' : fmtPct(pctGlobal, { conSigno: false })}</span></div>
      <div class="row-split"><span class="big-number">${eur(total)}</span><span class="sub-number">de ${eur(presupuesto, 0)}</span></div>
      <div class="progress ${pctGlobal > 1 ? 'over' : pctGlobal > 0.7 ? 'warn' : ''}" style="margin-top:10px"><span style="width:${Math.min((pctGlobal || 0) * 100, 100)}%"></span></div>
      <div class="sub-number" style="margin-top:8px">${quedan >= 0 ? `Te quedan ${eur(quedan)} de margen` : `Te has pasado ${eur(Math.abs(quedan))}`}${gastos.length ? ` · gasto medio ${eur(resumen)}` : ''}</div>
    </div>
    <h2 style="margin:4px 4px 10px">¿Dónde se te va el dinero?</h2>
    <div class="cat-list">${filasCategorias || '<div class="empty">Crea categorías en Ajustes.</div>'}</div>
    <h2 style="margin:18px 4px 10px">Detalle del mes</h2>
    ${lista}
    <div style="height:8px"></div>
    <button class="btn full" id="btn-add-gasto" type="button">+ Añadir gasto</button>
  `;

  cablearMesNav();
  $('#btn-add-gasto').onclick = () => modalGasto(null);
  const miniVer = $('#mini-ver');
  if (miniVer) miniVer.onclick = () => irTab('patrimonio');
  view.querySelectorAll('[data-edit]').forEach((el) => {
    el.onclick = () => modalGasto(el.dataset.edit);
  });
}

/* ---- Modal gasto (añadir / editar) ---- */
function modalGasto(idGasto = null) {
  const g = idGasto ? state.gastos.find((x) => x.id === idGasto) : null;
  let catSel = g ? g.catId : state.categorias[0]?.id;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>${g ? 'Editar gasto' : 'Nuevo gasto'}</h3>
      <div class="form-card">
        <div class="field-row" style="margin-bottom:12px">
          <div class="field"><label for="g-monto">Importe (€)</label>
            <input id="g-monto" type="text" inputmode="decimal" placeholder="0,00" value="${g ? String(g.monto).replace('.', ',') : ''}" autofocus /></div>
          <div class="field"><label for="g-fecha">Fecha</label>
            <input id="g-fecha" type="date" value="${g ? g.fecha : hoyISO()}" /></div>
        </div>
        <div class="field"><label>Etiqueta / categoría</label>
          <div class="chips" id="g-cats">
            ${state.categorias.map((c) => `<button class="chip ${c.id === catSel ? 'selected' : ''}" type="button" data-cat="${c.id}">${escapeHtml(c.nombre)}</button>`).join('')}
          </div></div>
        <div class="field"><label for="g-nota">Nota (opcional)</label>
          <input id="g-nota" type="text" placeholder="Ej.: cena con el grupo 1" value="${escapeHtml(g ? g.nota : '')}" /></div>
      </div>
      <div class="modal-actions">
        ${g ? '<button class="btn danger" id="g-borrar" type="button">Borrar</button>' : ''}
        <button class="btn secondary" id="g-cancelar" type="button">Cancelar</button>
        <button class="btn" id="g-guardar" type="button">${g ? 'Guardar' : 'Añadir'}</button>
      </div>
    </div>`;

  function cerrar() { overlay.remove(); }
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  $('#g-monto', overlay).focus();

  overlay.querySelectorAll('[data-cat]').forEach((b) => {
    b.onclick = () => { catSel = b.dataset.cat; overlay.querySelectorAll('[data-cat]').forEach((x) => x.classList.toggle('selected', x === b)); };
  });
  $('#g-cancelar', overlay).onclick = cerrar;
  $('#g-guardar', overlay).onclick = () => {
    const monto = parseAmount($('#g-monto', overlay).value);
    const fecha = $('#g-fecha', overlay).value;
    const nota = $('#g-nota', overlay).value.trim();
    if (monto == null || monto <= 0) return toast('Introduce un importe válido', 'error');
    if (monto > 1e9) return toast('El importe es demasiado grande', 'error');
    if (!fecha) return toast('Introduce una fecha', 'error');
    if (idGasto) {
      const enEstado = state.gastos.find((x) => x.id === idGasto);
      if (enEstado) {
        Object.assign(enEstado, { monto, fecha, catId: catSel, nota });
        stamp(enEstado);
      } else {
        state.gastos.push(stamp({ id: idGasto, monto, fecha, catId: catSel, nota, creado: Date.now() }));
      }
    } else {
      state.gastos.push(stamp({ id: uid(), monto, fecha, catId: catSel, nota, creado: Date.now() }));
    }
    guardarEstado();
    cerrar();
    toast(idGasto ? 'Gasto actualizado' : 'Gasto añadido');
    render();
  };
  if (idGasto) $('#g-borrar', overlay).onclick = () => {
    tumba('gastos', idGasto);
    state.gastos = state.gastos.filter((x) => x.id !== idGasto);
    guardarEstado(); cerrar(); toast('Gasto borrado'); render();
  };
}

function hoyISO() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }

/* ============ Vista: Objetivo Casa ============ */
function vistaObjetivo(view) {
  const v = datosVivienda();
  const pct = v.objetivo > 0 ? Math.min(v.fondo / v.objetivo, 1) : 0;
  const pctReal = v.objetivo > 0 ? v.fondo / v.objetivo : 0;
  const completado = pctReal >= 1;

  const barraPct = (pct * 100).toFixed(1).replace('.', ',') + ' %';

  let ritmo = '';
  if (v.llegada) {
    ritmo = `<div class="sub-number" style="margin-top:8px">Aportando <strong>${eur0(v.aporteMes)}/mes</strong> (${eur0(v.planMes)} plan${v.margen > 0 ? ' + ' + eur0(v.margen) + ' margen' : ''} + ${eur0(v.extraAnual / 12)} pagas prorrateadas), completas la entrada en <strong>${fmtMes(v.llegada)}</strong>.</div>`;
  } else if (v.faltan > 0) {
    ritmo = `<div class="sub-number" style="margin-top:8px">Define una aportación mensual al fondo vivienda (en Inversión → Ajustes) para calcular cuándo llegarías.</div>`;
  }

  let fechaObjLinea = '';
  if (v.fechaObj && v.fondoEnFecha != null && v.objetivo > 0) {
    fechaObjLinea = v.cumple
      ? `<div class="sub-number pct-good">Con fecha objetivo ${fmtMes(v.fechaObj)}: tendrías <strong>${eur0(v.fondoEnFecha)}</strong> · objetivo cubierto ✅</div>`
      : `<div class="sub-number">Con fecha objetivo ${fmtMes(v.fechaObj)}: tendrías <strong>${eur0(v.fondoEnFecha)}</strong> · faltarían ${eur0(Math.max(v.objetivo - v.fondoEnFecha, 0))} para el objetivo.</div>`;
  }

  // Avisos con las reglas del informe (plan_financiero_vivienda_28_30)
  const avisoVivienda = (() => {
    const tips = [];
    if (v.fondo >= 25000) {
      tips.push('Se cruzó el umbral de 25.000–30.000 € del informe: es el momento de estudiar depósitos o fondos monetarios para el fondo vivienda.');
    }
    const mesesPara = v.fechaObj ? Math.max(monthsBetween(currentMonthKey(), v.fechaObj), 0) : null;
    if (mesesPara != null && mesesPara > 24 && mesesPara <= 36) {
      tips.push('Faltan 24–36 meses para la fecha objetivo (regla 6 del informe): empieza a reducir progresivamente el riesgo del dinero de la entrada.');
    } else if (mesesPara != null && mesesPara <= 24) {
      tips.push('Faltan menos de 24 meses para la fecha objetivo: según el informe, el efectivo de la entrada debería estar ya en seguro, sin bolsa.');
    }
    // Efectivo total en Trade Republic = emergencia + vivienda + viajes (comparten cuenta)
    const efectivoTR = state.holdings
      .filter((h) => h.cubo === 'emergencia' || h.cubo === 'vivienda' || h.cubo === 'viajes')
      .reduce((a, h) => a + statsHolding(h.id).valorActual, 0);
    if (efectivoTR >= 80000) {
      tips.push(`Regla 9 del informe: tienes ${eur0(efectivoTR)} de efectivo en Trade Republic y la garantía cubre 100.000 € por entidad — repártelo entre entidades para quedar por debajo.`);
    } else if (efectivoTR >= 45000) {
      tips.push(`Regla de los 45.000 € superada (${eur0(efectivoTR)} de efectivo en Trade Republic): el 3,04 % TAE solo cubre hasta 50.000 € y por encima baja. Abre MyInvestor y traslada el exceso del fondo vivienda a un fondo monetario en euros; la emergencia se queda en Trade Republic.`);
    } else if (efectivoTR >= 40000) {
      tips.push(`El efectivo de Trade Republic (${eur0(efectivoTR)}) se acerca a los 45.000 € de la regla del informe: cuando la cruces, abre MyInvestor y mueve el exceso del fondo vivienda a un fondo monetario (la emergencia se queda).`);
    }
    if (!tips.length) return '';
    return `<div class="card" style="border-color:var(--gold)"><div class="card-title"><span>📌 Avisos del plan</span></div>${tips.map((t) => `<div class="sub-number" style="margin:6px 0">• ${t}</div>`).join('')}</div>`;
  })();

  // Proyección: acumulación de aportaciones, sin intereses (como en el informe)
  const filasProyeccion = [];
  for (let anio = 1; anio <= 5; anio++) {
    const f = v.fondo + v.aporteMes * 12 * anio;
    filasProyeccion.push({ label: `${anio} año${anio > 1 ? 's' : ''}`, fondo: f });
  }
  if (v.fechaObj && v.mesesHastaObj != null && v.objetivo > 0) {
    filasProyeccion.push({ label: `${fmtMes(v.fechaObj)} (objetivo)`, fondo: v.fondo + v.aporteMes * v.mesesHastaObj, especial: true });
  }
  const proyeccion = filasProyeccion.map((r) => {
    const p = v.objetivo > 0 ? r.fondo / v.objetivo : 0;
    return `<tr><td>${r.label}</td><td>${eur0(r.fondo)}</td><td>${v.objetivo > 0 ? `${(p * 100).toFixed(0)} %` : '—'}</td></tr>`;
  }).join('');

  const desglose = `
    <div class="field-row" style="margin-bottom:0">
      <div class="field"><label for="ob-precio">Precio orientativo (€)</label>
        <input id="ob-precio" type="text" inputmode="decimal" value="${String(v.precio).replace('.', ',')}" /></div>
      <div class="field"><label for="ob-fecha">Fecha objetivo de compra</label>
        <input id="ob-fecha" type="month" value="${v.fechaObj || ''}" /></div>
      <div class="field"><label for="ob-entrada">Entrada: % que no financia el banco</label>
        <input id="ob-entrada" type="text" inputmode="decimal" value="${String(v.pctEntrada).replace('.', ',')}" /></div>
      <div class="field"><label for="ob-gastos">% gastos de compra (impuestos, notaría…)</label>
        <input id="ob-gastos" type="text" inputmode="decimal" value="${String(v.pctGastos).replace('.', ',')}" /></div>
      <div class="field"><label for="ob-margen">Margen mensual que pasas al fondo (€)</label>
        <input id="ob-margen" type="text" inputmode="decimal" value="${String(v.margen).replace('.', ',')}" /></div>
    </div>
    <p class="hint">Pagas extra al fondo vivienda: <strong>${eur0(v.extraAnual)}/año</strong> (según Ajustes → Pagas extra; ya están incluidas en el ritmo).</p>
    <p class="hint">Según el informe: entrada = 20 % del precio (hipoteca del 80 %) más un 10–12 % de impuestos y gastos. Ejemplo del informe: vivienda de ${eur0(v.precio)} → efectivo orientativo ≈ ${eur0(v.precio * 0.2)} (entrada) + ${eur0(v.precio * 0.10)}–${eur0(v.precio * 0.12)} (gastos) = objetivo ≈ ${eur0(v.precio * 0.30)}–${eur0(v.precio * 0.32)}. La reserva de emergencia y el día a día <strong>no</strong> cuentan para la entrada.</p>
  `;

  view.innerHTML = `
    ${cabecera('Objetivo: Casa', false)}
    <div class="card">
      <div class="card-title"><span>Entrada para la vivienda</span>
        <span class="${completado ? 'pct-good' : ''}" style="text-transform:none;font-size:1rem">${v.objetivo > 0 ? barraPct : '—'}</span></div>
      ${completado
        ? `<div class="big-number pct-good">🎉 Objetivo alcanzado</div>`
        : `<div class="row-split"><span class="big-number">${eur(v.fondo, 0)}</span><span class="sub-number">de ${eur0(v.objetivo)}</span></div>`}
      <div class="progress lg ${completado ? '' : ''}" style="margin-top:10px"><span style="width:${pct * 100}%"></span></div>
      ${completado ? '' : `<div class="sub-number" style="margin-top:8px">Faltan <strong>${eur0(v.faltan)}</strong></div>`}
      ${ritmo}
      ${fechaObjLinea}
    </div>

    ${avisoVivienda}

    <h2 style="margin:4px 4px 10px">Cómo se calcula el objetivo</h2>
    <div class="card">${desglose}</div>

    <h2 style="margin:18px 4px 10px">Proyección del fondo vivienda</h2>
    <table class="card table"><thead><tr><th>Horizonte</th><th>Fondo estimado</th><th>Del objetivo</th></tr></thead><tbody>${proyeccion}</tbody></table>
    <p class="hint" style="margin-top:8px">Proyección de aportaciones sin contar intereses, como en el informe. La barra crece con los valores reales que registres en «Inversión».</p>
  `;

  const guardarNum = (id, clave, { min = 0, max = Infinity, entero = false } = {}) => {
    $(id).addEventListener('change', (e) => {
      let n = parseAmount(e.target.value);
      if (n == null) { render(); return; }
      n = Math.min(Math.max(n, min), max);
      if (entero) n = Math.round(n);
      state.ajustes.objetivoCasa[clave] = n;
      state.ajustes.mod = Date.now();
      guardarEstado();
      toast('Objetivo actualizado');
      render();
    });
  };
  guardarNum('#ob-precio', 'precio');
  guardarNum('#ob-entrada', 'pctEntrada', { max: 100 });
  guardarNum('#ob-gastos', 'pctGastos', { max: 100 });
  guardarNum('#ob-margen', 'margen');
  $('#ob-fecha').addEventListener('change', (e) => {
    state.ajustes.objetivoCasa.fechaObjetivo = e.target.value || null;
    state.ajustes.mod = Date.now();
    guardarEstado();
    render();
  });
}

/* ============ Vista: Inversión ============ */
function vistaInversion(view) {
  const stats = statsPatrimonio();
  const registrado = !!snapPorMes(ui.month);
  const mesActual = currentMonthKey();
  const faltaMesActual = !snapPorMes(mesActual);

  const banner = faltaMesActual
    ? `<div class="banner">
        <span>📅</span>
        <div class="banner-text"><strong>Compra mensual</strong>
        Recuerda registrar el valor de tus inversiones en el <strong>1 de ${fmtMes(mesActual).toLowerCase()}</strong>, justo en el momento de aportar.</div>
        <button class="btn small" id="btn-registrar" type="button">Registrar</button>
      </div>`
    : !registrado
      ? `<div class="banner" style="border-color:var(--border);background:var(--card)">
          <span>📅</span>
          <div class="banner-text"><strong>${fmtMes(ui.month)} sin registrar</strong>
          No hay valores guardados de este mes. Toca «Registrar» para añadirlos o corregirlos.</div>
          <button class="btn small secondary" id="btn-registrar" type="button">Registrar</button>
        </div>`
      : '';

  // Paga extra del mes seleccionado
  let bannerPaga = '';
  const pg = pagasConfig();
  const importePaga = +pg.importe || 0;  if (pg.activo && importePaga > 0 && esMesDePaga(ui.month)) {
    const snapSel = snapPorMes(ui.month);
    const porCubo = {};
    for (const r of repartoPaga(importePaga)) porCubo[r.cubo] = (porCubo[r.cubo] || 0) + r.monto;
    const detalle = Object.entries(porCubo)
      .map(([cubo, monto]) => `${eur0(monto)} ${cuboPorId(cubo)?.nombre || cubo}`)
      .join(' · ');
    if (!snapSel) {
      bannerPaga = `<div class="banner" style="border-color:var(--gold);background:linear-gradient(120deg,rgba(245,158,11,.16),rgba(16,185,129,.10))">
        <span>🎁</span>
        <div class="banner-text"><strong>Paga extra de ${fmtMes(ui.month).toLowerCase()}</strong>
        ${eur(importePaga)} → ${detalle}. Al registrar las aportaciones se incluirá sola.</div>
        <button class="btn small" id="btn-paga-reg" type="button">Registrar</button>
      </div>`;
    } else if (!snapSel.pagaAplicada) {
      bannerPaga = `<div class="banner" style="border-color:var(--gold);background:linear-gradient(120deg,rgba(245,158,11,.16),rgba(16,185,129,.10))">
        <span>🎁</span>
        <div class="banner-text"><strong>Paga extra de ${fmtMes(ui.month).toLowerCase()}</strong>
        ${eur(importePaga)} → ${detalle}. Aún no está sumada en este mes.</div>
        <button class="btn small" id="btn-paga-aplicar" type="button">Aplicar paga</button>
      </div>`;
    } else {
      bannerPaga = `<div class="banner" style="border-color:var(--border);background:var(--card)">
        <span>✅</span>
        <div class="banner-text"><strong>Paga extra aplicada</strong>
        ${eur(importePaga)} repartidos este mes (${detalle}).</div>
      </div>`;
    }
  }

  const inversionActual = state.holdings
    .filter((h) => h.cubo === 'jubilacion')
    .reduce((a, h) => a + statsHolding(h.id).valorActual, 0);
  const avisoInversion = inversionActual <= 0
    ? `<div class="banner" style="border-color:var(--border);background:var(--card)">
        <span>🌱</span>
        <div class="banner-text"><strong>Aún sin inversión en cartera</strong>
        Todo tu dinero está en cuentas. Cuando hagas tu primera compra del ETF, regístrala con «Registrar» y aparecerá aquí y en tu patrimonio.</div>
      </div>`
    : '';

  const holdings = state.holdings.map((h) => {
    const st = statsHolding(h.id);
    const cubo = cuboPorId(h.cubo);
    const perf = perfHolding(h.id, ui.month);
    const valores = st.serie.map((s) => s.post);
    return `
      <div class="holding-card" data-open="${h.id}" role="button" tabindex="0">
        <div class="holding-head">
          <strong>${escapeHtml(h.nombre)}</strong>
          <span class="tag">${escapeHtml(cubo ? cubo.nombre : '—')}</span>
        </div>
        <div class="row-split">
          <span class="big-number" style="font-size:1.5rem">${eur(st.valorActual)}</span>
          ${st.serie.length > 1 ? sparkDatos(valores) : ''}
        </div>
        <div class="holding-values">
          <div class="hold-stat"><div class="label">Aportado</div><div class="value">${eur(st.aportado)}</div></div>
          <div class="hold-stat"><div class="label">Rentab. total</div><div class="value ${st.roi != null && st.roi >= 0 ? 'pct-good' : 'pct-bad'}">${fmtPct(st.roi)}</div></div>
          <div class="hold-stat"><div class="label">Var. ${MESES_CORTOS[+ui.month.split('-')[1] - 1]}</div><div class="value ${perf != null && perf >= 0 ? 'pct-good' : perf != null ? 'pct-bad' : ''}">${fmtPct(perf)}</div></div>
        </div>
      </div>`;
  }).join('');

  const historial = mesesRegistrados().slice().reverse().map((mk) => {
    const s = snapPorMes(mk);
    const serie = stats.serie.find((x) => x.month === mk);
    const perf = serie && stats.serie.indexOf(serie) > 0 && stats.serie[stats.serie.indexOf(serie) - 1].post > 0
      ? (serie.valor - stats.serie[stats.serie.indexOf(serie) - 1].post) / stats.serie[stats.serie.indexOf(serie) - 1].post
      : null;
    const aportes = Object.values(s.aportes).reduce((a, b) => a + (+b || 0), 0);
    return `
      <div class="history-item" data-mes="${mk}" role="button" tabindex="0">
        <span class="m">${fmtMes(mk)}</span>
        <span class="c">${aportes > 0 ? 'aportado ' + eur0(aportes) : 'sin aporte'}</span>
        <span class="v">${eur0(serie ? serie.post : 0)}</span>
        <span class="v ${perf >= 0 ? 'pct-good' : perf != null ? 'pct-bad' : ''}" style="min-width:72px;text-align:right">${fmtPct(perf)}</span>
      </div>`;
  }).join('');

  view.innerHTML = `
    ${cabecera('Inversión')}
    ${banner}
    ${bannerPaga}
    ${avisoInversion}
    <div class="card">
      <div class="card-title"><span>Patrimonio invertido</span>
        <span class="${stats.roi >= 0 ? 'pct-good' : 'pct-bad'}" style="font-size:1rem;text-transform:none">${fmtPct(stats.roi)}</span></div>
      <div class="row-split">
        <span class="big-number">${eur(stats.total)}</span>
        ${stats.serie.length > 1 ? sparkDatos(stats.serie.map((s) => s.post)) : ''}
      </div>
      <div class="sub-number">Aportado en total: ${eur(stats.aportado)}</div>
      ${stats.perfMes != null ? `<div class="sub-number">Variación último mes: <strong class="${stats.perfMes >= 0 ? 'pct-good' : 'pct-bad'}">${fmtPct(stats.perfMes)}</strong></div>` : ''}
    </div>
    <h2 style="margin:4px 4px 10px">Posiciones</h2>
    ${holdings || '<div class="empty">Añade posiciones en Ajustes para empezar a registrar valores.</div>'}
    <h2 style="margin:18px 4px 10px">Historial</h2>
    <div class="card">${historial || '<div class="empty">Todavía no hay registros.</div>'}</div>
  `;

  cablearMesNav();
  const btn = $('#btn-registrar');
  if (btn) btn.onclick = () => modalRegistrar();
  const btnPagaReg = $('#btn-paga-reg');
  if (btnPagaReg) btnPagaReg.onclick = () => modalRegistrar(ui.month);
  const btnPagaAplicar = $('#btn-paga-aplicar');
  if (btnPagaAplicar) btnPagaAplicar.onclick = () => aplicarPaga(ui.month);
  view.querySelectorAll('[data-open]').forEach((el) => {
    el.onclick = () => {
      const hid = el.dataset.open;
      const serie = serieHolding(hid);
      modalRegistrar(serie.length ? serie[serie.length - 1].month : ui.month);
    };
  });
  view.querySelectorAll('[data-mes]').forEach((el) => {
    el.onclick = () => modalRegistrar(el.dataset.mes);
  });
}

/* ---- Modal registrar / editar valores de un mes ---- */
function modalRegistrar(mk = null) {
  const mes = mk || ui.month;
  const snap = snapPorMes(mes);
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>${snap ? 'Editar' : 'Registrar'} valores · ${fmtMes(mes)}</h3>
      <p class="hint" style="margin-top:-6px">Introduce el <strong>valor de cada posición el día 1</strong> (antes de la aportación) y lo que inviertes ese día.</p>
      ${!snap && pagasConfig().activo && esMesDePaga(mes) ? `<p class="hint" style="margin-top:-6px;color:var(--gold)">🎁 Este mes toca paga extra (${eur(+pagasConfig().importe || 0)}): las aportaciones vienen ya con su parte repartida.</p>` : ''}
      <div class="form-card" id="reg-fields">
        ${state.holdings.map((h) => {
          const v = snap && snap.valores[h.id] != null ? String(snap.valores[h.id]).replace('.', ',') : '';
          let a = snap && snap.aportes[h.id] != null ? String(snap.aportes[h.id]).replace('.', ',') : '';
          const pg = pagasConfig();
          if (!snap && pg.activo && esMesDePaga(mes) && (+pg.importe || 0) > 0) {
            const extra = repartoPaga(+pg.importe)
              .filter((r) => r.hid === h.id)
              .reduce((x, r) => x + r.monto, 0);
            const base = (+h.plan || 0) + extra;
            if (base > 0) a = String(Math.round(base * 100) / 100).replace('.', ',');
          }
          return `
          <div class="holding-card" style="margin-bottom:10px" data-hid="${h.id}">
            <div class="holding-head" style="margin-bottom:8px"><strong>${escapeHtml(h.nombre)}</strong></div>
            <div class="field-row">
              <div class="field"><label>Valor el día 1 (€)</label>
                <input type="text" inputmode="decimal" class="reg-valor" placeholder="0,00" value="${v}" /></div>
              <div class="field"><label>Aportación (€)</label>
                <input type="text" inputmode="decimal" class="reg-aporte" placeholder="${String(h.plan || 0).replace('.', ',')}" value="${a}" /></div>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="modal-actions">
        ${snap ? '<button class="btn danger" id="reg-borrar" type="button">Borrar mes</button>' : ''}
        <button class="btn secondary" id="reg-cancelar" type="button">Cancelar</button>
        <button class="btn" id="reg-guardar" type="button">Guardar</button>
      </div>
    </div>`;

  function cerrar() { overlay.remove(); }
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);

  $('#reg-cancelar', overlay).onclick = cerrar;
  $('#reg-guardar', overlay).onclick = () => {
    const valores = {}, aportes = {};
    let vacio = true;
    for (const card of overlay.querySelectorAll('[data-hid]')) {
      const hid = card.dataset.hid;
      const v = parseAmount($('.reg-valor', card).value) || 0;
      const a = parseAmount($('.reg-aporte', card).value) || 0;
      valores[hid] = v; aportes[hid] = a;
      if (v !== 0 || a !== 0) vacio = false;
    }
    if (vacio && !snap) return toast('No hay valores que guardar', 'error');
    const snapActual = snapPorMes(mes);
    if (snapActual) { snapActual.valores = valores; snapActual.aportes = aportes; stamp(snapActual); }
    else {
      const nuevo = stamp({ id: mes, month: mes, valores, aportes });
      const pg = pagasConfig();
      if (pg.activo && esMesDePaga(mes) && (+pg.importe || 0) > 0) nuevo.pagaAplicada = true;
      state.snapshots.push(nuevo);
    }
    guardarEstado(); cerrar(); toast(`Valores de ${fmtMes(mes)} guardados`); render();
  };
  if (snap) $('#reg-borrar', overlay).onclick = () => {
    tumba('snapshots', mes);
    state.snapshots = state.snapshots.filter((s) => s.month !== mes);
    guardarEstado(); cerrar(); toast('Registro del mes borrado'); render();
  };
}

/* ============ Vista: Patrimonio ============ */
function vistaPatrimonio(view) {
  const stats = statsPatrimonio();
  const dist = distribucionCubos();
  const saldos = saldosActuales();
  const COLOR_CUBO = { diaadia: '#64748b', emergencia: '#38bdf8', vivienda: '#f59e0b', viajes: '#8b5cf6', jubilacion: '#10b981' };

  const ingresos = +state.ajustes.ingreso || 0;
  const gastoMes = totalGastado(currentMonthKey());
  const aportesMes = (() => {
    const snapHoy = snapPorMes(currentMonthKey());
    if (!snapHoy) return null;
    return Object.values(snapHoy.aportes).reduce((a, b) => a + (+b || 0), 0);
  })();

  const barrasCubos = dist.map((b) => {
    const pct = b.pct;
    const objetivo = b.objetivo;
    const dif = objetivo > 0 ? pct - objetivo / 100 : null;
    return `
      <div class="bucket-row">
        <div class="bucket-head">
          <span class="name"><span class="dot" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${COLOR_CUBO[b.id] || '#64748b'};margin-right:8px"></span>${escapeHtml(b.nombre)}</span>
          <span class="amount">${eur(b.total)}</span>
        </div>
        <div class="bucket-bar">
          <span style="width:${(pct * 100).toFixed(1)}%;background:${COLOR_CUBO[b.id] || '#64748b'}"></span>
        </div>
        <div class="target">${fmtPct(pct, { conSigno: false, decimales: 1 })} del total${objetivo > 0 ? ` · objetivo ${objetivo} %${dif != null ? (Math.abs(dif) < 0.005 ? ' · en línea ✅' : ` · ${dif < 0 ? 'faltan' : 'exceden'} ${fmtPct(Math.abs(dif), { conSigno: false, decimales: 1 })}`) : ''}` : ''}</div>
      </div>`;
  }).join('');

  const serie = stats.serie;
  const chart = lineaChart(serie.map((s) => s.post), serie.map((s) => `${MESES_CORTOS[+s.month.split('-')[1] - 1]} ${s.month.slice(2, 4)}`));

  const tablaMeses = serie.slice().reverse().slice(0, 12).map((s) => {
    const i = stats.serie.indexOf(s);
    const prev = i > 0 ? stats.serie[i - 1] : null;
    const perf = prev && prev.post > 0 ? (s.valor - prev.post) / prev.post : null;
    const aportes = (() => {
      const snap = snapPorMes(s.month);
      return Object.values(snap.aportes).reduce((a, b) => a + (+b || 0), 0);
    })();
    return `<tr><td>${fmtMes(s.month)}</td><td class="${perf >= 0 ? 'pct-good' : perf != null ? 'pct-bad' : ''}">${fmtPct(perf)}</td><td>${eur0(aportes)}</td><td>${eur0(s.post)}</td></tr>`;
  }).join('');

  view.innerHTML = `
    ${cabecera('Patrimonio', false)}
    <div class="card">
      <div class="card-title"><span>Patrimonio total (todo junto)</span>
        <span class="${stats.roi >= 0 ? 'pct-good' : 'pct-bad'}" style="text-transform:none;font-size:1rem">${fmtPct(stats.roi)}</span></div>
      <div class="row-split">
        <span class="big-number">${eur(stats.total)}</span>
        ${serie.length > 1 ? sparkDatos(serie.map((s) => s.post), { w: 110 }) : ''}
      </div>
      <div class="sub-number">Aportado en total: ${eur(stats.aportado)}</div>
      ${stats.perfMes != null ? `<div class="sub-number">Última variación: <strong class="${stats.perfMes >= 0 ? 'pct-good' : 'pct-bad'}">${fmtPct(stats.perfMes)}</strong> (<span id="pat-ultimo-mes">${fmtMes(stats.ultimo.month)}</span>)</div>` : ''}
    </div>

    <div class="card">
      <div class="card-title"><span>Dónde está tu dinero</span>
        <button class="btn secondary small" id="btn-saldos" type="button" style="padding:5px 10px;font-size:0.75rem">Actualizar saldos</button></div>
      <div class="history-item" style="cursor:default">
        <span class="m" style="flex:1">Ibercaja<span class="c" style="display:block">Día a día</span></span>
        <span class="v">${eur(saldos.diaadia)}</span>
      </div>
      <div class="history-item" style="cursor:default">
        <span class="m" style="flex:1">Trade Republic · efectivo<span class="c" style="display:block">Colchón ${eur0(saldos.colchon)} · Ahorro ${eur0(saldos.ahorro)}${saldos.viajes > 0 ? ` (viajes ${eur0(saldos.viajes)})` : ''}</span></span>
        <span class="v">${eur(saldos.efectivoTR)}</span>
      </div>
      <div class="history-item" style="cursor:default">
        <span class="m" style="flex:1">Trade Republic · inversión<span class="c" style="display:block">ETF en cartera</span></span>
        <span class="v">${eur(saldos.inversion)}</span>
      </div>
      ${saldos.otros > 0.5 ? `<div class="history-item" style="cursor:default"><span class="m" style="flex:1">Otras posiciones</span><span class="v">${eur(saldos.otros)}</span></div>` : ''}
      <div class="history-item" style="cursor:default;border-top:1px solid var(--border);margin-top:4px">
        <span class="m" style="flex:1">Total</span>
        <span class="v">${eur(saldos.total)}</span>
      </div>
    </div>

    ${serie.length > 1 ? `<div class="card"><div class="card-title"><span>Evolución</span></div><div class="chart-wrap">${chart}</div></div>` : ''}

    <h2 style="margin:4px 4px 10px">Cómo está repartido</h2>
    <div class="card">${barrasCubos}</div>

    <h2 style="margin:18px 4px 10px">Este mes</h2>
    <div class="stat-grid">
      <div class="stat"><div class="label">Ingreso mensual</div><div class="value">${eur(ingresos)}</div></div>
      <div class="stat"><div class="label">Gasto del mes</div><div class="value">${eur(gastoMes)} <span class="pct ${gastoMes > ingresos ? 'pct-bad' : ''}" style="font-size:0.75rem">${ingresos > 0 ? fmtPct(gastoMes / ingresos, { conSigno: false, decimales: 0 }) : ''}</span></div></div>
      <div class="stat"><div class="label">Aportación este mes</div><div class="value">${aportesMes == null ? 'sin registrar' : eur0(aportesMes)}</div></div>
      <div class="stat"><div class="label">Sobra estimada</div><div class="value ${ingresos - gastoMes > 0 ? 'pct-good' : ingresos > 0 ? 'pct-bad' : ''}">${ingresos > 0 ? eur(ingresos - gastoMes) : '—'}</div></div>
    </div>

    <h2 style="margin:18px 4px 10px">Mes a mes</h2>
    <table class="card table"><thead><tr><th>Mes</th><th>Variación</th><th>Aporte</th><th>Total</th></tr></thead><tbody>${tablaMeses}</tbody></table>
  `;

  const btnSaldos = $('#btn-saldos');
  if (btnSaldos) btnSaldos.onclick = () => modalRegistrar(currentMonthKey());
}

/* === BEGIN-FUSIONAR === */
const COLECCIONES = ['gastos', 'snapshots', 'categorias', 'holdings', 'cubos'];

/* Misma regla que el servidor casero: registro a registro gana el 'mod' más
   reciente; los borrados viajan como lápidas. Se usa con la nube de GitHub
   (donde no hay servidor que fusione) y sirve como referencia del algoritmo. */
/* global TUMBA_MAXMS */
const TUMBA_MAXMS = 90 * 24 * 3600 * 1000;

function fusionarLocal(cliente, servidor) {
  const res = { ...servidor };
  const tumbas = {};
  for (const t of [...(servidor.eliminados || []), ...(cliente.eliminados || [])]) {
    if (!t || !t.id) continue;
    const clave = t.t + '|' + t.id;
    const prev = tumbas[clave];
    if (!prev || (t.mod || 0) > (prev.mod || 0)) tumbas[clave] = { t: t.t, id: t.id, mod: t.mod || 0 };
  }
  for (const col of COLECCIONES) {
    const listaS = servidor[col] || [];
    const mapa = new Map();
    const orden = [];
    for (const x of listaS) {
      if (!x || x.id == null) continue;
      if (!mapa.has(x.id)) orden.push(x.id);
      mapa.set(x.id, x);
    }
    for (const x of (cliente[col] || [])) {
      if (!x || x.id == null) continue;
      const viejo = mapa.get(x.id);
      if (viejo == null) { orden.push(x.id); mapa.set(x.id, x); }
      else if ((x.mod || 0) >= (viejo.mod || 0)) mapa.set(x.id, x);
    }
    for (const clave in tumbas) {
      const sep = clave.indexOf('|');
      const t = clave.slice(0, sep), idr = clave.slice(sep + 1);
      if (t === col) {
        const viejo = mapa.get(idr);
        if (viejo && (viejo.mod || 0) < (tumbas[clave].mod || 0)) mapa.delete(idr);
      }
    }
    res[col] = orden.filter((id) => mapa.has(id)).map((id) => mapa.get(id));
  }
  const ajS = servidor.ajustes || {}, ajC = cliente.ajustes || {};
  res.ajustes = ((ajC.mod || 0) > (ajS.mod || 0)) ? ajC : ajS;
  const ahora = Date.now();
  const vivas = Object.values(tumbas)
    .filter((t) => ahora - (t.mod || 0) < TUMBA_MAXMS)
    .sort((a, b) => (b.mod || 0) - (a.mod || 0))
    .slice(0, 200);
  res.eliminados = vivas;
  return res;
}

function desdeB64(b64) {
  const bin = atob(String(b64 || '').replace(/\n/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function haciaB64(texto) {
  const bytes = new TextEncoder().encode(texto);
  let bin = '';
  const trozo = 0x8000;
  for (let i = 0; i < bytes.length; i += trozo) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + trozo));
  return btoa(bin);
}
/* === END-FUSIONAR === */

/* ============ Sincronización local (móvil ↔ ordenador) ============ */
function syncUrl() {
  return (state.ajustes.syncUrl || '').trim().replace(/\/+$/, '');
}

function autoSyncActivo() {
  return syncUrl() && state.ajustes.syncAuto !== false;
}

function esBackupValido(o) {
  return o && typeof o === 'object' && Array.isArray(o.categorias) && Array.isArray(o.holdings ?? []);
}

/* Contenido sin datos propios del dispositivo (para no publicar en balde) */
function contenidoSync() {
  let copia;
  try { copia = JSON.parse(JSON.stringify(state)); } catch (e) { return ''; }
  if (copia.ajustes) { delete copia.ajustes.syncUrl; delete copia.ajustes.syncAuto; delete copia.ajustes.github; }
  return JSON.stringify(copia);
}

/* ---- Nube gratis: GitHub (JSON en un repo privado, la app en Pages) ---- */
const ghEstado = { etag: null, sha: null, remoto: null, existe: null };

function ghModoActivo() {
  const gh = state.ajustes.github;
  return !!(gh && gh.repo && gh.token);
}

function ghUrl(cfg) {
  return `https://api.github.com/repos/${cfg.repo}/contents/${encodeURIComponent(cfg.ruta || 'finanzas.json')}`;
}

function ghCabeceras(cfg, extra = {}) {
  return { Authorization: `Bearer ${cfg.token}`, Accept: 'application/vnd.github+json', ...extra };
}

async function ghLeer(cfg) {
  const cab = ghCabeceras(cfg);
  if (ghEstado.etag) cab['If-None-Match'] = ghEstado.etag;
  const res = await fetch(ghUrl(cfg), { headers: cab, cache: 'no-store' });
  if (res.status === 304) return ghEstado.remoto;
  if (res.ok) {
    ghEstado.etag = res.headers.get('etag');
    const j = await res.json();
    ghEstado.sha = j.sha;
    ghEstado.existe = true;
    try { ghEstado.remoto = JSON.parse(desdeB64(j.content)); } catch { ghEstado.remoto = null; }
    if (!esBackupValido(ghEstado.remoto)) ghEstado.remoto = null;
    return ghEstado.remoto;
  }
  if (res.status === 404) { ghEstado.etag = null; ghEstado.sha = null; ghEstado.remoto = null; ghEstado.existe = false; return null; }
  const err = new Error('get ' + res.status);
  err.status = res.status;
  throw err;
}

async function ghGuardar(cfg, obj, intento = 0) {
  const cuerpo = {
    message: 'finanzas: ' + new Date().toLocaleString('es-ES'),
    content: haciaB64(JSON.stringify(obj)),
    ...(ghEstado.sha ? { sha: ghEstado.sha } : {}),
  };
  const res = await fetch(ghUrl(cfg), {
    method: 'PUT',
    headers: ghCabeceras(cfg, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(cuerpo),
  });
  // conflicto: otro dispositivo subió al mismo tiempo → releer, refusionar y reintentar
  if ((res.status === 409 || res.status === 422) && intento < 3) {
    ghEstado.etag = null;
    const remoto = await ghLeer(cfg);
    return ghGuardar(cfg, fusionarLocal(state, remoto || { v: 2 }), intento + 1);
  }
  if (!res.ok) {
    const err = new Error('put ' + res.status);
    err.status = res.status;
    throw err;
  }
  const j = await res.json();
  ghEstado.sha = j.content && j.content.sha;
  ghEstado.etag = null;
  ghEstado.existe = true;
  return obj;
}

const GH_ERRORES = {
  401: 'Token inválido o caducado: genera otro y pégalo de nuevo',
  403: 'GitHub rechaza el token (permisos Contents: Read and write o límite temporal)',
  404: 'Repo no encontrado: revisa el nombre exacto (usuario/repo) o el acceso del token',
};

async function syncGitHub(forzar = false) {
  const cfg = state.ajustes.github;
  try {
    const remoto = await ghLeer(cfg);
    const fusionado = fusionarLocal(state, remoto || { v: 2 });
    const mismoRemoto = remoto && JSON.stringify(fusionado) === JSON.stringify(remoto);
    if (ghEstado.existe === false || !mismoRemoto) {
      await ghGuardar(cfg, fusionado);
      adoptarSync(fusionado);
      subidoPrevio = contenidoSync();
      if (forzar) toast('Sincronizado con GitHub');
    } else {
      subidoPrevio = contenidoSync();
      adoptarSync(fusionado);
    }
    ultimoSyncOK = Date.now();
    actualizarEstadoSync();
  } catch (e) {
    const msg = GH_ERRORES[e && e.status] || 'No se pudo conectar con GitHub (¿internet?)';
    actualizarEstadoSync('⚠️ ' + msg);
    if (forzar) toast(msg, 'error');
  }
}

function syncProgramar() {
  clearTimeout(syncProgramar._t);
  if (!autoSyncActivo()) return;
  syncProgramar._t = setTimeout(() => syncAhora(), 800);
}

let enSync = false;
let syncPendiente = false;
let subidoPrevio = null;
let ultimoSyncOK = 0;

function adoptarSync(rec) {
  const mia = { syncUrl: state.ajustes.syncUrl, syncAuto: state.ajustes.syncAuto, github: state.ajustes.github };
  const antes = contenidoSync();
  rec.ajustes = { ...(rec.ajustes || {}), ...mia };
  rec.eliminados = Array.isArray(rec.eliminados) ? rec.eliminados : [];
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rec)); } catch (e) { return; }
  state = rec;
  const cambio = contenidoSync() !== antes;
  if (cambio && !$('.modal-overlay')) render();
  actualizarEstadoSync();
}

async function syncAhora(forzar = false) {
  if (ghModoActivo()) {
    if (enSync) { syncPendiente = true; return; }
    if (forzar && Date.now() - ultimoSyncOK < 2500) {
      toast('Ya se sincronizó hace un momento; espera unos segundos');
      return;
    }
    enSync = true;
    try {
      await syncGitHub(forzar);
    } finally {
      enSync = false;
      if (syncPendiente) { syncPendiente = false; syncProgramar(); }
    }
    return;
  }
  const url = syncUrl();
  if (!url) {
    if (forzar) toast('Configura antes la URL del servidor', 'error');
    return;
  }
  if (enSync) { syncPendiente = true; return; }
  enSync = true;
  try {
    const sinCambiosLocales = contenidoSync() === subidoPrevio && !forzar;
    if (sinCambiosLocales) {
      // ya subí esto: solo compruebo si el servidor tiene algo nuevo de otros dispositivos
      const res = await fetch(url + '/api/state', { cache: 'no-store' });
      if (!res.ok) throw new Error('status ' + res.status);
      const rec = await res.json();
      if (esBackupValido(rec) && rec.syncT && rec.syncT !== state.syncT) {
        adoptarSync(rec);
        subidoPrevio = contenidoSync();
      }
    } else {
      const res = await fetch(url + '/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error('status ' + res.status);
      const fusionado = await res.json();
      if (!esBackupValido(fusionado)) throw new Error('formato');
      adoptarSync(fusionado);
      subidoPrevio = contenidoSync();
    }
  } catch {
    if (forzar) toast('No se pudo sincronizar (¿servidor activo?, ¿URL correcta?)', 'error');
  } finally {
    enSync = false;
    if (syncPendiente) { syncPendiente = false; syncProgramar(); }
  }
}

/* Recuperación: adoptar el último estado tal cual */
async function syncBajar() {
  if (ghModoActivo()) {
    try {
      ghEstado.etag = null; // fuerza la lectura completa
      const rec = await ghLeer(state.ajustes.github);
      if (!rec) return toast('El archivo de la nube todavía no existe');
      if (rec.syncT && state.syncT && rec.syncT < state.syncT) {
        if (!confirm('La nube tiene una versión más antigua que tu dispositivo. ¿Descargarla igual y sobrescribir lo local?')) return;
      }
      adoptarSync(rec);
      subidoPrevio = null;
      toast('Descargado y aplicado');
    } catch {
      toast('No se pudo descargar de GitHub (¿repo y token correctos?)', 'error');
    }
    return;
  }
  const url = syncUrl();
  if (!url) return toast('Configura antes la URL del servidor', 'error');
  try {
    const res = await fetch(url + '/api/state', { cache: 'no-store' });
    if (!res.ok) throw new Error('status ' + res.status);
    const texto = await res.text();
    if (!texto.trim() || texto.trim() === '{}') return toast('La nube está vacía', 'error');
    const rec = JSON.parse(texto);
    if (!esBackupValido(rec)) throw new Error('formato');
    if (rec.syncT && state.syncT && rec.syncT < state.syncT) {
      if (!confirm('El servidor tiene una versión más antigua que tu dispositivo. ¿Descargarla igual y sobrescribir lo local?')) return;
    }
    adoptarSync(rec);
    subidoPrevio = null;
    toast('Descargado y aplicado');
  } catch {
    toast('No se pudo descargar (¿servidor activo?, ¿URL correcta?)', 'error');
  }
}

function actualizarEstadoSync(extra = '') {
  const el = $('#sync-estado');
  if (!el) return;
  const ts = state.syncT ? new Date(state.syncT).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
  el.textContent = extra || (ts ? `Lo más reciente en la nube: ${ts}` : 'Sin sincronizar todavía');
}

/* ============ Vista: Análisis ============ */
function vistaAnalisis(view) {
  const n = ui.analisisMeses || 6;
  const filas = analisisPeriodo(n);
  const conDatos = filas.filter((f) => f.n > 0);
  const totalPeriodo = filas.reduce((a, f) => a + f.total, 0);
  const media = conDatos.length ? totalPeriodo / conDatos.length : 0;
  const presu = presupuestoTotal();
  const pctMedia = presu > 0 ? media / presu : null;
  const masCaro = conDatos.slice().sort((a, b) => b.total - a.total)[0];
  const mesesPasados = conDatos.filter((f) => presu > 0 && f.total > presu).length;

  // Categorías (incluye "sin etiqueta" si hay gastos sueltos)
  const cats = state.categorias.map((c) => {
    const serie = filas.map((f) => f.porCat[c.id] || 0);
    const total = serie.reduce((a, b) => a + b, 0);
    return { ...c, serie, total, media: conDatos.length ? total / conDatos.length : 0 };
  });
  const sinEtiqueta = filas.reduce((a, f) => a + (f.porCat.__none || 0), 0);
  if (sinEtiqueta > 0) {
    cats.push({ id: '__none', nombre: 'Sin etiqueta', color: '#64748b', presupuesto: 0, serie: filas.map((f) => f.porCat.__none || 0), total: sinEtiqueta, media: conDatos.length ? sinEtiqueta / conDatos.length : 0 });
  }
  cats.sort((a, b) => b.total - a.total);

  const filasCats = cats.map((c) => {
    if (c.total <= 0) return '';
    const pct = c.presupuesto > 0 ? c.media / c.presupuesto : null;
    const barra = c.presupuesto > 0
      ? `<div class="progress ${pct > 1 ? 'over' : pct > 0.7 ? 'warn' : ''}"><span style="width:${Math.min(pct * 100, 100)}%"></span></div>`
      : '';
    return `
      <div class="cat-row">
        <span class="cat-name"><span class="dot" style="background:${c.color}"></span>${escapeHtml(c.nombre)}</span>
        <span class="pct ${c.presupuesto > 0 ? pctClass(pct) : ''}">${c.presupuesto > 0 ? fmtPct(pct, { conSigno: false, decimales: 0 }) : ''}</span>
        <span class="cat-amounts">media <strong>${eur(c.media)}</strong>${c.presupuesto > 0 ? ` de ${eur0(c.presupuesto)}` : ' · sin límite'}</span>
        ${barra}
      </div>`;
  }).join('');

  // Desviaciones: dónde y cuánto te pasaste
  const desv = [];
  for (const f of conDatos) {
    for (const c of state.categorias) {
      if (!(c.presupuesto > 0)) continue;
      const g = f.porCat[c.id] || 0;
      if (g > c.presupuesto + 0.005) desv.push({ mk: f.mk, c, exceso: g - c.presupuesto, pct: g / c.presupuesto });
    }
  }
  desv.sort((a, b) => b.exceso - a.exceso);
  const desvHtml = desv.length
    ? desv.slice(0, 10).map((d) => `
        <div class="history-item" style="cursor:default">
          <span class="m" style="flex:1">${escapeHtml(d.c.nombre)} <span style="color:var(--muted-2);font-weight:400;font-size:.85rem">· ${etiquetaMes(d.mk)}</span></span>
          <span class="v pct-bad">+${eur(d.exceso)}</span>
          <span class="c" style="min-width:86px;text-align:right">${fmtPct(d.pct, { conSigno: false, decimales: 0 })} del límite</span>
        </div>`).join('')
    : `<div class="empty" style="padding:12px"><span class="big">✅</span>Ninguna etiqueta superó su límite en los meses con datos.</div>`;

  // Tabla mes a mes
  const tablaMeses = filas.slice().reverse().map((f) => {
    const idx = filas.indexOf(f);
    const prev = idx > 0 ? filas[idx - 1] : null;
    const delta = prev && prev.n > 0 && f.n > 0 ? f.total - prev.total : null;
    const pct = presu > 0 && f.n > 0 ? f.total / presu : null;
    const estado = f.n === 0 ? '<span style="color:var(--muted-2)">sin datos</span>'
      : pct == null ? '—'
      : `<span class="${pct > 1 ? 'pct-bad' : pct > 0.7 ? 'pct-warn' : 'pct-good'}">${fmtPct(pct, { conSigno: false, decimales: 0 })}</span>`;
    return `<tr>
      <td>${etiquetaMes(f.mk)}</td>
      <td>${f.n ? eur0(f.total) : '—'}</td>
      <td>${estado}</td>
      <td>${delta == null ? '—' : `<span class="${delta > 0 ? 'pct-bad' : 'pct-good'}">${delta > 0 ? '+' : '−'}${eur0(Math.abs(delta))}</span>`}</td>
    </tr>`;
  }).join('');

  // Patrones (rachas, estacionalidad, holgura)
  const patrones = [];
  const estacionales = new Set();
  if (conDatos.length >= 3) {
    for (const c of cats) {
      if (c.id === '__none') continue;
      let streak = 0, maxStreak = 0;
      for (const f of filas) {
        const g = f.porCat[c.id] || 0;
        if (c.presupuesto > 0 && g > c.presupuesto) { streak++; maxStreak = Math.max(maxStreak, streak); }
        else streak = 0;
      }
      if (maxStreak >= 2) {
        patrones.push(`<strong>${escapeHtml(c.nombre)}</strong>: ${maxStreak} meses seguidos por encima del límite.`);
      }
      const shares = conDatos.map((f) => (f.porCat[c.id] || 0) / (f.total || 1));
      const med = mediana(shares);
      if (c.total >= 40 && med < 0.6) {
        const picos = conDatos
          .map((f) => ({ f, g: f.porCat[c.id] || 0, share: (f.porCat[c.id] || 0) / (f.total || 1) }))
          .filter((x) => x.g >= 15 && x.share > Math.max(med * 1.75, med + 0.1));
        if (picos.length && picos.length <= 2) {
          const top = picos.sort((a, b) => b.share - a.share)[0];
          estacionales.add(c.id);
          patrones.push(`<strong>${escapeHtml(c.nombre)}</strong>: en ${fmtMes(top.f.mk).toLowerCase()} fue el <strong>${(top.share * 100).toFixed(0)} %</strong> de tu gasto (media del periodo: ${med < 0.005 ? '<1' : (med * 100).toFixed(0)} %).`);
        }
      }
      if (c.presupuesto > 0 && c.media > 0 && c.media < c.presupuesto * 0.55 && c.presupuesto - c.media >= 20) {
        patrones.push(`<strong>${escapeHtml(c.nombre)}</strong>: tu media (${eur0(c.media)}) está muy por debajo del límite (${eur0(c.presupuesto)}); podrías ajustarlo y liberar <strong>${eur0(c.presupuesto - c.media)}/mes</strong>.`);
      }
    }
  }
  const patronesHtml = patrones.length
    ? patrones.slice(0, 6).map((t) => `<div class="sub-number" style="margin:8px 0">• ${t}</div>`).join('')
    : `<div class="hint" style="margin-top:0">Necesitas al menos 3 meses con gastos para detectar patrones (rachas, estacionalidad, holguras).</div>`;

  // Plan sugerido (reglas a partir de tus datos)
  const plan = [];
  if (!conDatos.length) {
    plan.push('Añade gastos durante 2–3 meses y aquí aparecerá un plan personalizado: recortes concretos y a dónde mandar lo ahorrado.');
  } else {
    const excesos = state.categorias.map((c) => {
      if (!(c.presupuesto > 0) || estacionales.has(c.id)) return null;
      const avg = conDatos.reduce((a, f) => a + Math.max((f.porCat[c.id] || 0) - c.presupuesto, 0), 0) / conDatos.length;
      return { c, avg };
    }).filter((x) => x && x.avg >= 2).sort((a, b) => b.avg - a.avg);

    if (excesos.length) {
      const ahorroMes = excesos.reduce((a, x) => a + x.avg, 0);
      const lista = excesos.slice(0, 3).map((x) => `${escapeHtml(x.c.nombre)} (~${eur0(x.avg)}/mes)`).join(', ');
      plan.push(`Para cumplir tus límites, recorta de media <strong>${eur0(ahorroMes)}/mes</strong>: ${lista}.`);
      const v = datosVivienda();
      const mesesGanados = v.aporteMes > 0 && v.faltan > 0 ? v.faltan / v.aporteMes - v.faltan / (v.aporteMes + ahorroMes) : 0;
      if (mesesGanados >= 0.5) {
        const m = Math.round(mesesGanados);
        plan.push(`Si ese recorte (${eur0(ahorroMes * 12)}/año) va al fondo vivienda, adelantas la entrada unos <strong>${m} ${m === 1 ? 'mes' : 'meses'}</strong>.`);
      } else {
        plan.push(`Ese recorte supone <strong>${eur0(ahorroMes * 12)}/año</strong>: puedes destinarlo al fondo vivienda o a ahorro a largo plazo.`);
      }
    } else {
      plan.push('Vas dentro de todos tus límites en los meses con datos. Próximo paso: formaliza el ahorro que te sobra — el margen sin asignar puede ir al fondo vivienda cada mes.');
    }

    const holgura = state.categorias.map((c) => {
      if (!(c.presupuesto > 0)) return null;
      const total = conDatos.reduce((a, f) => a + (f.porCat[c.id] || 0), 0);
      const mesesConGasto = conDatos.filter((f) => (f.porCat[c.id] || 0) > 0).length;
      const m = total / conDatos.length;
      if (mesesConGasto < 2 || m >= c.presupuesto * 0.55) return null;
      return { c, m };
    }).filter((x) => x && x.c.presupuesto - x.m >= 25).sort((a, b) => (b.c.presupuesto - b.m) - (a.c.presupuesto - a.m))[0];
    if (holgura) {
      plan.push(`Tienes holgura en <strong>${escapeHtml(holgura.c.nombre)}</strong> (media ${eur0(holgura.m)} de ${eur0(holgura.c.presupuesto)}): si bajas su límite, los <strong>${eur0(holgura.c.presupuesto - holgura.m)}/mes</strong> liberados pueden ir directos a ahorro.`);
    }

    const viajes = cats.find((c) => c.id === 'c-viajes');
    if (viajes && viajes.total > 0) {
      const mesesSinVia = conDatos.filter((f) => (f.porCat['c-viajes'] || 0) === 0).length;
      const maxVia = Math.max(...conDatos.map((f) => f.porCat['c-viajes'] || 0), 0);
      if (mesesSinVia > 0 && maxVia >= Math.max(viajes.media, 1) * 1.5) {
        plan.push('Viajes es estacional: en los meses que viajas concentras el gasto. Usa la posición <strong>«Viajes y regalos»</strong> como bolsa (50 €/mes del plan) y tira de ella solo esos meses, sin tocar la vivienda.');
      }
    }
  }

  view.innerHTML = `
    ${cabecera('Análisis', false)}
    <div class="chips" style="margin:0 0 14px">
      ${[3, 6, 12].map((m) => `<button class="chip ${n === m ? 'selected' : ''}" data-periodo="${m}" type="button">${m} meses</button>`).join('')}
    </div>
    <div class="stat-grid" style="margin-bottom:12px">
      <div class="stat"><div class="label">Gastado en ${n} meses</div><div class="value">${eur0(totalPeriodo)}</div><div class="hint" style="margin-top:2px">${conDatos.length} de ${n} meses con datos</div></div>
      <div class="stat"><div class="label">Media mensual</div><div class="value">${eur0(media)}</div><div class="hint ${pctClass(pctMedia)}" style="margin-top:2px">${pctMedia != null ? fmtPct(pctMedia, { conSigno: false, decimales: 0 }) + ' del límite' : ''}</div></div>
      <div class="stat"><div class="label">Mes más caro</div><div class="value">${masCaro ? eur0(masCaro.total) : '—'}</div><div class="hint" style="margin-top:2px">${masCaro ? fmtMes(masCaro.mk) : 'sin datos'}</div></div>
      <div class="stat"><div class="label">Meses por encima</div><div class="value ${mesesPasados ? 'pct-bad' : 'pct-good'}">${mesesPasados}</div><div class="hint" style="margin-top:2px">de ${conDatos.length} con datos</div></div>
    </div>

    <h2 style="margin:4px 4px 10px">Dónde te pasaste</h2>
    <div class="card" style="padding-top:4px;padding-bottom:4px">${desvHtml}</div>

    <h2 style="margin:18px 4px 10px">Dónde se va (media mensual)</h2>
    <div class="cat-list">${filasCats || '<div class="empty">Sin gastos en el periodo.</div>'}</div>

    <h2 style="margin:18px 4px 10px">Comparativa mensual</h2>
    <table class="card table"><thead><tr><th>Mes</th><th>Gasto</th><th>% límite</th><th>vs. anterior</th></tr></thead><tbody>${tablaMeses}</tbody></table>

    <h2 style="margin:18px 4px 10px">Patrones que veo</h2>
    <div class="card">${patronesHtml}</div>

    <h2 style="margin:18px 4px 10px">Plan sugerido</h2>
    <div class="card" style="border-color:var(--accent)">
      ${plan.map((t) => `<div class="sub-number" style="margin:6px 0">• ${t}</div>`).join('')}
    </div>
    <p class="hint">Sugerencias calculadas con tus propios límites y gastos; no son asesoramiento financiero.</p>
  `;

  view.querySelectorAll('[data-periodo]').forEach((b) => {
    b.onclick = () => { ui.analisisMeses = +b.dataset.periodo; render(); };
  });
}

/* ============ Vista: Ajustes ============ */
function vistaAjustes(view) {
  const presupuesto = state.categorias.map((c, i) => `
    <div class="panel-item">
      <span class="dot" style="width:12px;height:12px;border-radius:50%;background:${c.color};flex:none"></span>
      <input type="text" data-cnombre="${c.id}" value="${escapeHtml(c.nombre)}" aria-label="Nombre de categoría" />
      <input type="text" class="w-budget" inputmode="decimal" data-cpres="${c.id}" value="${String(c.presupuesto || 0).replace('.', ',')}" aria-label="Presupuesto" />
      <button class="icon-btn danger" data-cdel="${c.id}" type="button" aria-label="Eliminar categoría">🗑</button>
    </div>`).join('');

  const portaleras = state.holdings.map((h) => `
    <div class="panel-item">
      <input type="text" data-hnombre="${h.id}" value="${escapeHtml(h.nombre)}" aria-label="Nombre de posición" />
      <select data-hcubo="${h.id}" aria-label="Espacio al que pertenece">
        ${state.cubos.map((cb) => `<option value="${cb.id}" ${cb.id === h.cubo ? 'selected' : ''}>${escapeHtml(cb.nombre)}</option>`).join('')}
      </select>
      <input type="text" class="w-budget" inputmode="decimal" data-hplan="${h.id}" value="${String(h.plan || 0).replace('.', ',')}" aria-label="Aportación plan" />
      <button class="icon-btn danger" data-hdel="${h.id}" type="button" aria-label="Eliminar posición">🗑</button>
    </div>`).join('');

  const objetivos = state.cubos.map((cb) => `
    <div class="panel-item">
      <span style="flex:1">${escapeHtml(cb.nombre)}</span>
      <input type="text" class="w-budget" inputmode="decimal" data-obj="${cb.id}" value="${String(cb.objetivo || 0).replace('.', ',')}" aria-label="Porcentaje objetivo" /> %
    </div>`).join('');

  const pg = state.ajustes.pagas || {};
  const pgRep = pg.reparto || {};
  const mesOpt = (sel) => MESES.map((m, i) => `<option value="${i + 1}" ${+sel === i + 1 ? 'selected' : ''}>${m.charAt(0).toUpperCase() + m.slice(1)}</option>`).join('');
  const sumaPct = (+pgRep.vivienda || 0) + (+pgRep.etf || 0) + (+pgRep.viajes || 0);

  view.innerHTML = `
    ${cabecera('Ajustes', false)}

    <div class="card">
      <div class="card-title"><span>Datos personales</span></div>
      <div class="field"><label for="aj-ingreso">Ingreso neto mensual (€)</label>
        <input id="aj-ingreso" type="text" inputmode="decimal" value="${String(state.ajustes.ingreso || 0).replace('.', ',')}" /></div>
      <p class="hint">Se usa para el indicador de ahorro del mes en «Patrimonio».</p>
    </div>

    <div class="card">
      <div class="card-title"><span>Pagas extra</span>
        <label style="display:flex;align-items:center;gap:6px;text-transform:none;letter-spacing:0;font-size:0.78rem;color:var(--muted);font-weight:600">
          <input type="checkbox" id="pg-activo" style="width:auto" ${pg.activo !== false ? 'checked' : ''} /> activas
        </label>
      </div>
      <div class="field-row">
        <div class="field"><label for="pg-importe">Importe neto por paga (€)</label>
          <input id="pg-importe" type="text" inputmode="decimal" value="${String(pg.importe ?? 1553.23).replace('.', ',')}" /></div>
        <div class="field"><label for="pg-numero">Pagas al año</label>
          <select id="pg-numero">
            <option value="2" ${(+pg.numero || 2) === 2 ? 'selected' : ''}>2 (doble paga)</option>
            <option value="1" ${+pg.numero === 1 ? 'selected' : ''}>1</option>
          </select></div>
        <div class="field"><label for="pg-mes1">Paga 1 (mes)</label>
          <select id="pg-mes1">${mesOpt(pg.mes1 ?? 6)}</select></div>
        <div class="field"><label for="pg-mes2">Paga 2 (mes)</label>
          <select id="pg-mes2" ${+pg.numero === 1 ? 'disabled' : ''}>${mesOpt(pg.mes2 ?? 12)}</select></div>
      </div>
      <div class="field-row" style="margin-top:12px">
        <div class="field"><label for="pg-viv">% al fondo vivienda</label>
          <input id="pg-viv" type="text" inputmode="decimal" value="${String(pgRep.vivienda ?? 80).replace('.', ',')}" /></div>
        <div class="field"><label for="pg-etf">% al ETF</label>
          <input id="pg-etf" type="text" inputmode="decimal" value="${String(pgRep.etf ?? 10).replace('.', ',')}" /></div>
        <div class="field"><label for="pg-via">% a viajes</label>
          <input id="pg-via" type="text" inputmode="decimal" value="${String(pgRep.viajes ?? 10).replace('.', ',')}" /></div>
        <div class="field"><label>Resto → día a día</label>
          <input id="pg-resto" type="text" disabled value="${Math.max(0, 100 - sumaPct)} %" /></div>
      </div>
      <p class="hint">Así se reparte cada paga. La app avisa en esos meses, la incluye al registrar las aportaciones y la suma a la previsión de la Casa. Ejemplo: 2 × 1.553,23 € en junio y diciembre → 80 % vivienda, 10 % ETF, 10 % viajes.</p>
    </div>

    <div class="card">
      <div class="card-title"><span>Presupuesto por etiqueta (€/mes)</span></div>
      ${presupuesto}
      <button class="btn secondary small" id="btn-add-cat" type="button" style="margin-top:10px">+ Nueva etiqueta</button>
    </div>

    <div class="card">
      <div class="card-title"><span>Posiciones de inversión</span></div>
      <p class="hint" style="margin-top:-4px;margin-bottom:8px">La app hace de «reparto anotado» del informe: emergencia y vivienda comparten la cuenta de efectivo de Trade Republic, y estas posiciones registran cuánto es de cada una. El último campo es la <strong>aportación planificada al mes</strong> (se sugiere al registrar).</p>
      ${portaleras}
      <button class="btn secondary small" id="btn-add-holding" type="button" style="margin-top:10px">+ Nueva posición</button>
    </div>

    <div class="card">
      <div class="card-title"><span>Reparto objetivo del patrimonio</span></div>
      ${objetivos}
    </div>

    <div class="card" style="border-color:var(--accent)">
      <div class="card-title"><span>☁️ Nube gratis (GitHub · recomendado)</span></div>
      <p class="hint" style="margin-top:-4px;margin-bottom:10px">Tus datos van a un <strong>repo privado</strong> de GitHub (JSON invisible a todos + historial de cambios como commits). Funciona desde cualquier lugar, sin PC encendido. Publica la app en Pages con <strong>publicar_github.sh</strong>.</p>
      <div class="field"><label for="gh-repo">Repo de DATOS (usuario/repo, privado)</label>
        <input id="gh-repo" type="text" placeholder="tucuenta/finanzas-datos" value="${escapeHtml((state.ajustes.github || {}).repo || '')}" /></div>
      <div class="field"><label for="gh-token">Token de acceso (fine-grained: solo ese repo, permiso «Contents: Read and write»)</label>
        <input id="gh-token" type="password" placeholder="github_pat_…" value="${escapeHtml((state.ajustes.github || {}).token || '')}" /></div>
      <div class="field"><label for="gh-ruta">Archivo de datos</label>
        <input id="gh-ruta" type="text" placeholder="finanzas.json" value="${escapeHtml((state.ajustes.github || {}).ruta || '')}" /></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
        <button class="btn small" id="btn-gh-probar" type="button">🔄 Sincronizar con GitHub</button>
      </div>
      <p class="hint">Si lo configuras, se usa NUBE GITHUB y el servidor casero queda como respaldo. El token se guarda <strong>solo en este dispositivo</strong> (no se sincroniza ni se exporta). Crea el token en github.com → Settings → Developer settings → Fine-grained tokens.</p>
    </div>

    <div class="card">
      <div class="card-title"><span>Sincronizar dispositivos en red local</span></div>
      <div class="field"><label for="aj-sync">Servidor de sincronización</label>
        <input id="aj-sync" type="url" placeholder="http://192.168.1.x:8750" value="${escapeHtml(state.ajustes.syncUrl || '')}" /></div>
      <label style="display:flex;align-items:center;gap:8px;margin:10px 0;font-size:0.9rem;color:var(--muted)">
        <input type="checkbox" id="aj-sync-auto" style="width:auto" ${state.ajustes.syncAuto !== false ? 'checked' : ''} />
        Al abrir la app, traer automáticamente lo más reciente de la nube
      </label>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
        <button class="btn small" id="btn-sync-up" type="button">🔄 Sincronizar ahora</button>
        <button class="btn secondary small" id="btn-sync-down" type="button">⬇️ Descargar de la nube (recuperación)</button>
      </div>
      <div class="hint" id="sync-estado">Sin sincronizar todavía</div>
      <p class="hint">Útil en tu propia red. Deja abierto el script <strong>iniciar.sh</strong> en el PC (o los servicios systemd). Los cambios se sincronizan solos; con la nube de GitHub no hace falta el PC para nada.</p>
    </div>

    <div class="card">
      <div class="card-title"><span>Copia de seguridad</span></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn secondary small" id="btn-export" type="button">⬇️ Exportar datos (JSON)</button>
        <button class="btn secondary small" id="btn-import" type="button">⬆️ Importar datos</button>
        <button class="btn danger small" id="btn-reset" type="button">Borrar todo</button>
      </div>
      <p class="hint">Los datos se guardan <strong>solo en este dispositivo</strong> (navegador). Exporta de vez en cuando para tener una copia o para pasarlos al móvil.</p>
      <input type="file" id="file-import" accept="application/json" style="display:none" />
    </div>

    <div class="card">
      <div class="card-title"><span>Instalar la app</span></div>
      <button class="btn full" id="btn-install" type="button" ${deferredInstall ? '' : 'disabled'}>📲 Instalar en este dispositivo</button>
      <p class="hint"><strong>Android:</strong> abre la web en Chrome → menú (⋮) → «Añadir a pantalla de inicio».<br>
      <strong>iPhone:</strong> abre la web en Safari → botón Compartir → «Añadir a pantalla de inicio».<br>
      <strong>Ordenador:</strong> en Chrome, icono de instalación en la barra de direcciones.</p>
    </div>

    <p class="hint" style="text-align:center;margin-top:20px">Finanzas Personal · los datos nunca salen de tu dispositivo</p>
  `;

  // Ingreso
  $('#aj-ingreso').addEventListener('change', (e) => {
    const v = parseAmount(e.target.value);
    state.ajustes.ingreso = v ?? 0;
    state.ajustes.mod = Date.now();
    guardarEstado(); toast('Ingreso actualizado');
  });

  // Pagas extra
  const pgActual = () => {
    if (!state.ajustes.pagas) state.ajustes.pagas = seedState().ajustes.pagas;
    return state.ajustes.pagas;
  };
  const pgRefrescar = () => {
    const p = pgActual();
    const r = p.reparto || {};
    const suma = (+r.vivienda || 0) + (+r.etf || 0) + (+r.viajes || 0);
    const resto = $('#pg-resto');
    if (resto) resto.value = `${Math.max(0, 100 - suma)} %`;
    const m2 = $('#pg-mes2');
    if (m2) m2.disabled = +p.numero === 1;
  };
  $('#pg-activo').addEventListener('change', (e) => {
    pgActual().activo = e.target.checked;
    guardarEstado(); toast(e.target.checked ? 'Pagas extra activadas' : 'Pagas extra desactivadas'); render();
  });
  $('#pg-importe').addEventListener('change', (e) => {
    pgActual().importe = parseAmount(e.target.value) ?? 0;
    guardarEstado(); toast('Importe de paga guardado');
  });
  $('#pg-numero').addEventListener('change', (e) => {
    pgActual().numero = +e.target.value === 1 ? 1 : 2;
    guardarEstado(); pgRefrescar();
  });
  $('#pg-mes1').addEventListener('change', (e) => {
    pgActual().mes1 = +e.target.value || 6;
    guardarEstado();
  });
  $('#pg-mes2').addEventListener('change', (e) => {
    pgActual().mes2 = +e.target.value || 12;
    guardarEstado();
  });
  [['#pg-viv', 'vivienda'], ['#pg-etf', 'etf'], ['#pg-via', 'viajes']].forEach(([sel, clave]) => {
    $(sel).addEventListener('change', (e) => {
      const p = pgActual();
      p.reparto = p.reparto || {};
      p.reparto[clave] = Math.min(Math.max(parseAmount(e.target.value) ?? 0, 0), 100);
      guardarEstado(); pgRefrescar();
    });
  });

  // Categorías
  view.querySelectorAll('[data-cnombre]').forEach((el) => el.addEventListener('change', () => {
    const c = catPorId(el.dataset.cnombre); c.nombre = el.value.trim() || c.nombre; stamp(c); guardarEstado();
  }));
  view.querySelectorAll('[data-cpres]').forEach((el) => el.addEventListener('change', () => {
    const c = catPorId(el.dataset.cpres); c.presupuesto = parseAmount(el.value) ?? 0; stamp(c); guardarEstado();
  }));
  view.querySelectorAll('[data-cdel]').forEach((el) => el.onclick = () => {
    const id = el.dataset.cdel;
    const c = catPorId(id);
    const usada = state.gastos.some((g) => g.catId === id);
    if (!confirm(usada ? 'Esta etiqueta tiene gastos guardados. Al borrarla seguirán como «Sin categoría». ¿Borrar?' : '¿Borrar esta etiqueta?')) return;
    if (c) tumba('categorias', id);
    state.categorias = state.categorias.filter((x) => x.id !== id);
    guardarEstado(); render();
  });
  $('#btn-add-cat').onclick = () => {
    state.categorias.push(stamp({ id: uid(), nombre: 'Nueva etiqueta', presupuesto: 0, color: PALETA[state.categorias.length % PALETA.length] }));
    guardarEstado(); render();
  };

  // Holdings
  view.querySelectorAll('[data-hnombre]').forEach((el) => el.addEventListener('change', () => {
    const h = holdingPorId(el.dataset.hnombre); h.nombre = el.value.trim() || h.nombre; stamp(h); guardarEstado();
  }));
  view.querySelectorAll('[data-hcubo]').forEach((el) => el.addEventListener('change', () => {
    const h = holdingPorId(el.dataset.hcubo); h.cubo = el.value; stamp(h); guardarEstado(); toast('Actualizado');
  }));
  view.querySelectorAll('[data-hplan]').forEach((el) => el.addEventListener('change', () => {
    const h = holdingPorId(el.dataset.hplan); h.plan = parseAmount(el.value) ?? 0; stamp(h); guardarEstado();
  }));
  view.querySelectorAll('[data-hdel]').forEach((el) => el.onclick = () => {
    const id = el.dataset.hdel;
    if (!confirm('¿Borrar esta posición? Su historial de valores también se borrará.')) return;
    if (holdingPorId(id)) tumba('holdings', id);
    state.holdings = state.holdings.filter((h) => h.id !== id);
    for (const s of state.snapshots) {
      if (s.valores[id] != null || s.aportes[id] != null) {
        delete s.valores[id]; delete s.aportes[id];
        stamp(s);
      }
    }
    guardarEstado(); render();
  });
  $('#btn-add-holding').onclick = () => {
    state.holdings.push(stamp({ id: uid(), nombre: 'Nueva posición', cubo: state.cubos[0]?.id || 'liquidez', plan: 0 }));
    guardarEstado(); render();
  };

  // Objetivos
  view.querySelectorAll('[data-obj]').forEach((el) => el.addEventListener('change', () => {
    const cb = cuboPorId(el.dataset.obj);
    const n = parseAmount(el.value);
    cb.objetivo = Math.min(Math.max(n ?? 0, 0), 100);
    stamp(cb);
    guardarEstado();
  }));

  // Datos
  $('#btn-export').onclick = () => {
    // El token y la config de sincronización son de cada dispositivo: no se exportan
    const copia = JSON.parse(JSON.stringify(state));
    if (copia.ajustes) { delete copia.ajustes.github; delete copia.ajustes.syncUrl; delete copia.ajustes.syncAuto; }
    const blob = new Blob([JSON.stringify(copia, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `finanzas-backup-${hoyISO()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  $('#btn-import').onclick = () => $('#file-import').click();
  $('#file-import').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const s = JSON.parse(reader.result);
        if (!s || typeof s !== 'object' || !Array.isArray(s.categorias)) throw new Error('formato');
        // conservar la config de nube propia de este dispositivo
        s.ajustes = {
          ...(s.ajustes || {}),
          github: state.ajustes.github,
          syncUrl: state.ajustes.syncUrl,
          syncAuto: state.ajustes.syncAuto,
        };
        guardarEstado(s);
        toast('Datos importados'); render();
      } catch {
        toast('El archivo no es un backup válido', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };
  $('#btn-reset').onclick = () => {
    if (!confirm('Se borrarán TODOS los datos en este dispositivo Y en los otros conectados (gastos, inversiones y ajustes). ¿Continuar?')) return;
    if (!confirm('¿Seguro? Se recomienda exportar antes. La acción no se puede deshacer.')) return;
    const ahora = Date.now();
    const tombas = [
      ...state.gastos.map((g) => ({ t: 'gastos', id: g.id, mod: ahora })),
      ...state.snapshots.map((s) => ({ t: 'snapshots', id: s.id || s.month, mod: ahora })),
      ...state.categorias.map((c) => ({ t: 'categorias', id: c.id, mod: ahora })),
      ...state.holdings.map((h) => ({ t: 'holdings', id: h.id, mod: ahora })),
      ...state.cubos.map((c) => ({ t: 'cubos', id: c.id, mod: ahora })),
    ];
    const urlSync = state.ajustes.syncUrl, autoSync = state.ajustes.syncAuto, github = state.ajustes.github;
    state = seedState();
    state.eliminados = [...(state.eliminados || []), ...tombas];
    state.ajustes.syncUrl = urlSync;
    state.ajustes.syncAuto = autoSync;
    state.ajustes.github = github;
    guardarEstado(); // se sincroniza el borrado a los demás dispositivos
    ui.month = currentMonthKey();
    toast('Todo borrado');
    render();
  };

  // Sincronización (config: datos propios de cada dispositivo, no se publican)
  $('#aj-sync').addEventListener('change', (e) => {
    state.ajustes.syncUrl = e.target.value.trim();
    guardarEstado(state, true);
    toast('URL de sincronización guardada');
  });
  $('#aj-sync-auto').addEventListener('change', (e) => {
    state.ajustes.syncAuto = e.target.checked;
    guardarEstado(state, true);
    if (e.target.checked && syncUrl()) syncAhora();
  });
  $('#btn-sync-up').onclick = () => syncAhora(true);
  $('#btn-sync-down').onclick = () => syncBajar();
  $('#btn-gh-probar').onclick = () => syncAhora(true);

  // Config GitHub (por dispositivo, no se sincroniza)
  const ghCampo = (id, clave, esUltimo = false) => {
    const guardar = () => {
      const g = { ...(state.ajustes.github || {}) };
      g[clave] = $(id).value.trim();
      state.ajustes.github = (g.repo || g.token || g.ruta) ? g : null;
      state.ajustes.mod = Date.now();
      guardarEstado(state, true);
    };
    // guarda también mientras se escribe (por si cierras la app sin salir del campo)
    $(id).addEventListener('input', () => {
      clearTimeout(ghCampo._t);
      ghCampo._t = setTimeout(guardar, 400);
    });
    $(id).addEventListener('change', () => {
      clearTimeout(ghCampo._t);
      guardar();
      if (ghModoActivo() && esUltimo) syncAhora();
      toast(esUltimo ? 'Nube GitHub configurada' : 'Guardado');
    });
  };
  ghCampo('#gh-repo', 'repo');
  ghCampo('#gh-token', 'token');
  ghCampo('#gh-ruta', 'ruta', true);
  actualizarEstadoSync();

  // Instalación PWA
  const bi = $('#btn-install');
  if (deferredInstall) {
    bi.disabled = false;
    bi.onclick = async () => {
      deferredInstall.prompt();
      const r = await deferredInstall.userChoice;
      if (r && r.outcome === 'accepted') toast('¡App instalada!');
      deferredInstall = null;
      render();
    };
  } else {
    bi.disabled = true;
  }
}

/* ============ Arranque ============ */
document.querySelectorAll('#tabs .tab').forEach((b) => b.addEventListener('click', () => irTab(b.dataset.tab)));

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstall = e;
  if (ui.tab === 'ajustes') render();
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

(() => {
  const h = location.hash.replace('#', '');
  if (['gastos', 'objetivo', 'inversion', 'patrimonio', 'analisis', 'ajustes'].includes(h)) {
    ui.tab = h;
    document.querySelectorAll('#tabs .tab').forEach((b) => { b.classList.toggle('active', b.dataset.tab === h); });
  }
  render();
  if (autoSyncActivo()) syncAhora();
})();

// Sincronización continua: cada 15 s y al volver a ver la app
setInterval(() => { if (autoSyncActivo()) syncAhora(); }, 15000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && autoSyncActivo()) syncAhora(); });
window.addEventListener('online', () => { if (autoSyncActivo()) syncAhora(); });
