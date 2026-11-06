/* Finanzas Personal — app de gastos, inversión y patrimonio (PWA, datos en localStorage) */
'use strict';

/* ============ Utilidades ============ */
const $ = (sel, root = document) => root.querySelector(sel);
const APP_VERSION = 'versión 25 · 6 nov 2026 · auditoría total';
const uid = () =>
  (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2));

const PALETA = ['#8b5cf6', '#38bdf8', '#f59e0b', '#10b981', '#f43f5e', '#22d3ee', '#a78bfa', '#fb923c', '#4ade80', '#e879f9'];

/* Iconos de línea (estilo Lucide) para la interfaz */
const ICONOS = {
  inicio: '<path d="M3 10.7 12 3l9 7.7"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/>',
  gastos: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-3-2-2 2-2-2-2 2-2-2-3 2V4a1 1 0 0 1 1-1Z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  patrimonio: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/>',
  analisis: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="m7 15 4-5 3.5 2.5L20 6"/>',
  objetivos: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v2M22 12h-2M12 20v2M2 12h2"/>',
  ajustes: '<path d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h8M16 17h4"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="14" cy="17" r="2"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  flecha: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  casa: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/>',
  escudo: '<path d="M12 3 20 6v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6l8-3Z"/><path d="m9 12 2 2 4-4"/>',
  avion: '<path d="M21 3 3.6 10.3a.5.5 0 0 0 0 .94l6.7 2.2 2.2 6.7a.5.5 0 0 0 .94 0L21 3Z"/><path d="m10.3 13.4 4.1-4.1"/>',
  bolsa: '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',
  cartera: '<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M4 7V5a1 1 0 0 1 1-1h10l2 3"/><path d="M16 12h4v4h-4a2 2 0 0 1 0-4Z"/>',
  comida: '<path d="M4 2v7a3 3 0 0 0 6 0V2"/><path d="M7 2v20"/><path d="M17 2c-2 2-3 5-3 8 0 2 1 3 3 3h1v9"/>',
  coche: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 7c-.2-.6-.8-1-1.4-1H7c-.6 0-1.2.4-1.4 1L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/>',
  compras: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  banco: '<path d="m3 9 9-5 9 5"/><path d="M5 10v8M10 10v8M14 10v8M19 10v8"/><path d="M3 21h18"/>',
  tarjeta: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19"/><path d="M6 15h4"/>',
  calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/>',
  editar: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"/>',
  basura: '<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/><path d="M10 11v6M14 11v6"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  alerta: '<path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5M12 17.5v.5"/>',
  tendencia: '<path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/>',
  compartido: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 21c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"/><path d="M17 4.5a3.5 3.5 0 0 1 0 7M17.5 15c2.4.4 4 2.3 4 4.5"/>',
  descargar: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/>',
  instalar: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/>',
  cerrar: '<path d="M6 6l12 12M18 6 6 18"/>',
  objetivo: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  campana: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
};

function icono(nombre, size = 20) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[nombre] || ICONOS.objetivo}</svg>`;
}

const CUBO_ICONO = { diaadia: 'tarjeta', emergencia: 'escudo', vivienda: 'casa', viajes: 'avion', jubilacion: 'bolsa' };
const CUBO_COLOR = { diaadia: '#94a3b8', emergencia: '#60a5fa', vivienda: '#f5c451', viajes: '#a78bfa', jubilacion: '#2eea8b' };

function iconoCubo(id) { return icono(CUBO_ICONO[id] || 'objetivo'); }
function colorCubo(id) { return CUBO_COLOR[id] || '#94a3b8'; }

/* Emoji estable por categoría para las filas de gasto */
function emojiCategoria(nombre) {
  const n = String(nombre || '').toLowerCase();
  if (/ocio|amigos|pareja|social/.test(n)) return '👥';
  if (/comida|café|cafe|diario|restaurante/.test(n)) return '🍽️';
  if (/transporte|móvil|movil|fijo|bus|tren|coche/.test(n)) return '🚗';
  if (/compra|capricho|ropa|personal/.test(n)) return '🛍️';
  if (/viaje|regalo|vacacion/.test(n)) return '✈️';
  if (/casa|hogar|vivienda/.test(n)) return '🏠';
  if (/salud|médic|medic/.test(n)) return '🩺';
  return '🏷️';
}

/* Icono de línea para las filas de categorías de Gastos */
function iconoCategoria(nombre, size = 18) {
  const n = String(nombre || '').toLowerCase();
  if (/ocio|amigos|pareja|social/.test(n)) return icono('compartido', size);
  if (/comida|café|cafe|diario|restaurante/.test(n)) return icono('comida', size);
  if (/transporte|móvil|movil|fijo|bus|tren|coche/.test(n)) return icono('coche', size);
  if (/compra|capricho|ropa|personal/.test(n)) return icono('compras', size);
  if (/viaje|regalo|vacacion/.test(n)) return icono('avion', size);
  if (/casa|hogar|vivienda/.test(n)) return icono('casa', size);
  return icono('gastos', size);
}

function emojiPorIcono(nombre) {
  const n = String(nombre || '').toLowerCase();
  if (/casa|vivienda|hogar/.test(n)) return '🏠';
  if (/emergencia|colchón|colchon|seguridad/.test(n)) return '🛡️';
  if (/viaje|vacacion/.test(n)) return '✈️';
  if (/jubila|inversión|inversion|etf|bolsa/.test(n)) return '📈';
  return '🎯';
}


function toast(msg, tipo = '') {
  const t = $('#toast');
  t.textContent = msg;
  t.className = `show ${tipo}`;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { t.className = ''; }, 2600);
}

/* Accesibilidad: prepara cualquier modal (rol, Escape y foco inicial) */
function activarModal(overlay) {
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.tabIndex = -1;
  overlay.addEventListener('keydown', (e) => { if (e.key === 'Escape') overlay.remove(); });
  setTimeout(() => {
    const el = overlay.querySelector('input:not([type="checkbox"]):not([type="radio"]), select, textarea, button');
    if (el) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }
  }, 60);
}

const ALIAS_TAB = { compartidos: 'gastos', objetivo: 'objetivos', inversion: 'patrimonio' };
const TAB_LEGACY = { objetivo: 'objetivos', inversion: 'patrimonio' };

function marcarTabActiva(tab) {
  const activo = ALIAS_TAB[tab] || tab;
  document.querySelectorAll('#tabs .tab').forEach((b) => {
    const on = b.dataset.tab === activo;
    b.classList.toggle('active', on);
    if (on) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
}

/* ============ Estado ============ */
const STORAGE_KEY = 'finanzas-personal-v2';
const STORAGE_KEY_VIEJA = 'finanzas-personal-v1';

function seedState() {
  const mk = currentMonthKey();
  const inicioMes = `${mk}-01`;
  return {
    v: 3,
    ajustes: {
      nombre: '',
      ingreso: 1553.23,
      diaCobro: 1,
      cuentaIbercaja: null,
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
        margen: 0,        // margen mensual que pasas al fondo
        extraAnual: 2485.17, // compatibilidad; ahora se calcula desde «pagas»
        fechaObjetivo: '2034-06',
      },
    },
    plan: {
      ingresoAnual: 21742,
      gastoMensual: 250,
      crecimientoSalarial: 2,
      inflacion: 2,
      rentabilidadCartera: 5,
      rentabilidadCuenta: 3.04,
      rentabilidadCuentaExceso: 2.53,
      tramoCuenta: 50000,
      comisionCartera: 0.2,
      impuestoAhorro: true,
      edadActual: 22,
      edadJubilacion: 67,
      tasaRetirada: 4,
      colchonMeses: 6,
      asignacionObjetivo: { efectivo: 30, rentaVariable: 60, rentaFija: 10, cripto: 0 },
      hipoteca: { tipo: 3.5, plazo: 30, gastos: 11, entrada: 20, ingresoPareja: 0, ahorroPareja: 0, colchon: 5000, precio: 300000, fecha: '2034-06', alquiler: 0 },
    },
    categorias: [
      { id: 'c-ocio', nombre: 'Ocio social: amigos y pareja', presupuesto: 250, color: PALETA[0], tipo: 'variable' },
      { id: 'c-comidas', nombre: 'Comidas, cafés y pequeños gastos diarios', presupuesto: 90, color: PALETA[3], tipo: 'variable' },
      { id: 'c-transporte', nombre: 'Transporte, móvil y fijos', presupuesto: 30, color: PALETA[2], tipo: 'fijo' },
      { id: 'c-compras', nombre: 'Compras personales y caprichos', presupuesto: 100, color: PALETA[1], tipo: 'variable' },
      { id: 'c-viajes', nombre: 'Viajes, regalos e irregulares', presupuesto: 50, color: PALETA[4], tipo: 'irregular' },
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
      { id: 'h-ibercaja', nombre: 'Día a día (Ibercaja)', cubo: 'diaadia', plan: 0, entidad: 'Ibercaja', tipo: 'efectivo', clase: 'efectivo', moneda: 'EUR', saldoBase: 1500, fechaBase: inicioMes, autoNomina: true, diaCobro: 1 },
      { id: 'h-emergencia', nombre: 'Emergencia (Trade Republic · efectivo)', cubo: 'emergencia', plan: 0, entidad: 'Trade Republic', tipo: 'efectivo', clase: 'efectivo', moneda: 'EUR', saldoBase: 4500, fechaBase: inicioMes },
      // Vivienda y emergencia comparten cuenta en Trade Republic: la app lleva el reparto anotado
      { id: 'h-vivienda', nombre: 'Vivienda (Trade Republic · efectivo)', cubo: 'vivienda', plan: 750, entidad: 'Trade Republic', tipo: 'efectivo', clase: 'efectivo', moneda: 'EUR', saldoBase: 3000, fechaBase: inicioMes },
      // La partida de viajes no se pasa a vivienda: se acumula «anotada como viajes»
      { id: 'h-viajes', nombre: 'Viajes y regalos (Trade Republic · efectivo)', cubo: 'viajes', plan: 50, entidad: 'Trade Republic', tipo: 'efectivo', clase: 'efectivo', moneda: 'EUR', saldoBase: 0, fechaBase: inicioMes },
      { id: 'h-etf', nombre: 'ETF FTSE All-World (jubilación)', cubo: 'jubilacion', plan: 50, entidad: 'Trade Republic', tipo: 'inversion', clase: 'rentaVariable', moneda: 'EUR', isin: 'IE00BK5BQT80', unidades: 0, precio: 0, comision: 0.2, saldoBase: 1000, fechaBase: inicioMes },
    ],
    // Primer registro: valores iniciales del plan (capital base). Editable desde la app.
    snapshots: [
      { id: mk, month: mk, inicial: true, valores: { 'h-ibercaja': 1500, 'h-emergencia': 4500, 'h-vivienda': 3000, 'h-viajes': 0, 'h-etf': 1000 }, aportes: { 'h-ibercaja': 0, 'h-emergencia': 0, 'h-vivienda': 0, 'h-viajes': 0, 'h-etf': 0 } },
    ],
    personas: [],
    compartidosEventos: [],
    bizums: [],
    objetivos: [],
    deudas: [],
    movimientos: [],
    recurrentes: [],
    presupuestosHistorial: [],
    seguros: [],
    analisisDescartados: [],
    eliminados: [],
  };
}

let state; // se inicializa tras la declaración de funciones
let ui = { tab: 'inicio', month: currentMonthKey() };
let deferredInstall = null;

state = cargarEstado();

/* Marcas para la fusión por registro en el servidor */
function stamp(x) { x.mod = Date.now(); return x; }

function tumba(tipo, id) {
  state.eliminados = state.eliminados || [];
  state.eliminados.push({ t: tipo, id, mod: Date.now() });
}

/* ============ Estado: normalización y migraciones ============ */
function inferirEntidad(h) {
  const n = String((h && h.nombre) || '').toLowerCase();
  if (/ibercaja/.test(n)) return 'Ibercaja';
  if (/trade republic|trade_republic/.test(n)) return 'Trade Republic';
  if (/myinvestor/.test(n)) return 'MyInvestor';
  if (/openbank/.test(n)) return 'OpenBank';
  if (/bankinter/.test(n)) return 'Bankinter';
  if (/revolut/.test(n)) return 'Revolut';
  if (/indexa/.test(n)) return 'Indexa Capital';
  return 'Otra';
}

function inferirTipoHolding(h) {
  if (h && h.tipo) return h.tipo;
  if (h && h.cubo === 'jubilacion') return 'inversion';
  if (h && /etf|fondo|bolsa|acción|accion|cripto|bitcoin/i.test(h.nombre || '')) return 'inversion';
  if (h && /inmueble|vivienda|piso|casa/i.test(h.nombre || '')) return 'inmueble';
  return 'efectivo';
}

function inferirClaseHolding(h) {
  if (h && h.clase) return h.clase;
  const n = String((h && h.nombre) || '').toLowerCase();
  if (/renta fija|bono|bonos|monetario|depósito|deposito/i.test(n)) return 'rentaFija';
  if (/cripto|bitcoin|ethereum/i.test(n)) return 'cripto';
  if (/inmueble|vivienda|piso|casa/i.test(n)) return 'inmueble';
  if (inferirTipoHolding(h) === 'inversion') return 'rentaVariable';
  return 'efectivo';
}

function normalizarEstado(entrada) {
  const def = seedState();
  const s = (entrada && typeof entrada === 'object') ? entrada : def;
  s.v = 3;

  s.ajustes = { ...def.ajustes, ...(s.ajustes || {}) };
  s.ajustes.pagas = { ...def.ajustes.pagas, ...(s.ajustes.pagas || {}) };
  s.ajustes.pagas.reparto = { ...def.ajustes.pagas.reparto, ...(s.ajustes.pagas.reparto || {}) };
  s.ajustes.objetivoCasa = { ...def.ajustes.objetivoCasa, ...(s.ajustes.objetivoCasa || {}) };
  s.ajustes.nombre = typeof s.ajustes.nombre === 'string' ? s.ajustes.nombre : '';
  s.ajustes.diaCobro = Math.min(31, Math.max(1, +s.ajustes.diaCobro || 1));
  s.ajustes.cuentaIbercaja = s.ajustes.cuentaIbercaja || null;

  s.plan = { ...def.plan, ...(s.plan || {}) };
  s.plan.asignacionObjetivo = { ...def.plan.asignacionObjetivo, ...(s.plan.asignacionObjetivo || {}) };
  s.plan.hipoteca = { ...def.plan.hipoteca, ...(s.plan.hipoteca || {}) };
  for (const k of ['ingresoAnual', 'gastoMensual', 'crecimientoSalarial', 'inflacion', 'rentabilidadCartera', 'rentabilidadCuenta', 'rentabilidadCuentaExceso', 'tramoCuenta', 'comisionCartera', 'edadActual', 'edadJubilacion', 'tasaRetirada', 'colchonMeses']) {
    if (!isFinite(+s.plan[k])) s.plan[k] = def.plan[k];
    else s.plan[k] = +s.plan[k];
  }
  for (const k of ['tipo', 'plazo', 'gastos', 'entrada', 'ingresoPareja', 'ahorroPareja', 'colchon', 'precio', 'alquiler']) {
    if (!isFinite(+s.plan.hipoteca[k])) s.plan.hipoteca[k] = def.plan.hipoteca[k];
    else s.plan.hipoteca[k] = +s.plan.hipoteca[k];
  }
  s.plan.impuestoAhorro = s.plan.impuestoAhorro !== false;

  s.categorias = (Array.isArray(s.categorias) && s.categorias.length ? s.categorias : def.categorias)
    .map((c, i) => ({
      ...c,
      presupuesto: Math.max(0, +c.presupuesto || 0),
      tipo: c.tipo || 'variable',
      color: c.color || PALETA[i % PALETA.length],
    }));

  s.cubos = Array.isArray(s.cubos) && s.cubos.length ? s.cubos : def.cubos;
  s.holdings = (Array.isArray(s.holdings) && s.holdings.length ? s.holdings : def.holdings)
    .map((h) => {
      const tipo = inferirTipoHolding(h);
      return {
        ...h,
        cubo: h.cubo || 'diaadia',
        plan: Math.max(0, +h.plan || 0),
        entidad: h.entidad || inferirEntidad(h),
        tipo,
        clase: inferirClaseHolding({ ...h, tipo }),
        moneda: h.moneda || 'EUR',
        comision: h.comision != null && isFinite(+h.comision) ? +h.comision : (tipo === 'inversion' ? 0.2 : 0),
        unidades: h.unidades != null && isFinite(+h.unidades) ? +h.unidades : 0,
        precio: h.precio != null && isFinite(+h.precio) ? +h.precio : 0,
        snapshotUnidades: (h.snapshotUnidades && typeof h.snapshotUnidades === 'object') ? h.snapshotUnidades : {},
      };
    });

  s.snapshots = (Array.isArray(s.snapshots) ? s.snapshots : []).map((sn) => ({
    ...sn,
    id: sn.id || sn.month,
    month: sn.month,
    valores: sn.valores || {},
    aportes: sn.aportes || {},
  }));

  const ultimoSnap = s.snapshots.slice().sort((a, b) => String(a.month).localeCompare(String(b.month))).pop();
  for (const h of s.holdings) {
    if (h.id === 'h-ibercaja' && h.autoNomina == null) h.autoNomina = true;
    if (h.id === 'h-ibercaja' && h.diaCobro == null) h.diaCobro = Math.min(31, Math.max(1, +s.ajustes.diaCobro || 1));
    if (!isFinite(+h.saldoBase)) {
      const v = ultimoSnap && ultimoSnap.valores ? ultimoSnap.valores[h.id] : null;
      h.saldoBase = v != null && isFinite(+v) ? +v : 0;
    }
    if (!h.fechaBase || !/^\d{4}-\d{2}-\d{2}$/.test(String(h.fechaBase))) {
      h.fechaBase = `${(ultimoSnap && ultimoSnap.month) || currentMonthKey()}-01`;
    }
    if (!isFinite(+h.fechaBaseTs)) h.fechaBaseTs = new Date(`${h.fechaBase}T00:00:00`).getTime();
  }

  s.gastos = (Array.isArray(s.gastos) ? s.gastos : []).map((g) => ({
    ...g,
    monto: Math.abs(+g.monto || 0),
    catId: g.catId || '__none',
    fecha: /^\d{4}-\d{2}-\d{2}$/.test(String(g.fecha || '')) ? g.fecha : hoyISO(),
    cuentaId: g.cuentaId || 'h-ibercaja',
    creado: +g.creado || Date.now(),
  }));

  s.personas = (Array.isArray(s.personas) ? s.personas : []).map((p) => ({ ...p, nombre: String(p.nombre || '').trim() || 'Sin nombre' }));
  s.compartidosEventos = (Array.isArray(s.compartidosEventos) ? s.compartidosEventos : []).map((ev) => ({
    ...ev,
    importe: Math.abs(+ev.importe || 0),
    fecha: /^\d{4}-\d{2}-\d{2}$/.test(String(ev.fecha || '')) ? ev.fecha : hoyISO(),
    cuentaId: ev.cuentaId || 'h-ibercaja',
    participantes: Array.isArray(ev.participantes) ? ev.participantes : [],
    creado: +ev.creado || Date.now(),
  }));
  s.bizums = (Array.isArray(s.bizums) ? s.bizums : []).map((b) => ({
    ...b,
    importe: +b.importe || 0,
    fecha: /^\d{4}-\d{2}-\d{2}$/.test(String(b.fecha || '')) ? b.fecha : hoyISO(),
    cuentaId: b.cuentaId || 'h-ibercaja',
    creado: +b.creado || Date.now(),
  }));
  s.objetivos = (Array.isArray(s.objetivos) ? s.objetivos : []).map((g) => ({ ...g, monto: Math.max(0, +g.monto || 0) }));

  s.deudas = (Array.isArray(s.deudas) ? s.deudas : []).map((d) => ({
    ...d,
    saldo: Math.max(0, +d.saldo || 0),
    tipoInteres: Math.max(0, +d.tipoInteres || 0),
    cuota: Math.max(0, +d.cuota || 0),
    plazoMeses: Math.max(0, +d.plazoMeses || 0),
    creado: +d.creado || Date.now(),
  }));

  s.movimientos = (Array.isArray(s.movimientos) ? s.movimientos : []).map((m) => ({
    ...m,
    importe: Math.abs(+m.importe || 0),
    fecha: /^\d{4}-\d{2}-\d{2}$/.test(String(m.fecha || '')) ? m.fecha : hoyISO(),
    cuentaId: m.cuentaId || 'h-ibercaja',
    creado: +m.creado || Date.now(),
  }));

  s.recurrentes = (Array.isArray(s.recurrentes) ? s.recurrentes : []).map((r) => ({
    ...r,
    importe: Math.abs(+r.importe || 0),
    frecuencia: r.frecuencia === 'anual' ? 'anual' : 'mensual',
    dia: Math.min(31, Math.max(1, +r.dia || 1)),
    mes: Math.min(12, Math.max(1, +r.mes || 1)),
    activo: r.activo !== false,
    creado: +r.creado || Date.now(),
  }));

  s.presupuestosHistorial = (Array.isArray(s.presupuestosHistorial) ? s.presupuestosHistorial : []).map((p) => ({
    ...p,
    id: p.id || `${p.catId}-${p.mes}`,
    importe: Math.max(0, +p.importe || 0),
  }));
  if (!s.presupuestosHistorial.length) {
    const mk = currentMonthKey();
    for (const c of s.categorias) {
      s.presupuestosHistorial.push({ id: `${c.id}-${mk}`, catId: c.id, mes: mk, importe: +c.presupuesto || 0, mod: 0 });
    }
  }

  s.seguros = (Array.isArray(s.seguros) ? s.seguros : []).map((x) => ({
    ...x,
    primaAnual: Math.max(0, +x.primaAnual || 0),
    creado: +x.creado || Date.now(),
  }));

  s.analisisDescartados = Array.isArray(s.analisisDescartados) ? s.analisisDescartados.filter((x) => typeof x === 'string') : [];
  s.eliminados = Array.isArray(s.eliminados) ? s.eliminados : [];
  return s;
}

function cargarEstado() {
  try { localStorage.removeItem(STORAGE_KEY_VIEJA); } catch (e) {}
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && Array.isArray(s.categorias)) {
        const normalizado = normalizarEstado(s);
        if (normalizado.ajustes.github && normalizado.ajustes.github.repo) {
          normalizado.ajustes.github.repo = normalizarRepo(normalizado.ajustes.github.repo);
        }
        guardarEstado(normalizado, true);
        return normalizado;
      }
    }
  } catch (e) {
    try { if (raw) localStorage.setItem(STORAGE_KEY + '-error', raw); } catch (e2) {}
  }
  const s = normalizarEstado(seedState());
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

/* Presupuesto vigente de una categoría en un mes concreto (histórico). */
function presupuestoCategoria(catId, mk) {
  const hist = (state.presupuestosHistorial || [])
    .filter((p) => p.catId === catId && String(p.mes) <= String(mk))
    .sort((a, b) => String(b.mes).localeCompare(String(a.mes)));
  if (hist.length) return +hist[0].importe || 0;
  const c = catPorId(catId);
  return c ? +c.presupuesto || 0 : 0;
}

function presupuestoTotalMes(mk) {
  return state.categorias.reduce((a, c) => a + presupuestoCategoria(c.id, mk), 0);
}

function registrarPresupuesto(catId, importe, mk = currentMonthKey()) {
  state.presupuestosHistorial = state.presupuestosHistorial || [];
  const existente = state.presupuestosHistorial.find((p) => p.catId === catId && p.mes === mk);
  const valor = Math.max(0, +importe || 0);
  if (existente) {
    existente.importe = valor;
    stamp(existente);
  } else {
    state.presupuestosHistorial.push(stamp({ id: `${catId}-${mk}`, catId, mes: mk, importe: valor }));
  }
}

/* ============ Derivados: gastos compartidos / Bizum ============ */
function personasLista() { return state.personas || []; }

function nombreParticipante(id) {
  if (id === 'yo') return 'Yo';
  const p = personasLista().find((x) => x.id === id);
  return p ? p.nombre : '—';
}

function balancesCompartidos() {
  const saldo = {};
  for (const p of personasLista()) saldo[p.id] = 0;
  for (const ev of state.compartidosEventos || []) {
    const pagador = ev.pagador;
    const miParte = (ev.participantes || []).find((x) => x.id === 'yo');
    for (const part of ev.participantes || []) {
      if (part.id === 'yo') continue;
      if (!(part.id in saldo)) saldo[part.id] = 0;
      if (pagador === 'yo') saldo[part.id] += +part.importe || 0;
      else if (pagador === part.id && miParte) saldo[part.id] -= +miParte.importe || 0;
    }
  }
  for (const b of state.bizums || []) {
    if (!(b.personaId in saldo)) saldo[b.personaId] = 0;
    saldo[b.personaId] -= +b.importe || 0; // + = me paga (reduce deuda), − = le pago
  }
  let debido = 0, debo = 0;
  for (const k of Object.keys(saldo)) {
    saldo[k] = Math.round(saldo[k] * 100) / 100;
    if (saldo[k] > 0) debido += saldo[k];
    else debo += -saldo[k];
  }
  return {
    saldo,
    debido: Math.round(debido * 100) / 100,
    debo: Math.round(debo * 100) / 100,
    neto: Math.round((debido - debo) * 100) / 100,
  };
}

function repartirIgual(total, ids) {
  if (!ids.length) return {};
  const base = Math.floor((total / ids.length) * 100) / 100;
  const out = {};
  let acumulado = 0;
  ids.forEach((id, i) => {
    out[id] = i === ids.length - 1 ? Math.round((total - acumulado) * 100) / 100 : base;
    acumulado += out[id];
  });
  return out;
}

/* ============ Derivados: análisis multi-mes ============ */
function analisisPeriodo(n) {
  const meses = [];
  for (let i = n - 1; i >= 0; i--) meses.push(addMonths(currentMonthKey(), -i));
  return meses.map((mk) => {
    const gastos = gastosDelMes(mk);
    const porCat = { __none: 0 };
    const porCatPresu = {};
    for (const c of state.categorias) { porCat[c.id] = 0; porCatPresu[c.id] = presupuestoCategoria(c.id, mk); }
    let total = 0;
    for (const g of gastos) {
      const id = state.categorias.some((c) => c.id === g.catId) ? g.catId : '__none';
      porCat[id] = (porCat[id] || 0) + g.monto;
      total += g.monto;
    }
    return { mk, porCat, porCatPresu, presupuesto: presupuestoTotalMes(mk), total, n: gastos.length };
  });
}

function etiquetaMes(mk) {
  return `${MESES_CORTOS[+mk.split('-')[1] - 1]} ${mk.slice(2, 4)}`;
}

/* ============ Derivados: inversión y patrimonio ============ */
function snapPorMes(mk) { return state.snapshots.find((s) => s.month === mk); }

function mesesRegistrados() {
  return state.snapshots.map((s) => s.month).sort();
}

function holdingPorId(id) { return state.holdings.find((h) => h.id === id); }
function holdingsActivos() { return state.holdings.filter((h) => !h.archivada); }

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

function statsHoldingSnapshot(hid) {
  const serie = serieHolding(hid);
  if (!serie.length) return { valorActual: 0, aportado: 0, roi: null, serie };
  const primero = serie[0];
  const ultimo = serie[serie.length - 1];
  const aportado = primero.valor + serie.reduce((a, s) => a + s.aporte, 0);
  const valorActual = ultimo.post;
  const roi = aportado > 0 ? (valorActual - aportado) / aportado : null;
  return { valorActual, aportado, roi, serie, ultimo, primero };
}

function esCuentaEfectivo(h) {
  return !!h && (h.tipo === 'efectivo' || h.tipo === 'cuenta' || h.tipo === 'ahorro');
}

function esInversion(h) {
  return !!h && h.tipo === 'inversion';
}

function gastosVinculadosCompartidos() {
  const set = new Set();
  for (const ev of state.compartidosEventos || []) if (ev.gastoId) set.add(ev.gastoId);
  return set;
}

/* Nómina y pagas automáticas opcionales de una cuenta de efectivo.
   Solo se aplican desde su fechaBase; si cambias el salario, reconcilia la cuenta. */
function ingresosAutomaticosCuenta(h) {
  if (!h || !h.autoNomina) return { nominas: 0, pagas: 0 };
  const base = new Date(`${h.fechaBase || '1970-01-01'}T00:00:00`);
  if (!isFinite(base.getTime())) return { nominas: 0, pagas: 0 };
  const ingreso = +state.ajustes.ingreso || 0;
  const hoy = new Date();
  const dia = Math.min(31, Math.max(1, +h.diaCobro || +state.ajustes.diaCobro || 1));
  let y = base.getFullYear(), m = base.getMonth(), nominas = 0, pagas = 0;
  while (y < hoy.getFullYear() || (y === hoy.getFullYear() && m <= hoy.getMonth())) {
    const ultimoDia = new Date(y, m + 1, 0).getDate();
    const pago = new Date(y, m, Math.min(dia, ultimoDia));
    if (pago > base && pago <= hoy) {
      nominas += ingreso;
    }
    m += 1;
    if (m === 12) { m = 0; y += 1; }
  }
  return { nominas, pagas };
}

/* Un movimiento es posterior al saldo base si su fecha es mayor, o si es del mismo
   día pero se creó después de la reconciliación (fechaBaseTs). */
function posteriorA(fecha, creado, h) {
  const desde = String((h && h.fechaBase) || '1970-01-01');
  const f = String(fecha || '');
  if (f > desde) return true;
  if (f < desde) return false;
  const desdeTs = +((h && h.fechaBaseTs) || 0) || new Date(`${desde}T00:00:00`).getTime();
  return (+creado || 0) > desdeTs;
}

/* Saldo derivado de una cuenta de efectivo: base + nóminas/pagas + ingresos
   − gastos − compartidos pagados + bizums + traspasos/retiradas. */
function saldoCuenta(hid) {
  const h = holdingPorId(hid);
  if (!h || !esCuentaEfectivo(h)) return 0;
  const desde = String(h.fechaBase || '1970-01-01');
  let saldo = +h.saldoBase || 0;
  const auto = ingresosAutomaticosCuenta(h);
  saldo += auto.nominas + auto.pagas;
  const vinculados = gastosVinculadosCompartidos();

  for (const g of state.gastos || []) {
    if ((g.cuentaId || 'h-ibercaja') !== hid) continue;
    if (!posteriorA(g.fecha, g.creado, h)) continue;
    if (vinculados.has(g.id)) continue;
    saldo -= +g.monto || 0;
  }

  for (const ev of state.compartidosEventos || []) {
    if ((ev.cuentaId || 'h-ibercaja') !== hid) continue;
    if (!posteriorA(ev.fecha, ev.creado, h)) continue;
    // Si pagué yo, sale el importe completo; la parte ajena queda como derecho de cobro.
    if (ev.pagador === 'yo') saldo -= +ev.importe || 0;
  }

  for (const b of state.bizums || []) {
    if ((b.cuentaId || 'h-ibercaja') !== hid) continue;
    if (!posteriorA(b.fecha, b.creado, h)) continue;
    saldo += +b.importe || 0; // + me pagan, − pago
  }

  for (const m of state.movimientos || []) {
    const fecha = String(m.fecha || '');
    const tipo = m.tipo;
    const importe = +m.importe || 0;
    if (m.cuentaId === hid && posteriorA(fecha, m.creado, h)) {
      if (tipo === 'ingreso' || tipo === 'retirada' || tipo === 'devolucion' || tipo === 'dividendo') saldo += importe;
      else if (tipo === 'gasto' || tipo === 'inversion' || tipo === 'pagoDeuda' || tipo === 'traspaso') saldo -= importe;
    }
    if (m.cuentaDestinoId === hid && posteriorA(fecha, m.creado, h) && tipo === 'traspaso') saldo += importe;
  }

  return Math.round(saldo * 100) / 100;
}

function valorHolding(hid) {
  const h = holdingPorId(hid);
  if (!h) return 0;
  if (esInversion(h) && +h.unidades > 0 && +h.precio > 0) {
    return Math.round((+h.unidades * +h.precio) * 100) / 100;
  }
  if (esCuentaEfectivo(h)) return saldoCuenta(hid);
  return statsHoldingSnapshot(hid).valorActual;
}

function statsHolding(hid) {
  const st = statsHoldingSnapshot(hid);
  const h = holdingPorId(hid);
  if (esCuentaEfectivo(h)) return { ...st, valorActual: valorHolding(hid), roi: null, aportado: 0 };
  return { ...st, valorActual: valorHolding(hid) };
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

/* Serie agregada del patrimonio. Los meses históricos salen de snapshots;
   el último punto se ancla al patrimonio actual (incluye saldos derivados). */
function seriePatrimonio() {
  const meses = mesesRegistrados();
  const serie = meses.map((mk) => {
    const s = snapPorMes(mk);
    let post = 0, pre = 0;
    for (const h of state.holdings) {
      const v = s.valores[h.id];
      if (v != null) { pre += +v || 0; post += (+v || 0) + (+s.aportes[h.id] || 0); }
    }
    return { month: mk, valor: pre, post };
  });
  const totalActual = saldosActuales().total;
  const mkActual = currentMonthKey();
  if (!serie.length) return [{ month: mkActual, valor: totalActual, post: totalActual }];
  const ultimo = serie[serie.length - 1];
  if (ultimo.month === mkActual) ultimo.post = totalActual;
  else serie.push({ month: mkActual, valor: totalActual, post: totalActual });
  return serie;
}

function statsPatrimonio() {
  const serie = seriePatrimonio();
  const total = saldosActuales().total;
  if (!serie.length) return { total, aportado: 0, roi: null, perfMes: null, serie, ultimo: null, primero: null };
  const primero = serie[0];
  const ultimo = serie[serie.length - 1];
  let aportado = +primero.valor || 0;
  for (const mk of mesesRegistrados()) {
    const s = snapPorMes(mk);
    for (const h of state.holdings) if (s.valores[h.id] != null) aportado += +s.aportes[h.id] || 0;
  }
  const roi = aportado > 0 ? (total - aportado) / aportado : null;
  const prev = serie.length > 1 ? serie[serie.length - 2] : null;
  const perfMes = prev && prev.post > 0 ? (total - prev.post) / prev.post : null;
  return { total, aportado, roi, perfMes, serie, ultimo, primero };
}

function distribucionCubos() {
  const total = statsPatrimonio().total;
  return state.cubos.map((cubo) => {
    let suma = 0;
    for (const h of holdingsActivos()) {
      if (h.cubo !== cubo.id) continue;
      suma += valorHolding(h.id);
    }
    return { ...cubo, total: suma, pct: total > 0 ? suma / total : 0 };
  }).filter((b) => b.total > 0);
}

function distribucionEntidades() {
  const mapa = {};
  for (const h of holdingsActivos()) {
    const entidad = h.entidad || 'Otra';
    mapa[entidad] = (mapa[entidad] || 0) + valorHolding(h.id);
  }
  return Object.entries(mapa)
    .map(([entidad, total]) => ({ entidad, total }))
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total);
}

function distribucionClases() {
  const mapa = {};
  for (const h of holdingsActivos()) {
    const clase = h.clase || (esInversion(h) ? 'rentaVariable' : 'efectivo');
    mapa[clase] = (mapa[clase] || 0) + valorHolding(h.id);
  }
  const total = Object.values(mapa).reduce((a, b) => a + b, 0);
  return Object.entries(mapa)
    .map(([clase, valor]) => ({ clase, valor, pct: total > 0 ? valor / total : 0 }))
    .filter((x) => x.valor > 0)
    .sort((a, b) => b.valor - a.valor);
}

function holdingIbercaja() {
  return holdingsActivos().find((h) => h.id === 'h-ibercaja') || holdingsActivos().find((h) => h.cubo === 'diaadia') || null;
}

/* Compatibilidad con la versión anterior: el desglose de una cuenta concreta. */
function desgloseCuenta(hid) {
  const h = holdingPorId(hid);
  const desde = String((h && h.fechaBase) || '1970-01-01');
  const vinculados = gastosVinculadosCompartidos();
  let gastos = 0, bizums = 0, compartidos = 0, ingresos = 0, devoluciones = 0;
  let inversiones = 0, retiradas = 0, traspasosSalida = 0, traspasosEntrada = 0, pagosDeuda = 0;
  const auto = ingresosAutomaticosCuenta(h);

  for (const g of state.gastos || []) {
    if ((g.cuentaId || 'h-ibercaja') !== hid) continue;
    if (!posteriorA(g.fecha, g.creado, h) || vinculados.has(g.id)) continue;
    gastos += +g.monto || 0;
  }
  for (const ev of state.compartidosEventos || []) {
    if ((ev.cuentaId || 'h-ibercaja') !== hid) continue;
    if (!posteriorA(ev.fecha, ev.creado, h)) continue;
    if (ev.pagador === 'yo') compartidos += +ev.importe || 0;
  }
  for (const b of state.bizums || []) {
    if ((b.cuentaId || 'h-ibercaja') !== hid) continue;
    if (!posteriorA(b.fecha, b.creado, h)) continue;
    bizums += +b.importe || 0;
  }
  for (const m of state.movimientos || []) {
    const fecha = String(m.fecha || '');
    if (!posteriorA(fecha, m.creado, h)) continue;
    const importe = +m.importe || 0;
    if (m.cuentaId === hid) {
      if (m.tipo === 'ingreso' || m.tipo === 'dividendo') ingresos += importe;
      else if (m.tipo === 'devolucion') devoluciones += importe;
      else if (m.tipo === 'gasto') gastos += importe;
      else if (m.tipo === 'inversion') inversiones += importe;
      else if (m.tipo === 'retirada') retiradas += importe;
      else if (m.tipo === 'traspaso') traspasosSalida += importe;
      else if (m.tipo === 'pagoDeuda') pagosDeuda += importe;
    }
    if (m.cuentaDestinoId === hid && m.tipo === 'traspaso') traspasosEntrada += importe;
  }
  const r = (n) => Math.round(n * 100) / 100;
  return {
    h,
    base: +((h && h.saldoBase) || 0),
    gastos: r(gastos),
    bizums: r(bizums),
    compartidos: r(compartidos),
    nominas: r(auto.nominas),
    pagas: r(auto.pagas),
    ingresos: r(ingresos),
    devoluciones: r(devoluciones),
    inversiones: r(inversiones),
    retiradas: r(retiradas),
    traspasosSalida: r(traspasosSalida),
    traspasosEntrada: r(traspasosEntrada),
    traspasos: r(traspasosSalida - traspasosEntrada + inversiones - retiradas),
    pagosDeuda: r(pagosDeuda),
    actual: saldoCuenta(hid),
  };
}

function desgloseIbercaja() {
  const h = holdingIbercaja();
  return desgloseCuenta(h ? h.id : 'h-ibercaja');
}

function saldoIbercajaActual() {
  return desgloseIbercaja().actual;
}

function ajusteIbercaja() { return 0; }

/* Patrimonio neto = activos + derechos de cobro − deudas − obligaciones. */
function saldosActuales() {
  const sumCubos = (ids) => holdingsActivos().filter((h) => ids.includes(h.cubo) && esCuentaEfectivo(h)).reduce((a, h) => a + valorHolding(h.id), 0);
  const diaadia = Math.round(sumCubos(['diaadia']) * 100) / 100;
  const colchon = sumCubos(['emergencia']);
  const vivienda = sumCubos(['vivienda']);
  const viajes = sumCubos(['viajes']);
  const ahorro = vivienda + viajes;
  const inversion = holdingsActivos().filter(esInversion).reduce((a, h) => a + valorHolding(h.id), 0);
  const inmuebles = holdingsActivos().filter((h) => h.tipo === 'inmueble').reduce((a, h) => a + valorHolding(h.id), 0);
  const efectivo = holdingsActivos().filter((h) => esCuentaEfectivo(h) && h.cubo !== 'diaadia').reduce((a, h) => a + valorHolding(h.id), 0);
  const conocidos = ['diaadia', 'emergencia', 'vivienda', 'viajes', 'jubilacion'];
  const otros = holdingsActivos()
    .filter((h) => !conocidos.includes(h.cubo) && !esCuentaEfectivo(h) && !esInversion(h) && h.tipo !== 'inmueble')
    .reduce((a, h) => a + valorHolding(h.id), 0);
  const comp = balancesCompartidos();
  const deudas = (state.deudas || []).reduce((a, d) => a + (+d.saldo || 0), 0);
  const activos = diaadia + efectivo + inversion + inmuebles + otros;
  const total = activos + comp.debido - comp.debo - deudas;
  return {
    diaadia,
    colchon,
    vivienda,
    viajes,
    ahorro,
    inversion,
    inmuebles,
    efectivo,
    efectivoTR: efectivo,
    otros,
    porCobrar: comp.debido,
    porPagar: comp.debo,
    deudas: Math.round(deudas * 100) / 100,
    activos: Math.round(activos * 100) / 100,
    tr: efectivo + inversion + inmuebles + otros,
    total: Math.round(total * 100) / 100,
  };
}

function patrimonioNeto() { return saldosActuales().total; }

function totalDeudas() {
  return Math.round((state.deudas || []).reduce((a, d) => a + (+d.saldo || 0), 0) * 100) / 100;
}

function deudaPorId(id) { return (state.deudas || []).find((d) => d.id === id); }

function ingresosDelMes(mk) {
  const auto = holdingsActivos().some((h) => h.autoNomina);
  const nomina = auto ? (+state.ajustes.ingreso || 0) : 0;
  const paga = 0;
  const otros = (state.movimientos || [])
    .filter((m) => (m.tipo === 'ingreso' || m.tipo === 'dividendo') && String(m.fecha).startsWith(mk))
    .reduce((a, m) => a + (+m.importe || 0), 0);
  const devoluciones = (state.movimientos || [])
    .filter((m) => m.tipo === 'devolucion' && String(m.fecha).startsWith(mk))
    .reduce((a, m) => a + (+m.importe || 0), 0);
  return { nomina, paga, otros, devoluciones, total: nomina + paga + otros + devoluciones };
}

function flujoMes(mk) {
  const ingresos = ingresosDelMes(mk);
  const gastos = totalGastado(mk);
  const inversiones = (state.movimientos || [])
    .filter((m) => m.tipo === 'inversion' && String(m.fecha).startsWith(mk))
    .reduce((a, m) => a + (+m.importe || 0), 0);
  const retiradas = (state.movimientos || [])
    .filter((m) => m.tipo === 'retirada' && String(m.fecha).startsWith(mk))
    .reduce((a, m) => a + (+m.importe || 0), 0);
  const aportesSnapMes = aportesSnap(mk) || 0;
  const aportes = aportesSnapMes > 0 ? aportesSnapMes : (inversiones - retiradas);
  const pagosDeuda = (state.movimientos || [])
    .filter((m) => m.tipo === 'pagoDeuda' && String(m.fecha).startsWith(mk))
    .reduce((a, m) => a + (+m.importe || 0), 0);
  const ahorro = ingresos.total - gastos;
  return {
    ingresos,
    gastos,
    aportes,
    pagosDeuda,
    ahorro,
    tasaAhorro: ingresos.total > 0 ? ahorro / ingresos.total : null,
    flujo: ingresos.total - gastos - aportes - pagosDeuda,
  };
}

function xirrHolding(hid) {
  const h = holdingPorId(hid);
  if (!h || !esInversion(h)) return null;
  const flujos = [];
  for (const m of state.movimientos || []) {
    if (m.holdingId !== hid) continue;
    if (m.tipo === 'inversion') flujos.push({ fecha: m.fecha, importe: -(+m.importe || 0) });
    if (m.tipo === 'retirada') flujos.push({ fecha: m.fecha, importe: +m.importe || 0 });
    if (m.tipo === 'dividendo') flujos.push({ fecha: m.fecha, importe: +m.importe || 0 });
  }
  const st = statsHoldingSnapshot(hid);
  if (!flujos.length && st.serie.length) {
    flujos.push({ fecha: `${st.serie[0].month}-01`, importe: -(+st.serie[0].valor || 0) });
    for (const s of st.serie.slice(1)) {
      if (+s.aporte) flujos.push({ fecha: `${s.month}-01`, importe: -(+s.aporte || 0) });
    }
  }
  if (!flujos.length) return null;
  const actual = valorHolding(hid);
  flujos.push({ fecha: hoyISO(), importe: actual });
  return xirr(flujos);
}

function movimientosDelMes(mk) {
  const gastos = gastosDelMes(mk).map((g) => ({
    id: g.id, fecha: g.fecha, tipo: 'gasto', importe: g.monto, catId: g.catId,
    cuentaId: g.cuentaId, nota: g.nota, creado: g.creado, origen: 'gasto',
  }));
  const movs = (state.movimientos || [])
    .filter((m) => String(m.fecha).startsWith(mk))
    .map((m) => ({ ...m, origen: 'movimiento' }));
  return [...gastos, ...movs].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)) || (+b.creado || 0) - (+a.creado || 0));
}

function etiquetaTipoMovimiento(tipo) {
  return ({
    ingreso: 'Ingreso',
    gasto: 'Gasto',
    traspaso: 'Traspaso',
    inversion: 'Inversión',
    retirada: 'Retirada',
    pagoDeuda: 'Pago de deuda',
    devolucion: 'Devolución',
    dividendo: 'Dividendo / cupón',
  })[tipo] || tipo;
}

/* ============ Objetivo: casa ============ */
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

function pagasPendientes() {
  const p = pagasConfig();
  if (!p.activo) return [];
  const out = [];
  let mk = currentMonthKey();
  for (let i = 0; i < 12; i++) {
    if (esMesDePaga(mk)) {
      const sn = snapPorMes(mk);
      if (!sn || !sn.pagaAplicada) out.push(mk);
    }
    mk = prevMonthKey(mk);
  }
  return out;
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
    const hs = holdingsActivos().filter((h) => h.cubo === cubo);
    if (!hs.length) continue;
    const importeCubo = (monto * pctCubo) / 100;
    for (const h of hs) out.push({ hid: h.id, monto: Math.round((importeCubo / hs.length) * 100) / 100, cubo, pct: pctCubo });
  }
  return out;
}

/* Reconstruye los movimientos de caja/inversión de un snapshot a partir de sus aportes.
   Así el registro mensual y la paga extra mueven el dinero de verdad y no solo el gráfico. */
function sincronizarAportesSnapshot(mk) {
  const snap = snapPorMes(mk);
  if (!snap) return;
  const origen = holdingIbercaja() ? holdingIbercaja().id : (holdingsActivos().find(esCuentaEfectivo) || {}).id;
  if (!origen) return;
  state.movimientos = (state.movimientos || []).filter((m) => m.origenSnapshot !== mk);
  for (const h of state.holdings) {
    if (h.snapshotUnidades && h.snapshotUnidades[mk]) {
      h.unidades = Math.max(0, (+h.unidades || 0) - (+h.snapshotUnidades[mk] || 0));
      delete h.snapshotUnidades[mk];
    }
  }
  const fecha = mk === currentMonthKey() ? hoyISO() : `${mk}-02`;
  for (const h of holdingsActivos()) {
    const a = +((snap.aportes || {})[h.id]) || 0;
    if (a <= 0 || h.id === origen) continue;
    if (esCuentaEfectivo(h)) {
      state.movimientos.push(stamp({ id: uid(), tipo: 'traspaso', importe: a, fecha, cuentaId: origen, cuentaDestinoId: h.id, nota: `Aportación ${fmtMes(mk)}`, origenSnapshot: mk, creado: Date.now() }));
    } else {
      if (+h.precio > 0) {
        const um = a / +h.precio;
        h.unidades = Math.round(((+h.unidades || 0) + um) * 1000000) / 1000000;
        h.snapshotUnidades = h.snapshotUnidades || {};
        h.snapshotUnidades[mk] = um;
        stamp(h);
      }
      state.movimientos.push(stamp({ id: uid(), tipo: 'inversion', importe: a, fecha, cuentaId: origen, holdingId: h.id, nota: `Aportación ${fmtMes(mk)}`, origenSnapshot: mk, creado: Date.now() }));
    }
  }
  if (snap.pagaAplicada) {
    const importePaga = +snap.pagaImporte || +pagasConfig().importe || 0;
    if (importePaga > 0) {
      state.movimientos.push(stamp({ id: uid(), tipo: 'ingreso', importe: importePaga, fecha, cuentaId: origen, nota: `Paga extra ${fmtMes(mk)}`, origenSnapshot: mk, pagaIngreso: true, creado: Date.now() }));
    }
  }
}

function aplicarPaga(mk) {
  const p = pagasConfig();
  if (!p.activo) return toast('Las pagas extra están desactivadas', 'error');
  const importe = +p.importe || 0;
  if (importe <= 0) return toast('Configura el importe de la paga', 'error');
  const snap = snapPorMes(mk);
  if (!snap) return modalRegistrar(mk);
  if (snap.pagaAplicada) return toast('La paga ya está aplicada a ese mes');
  snap.pagaImporte = importe;
  for (const r of repartoPaga(importe)) {
    snap.aportes[r.hid] = Math.round(((+snap.aportes[r.hid] || 0) + r.monto) * 100) / 100;
  }
  snap.pagaAplicada = true;
  sincronizarAportesSnapshot(mk);
  stamp(snap);
  guardarEstado();
  toast(`Paga extra aplicada a ${fmtMes(mk)}`);
  render();
}

function extraAnualVivienda() {
  const p = pagasConfig();
  if (!p.activo) return 0;
  const numero = Math.min(Math.max(+p.numero || 2, 1), 2);
  const r = p.reparto || {};
  let vivienda = Math.max(0, +r.vivienda || 0);
  const suma = vivienda + Math.max(0, +r.etf || 0) + Math.max(0, +r.viajes || 0);
  if (suma > 100) vivienda = vivienda * 100 / suma;
  return numero * (+p.importe || 0) * (vivienda / 100);
}

function fondoViviendaActual() {
  return holdingsActivos()
    .filter((h) => h.cubo === 'vivienda' && esCuentaEfectivo(h))
    .reduce((a, h) => a + statsHolding(h.id).valorActual, 0);
}

function datosVivienda() {
  const o = state.ajustes.objetivoCasa || {};
  const precio = +o.precio || 0;
  const pctEntrada = +o.pctEntrada || 0;
  const pctGastos = +o.pctGastos || 0;
  const objetivo = precio * (pctEntrada + pctGastos) / 100;
  const fondo = fondoViviendaActual();
  const planMes = holdingsActivos().filter((h) => h.cubo === 'vivienda').reduce((a, h) => a + (+h.plan || 0), 0);
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
    return `<text x="${px(i)}" y="${alto - 6}" text-anchor="${anchor}" font-size="11" fill="#94a3b8">${escapeHtml(t)}</text>`;
  }).join('');
  const yLabels =
    `<text x="${padL}" y="12" font-size="11" fill="#94a3b8">${eur0(max).replace(/\u00a0/g, ' ')}</text>` +
    `<text x="${padL}" y="${alto - padB - 4}" font-size="11" fill="#94a3b8">${eur0(min).replace(/\u00a0/g, ' ')}</text>`;
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

function sparkDatos(valores, { w = 96, h = 30, suave = false, area = false } = {}) {
  valores = valores.map((v) => +v || 0);
  if (valores.length < 2) return '';
  const min = Math.min(...valores), max = Math.max(...valores);
  const px = (i) => (i * (w - 4)) / Math.max(valores.length - 1, 1) + 2;
  const py = (v) => min === max ? h / 2 : 2 + (1 - (v - min) / (max - min)) * (h - 4);
  const pts = valores.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const sube = valores[valores.length - 1] >= valores[0];
  const color = sube ? '#22c55e' : '#f43f5e';
  let d = '';
  if (suave && valores.length > 2) {
    d = `M${px(0).toFixed(1)} ${py(valores[0]).toFixed(1)}`;
    for (let i = 0; i < valores.length - 1; i++) {
      const i0 = Math.max(i - 1, 0), i3 = Math.min(i + 2, valores.length - 1);
      const c1x = px(i) + (px(i + 1) - px(i0)) / 6;
      const c1y = py(valores[i]) + (py(valores[i + 1]) - py(valores[i0])) / 6;
      const c2x = px(i + 1) - (px(i3) - px(i)) / 6;
      const c2y = py(valores[i + 1]) - (py(valores[i3]) - py(valores[i])) / 6;
      d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${px(i + 1).toFixed(1)} ${py(valores[i + 1]).toFixed(1)}`;
    }
  }
  const linea = d
    ? `<path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`
    : `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  const gid = `spark-${uid()}`;
  const relleno = area && d && min !== max
    ? `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".18"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
       <path d="${d} L${px(valores.length - 1).toFixed(1)} ${h} L${px(0).toFixed(1)} ${h} Z" fill="url(#${gid})"/>`
    : '';
  return `<svg class="spark" aria-hidden="true" focusable="false" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    ${relleno}
    ${linea}
    <circle cx="${px(valores.length - 1)}" cy="${py(valores[valores.length - 1])}" r="2.5" fill="${color}"/>
  </svg>`;
}

/* ============ App shell ============ */
function irTab(tab) {
  ui.tab = TAB_LEGACY[tab] || tab;
  try { history.replaceState(null, '', '#' + ui.tab); } catch (e) {}
  marcarTabActiva(ui.tab);
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
  const view = $('#view');
  view.className = '';
  if (ui.tab === 'inicio') return vistaInicio(view);
  if (ui.tab === 'gastos') return vistaGastos(view);
  if (ui.tab === 'patrimonio') return vistaPatrimonio(view);
  if (ui.tab === 'analisis') return vistaAnalisis(view);
  if (ui.tab === 'objetivos') return vistaObjetivos(view);
  if (ui.tab === 'plan') return vistaPlan(view);
  if (ui.tab === 'compartidos') return vistaCompartidos(view);
  if (ui.tab === 'ajustes') return vistaAjustes(view);
  return vistaInicio(view);
}

function monthNavHTML() {
  return `
    <div class="month-nav" aria-label="Cambiar de mes">
      <button id="mes-prev" type="button" aria-label="Mes anterior">‹</button>
      <span class="month-label">${fmtMes(ui.month)}</span>
      <button id="mes-next" type="button" aria-label="Mes siguiente">›</button>
    </div>`;
}

function cabecera(titulo, conMes = true) {
  return `
    <header class="page-head">
      <div>
        <span class="eyebrow">Finanzas personales</span>
        <h1>${titulo}</h1>
      </div>
      ${conMes ? monthNavHTML() : ''}
    </header>`;
}

function cablearMesNav() {
  const p = $('#mes-prev'), n = $('#mes-next');
  if (p) p.onclick = () => { ui.month = prevMonthKey(ui.month); render(); };
  if (n) n.onclick = () => { ui.month = nextMonthKey(ui.month); render(); };
}

/* ============ Helpers de presentación ============ */
function saludo() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

function fechaHoyLarga() {
  const s = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function aportePlanMensual() {
  return holdingsActivos().reduce((a, h) => a + (+h.plan || 0), 0);
}

function aportesSnap(mk) {
  const sn = snapPorMes(mk);
  if (!sn) return null;
  return Object.values(sn.aportes || {}).reduce((a, b) => a + (+b || 0), 0);
}

function donutSVG(segmentos, { size = 190, grosor = 18, total = null, valor = '', etiqueta = '' } = {}) {
  const validos = (segmentos || []).filter((s) => (+s.valor || 0) > 0);
  const suma = total != null ? total : validos.reduce((a, s) => a + (+s.valor || 0), 0);
  const radio = (size - grosor) / 2;
  const circ = 2 * Math.PI * radio;
  let offset = 0;
  const arcos = validos.map((s) => {
    const frac = suma > 0 ? (+s.valor || 0) / suma : 0;
    const len = Math.max(frac * circ - 2, 0);
    const el = `<circle cx="${size / 2}" cy="${size / 2}" r="${radio}" fill="none" stroke="${s.color || '#94a3b8'}" stroke-width="${grosor}" stroke-linecap="round" stroke-dasharray="${len.toFixed(2)} ${(circ - len).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>`;
    offset += frac * circ;
    return el;
  }).join('');
  return `<div class="donut" style="--donut-size:${size}px">
    <svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Distribución">
      <circle cx="${size / 2}" cy="${size / 2}" r="${radio}" fill="none" stroke="rgba(255,255,255,.055)" stroke-width="${grosor}"/>
      ${arcos}
    </svg>
    <div class="donut-center">${valor ? `<strong>${valor}</strong>` : ''}${etiqueta ? `<span>${etiqueta}</span>` : ''}</div>
  </div>`;
}

/* Anillo compacto de presupuesto para Gastos */
function anilloProgreso(pct, { size = 82, grosor = 8, label = '' } = {}) {
  const radio = (size - grosor) / 2;
  const circ = 2 * Math.PI * radio;
  const frac = pct == null ? 0 : Math.max(0, Math.min(pct, 1));
  const len = circ * frac;
  const color = pct == null ? 'rgba(255,255,255,.2)' : pct > 1 ? 'var(--rose)' : pct > 0.7 ? 'var(--gold)' : 'var(--accent)';
  const arco = frac > 0 ? `<circle cx="${size / 2}" cy="${size / 2}" r="${radio}" fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round" stroke-dasharray="${len.toFixed(2)} ${(circ - len).toFixed(2)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>` : '';
  return `<div class="progress-ring" style="--ring-size:${size}px">
    <svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Presupuesto consumido: ${escapeHtml(label)}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${radio}" fill="none" stroke="rgba(255,255,255,.075)" stroke-width="${grosor}"/>
      ${arco}
    </svg>
    <span class="progress-ring-label">${escapeHtml(label)}</span>
  </div>`;
}

/* Navegación interna de tarjetas */
function cablearNavegacion(view) {
  view.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      irTab(el.dataset.nav);
    });
  });
}

/* ============ Vista: Inicio ============ */
function vistaInicio(view) {
  view.classList.add('view-inicio');
  const mk = currentMonthKey();
  const stats = statsPatrimonio();
  const gastos = gastosDelMes(mk);
  const total = totalGastado(mk);
  const presupuesto = presupuestoTotal();
  const pctG = presupuesto > 0 ? total / presupuesto : 0;
  const saldos = saldosActuales();
  const v = datosVivienda();
  const pctCasa = v.objetivo > 0 ? Math.min(v.fondo / v.objetivo, 1) : 0;
  const nombre = (state.ajustes.nombre || '').trim();
  const aportesMes = aportesSnap(mk);
  const planMes = aportePlanMensual();
  const aportesRegistrados = aportesMes != null && aportesMes > 0;
  const ahorroMes = aportesRegistrados ? aportesMes : planMes;
  const flujo = flujoMes(mk);
  const planRes = resumenPlan();
  const recPend = recurrentesPendientes();
  const comp = balancesCompartidos();
  const resumenComp = (comp.debido > 0.004 || comp.debo > 0.004)
    ? `${comp.debido > 0.004 ? `Te deben ${eur(comp.debido)}` : ''}${comp.debido > 0.004 && comp.debo > 0.004 ? ' · ' : ''}${comp.debo > 0.004 ? `Debes ${eur(comp.debo)}` : ''}`
    : 'Controla cenas, regalos y bizums sin perder la cuenta.';
  const recientes = state.gastos
    .slice()
    .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)) || (b.creado || 0) - (a.creado || 0))
    .slice(0, 5);
  const serie = stats.serie;
  const variacion = stats.perfMes != null ? stats.perfMes : stats.roi;
  const variacionEsMes = stats.perfMes != null;
  const mesCorto = MESES[+mk.split('-')[1] - 1];
  const pctGastosTxt = presupuesto > 0 ? `${Math.round(pctG * 100)} %` : '—';
  const pctCasaTxt = (pctCasa * 100).toFixed(1).replace('.', ',');
  const snHoy = snapPorMes(mk);
  const pagasPend = pagasPendientes();
  const pagaPendienteMk = pagasPend[0] || null;
  const pagaPendiente = !!pagaPendienteMk;
  const excedidas = state.categorias.filter((c) => {
    const gastado = gastos.filter((g) => g.catId === c.id).reduce((a, g) => a + g.monto, 0);
    return c.presupuesto > 0 && gastado > c.presupuesto;
  });
  const avisos = [];
  if (!snHoy) avisos.push({ tipo: 'info', icono: icono('calendario', 15), html: `Aún no has registrado los valores de <strong>${fmtMes(mk)}</strong>.` });
  if (pagaPendiente) avisos.push({ tipo: 'info', icono: icono('calendario', 15), html: `Tienes <strong>${pagasPend.length}</strong> paga${pagasPend.length === 1 ? '' : 's'} extra pendiente${pagasPend.length === 1 ? '' : 's'} de aplicar (${fmtMes(pagaPendienteMk)}).` });
  if (excedidas.length) avisos.push({ tipo: 'alerta', icono: icono('alerta', 15), html: `Has superado el presupuesto en <strong>${excedidas.length} ${excedidas.length === 1 ? 'categoría' : 'categorías'}</strong> este mes.` });
  if (recPend > 0) avisos.push({ tipo: 'info', icono: icono('calendario', 15), html: `Tienes <strong>${recPend}</strong> movimientos recurrentes pendientes de aplicar.` });
  if (planRes.mesesColchon != null && planRes.mesesColchon < planRes.p.colchonMeses) avisos.push({ tipo: 'alerta', icono: icono('escudo', 15), html: `Tu colchón cubre <strong>${planRes.mesesColchon.toFixed(1).replace('.', ',')} meses</strong>; el objetivo es ${planRes.p.colchonMeses}.` });
  const hayAvisos = avisos.length > 0;

  const recientesHtml = recientes.length ? recientes.map((g) => {
    const cat = catPorId(g.catId);
    const color = cat ? cat.color : '#64748b';
    return `<div class="recent-row" data-edit="${g.id}" role="button" tabindex="0" aria-label="Editar gasto">
      <span class="recent-ico" style="background:${color}1f;border-color:${color}33">${cat ? emojiCategoria(cat.nombre) : '🏷️'}</span>
      <div class="recent-main"><strong>${escapeHtml(g.nota || 'Gasto')}</strong><span>${escapeHtml(cat ? cat.nombre : 'Sin categoría')} · ${fmtDia(g.fecha)}</span></div>
      <span class="recent-amount">${eur(g.monto)}</span>
    </div>`;
  }).join('') : '<div class="empty" style="padding:18px"><span class="big">🧾</span>Aún no hay movimientos este mes.</div>';

  view.innerHTML = `
    <header class="page-head inicio-head">
      <div class="inicio-head-copy">
        <h1>${saludo()}${nombre ? `, ${escapeHtml(nombre)}` : ''} 👋</h1>
        <p class="page-sub">Así va tu plan financiero</p>
      </div>
      <div class="page-head-actions">
        <button class="btn" id="inicio-add-top" type="button">${icono('mas', 16)} Añadir gasto</button>
        <button class="icon-btn inicio-bell" id="inicio-avisos" type="button" aria-label="Ver avisos">${icono('campana', 19)}${hayAvisos ? '<span class="bell-dot"></span>' : ''}</button>
      </div>
    </header>

    ${pagaPendiente ? `
    <div class="banner">
      <span class="banner-ico">${icono('calendario', 19)}</span>
      <div class="banner-text"><strong>Paga extra de ${fmtMes(pagaPendienteMk).toLowerCase()}</strong>${eur(+pagasConfig().importe || 0)} pendiente de aplicar a tus aportaciones.</div>
      <button class="btn small" id="inicio-paga" type="button">Aplicar paga</button>
    </div>` : ''}

    <div class="dashboard-grid">
      <div class="dashboard-main">
        <section class="card networth-card">
          <div class="networth-top">
            <div class="networth-copy">
              <span class="networth-label">Patrimonio neto</span>
              <div class="hero-value networth-value">${eur(saldos.total)}</div>
              <div class="networth-trend ${variacion == null ? 'neutral' : variacion < 0 ? 'negative' : 'positive'}">
                ${variacion != null ? `<span class="trend-mark" aria-hidden="true">${variacion < 0 ? '▼' : '▲'}</span>` : ''}
                <strong>${fmtPct(variacion, { decimales: 1 })}</strong>
                <span>${variacionEsMes ? 'este mes' : variacion != null ? 'desde el inicio' : 'sin datos'}</span>
              </div>
              <span class="networth-aportado">Activos ${eur(saldos.activos)} · deudas ${eur(saldos.deudas)} · aportado ${eur(stats.aportado)}</span>
            </div>
            ${saldos.total > 0 ? `<div class="networth-spark">${sparkDatos(serie.length > 1 ? serie.map((s) => s.post) : [saldos.total, saldos.total], { w: 150, h: 46, suave: true, area: true })}</div>` : ''}
          </div>
          <div class="hero-actions">
            <button class="btn small" id="inicio-ver-patrimonio" type="button">${icono('patrimonio', 16)} Ver patrimonio</button>
            <button class="btn secondary small" id="inicio-registrar" type="button">${icono('editar', 16)} Registrar valores</button>
          </div>
        </section>

        <div class="home-summary-mobile" aria-label="Resumen financiero">
          <div class="summary-row" data-nav="gastos" role="button" tabindex="0" aria-label="Ver gastos del mes">
            <span class="summary-ico green">${icono('cartera', 20)}</span>
            <div class="summary-main">
              <div class="summary-title">Gastos <span>(${mesCorto})</span></div>
              <div class="summary-sub"><strong>${eur(total)}</strong> <span>/ ${eur(presupuesto, 0)}</span></div>
            </div>
            <span class="summary-right ${pctG > 1 ? 'pct-bad' : ''}">${pctGastosTxt}</span>
          </div>
          <div class="summary-row" data-nav="patrimonio" role="button" tabindex="0" aria-label="Ver ahorro e inversión">
            <span class="summary-ico green">${icono('patrimonio', 20)}</span>
            <div class="summary-main">
              <div class="summary-title">Ahorro e inversión</div>
              <div class="summary-sub"><strong>${eur(ahorroMes)}</strong> <span>${aportesRegistrados ? 'este mes' : 'plan mensual'}</span></div>
            </div>
            <span class="summary-right summary-arrow">${icono('chevron', 17)}</span>
          </div>
          <div class="summary-row" data-nav="plan" role="button" tabindex="0" aria-label="Ver plan financiero">
            <span class="summary-ico gold">${icono('tendencia', 20)}</span>
            <div class="summary-main">
              <div class="summary-title">Tasa de ahorro</div>
              <div class="summary-sub"><strong>${fmtPct(flujo.tasaAhorro, { conSigno: false, decimales: 1 })}</strong> <span>· colchón ${planRes.mesesColchon == null ? '—' : planRes.mesesColchon.toFixed(1).replace('.', ',') + ' meses'}</span></div>
            </div>
            <span class="summary-right">${icono('chevron', 17)}</span>
          </div>
          <div class="summary-row summary-goal-row" data-nav="objetivos" role="button" tabindex="0" aria-label="Ver objetivos">
            <span class="summary-ico gold">${icono('casa', 20)}</span>
            <div class="summary-main">
              <div class="summary-title">Objetivo: Casa</div>
              <div class="summary-sub"><strong>${eur(v.fondo)}</strong> <span>de ${eur0(v.objetivo)}</span></div>
            </div>
            <span class="summary-right">${pctCasaTxt} %</span>
            <div class="progress summary-progress"><span style="width:${pctCasa * 100}%"></span></div>
          </div>
        </div>

        <section class="card money-card">
          <div class="card-head">
            <h2>Tu dinero ahora</h2>
            <button class="card-link" data-nav="patrimonio" type="button">Ver detalle ${icono('flecha', 14)}</button>
          </div>
          <div class="money-tiles">
            <div class="money-tile">
              <span class="tile-icon">${icono('banco', 22)}</span>
              <span class="mt-label">Ibercaja</span>
              <strong>${eur0(saldos.diaadia)}</strong>
            </div>
            <div class="money-tile">
              <span class="tile-icon">${icono('patrimonio', 22)}</span>
              <span class="mt-label">Emergencia</span>
              <strong>${eur0(saldos.colchon)}</strong>
            </div>
            <div class="money-tile">
              <span class="tile-icon">${icono('tendencia', 22)}</span>
              <span class="mt-label">Inversión</span>
              <strong>${eur0(saldos.inversion)}</strong>
            </div>
          </div>
        </section>

        <section class="card recent-card">
          <div class="card-head">
            <div><h2>Movimientos recientes</h2><p>Últimos gastos registrados</p></div>
            <button class="card-link" data-nav="gastos" type="button">Ver todos ${icono('chevron', 13)}</button>
          </div>
          ${recientesHtml}
        </section>
      </div>

      <aside class="dashboard-side">
        <article class="card goal-preview">
          <div class="goal-top">
            <div class="goal-icon gold">${icono('casa', 22)}</div>
            <div class="goal-info">
              <span class="card-eyebrow">Objetivo</span>
              <h2>Casa</h2>
              <div class="goal-date">${icono('calendario', 13)} ${v.fechaObj ? `Fecha objetivo ${fmtMes(v.fechaObj)}` : 'Sin fecha objetivo'}</div>
            </div>
            <span class="pill goal-badge ${pctCasa >= 1 ? 'good' : ''}">${(pctCasa * 100).toFixed(1).replace('.', ',')} %</span>
          </div>
          <div class="goal-value-row"><strong>${eur0(v.fondo)}</strong><span>de ${eur0(v.objetivo)}</span></div>
          <div class="progress lg"><span style="width:${pctCasa * 100}%"></span></div>
          <div class="goal-preview-foot"><span>${eur0(v.aporteMes)}/mes</span><span>${v.llegada ? `Llegada ${fmtMes(v.llegada)}` : 'Define tu aporte'}</span></div>
          <button class="btn secondary small full" data-nav="objetivos" type="button">Ver objetivos ${icono('flecha', 14)}</button>
        </article>

        <article class="card">
          <div class="card-head" style="margin-bottom:10px">
            <div><h2>Compartidos y Bizum</h2><p>${resumenComp}</p></div>
            <span class="mini-icon">${icono('compartido', 18)}</span>
          </div>
          <button class="btn secondary small full" data-nav="compartidos" type="button">Abrir compartidos</button>
        </article>
      </aside>
    </div>
  `;

  cablearNavegacion(view);
  view.querySelectorAll('[data-edit]').forEach((el) => {
    el.onclick = () => modalGasto(el.dataset.edit);
  });
  const add = $('#inicio-add-top');
  if (add) add.onclick = () => modalGasto(null);
  const ver = $('#inicio-ver-patrimonio');
  if (ver) ver.onclick = () => irTab('patrimonio');
  const reg = $('#inicio-registrar');
  if (reg) reg.onclick = () => modalRegistrar(currentMonthKey());
  const paga = $('#inicio-paga');
  if (paga) paga.onclick = () => aplicarPaga(pagaPendienteMk || mk);
  const bell = $('#inicio-avisos');
  if (bell) bell.onclick = () => modalAvisos(avisos);
}

/* ---- Modal: avisos de Inicio ---- */
function modalAvisos(avisos) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>Avisos</h3>
      ${avisos.length
        ? `<div class="insight-list">${avisos.map((a) => `<div class="insight ${a.tipo === 'alerta' ? 'alert' : ''}"><span class="insight-ico">${a.icono}</span><p>${a.html}</p></div>`).join('')}</div>`
        : '<div class="empty"><span class="big">✅</span>Todo al día. No tienes avisos nuevos.</div>'}
      <div class="modal-actions"><button class="btn" id="avisos-cerrar" type="button">Cerrar</button></div>
    </div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);
  $('#avisos-cerrar', overlay).onclick = cerrar;
}

/* ============ Vista: Gastos ============ */
function vistaGastos(view) {
  view.classList.add('view-gastos');
  const gastos = gastosDelMes(ui.month);
  const total = totalGastado(ui.month);
  const presupuesto = presupuestoTotalMes(ui.month);
  const pctGlobal = presupuesto > 0 ? total / presupuesto : null;
  const quedan = presupuesto - total;
  const comp = balancesCompartidos();
  const resumenComp = (comp.debido > 0.004 || comp.debo > 0.004)
    ? `${comp.debido > 0.004 ? `Te deben ${eur(comp.debido)}` : ''}${comp.debido > 0.004 && comp.debo > 0.004 ? ' · ' : ''}${comp.debo > 0.004 ? `Debes ${eur(comp.debo)}` : ''}`
    : 'Controla cenas, regalos y bizums: quién te debe y cuánto.';

  const catsData = state.categorias
    .map((c) => ({ ...c, presupuesto: presupuestoCategoria(c.id, ui.month), gastado: gastos.filter((g) => g.catId === c.id).reduce((a, g) => a + g.monto, 0) }))
    .sort((a, b) => b.gastado - a.gastado);
  const movsMes = (state.movimientos || [])
    .filter((m) => String(m.fecha).startsWith(ui.month))
    .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)) || (+b.creado || 0) - (+a.creado || 0));

  const pctTxt = pctGlobal == null ? '—' : `${Math.round(pctGlobal * 100)} %`;
  const anillo = anilloProgreso(pctGlobal, { size: 82, grosor: 8, label: pctTxt });
  const restanteTxt = presupuesto > 0
    ? (quedan >= 0 ? `Te quedan ${eur(quedan)}` : `Excedido ${eur(-quedan)}`)
    : 'Sin presupuesto definido';

  const filasCategorias = catsData.map((c) => {
    const pct = c.presupuesto > 0 ? c.gastado / c.presupuesto : null;
    const cls = pct == null ? '' : pct > 1 ? 'pct-bad' : pct > 0.7 ? 'pct-warn' : 'pct-good';
    const barCls = pct == null ? '' : pct > 1 ? 'over' : pct > 0.7 ? 'warn' : '';
    return `<div class="cat-row">
      <span class="cat-ico" style="background:${c.color}1a;border-color:${c.color}2e;color:${c.color}">${iconoCategoria(c.nombre, 18)}</span>
      <div class="cat-main">
        <div class="cat-name">${escapeHtml(c.nombre)}</div>
        <div class="cat-sub"><strong>${eur(c.gastado)}</strong>${c.presupuesto > 0 ? ` <span>/ ${eur(c.presupuesto)}</span>` : ' <span>· sin límite</span>'}</div>
      </div>
      <div class="cat-right"><strong class="${cls}">${pct == null ? '—' : fmtPct(pct, { conSigno: false, decimales: 0 })}</strong></div>
      ${c.presupuesto > 0 ? `<div class="progress ${barCls}"><span style="width:${Math.min(pct * 100, 100)}%"></span></div>` : ''}
    </div>`;
  }).join('');

  const dias = {};
  for (const g of gastos) (dias[g.fecha] = dias[g.fecha] || []).push(g);
  const lista = Object.keys(dias).length === 0
    ? `<div class="empty"><span class="big">🗂️</span>Aún no hay gastos en ${fmtMes(ui.month).toLowerCase()}.<br>Usa el botón «Añadir gasto» para registrar el primero.</div>`
    : Object.keys(dias).sort().reverse().map((d) => `
      <div class="day-group">
        <div class="day-label">${fmtDia(d)}</div>
        ${dias[d].map((g) => {
          const cat = catPorId(g.catId);
          return `<div class="exp-item" data-edit="${g.id}" role="button" tabindex="0" aria-label="Editar gasto">
            <span class="dot" style="background:${cat ? cat.color : '#64748b'}"></span>
            <div class="exp-main">
              <div class="exp-note">${escapeHtml(g.nota || 'Gasto')}</div>
              <div class="exp-cat">${escapeHtml(cat ? cat.nombre : 'Sin categoría')}</div>
            </div>
            <span class="exp-amount">${eur(g.monto)}</span>
          </div>`;
        }).join('')}
      </div>`).join('');

  const listaMovs = movsMes.length ? movsMes.map((m) => {
    const cat = catPorId(m.catId);
    const cuenta = holdingPorId(m.cuentaId);
    const positivo = ['ingreso', 'retirada', 'devolucion'].includes(m.tipo);
    const color = positivo ? 'var(--accent)' : 'var(--rose)';
    return `<div class="exp-item" data-edit-mov="${m.id}" role="button" tabindex="0" aria-label="Editar movimiento">
      <span class="dot" style="background:${color}"></span>
      <div class="exp-main">
        <div class="exp-note">${escapeHtml(m.nota || etiquetaTipoMovimiento(m.tipo))}</div>
        <div class="exp-cat">${escapeHtml(etiquetaTipoMovimiento(m.tipo))}${cat ? ' · ' + escapeHtml(cat.nombre) : ''}${cuenta ? ' · ' + escapeHtml(cuenta.nombre) : ''} · ${fmtDia(m.fecha)}</div>
      </div>
      <span class="exp-amount ${positivo ? 'pct-good' : ''}">${positivo ? '+' : '−'}${eur(m.importe)}</span>
    </div>`;
  }).join('') : '<div class="empty" style="padding:16px"><span class="big">🔁</span>Sin ingresos, traspasos ni inversiones este mes.</div>';

  view.innerHTML = `
    <header class="page-head gastos-head">
      <div><span class="eyebrow">Control del mes</span><h1>Gastos</h1></div>
      <div class="page-head-actions">
        <button class="btn secondary small" id="btn-add-mov" type="button">${icono('mas', 15)} Movimiento</button>
        <button class="btn secondary small" id="btn-import-csv" type="button">${icono('descargar', 15)} Importar CSV</button>
        ${monthNavHTML()}
      </div>
    </header>

    <div class="content-grid gastos-grid">
      <div class="stack">
        <section class="card gastos-summary">
          ${anillo}
          <div class="gastos-summary-copy">
            <div class="gastos-spent">${eur(total)}</div>
            <div class="gastos-budget">de ${eur(presupuesto)}</div>
            <div class="gastos-remaining ${quedan < 0 ? 'pct-bad' : ''}">${restanteTxt}</div>
          </div>
        </section>

        <section class="card gastos-cats-card">
          <div class="card-head gastos-cats-head">
            <div><h2>Por categoría</h2></div>
            <button class="card-link" data-nav="ajustes" type="button">Editar límites ${icono('chevron', 13)}</button>
          </div>
          <div class="cat-list gastos-cat-list">${filasCategorias || '<div class="empty">Crea categorías en Ajustes.</div>'}</div>
        </section>

        <div class="gastos-cta-dock">
          <button class="btn gastos-add-btn" id="btn-add-gasto" type="button">${icono('mas', 18)} Añadir gasto</button>
        </div>
      </div>

      <div class="stack">
        <section class="card">
          <div class="card-head">
            <div><h2>Detalle del mes</h2><p>${gastos.length} ${gastos.length === 1 ? 'gasto' : 'gastos'} en ${fmtMes(ui.month).toLowerCase()}</p></div>
            <button class="card-link" id="btn-export-csv" type="button">${icono('descargar', 14)} CSV</button>
          </div>
          ${lista}
        </section>

        <section class="card">
          <div class="card-head">
            <div><h2>Otros movimientos</h2><p>Ingresos, traspasos, inversiones, retiradas y pagos de deuda</p></div>
          </div>
          ${listaMovs}
        </section>

        <section class="card">
          <div class="card-head" style="margin-bottom:12px">
            <div><h2>${icono('compartido', 17)} Compartidos y Bizum</h2><p>${resumenComp}</p></div>
          </div>
          <button class="btn secondary full" id="btn-comp" type="button">Abrir compartidos ${icono('flecha', 15)}</button>
        </section>
      </div>
    </div>
  `;

  cablearMesNav();
  cablearNavegacion(view);
  const add = $('#btn-add-gasto');
  if (add) add.onclick = () => modalGasto(null);
  const addMov = $('#btn-add-mov');
  if (addMov) addMov.onclick = () => modalMovimiento();
  const importCsv = $('#btn-import-csv');
  if (importCsv) importCsv.onclick = () => modalImportarCSV();
  const exportCsv = $('#btn-export-csv');
  if (exportCsv) exportCsv.onclick = () => descargarCSVMovimientos();
  const btnComp = $('#btn-comp');
  if (btnComp) btnComp.onclick = () => irTab('compartidos');
  view.querySelectorAll('[data-edit]').forEach((el) => {
    el.onclick = () => modalGasto(el.dataset.edit);
  });
  view.querySelectorAll('[data-edit-mov]').forEach((el) => {
    el.onclick = () => modalMovimiento(el.dataset.editMov);
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
        <div class="field"><label for="g-cuenta">Cuenta / método de pago</label>
          <select id="g-cuenta">
            ${holdingsActivos().filter(esCuentaEfectivo).map((h) => `<option value="${h.id}" ${((g && g.cuentaId) || 'h-ibercaja') === h.id ? 'selected' : ''}>${escapeHtml(h.nombre)} · ${escapeHtml(h.entidad || '')}</option>`).join('')}
          </select></div>
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
  activarModal(overlay);
  $('#g-monto', overlay).focus();

  overlay.querySelectorAll('[data-cat]').forEach((b) => {
    b.onclick = () => { catSel = b.dataset.cat; overlay.querySelectorAll('[data-cat]').forEach((x) => x.classList.toggle('selected', x === b)); };
  });
  $('#g-cancelar', overlay).onclick = cerrar;
  $('#g-guardar', overlay).onclick = () => {
    const monto = parseAmount($('#g-monto', overlay).value);
    const fecha = $('#g-fecha', overlay).value;
    const nota = $('#g-nota', overlay).value.trim();
    const cuentaId = $('#g-cuenta', overlay).value || 'h-ibercaja';
    if (monto == null || monto <= 0) return toast('Introduce un importe válido', 'error');
    if (monto > 1e9) return toast('El importe es demasiado grande', 'error');
    if (!fecha) return toast('Introduce una fecha', 'error');
    if (idGasto) {
      const enEstado = state.gastos.find((x) => x.id === idGasto);
      if (enEstado) {
        Object.assign(enEstado, { monto, fecha, catId: catSel, nota, cuentaId });
        stamp(enEstado);
      } else {
        state.gastos.push(stamp({ id: idGasto, monto, fecha, catId: catSel, nota, cuentaId, creado: Date.now() }));
      }
    } else {
      state.gastos.push(stamp({ id: uid(), monto, fecha, catId: catSel, nota, cuentaId, creado: Date.now() }));
    }
    guardarEstado();
    cerrar();
    toast(idGasto ? 'Gasto actualizado' : 'Gasto añadido');
    render();
  };
  if (idGasto) $('#g-borrar', overlay).onclick = () => {
    if ((state.compartidosEventos || []).some((ev) => ev.gastoId === idGasto)) {
      return toast('Este gasto forma parte de un gasto compartido; bórralo desde Compartidos', 'error');
    }
    tumba('gastos', idGasto);
    state.gastos = state.gastos.filter((x) => x.id !== idGasto);
    guardarEstado(); cerrar(); toast('Gasto borrado'); render();
  };
}

/* Fuerza la actualización de la PWA sin borrar datos (localStorage intacto) */
async function buscarActualizacion() {
  toast('Buscando actualización…');
  try {
    await Promise.all(['./index.html', './app.js', './styles.css', './sw.js'].map((u) => fetch(u, { cache: 'reload' }).catch(() => null)));
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
    if (window.caches) {
      const claves = await caches.keys();
      await Promise.all(claves.map((k) => caches.delete(k)));
    }
  } catch (e) { /* recarga igualmente */ }
  location.replace(location.pathname + '?v=' + Date.now());
}

/* Compara la versión instalada con la publicada en Pages */
async function comprobarVersionPublicada() {
  const el = $('#version-info');
  if (!el) return;
  try {
    const res = await fetch('./app.js?t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error('status');
    const txt = await res.text();
    const m = txt.match(/APP_VERSION = '([^']+)'/);
    const remota = m ? m[1] : 'desconocida';
    const igual = remota === APP_VERSION;
    el.innerHTML = `Instalada aquí: <strong>${APP_VERSION}</strong><br>Publicada en GitHub: <strong>${remota}</strong> ${igual ? '✅' : '— pulsa «Buscar actualización» cuando esté publicada'}`;
  } catch (e) {
    el.textContent = `Instalada aquí: ${APP_VERSION} · no se pudo comprobar la publicada`;
  }
}

/* ============ Vista: Objetivos ============ */
function vistaObjetivos(view) {
  const v = datosVivienda();
  const pctCasa = v.objetivo > 0 ? Math.min(v.fondo / v.objetivo, 1) : 0;
  const pctCasaReal = v.objetivo > 0 ? v.fondo / v.objetivo : 0;
  const completado = pctCasaReal >= 1;

  const extraGoals = (state.objetivos || []).map((g) => {
    const cubo = cuboPorId(g.cuboId);
    const actual = holdingsActivos()
      .filter((h) => h.cubo === g.cuboId)
      .reduce((a, h) => a + statsHolding(h.id).valorActual, 0);
    const plan = holdingsActivos()
      .filter((h) => h.cubo === g.cuboId)
      .reduce((a, h) => a + (+h.plan || 0), 0);
    const monto = +g.monto || 0;
    const faltan = Math.max(monto - actual, 0);
    const pct = monto > 0 ? Math.min(actual / monto, 1) : 0;
    const meses = faltan > 0 && plan > 0 ? Math.ceil(faltan / plan) : null;
    const llegada = meses ? addMonths(currentMonthKey(), meses) : null;
    const mesesHastaFecha = g.fecha ? Math.max(monthsBetween(currentMonthKey(), g.fecha), 0) : null;
    const aporteNecesario = mesesHastaFecha && faltan > 0 ? faltan / mesesHastaFecha : null;
    const enPlazo = g.fecha && llegada ? String(llegada) <= String(g.fecha) : null;
    return { ...g, cubo, actual, plan, monto, faltan, pct, meses, llegada, mesesHastaFecha, aporteNecesario, enPlazo, color: colorCubo(g.cuboId) };
  });

  // Proyección del fondo vivienda (aportaciones sin intereses)
  const filasProyeccion = [];
  for (let anio = 1; anio <= 5; anio++) {
    filasProyeccion.push({ label: `${anio} año${anio > 1 ? 's' : ''}`, fondo: v.fondo + v.aporteMes * 12 * anio });
  }
  if (v.fechaObj && v.mesesHastaObj != null && v.objetivo > 0) {
    filasProyeccion.push({ label: `${fmtMes(v.fechaObj)} (objetivo)`, fondo: v.fondo + v.aporteMes * v.mesesHastaObj, especial: true });
  }
  const proyeccion = filasProyeccion.map((r) => {
    const p = v.objetivo > 0 ? r.fondo / v.objetivo : 0;
    return `<tr><td>${r.label}</td><td>${eur0(r.fondo)}</td><td>${v.objetivo > 0 ? `${(p * 100).toFixed(0)} %` : '—'}</td></tr>`;
  }).join('');

  // Avisos del plan (mismas reglas que el informe de vivienda)
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
  const efectivoTR = holdingsActivos()
    .filter((h) => (h.entidad || '').toLowerCase() === 'trade republic' && esCuentaEfectivo(h))
    .reduce((a, h) => a + statsHolding(h.id).valorActual, 0);
  if (efectivoTR >= 80000) {
    tips.push(`Regla 9 del informe: tienes ${eur0(efectivoTR)} de efectivo en Trade Republic y la garantía cubre 100.000 € por entidad — repártelo entre entidades para quedar por debajo.`);
  } else if (efectivoTR >= 45000) {
    tips.push(`Regla de los 45.000 € superada (${eur0(efectivoTR)} de efectivo en Trade Republic): el 3,04 % TAE solo cubre hasta 50.000 € y por encima baja. Abre MyInvestor y traslada el exceso del fondo vivienda a un fondo monetario en euros; la emergencia se queda en Trade Republic.`);
  } else if (efectivoTR >= 40000) {
    tips.push(`El efectivo de Trade Republic (${eur0(efectivoTR)}) se acerca a los 45.000 € de la regla del informe: cuando la cruces, abre MyInvestor y mueve el exceso del fondo vivienda a un fondo monetario (la emergencia se queda).`);
  }

  const avisosHtml = tips.length ? `
    <section class="card">
      <div class="card-head">
        <div><h2>Avisos del plan</h2><p>Reglas que conviene no perder de vista</p></div>
        <span class="mini-icon" style="color:var(--gold);background:rgba(245,196,81,.12);border-color:rgba(245,196,81,.18)">${icono('alerta', 18)}</span>
      </div>
      <div class="insight-list">
        ${tips.map((t) => `<div class="insight alert"><span class="insight-ico">${icono('alerta', 15)}</span><p>${t}</p></div>`).join('')}
      </div>
    </section>` : '';

  const extraCards = extraGoals.map((g) => `
    <article class="goal-card ${extraGoals.length === 1 ? 'span-2' : ''}">
      <div class="goal-top">
        <div class="goal-icon" style="color:${g.color};background:${g.color}1f;border-color:${g.color}33">${g.icono ? icono(g.icono, 22) : iconoCubo(g.cuboId)}</div>
        <div class="goal-info">
          <span class="card-eyebrow">${escapeHtml(g.cubo ? g.cubo.nombre : 'Objetivo')}</span>
          <h2>${escapeHtml(g.nombre)}</h2>
          <div class="goal-date">${icono('calendario', 13)} ${g.fecha ? `Fecha objetivo ${fmtMes(g.fecha)}` : 'Sin fecha objetivo'}</div>
        </div>
        <span class="pill goal-badge ${g.enPlazo === true ? 'good' : g.enPlazo === false ? 'bad' : ''}">${(g.pct * 100).toFixed(1).replace('.', ',')} %</span>
      </div>
      <div class="goal-value-row"><strong>${eur0(g.actual)}</strong><span>de ${eur0(g.monto)}</span></div>
      <div class="progress"><span style="width:${g.pct * 100}%"></span></div>
      <div class="goal-stats">
        <div><span>Aportación</span><strong>${eur0(g.plan)}/mes</strong></div>
        <div><span>Faltan</span><strong>${eur0(g.faltan)}</strong></div>
        <div><span>Llegada</span><strong>${g.llegada ? fmtMes(g.llegada) : '—'}</strong></div>
      </div>
      ${g.fecha ? `<div class="goal-stats"><div><span>Necesario para fecha</span><strong>${g.aporteNecesario == null ? '—' : eur0(g.aporteNecesario) + '/mes'}</strong></div><div><span>¿En plazo?</span><strong class="${g.enPlazo === true ? 'pct-good' : g.enPlazo === false ? 'pct-bad' : ''}">${g.enPlazo === true ? 'Sí' : g.enPlazo === false ? 'No' : '—'}</strong></div></div>` : ''}
      <div class="goal-actions">
        <button class="btn secondary small" data-goal-edit="${g.id}" type="button">${icono('editar', 15)} Editar</button>
        <button class="icon-btn danger" data-goal-del="${g.id}" type="button" aria-label="Eliminar objetivo">${icono('basura', 16)}</button>
      </div>
    </article>`).join('');

  view.innerHTML = `
    <header class="page-head">
      <div>
        <span class="eyebrow">Metas a largo plazo</span>
        <h1>Objetivos</h1>
        <p class="page-sub">Tu plan de vivienda y las metas que quieras construir.</p>
      </div>
      <div class="page-head-actions">
        <button class="btn" id="ob-nuevo-top" type="button">${icono('mas', 16)} Nuevo objetivo</button>
      </div>
    </header>

    <div class="goals-grid">
      <article class="goal-card primary span-2">
        <div class="goal-top">
          <div class="goal-icon gold">${icono('casa', 22)}</div>
          <div class="goal-info">
            <span class="card-eyebrow">Objetivo principal</span>
            <h2>Entrada para la vivienda</h2>
            <div class="goal-date">${icono('calendario', 13)} ${v.fechaObj ? `Fecha objetivo ${fmtMes(v.fechaObj)}` : 'Sin fecha objetivo'} · ${eur0(v.precio)} de vivienda</div>
          </div>
          <span class="pill goal-badge ${completado ? 'good' : v.cumple === true ? 'good' : v.cumple === false ? 'bad' : ''}">${(pctCasaReal * 100).toFixed(1).replace('.', ',')} %</span>
        </div>
        <div class="goal-value-row">
          <strong>${completado ? '🎉' : eur0(v.fondo)}</strong>
          <span>${completado ? 'Objetivo alcanzado' : `de ${eur0(v.objetivo)}`}</span>
        </div>
        <div class="progress lg"><span style="width:${pctCasa * 100}%"></span></div>
        <div class="goal-stats">
          <div><span>Aportación mensual</span><strong>${eur0(v.aporteMes)}</strong></div>
          <div><span>Faltan</span><strong>${eur0(v.faltan)}</strong></div>
          <div><span>Llegada estimada</span><strong>${v.llegada ? fmtMes(v.llegada) : '—'}</strong></div>
        </div>
        <div class="goal-stats">
          <div><span>¿Llegas a la fecha?</span><strong class="${v.cumple === true ? 'pct-good' : v.cumple === false ? 'pct-bad' : ''}">${v.cumple === true ? 'Sí' : v.cumple === false ? 'No' : '—'}</strong></div>
          <div><span>Fondo en fecha</span><strong>${v.fondoEnFecha == null ? '—' : eur0(v.fondoEnFecha)}</strong></div>
        </div>
        <div class="goal-actions">
          <button class="btn secondary small" id="ob-casa-editar" type="button">${icono('editar', 15)} Editar objetivo</button>
          <button class="btn small" id="ob-registrar" type="button">${icono('mas', 15)} Registrar aporte</button>
        </div>
      </article>

      ${extraCards}

      ${!extraGoals.length ? `
      <div class="empty-goal span-2">
        <strong>Aún no tienes otros objetivos</strong>
        Crea metas para tu colchón de emergencia, viajes o jubilación y verás su progreso aquí.
        <br><button class="btn secondary small" id="ob-nuevo-empty" type="button">${icono('mas', 15)} Crear mi primer objetivo</button>
      </div>` : ''}
    </div>

    ${avisosHtml ? `
    <div class="content-grid" style="margin-top:16px">
      <div class="stack">${avisosHtml}</div>
      <div class="stack">
        <section class="card">
          <div class="card-head">
            <div><h2>Proyección del fondo vivienda</h2><p>Aportaciones sin contar intereses, como en el informe</p></div>
          </div>
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Horizonte</th><th>Fondo estimado</th><th>Del objetivo</th></tr></thead>
              <tbody>${proyeccion}</tbody>
            </table>
          </div>
          <p class="hint">La barra crece con los valores reales que registres en Patrimonio. Las pagas extra ya están incluidas en el ritmo mensual.</p>
        </section>
      </div>
    </div>` : `
    <section class="card" style="margin-top:16px">
      <div class="card-head">
        <div><h2>Proyección del fondo vivienda</h2><p>Aportaciones sin contar intereses, como en el informe</p></div>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Horizonte</th><th>Fondo estimado</th><th>Del objetivo</th></tr></thead>
          <tbody>${proyeccion}</tbody>
        </table>
      </div>
      <p class="hint">La barra crece con los valores reales que registres en Patrimonio. Las pagas extra ya están incluidas en el ritmo mensual.</p>
    </section>`}
  `;

  const nuevoTop = $('#ob-nuevo-top');
  if (nuevoTop) nuevoTop.onclick = () => modalObjetivoNuevo();
  const nuevoEmpty = $('#ob-nuevo-empty');
  if (nuevoEmpty) nuevoEmpty.onclick = () => modalObjetivoNuevo();
  const editarCasa = $('#ob-casa-editar');
  if (editarCasa) editarCasa.onclick = () => modalObjetivoCasa();
  const registrar = $('#ob-registrar');
  if (registrar) registrar.onclick = () => modalRegistrar(currentMonthKey());
  view.querySelectorAll('[data-goal-edit]').forEach((b) => {
    b.onclick = () => {
      const g = (state.objetivos || []).find((x) => x.id === b.dataset.goalEdit);
      if (g) modalObjetivoNuevo(g);
    };
  });
  view.querySelectorAll('[data-goal-del]').forEach((b) => {
    b.onclick = () => {
      const id = b.dataset.goalDel;
      const g = (state.objetivos || []).find((x) => x.id === id);
      if (!g) return;
      if (!confirm(`¿Eliminar el objetivo «${g.nombre}»? Las posiciones y su dinero no se borran.`)) return;
      tumba('objetivos', id);
      state.objetivos = state.objetivos.filter((x) => x.id !== id);
      guardarEstado(); toast('Objetivo eliminado'); render();
    };
  });
}

/* ---- Modal: editar objetivo vivienda ---- */
function modalObjetivoCasa() {
  const o = state.ajustes.objetivoCasa || {};
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>Editar objetivo: Casa</h3>
      <div class="form-card">
        <div class="field"><label for="oc-precio">Precio de la vivienda (€)</label>
          <input id="oc-precio" type="text" inputmode="decimal" value="${String(o.precio || 0).replace('.', ',')}" /></div>
        <div class="field"><label for="oc-fecha">Fecha de compra</label>
          <input id="oc-fecha" type="month" value="${o.fechaObjetivo || ''}" /></div>
        <div class="field-row">
          <div class="field"><label for="oc-entrada">% de entrada</label>
            <input id="oc-entrada" type="text" inputmode="decimal" value="${String(o.pctEntrada ?? 20).replace('.', ',')}" /></div>
          <div class="field"><label for="oc-gastos">% de gastos (10–12)</label>
            <input id="oc-gastos" type="text" inputmode="decimal" value="${String(o.pctGastos ?? 11).replace('.', ',')}" /></div>
        </div>
        <div class="field"><label for="oc-margen">Margen extra al mes (€)</label>
          <input id="oc-margen" type="text" inputmode="decimal" value="${String(o.margen || 0).replace('.', ',')}" /></div>
        <p class="hint">Entrada = 20 % del precio (hipoteca del 80 %) más un 10–12 % de impuestos y gastos. Ejemplo: vivienda de ${eur0(+o.precio || 300000)} → objetivo ≈ ${eur0((+o.precio || 300000) * 0.31)}. La reserva de emergencia y el día a día no cuentan para la entrada.</p>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" id="oc-cancel" type="button">Cancelar</button>
        <button class="btn" id="oc-save" type="button">Guardar</button>
      </div>
    </div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);
  $('#oc-cancel', overlay).onclick = cerrar;
  $('#oc-save', overlay).onclick = () => {
    const precio = parseAmount($('#oc-precio', overlay).value);
    const pctEntrada = parseAmount($('#oc-entrada', overlay).value);
    const pctGastos = parseAmount($('#oc-gastos', overlay).value);
    const margen = parseAmount($('#oc-margen', overlay).value) ?? 0;
    if (precio == null || precio <= 0) return toast('Introduce un precio válido', 'error');
    if (pctEntrada == null || pctEntrada < 0 || pctEntrada > 100) return toast('El % de entrada no es válido', 'error');
    if (pctGastos == null || pctGastos < 0 || pctGastos > 100) return toast('El % de gastos no es válido', 'error');
    const fechaObjetivo = $('#oc-fecha', overlay).value || null;
    state.ajustes.objetivoCasa = {
      ...state.ajustes.objetivoCasa,
      precio,
      pctEntrada,
      pctGastos,
      margen: Math.max(margen, 0),
      fechaObjetivo,
    };
    state.plan.hipoteca.precio = precio;
    state.plan.hipoteca.entrada = pctEntrada;
    state.plan.hipoteca.gastos = pctGastos;
    state.plan.hipoteca.fecha = fechaObjetivo;
    state.plan.mod = Date.now();
    state.ajustes.mod = Date.now();
    guardarEstado(); cerrar(); toast('Objetivo actualizado'); render();
  };
}

/* ---- Modal: nuevo / editar objetivo ---- */
function modalObjetivoNuevo(goal = null) {
  const usados = new Set((state.objetivos || []).filter((x) => x.id !== (goal && goal.id)).map((x) => x.cuboId));
  const disponibles = state.cubos.filter((c) => c.id !== 'vivienda' && !usados.has(c.id));
  if (!goal && !disponibles.length) {
    return toast('Todas las posiciones ya tienen un objetivo. Crea otro espacio en Ajustes.', 'error');
  }
  const cubos = state.cubos.filter((c) => (goal && c.id === goal.cuboId) || (c.id !== 'vivienda' && !usados.has(c.id)));
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>${goal ? 'Editar objetivo' : 'Nuevo objetivo'}</h3>
      <div class="form-card">
        <div class="field"><label for="go-nombre">Nombre del objetivo</label>
          <input id="go-nombre" type="text" placeholder="Ej.: Colchón de emergencia" value="${goal ? escapeHtml(goal.nombre) : ''}" /></div>
        <div class="field"><label for="go-cubo">Se calcula con el dinero de…</label>
          <select id="go-cubo">
            ${cubos.map((c) => `<option value="${c.id}" ${goal && goal.cuboId === c.id ? 'selected' : ''}>${escapeHtml(c.nombre)}</option>`).join('')}
          </select>
          <p class="hint">El progreso usa el valor actual de las posiciones de ese espacio. Puedes cambiarlas en Ajustes → Posiciones de inversión.</p>
        </div>
        <div class="field-row">
          <div class="field"><label for="go-monto">Meta (€)</label>
            <input id="go-monto" type="text" inputmode="decimal" placeholder="0,00" value="${goal ? String(goal.monto || 0).replace('.', ',') : ''}" /></div>
          <div class="field"><label for="go-fecha">Fecha objetivo</label>
            <input id="go-fecha" type="month" value="${goal && goal.fecha ? goal.fecha : ''}" /></div>
        </div>
        <div class="field">
          <label for="go-icono">Icono</label>
          <select id="go-icono">
            ${[['objetivo', '🎯 Objetivo'], ['escudo', '🛡️ Emergencia'], ['avion', '✈️ Viajes'], ['bolsa', '📈 Jubilación'], ['casa', '🏠 Casa'], ['tarjeta', '💳 Día a día']].map(([k, v]) => `<option value="${k}" ${goal && goal.icono === k ? 'selected' : ''}>${v}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="modal-actions">
        ${goal ? '<button class="btn danger" id="go-borrar" type="button">Borrar</button>' : ''}
        <button class="btn secondary" id="go-cancel" type="button">Cancelar</button>
        <button class="btn" id="go-save" type="button">${goal ? 'Guardar' : 'Crear objetivo'}</button>
      </div>
    </div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);
  $('#go-cancel', overlay).onclick = cerrar;
  $('#go-save', overlay).onclick = () => {
    const nombre = $('#go-nombre', overlay).value.trim();
    const cuboId = $('#go-cubo', overlay).value;
    const monto = parseAmount($('#go-monto', overlay).value);
    const fecha = $('#go-fecha', overlay).value || null;
    const iconoElegido = $('#go-icono', overlay).value;
    if (!nombre) return toast('Ponle un nombre al objetivo', 'error');
    if (monto == null || monto <= 0) return toast('Introduce una meta válida', 'error');
    if (!cuboId) return toast('Elige de dónde sale el dinero', 'error');
    if (goal) {
      Object.assign(goal, { nombre, cuboId, monto, fecha, icono: iconoElegido });
      stamp(goal);
    } else {
      state.objetivos = state.objetivos || [];
      state.objetivos.push(stamp({ id: uid(), nombre, cuboId, monto, fecha, icono: iconoElegido, creado: Date.now() }));
    }
    guardarEstado(); cerrar(); toast(goal ? 'Objetivo actualizado' : 'Objetivo creado'); render();
  };
  if (goal) {
    $('#go-borrar', overlay).onclick = () => {
      if (!confirm(`¿Eliminar el objetivo «${goal.nombre}»? Las posiciones y su dinero no se borran.`)) return;
      tumba('objetivos', goal.id);
      state.objetivos = state.objetivos.filter((x) => x.id !== goal.id);
      guardarEstado(); cerrar(); toast('Objetivo eliminado'); render();
    };
  }
}

/* ============ Registro mensual de valores ============ */

/* ---- Modal registrar / editar valores de un mes ---- */
function modalRegistrar(mk = null) {
  const mes = mk || ui.month;
  const snap = snapPorMes(mes);
  const iberId = holdingIbercaja() ? holdingIbercaja().id : null;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>${snap ? 'Editar' : 'Registrar'} valores · ${fmtMes(mes)}</h3>
      <p class="hint" style="margin-top:-6px">Introduce el <strong>valor de cada posición el día 1</strong>. Las aportaciones a inversión se descuentan del saldo de Ibercaja y se suman a la posición.</p>
      <p class="hint" style="margin-top:-6px">Para corregir el saldo actual de Ibercaja, usa su fila en Patrimonio.</p>
      <button class="card-link" id="reg-ajustar-ibercaja" type="button" style="margin-bottom:10px">Ajustar saldo actual de Ibercaja ${icono('flecha', 13)}</button>
      ${!snap && pagasConfig().activo && esMesDePaga(mes) ? `<p class="hint" style="margin-top:-6px;color:var(--gold)">🎁 Este mes toca paga extra (${eur(+pagasConfig().importe || 0)}): las aportaciones vienen ya con su parte repartida.</p>` : ''}
      <div class="form-card" id="reg-fields">
        ${holdingsActivos().map((h) => {
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
              <div class="field"><label>Aportación${h.id === iberId ? '' : ' desde Ibercaja'} (€)</label>
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
  activarModal(overlay);

  $('#reg-cancelar', overlay).onclick = cerrar;
  const btnIber = $('#reg-ajustar-ibercaja', overlay);
  if (btnIber) btnIber.onclick = () => { cerrar(); modalAjustarIbercaja(); };
  $('#reg-guardar', overlay).onclick = () => {
    const valores = {}, aportes = {}, llenos = {};
    let vacio = true;
    for (const card of overlay.querySelectorAll('[data-hid]')) {
      const hid = card.dataset.hid;
      const rawV = $('.reg-valor', card).value.trim();
      const v = parseAmount(rawV) || 0;
      const a = parseAmount($('.reg-aporte', card).value) || 0;
      valores[hid] = v; aportes[hid] = a; llenos[hid] = !!rawV;
      if (v !== 0 || a !== 0) vacio = false;
    }
    if (vacio && !snap) return toast('No hay valores que guardar', 'error');
    const snapActual = snapPorMes(mes);
    const pg = pagasConfig();
    if (snapActual) {
      snapActual.valores = valores;
      snapActual.aportes = aportes;
      if (pg.activo && esMesDePaga(mes) && (+pg.importe || 0) > 0) {
        const planTotal = state.holdings.reduce((a, h) => a + (+h.plan || 0), 0);
        const totalAportes = Object.values(aportes).reduce((a, b) => a + (+b || 0), 0);
        snapActual.pagaAplicada = totalAportes >= planTotal + (+pg.importe || 0) - 1;
        if (snapActual.pagaAplicada) snapActual.pagaImporte = +pg.importe || 0;
      }
      stamp(snapActual);
    } else {
      const nuevo = stamp({ id: mes, month: mes, valores, aportes });
      if (pg.activo && esMesDePaga(mes) && (+pg.importe || 0) > 0) {
        const planTotal = state.holdings.reduce((a, h) => a + (+h.plan || 0), 0);
        const totalAportes = Object.values(aportes).reduce((a, b) => a + (+b || 0), 0);
        nuevo.pagaAplicada = totalAportes >= planTotal + (+pg.importe || 0) - 1;
        if (nuevo.pagaAplicada) nuevo.pagaImporte = +pg.importe || 0;
      }
      state.snapshots.push(nuevo);
    }
    // El snapshot más reciente fija el saldo base de las cuentas de efectivo.
    const esUltimo = !state.snapshots.some((s) => String(s.month) > String(mes));
    if (esUltimo) {
      for (const h of holdingsActivos()) {
        if (!esCuentaEfectivo(h) || !llenos[h.id]) continue;
        h.saldoBase = valores[h.id];
        h.fechaBase = `${mes}-01`;
        h.fechaBaseTs = new Date(`${mes}-01T00:00:00`).getTime();
        stamp(h);
      }
    }
    sincronizarAportesSnapshot(mes);
    guardarEstado(); cerrar(); toast(`Valores de ${fmtMes(mes)} guardados`); render();
  };
  if (snap) $('#reg-borrar', overlay).onclick = () => {
    const eraUltimo = !state.snapshots.some((s) => String(s.month) > String(mes));
    tumba('snapshots', mes);
    state.snapshots = state.snapshots.filter((s) => s.month !== mes);
    state.movimientos = (state.movimientos || []).filter((m) => m.origenSnapshot !== mes);
    for (const h of state.holdings) {
      if (h.snapshotUnidades && h.snapshotUnidades[mes]) {
        h.unidades = Math.max(0, (+h.unidades || 0) - (+h.snapshotUnidades[mes] || 0));
        delete h.snapshotUnidades[mes];
        stamp(h);
      }
    }
    if (eraUltimo) {
      const prev = state.snapshots.filter((s) => String(s.month) < String(mes)).sort((a, b) => String(a.month).localeCompare(String(b.month))).pop();
      if (prev) {
        for (const h of holdingsActivos()) {
          if (!esCuentaEfectivo(h) || prev.valores[h.id] == null) continue;
          h.saldoBase = +prev.valores[h.id] || 0;
          h.fechaBase = `${prev.month}-01`;
          h.fechaBaseTs = new Date(`${prev.month}-01T00:00:00`).getTime();
          stamp(h);
        }
      }
    }
    guardarEstado(); cerrar(); toast('Registro del mes borrado'); render();
  };
}

/* ---- Modal: ajustar saldo actual de una cuenta de efectivo ---- */
function modalAjustarCuenta(hid = null) {
  const h = hid ? holdingPorId(hid) : holdingIbercaja();
  if (!h) return toast('No hay ninguna cuenta de efectivo', 'error');
  const des = desgloseCuenta(h.id);
  const mesActual = currentMonthKey();
  const fechaBase = new Date(`${h.fechaBase || ''}T00:00:00`);
  const fechaTxt = isFinite(fechaBase.getTime())
    ? fechaBase.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'sin fecha';
  const conSigno = (n, invertir = false) => {
    if (Math.abs(n) < 0.005) return eur(0);
    const positivo = invertir ? n < 0 : n > 0;
    return `${positivo ? '+' : '−'}${eur(Math.abs(n))}`;
  };
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>Saldo de ${escapeHtml(h.nombre)}</h3>
      <p class="hint" style="margin-top:-6px">Saldo confirmado el ${fechaTxt}. A partir de ahí se aplican nóminas, gastos, compartidos, bizums y traspasos. Si cambias el salario, pulsa «Reconciliar» para fijar un nuevo punto de partida. Las pagas extra se aplican desde Inicio o Patrimonio y generan su propio ingreso y reparto.</p>
      <div class="ibercaja-desglose">
        <div><span>Saldo confirmado <small>${fechaTxt}</small></span><strong>${eur(des.base)}</strong></div>
        <div><span>Nóminas automáticas</span><strong class="pct-good">${conSigno(des.nominas)}</strong></div>
        ${des.pagas > 0 ? `<div><span>Pagas extra automáticas</span><strong class="pct-good">${conSigno(des.pagas)}</strong></div>` : ''}
        ${des.ingresos > 0 ? `<div><span>Otros ingresos</span><strong class="pct-good">${conSigno(des.ingresos)}</strong></div>` : ''}
        ${des.devoluciones > 0 ? `<div><span>Devoluciones</span><strong class="pct-good">${conSigno(des.devoluciones)}</strong></div>` : ''}
        <div><span>Gastos</span><strong class="pct-bad">${des.gastos > 0 ? `−${eur(des.gastos)}` : eur(0)}</strong></div>
        ${des.compartidos > 0 ? `<div><span>Compartidos pagados por ti</span><strong class="pct-bad">−${eur(des.compartidos)}</strong></div>` : ''}
        <div><span>Bizums (neto)</span><strong class="${des.bizums >= 0 ? 'pct-good' : 'pct-bad'}">${conSigno(des.bizums)}</strong></div>
        ${des.inversiones > 0 ? `<div><span>Inversiones</span><strong class="pct-bad">−${eur(des.inversiones)}</strong></div>` : ''}
        ${des.retiradas > 0 ? `<div><span>Retiradas de inversión</span><strong class="pct-good">+${eur(des.retiradas)}</strong></div>` : ''}
        ${des.traspasosSalida > 0 ? `<div><span>Traspasos enviados</span><strong class="pct-bad">−${eur(des.traspasosSalida)}</strong></div>` : ''}
        ${des.traspasosEntrada > 0 ? `<div><span>Traspasos recibidos</span><strong class="pct-good">+${eur(des.traspasosEntrada)}</strong></div>` : ''}
        ${des.pagosDeuda > 0 ? `<div><span>Pagos de deuda</span><strong class="pct-bad">−${eur(des.pagosDeuda)}</strong></div>` : ''}
        <div class="total"><span>Saldo actual</span><strong>${eur(des.actual)}</strong></div>
      </div>
      <div class="field"><label for="ib-saldo">Nuevo saldo actual (€)</label>
        <input id="ib-saldo" type="text" inputmode="decimal" value="${des.actual.toFixed(2).replace('.', ',')}" autofocus /></div>
      <div class="field-row">
        <div class="field"><label for="ib-dia">Día de cobro de la nómina</label>
          <input id="ib-dia" type="number" min="1" max="31" value="${h.diaCobro || state.ajustes.diaCobro || 1}" /></div>
        <div class="field"><label for="ib-auto">Nómina automática</label>
          <select id="ib-auto">
            <option value="1" ${h.autoNomina ? 'selected' : ''}>Sí, añadir nómina y pagas</option>
            <option value="0" ${!h.autoNomina ? 'selected' : ''}>No, registrar ingresos a mano</option>
          </select></div>
      </div>
      <p class="hint">Al guardar, este saldo será el nuevo punto de partida e incluirá los movimientos ya registrados hasta hoy. Los posteriores se aplican automáticamente.</p>
      <button class="card-link" id="ib-registrar" type="button">Registrar valores del mes ${icono('flecha', 14)}</button>
      <div class="modal-actions">
        <button class="btn secondary" id="ib-reconciliar" type="button">Reconciliar al saldo actual</button>
        <button class="btn secondary" id="ib-cancelar" type="button">Cancelar</button>
        <button class="btn" id="ib-guardar" type="button">Guardar saldo</button>
      </div>
    </div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);
  $('#ib-cancelar', overlay).onclick = cerrar;
  $('#ib-registrar', overlay).onclick = () => { cerrar(); modalRegistrar(mesActual); };
  $('#ib-reconciliar', overlay).onclick = () => {
    $('#ib-saldo', overlay).value = String(saldoCuenta(h.id).toFixed(2)).replace('.', ',');
    toast('Saldo actual cargado; pulsa Guardar para fijarlo');
  };
  $('#ib-guardar', overlay).onclick = () => {
    const saldo = parseAmount($('#ib-saldo', overlay).value);
    if (saldo == null) return toast('Introduce un saldo válido', 'error');
    const dia = Math.min(31, Math.max(1, parseInt($('#ib-dia', overlay).value, 10) || 1));
    h.saldoBase = saldo;
    h.fechaBase = hoyISO();
    h.fechaBaseTs = Date.now() - 1;
    h.diaCobro = dia;
    h.autoNomina = $('#ib-auto', overlay).value === '1';
    state.ajustes.diaCobro = dia;
    stamp(h);
    guardarEstado(); cerrar(); toast('Saldo actualizado'); render();
  };
}

function modalAjustarIbercaja() { return modalAjustarCuenta(holdingIbercaja() ? holdingIbercaja().id : null); }

/* ============ Vista: Patrimonio ============ */
function vistaPatrimonio(view) {
  view.classList.add('view-patrimonio');
  const stats = statsPatrimonio();
  const saldos = saldosActuales();
  const totalActual = saldos.total;
  const totalActivos = saldos.activos;
  const dist = distribucionCubos()
    .map((b) => ({ ...b, pct: totalActivos > 0 ? b.total / totalActivos : 0 }))
    .sort((a, b) => b.total - a.total);
  const mesActual = currentMonthKey();
  const flujo = flujoMes(mesActual);
  const comp = balancesCompartidos();
  const compRows = Object.entries(comp.saldo || {}).map(([id, saldo]) => {
    const p = personasLista().find((x) => x.id === id);
    return `<div class="money-row"><div><div class="lbl">${escapeHtml(p ? p.nombre : '—')}</div><div class="sub">${saldo > 0.004 ? 'te debe' : saldo < -0.004 ? 'le debes' : 'en paz'}</div></div><div class="val ${saldo > 0.004 ? 'pct-good' : saldo < -0.004 ? 'pct-bad' : ''}">${saldo > 0 ? '+' : saldo < 0 ? '−' : ''}${eur(Math.abs(saldo))}</div></div>`;
  }).join('');
  const serie = stats.serie;
  const ultimoMes = stats.ultimo ? stats.ultimo.month : mesActual;
  const snActual = snapPorMes(mesActual);
  const pagasPend = pagasPendientes();
  const pagaPendienteMk = pagasPend[0] || null;
  const pagaPendiente = !!pagaPendienteMk;
  const faltaMes = !snActual;
  const variacion = stats.perfMes != null ? stats.perfMes : stats.roi;
  const variacionEsMes = stats.perfMes != null;

  const chart = serie.length > 1
    ? lineaChart(serie.map((s) => s.post), serie.map((s) => `${MESES_CORTOS[+s.month.split('-')[1] - 1]} ${s.month.slice(2, 4)}`))
    : '';

  const donut = donutSVG(dist.map((b) => ({ valor: b.total, color: colorCubo(b.id) })), { size: 140, grosor: 22, valor: eur0(totalActivos), etiqueta: 'activos' });

  const leyenda = dist.map((b) => `
    <div class="pat-legend-row">
      <span class="pat-legend-dot" style="background:${colorCubo(b.id)}"></span>
      <span class="pat-legend-name">${escapeHtml(b.nombre)}</span>
      <span class="pat-legend-pct">${fmtPct(b.pct, { conSigno: false, decimales: 0 })}${b.objetivo ? ` · obj ${b.objetivo} %` : ''}</span>
    </div>`).join('');

  const cuentas = holdingsActivos().map((h) => {
    const valor = valorHolding(h.id);
    const pct = totalActivos > 0 ? valor / totalActivos : null;
    const color = colorCubo(h.cubo);
    const cubo = cuboPorId(h.cubo);
    const esEfectivo = esCuentaEfectivo(h);
    const tipo = `${esEfectivo ? 'Efectivo' : esInversion(h) ? 'Inversión' : h.tipo === 'inmueble' ? 'Inmueble' : 'Posición'} · ${h.entidad || 'Otra'}`;
    return `<button class="pat-account-row" type="button" data-open="${h.id}" aria-label="${esEfectivo ? 'Ajustar saldo de ' : 'Editar '}${escapeHtml(h.nombre)}">
      <span class="pat-account-ico" style="color:${color};background:${color}1a;border-color:${color}30">${iconoCubo(h.cubo)}</span>
      <span class="pat-account-main">
        <strong class="pat-account-name" title="${escapeHtml(h.nombre)}">${escapeHtml(h.nombre)}</strong>
        <span class="pat-account-type">${escapeHtml(tipo)}${cubo ? ' · ' + escapeHtml(cubo.nombre) : ''}</span>
        <span class="pat-account-amount">${eur(valor)}</span>
      </span>
      <span class="pat-account-pct">${pct == null ? '—' : fmtPct(pct, { conSigno: false, decimales: 0 })}</span>
      <span class="pat-account-arrow" aria-hidden="true">${esEfectivo ? icono('editar', 15) : icono('chevron', 15)}</span>
    </button>`;
  }).join('');

  const metricas = holdingsActivos().map((h) => {
    const st = statsHolding(h.id);
    const perf = perfHolding(h.id, ultimoMes);
    const tir = xirrHolding(h.id);
    const labelVar = stats.ultimo ? MESES_CORTOS[+ultimoMes.split('-')[1] - 1] : 'mes';
    return `<div class="pat-metric-row">
      <div class="pat-metric-name" title="${escapeHtml(h.nombre)}">${escapeHtml(h.nombre)}</div>
      <div class="pat-metric-values">
        <span><small>Valor</small><strong>${eur(st.valorActual)}</strong></span>
        <span><small>Aportado</small><strong>${eur(st.aportado)}</strong></span>
        <span><small>XIRR</small><strong class="${tir != null && tir >= 0 ? 'pct-good' : tir != null ? 'pct-bad' : ''}">${fmtPct(tir)}</strong></span>
        <span><small>Var. ${labelVar}</small><strong class="${perf != null && perf >= 0 ? 'pct-good' : perf != null ? 'pct-bad' : ''}">${fmtPct(perf)}</strong></span>
      </div>
    </div>`;
  }).join('');

  const deudas = (state.deudas || []).length
    ? state.deudas.map((d) => `<div class="pat-debt-row">
        <div class="pat-debt-main"><strong>${escapeHtml(d.nombre)}</strong><span>${escapeHtml(d.tipo || 'Deuda')}${d.entidad ? ' · ' + escapeHtml(d.entidad) : ''}${d.tipoInteres ? ` · ${d.tipoInteres} %` : ''}</span></div>
        <div class="pat-debt-values"><strong>${eur(d.saldo)}</strong><span>${d.cuota ? `Cuota ${eur(d.cuota)}/mes` : 'Sin cuota'}</span></div>
        <button class="icon-btn" type="button" data-deuda-edit="${d.id}" aria-label="Editar deuda">${icono('editar', 15)}</button>
        <button class="icon-btn danger" type="button" data-deuda-del="${d.id}" aria-label="Eliminar deuda">${icono('basura', 15)}</button>
      </div>`).join('')
    : '<div class="empty" style="padding:16px"><span class="big">🏦</span>Sin deudas registradas. Añade hipoteca, préstamos o tarjetas para calcular tu patrimonio neto real.</div>';

  const rebalanceo = dist.filter((b) => +b.objetivo > 0).map((b) => {
    const objetivoImporte = totalActivos * (+b.objetivo || 0) / 100;
    const delta = objetivoImporte - b.total;
    return `<div class="money-row"><div><div class="lbl">${escapeHtml(b.nombre)}</div><div class="sub">Objetivo ${b.objetivo} % · real ${(b.pct * 100).toFixed(1).replace('.', ',')} %</div></div><div class="val ${Math.abs(delta) < 1 ? 'pct-good' : 'pct-warn'}">${delta > 0 ? 'Aportar ' : delta < 0 ? 'Retirar ' : ''}${eur(Math.abs(delta))}</div></div>`;
  }).join('');

  const entidades = distribucionEntidades().map((x) => `
    <div class="money-row"><div><div class="lbl">${escapeHtml(x.entidad)}</div><div class="sub">${fmtPct(totalActivos > 0 ? x.total / totalActivos : 0, { conSigno: false, decimales: 0 })} del activo</div></div><div class="val">${eur(x.total)}</div></div>
  `).join('') || '<div class="hint">Sin posiciones.</div>';

  const clases = distribucionClases().map((x) => {
    const objetivo = +(state.plan.asignacionObjetivo || {})[x.clase] || 0;
    const desvio = objetivo > 0 ? x.pct * 100 - objetivo : null;
    return `<div class="money-row">
      <div><div class="lbl">${escapeHtml(x.clase)}</div><div class="sub">Objetivo ${objetivo} %${desvio != null ? ` · ${desvio > 0 ? '+' : ''}${desvio.toFixed(1).replace('.', ',')} pp` : ''}</div></div>
      <div class="val">${eur(x.valor)} <span class="tiny">${fmtPct(x.pct, { conSigno: false, decimales: 0 })}</span></div>
    </div>`;
  }).join('') || '<div class="hint">Sin posiciones.</div>';

  const historial = serie.slice().reverse().slice(0, 12).map((s) => {
    const idx = stats.serie.indexOf(s);
    const prev = idx > 0 ? stats.serie[idx - 1] : null;
    const perf = prev && prev.post > 0 ? (s.valor - prev.post) / prev.post : null;
    const sn = snapPorMes(s.month);
    const aportes = sn ? Object.values(sn.aportes || {}).reduce((a, b) => a + (+b || 0), 0) : 0;
    const cls = perf != null && perf >= 0 ? 'pct-good' : perf != null ? 'pct-bad' : '';
    return `<div class="pat-history-row" data-mes="${s.month}" role="button" tabindex="0" aria-label="Editar ${escapeHtml(fmtMes(s.month))}">
      <div class="pat-history-top"><strong>${fmtMes(s.month)}</strong><span>${eur0(s.post)}</span></div>
      <div class="pat-history-bottom">
        <span>Variación <strong class="${cls}">${fmtPct(perf)}</strong></span>
        <span>Aporte <strong>${eur0(aportes)}</strong></span>
      </div>
    </div>`;
  }).join('');

  view.innerHTML = `
    <header class="page-head pat-head">
      <div><span class="eyebrow">Balance y cartera</span><h1>Patrimonio</h1></div>
      <div class="page-head-actions">
        <button class="btn secondary small" id="pat-add-cuenta" type="button">${icono('mas', 15)} Cuenta</button>
        <button class="btn secondary small" id="pat-add-deuda" type="button">${icono('mas', 15)} Deuda</button>
        <button class="icon-btn pat-reg-btn" id="pat-registrar" type="button" aria-label="Registrar valores" title="Registrar valores">${icono('editar', 18)}</button>
      </div>
    </header>

    ${pagaPendiente ? `
    <div class="banner">
      <span class="banner-ico">${icono('calendario', 19)}</span>
      <div class="banner-text"><strong>Paga extra de ${fmtMes(pagaPendienteMk).toLowerCase()}</strong>${eur(+pagasConfig().importe || 0)} pendiente de aplicar a tus aportaciones.</div>
      <button class="btn small" id="pat-banner-btn" type="button">Aplicar paga</button>
    </div>` : faltaMes ? `
    <div class="banner" style="border-color:var(--border);background:var(--card)">
      <span class="banner-ico">${icono('calendario', 19)}</span>
      <div class="banner-text"><strong>${fmtMes(mesActual)} sin registrar</strong>Añade los valores del día 1 para mantener actualizado tu patrimonio.</div>
      <button class="btn secondary small" id="pat-banner-btn" type="button">Registrar</button>
    </div>` : ''}

    <div class="pat-layout">
      <div class="stack">
        <section class="card pat-total">
          <span class="pat-total-label">Patrimonio neto</span>
          <div class="pat-total-value">${eur(totalActual)}</div>
          <div class="pat-total-trend ${variacion == null ? 'neutral' : variacion < 0 ? 'negative' : 'positive'}">
            ${variacion != null ? `<span class="trend-mark" aria-hidden="true">${variacion < 0 ? '▼' : '▲'}</span>` : ''}
            <strong>${variacion == null ? '—' : fmtPct(variacion, { decimales: 1 })}</strong>
            <span>${variacionEsMes ? 'desde el último registro' : variacion != null ? 'desde el inicio' : 'sin datos'}</span>
          </div>
          <div class="pat-net-breakdown">
            <div><span>Activos</span><strong>${eur(saldos.activos)}</strong></div>
            <div><span>Por cobrar</span><strong class="pct-good">${eur(saldos.porCobrar)}</strong></div>
            <div><span>Por pagar</span><strong class="pct-bad">${eur(saldos.porPagar)}</strong></div>
            <div><span>Deudas</span><strong class="pct-bad">${eur(saldos.deudas)}</strong></div>
          </div>
        </section>

        <section class="card pat-dist-card" aria-label="Distribución del patrimonio">
          <div class="card-head"><div><h2>Distribución</h2><p>Sobre activos, no sobre patrimonio neto</p></div></div>
          <div class="pat-dist">
            <div class="pat-donut">${donut}</div>
            <div class="pat-legend">${leyenda || '<span class="pat-legend-empty">Sin posiciones registradas.</span>'}</div>
          </div>
        </section>
      </div>

      <div class="stack">
        <section class="card pat-accounts-card" aria-label="Cuentas y patrimonio">
          <div class="card-head"><div><h2>Cuentas y posiciones</h2><p>Toca una cuenta de efectivo para conciliar su saldo</p></div></div>
          <div class="pat-account-list">${cuentas || '<div class="empty">Añade posiciones en Ajustes para empezar.</div>'}</div>
        </section>
      </div>
    </div>

    <section class="card" style="margin-top:16px">
      <div class="card-head">
        <div><h2>Deudas</h2><p>Hipoteca, préstamos, tarjetas y compras a plazos</p></div>
        <button class="btn secondary small" id="pat-add-deuda-2" type="button">${icono('mas', 15)} Añadir deuda</button>
      </div>
      <div class="pat-debt-list">${deudas}</div>
    </section>

    <details class="pat-more">
      <summary class="pat-more-summary">
        <span class="pat-more-summary-main"><strong>Historial y detalles</strong><span>Evolución, rentabilidad, flujo, entidades y cartera</span></span>
        ${icono('chevron', 16)}
      </summary>
      <div class="pat-more-body">
        <div class="pat-more-links">
          <button class="card-link" data-nav="analisis" type="button">Ver análisis ${icono('flecha', 14)}</button>
          <button class="card-link" data-nav="objetivos" type="button">Ver objetivos ${icono('flecha', 14)}</button>
          <button class="card-link" data-nav="plan" type="button">Ver plan ${icono('flecha', 14)}</button>
        </div>

        <section class="card">
          <div class="card-head">
            <div><h2>Evolución</h2><p>Patrimonio registrado mes a mes · el último punto usa el saldo actual</p></div>
            ${stats.perfMes != null ? `<span class="pill ${stats.perfMes >= 0 ? 'good' : 'bad'}">${fmtPct(stats.perfMes)} último mes</span>` : ''}
          </div>
          ${chart ? `<div class="chart-wrap">${chart}</div>` : '<div class="empty" style="padding:18px"><span class="big">📈</span>Registra al menos dos meses para ver la evolución.</div>'}
        </section>

        <section class="card">
          <div class="card-head">
            <div><h2>Rentabilidad por posición</h2><p>XIRR = rentabilidad anual ponderada por dinero y tiempo · toca una cuenta para editar</p></div>
          </div>
          <div class="pat-metrics">${metricas || '<div class="empty">Sin posiciones registradas.</div>'}</div>
        </section>

        <section class="card">
          <div class="card-head"><div><h2>Flujo del mes</h2><p>Ingresos, gastos, inversión y tasa de ahorro</p></div></div>
          <div class="stat-grid two">
            <div class="stat"><div class="label">Ingresos</div><div class="value">${eur(flujo.ingresos.total)}</div><div class="hint">Nómina ${eur0(flujo.ingresos.nomina)}${flujo.ingresos.paga ? ` · paga ${eur0(flujo.ingresos.paga)}` : ''}${flujo.ingresos.otros ? ` · otros ${eur0(flujo.ingresos.otros)}` : ''}</div></div>
            <div class="stat"><div class="label">Gastos</div><div class="value">${eur(flujo.gastos)}</div><div class="hint">${flujo.ingresos.total > 0 ? fmtPct(flujo.gastos / flujo.ingresos.total, { conSigno: false, decimales: 0 }) + ' de los ingresos' : 'sin ingresos registrados'}</div></div>
            <div class="stat"><div class="label">Ahorro e inversión</div><div class="value">${eur(flujo.aportes)}</div><div class="hint">Aportaciones y movimientos de inversión</div></div>
            <div class="stat"><div class="label">Tasa de ahorro</div><div class="value ${flujo.tasaAhorro != null && flujo.tasaAhorro >= 0.2 ? 'pct-good' : flujo.tasaAhorro != null && flujo.tasaAhorro < 0 ? 'pct-bad' : ''}">${fmtPct(flujo.tasaAhorro, { conSigno: false, decimales: 1 })}</div><div class="hint">${flujo.ahorro >= 0 ? `Sobra ${eur(flujo.ahorro)} antes de invertir` : `Déficit ${eur(-flujo.ahorro)}`}</div></div>
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div><h2>Por entidad</h2><p>Dónde está el dinero ahora mismo</p></div></div>
          ${entidades}
          <div class="money-total"><span>Activos</span><strong>${eur(saldos.activos)}</strong></div>
        </section>

        <section class="card">
          <div class="card-head"><div><h2>Por clase de activo</h2><p>Comparación con tu asignación objetivo</p></div><button class="card-link" data-nav="plan" type="button">Editar objetivo ${icono('chevron', 13)}</button></div>
          ${clases}
        </section>

        <section class="card">
          <div class="card-head"><div><h2>Rebalanceo por espacio</h2><p>Cuánto te falta o sobra para tu reparto objetivo</p></div><button class="card-link" data-nav="ajustes" type="button">Editar espacios ${icono('chevron', 13)}</button></div>
          ${rebalanceo || '<div class="hint">Define porcentajes objetivo en Ajustes → Reparto objetivo del patrimonio.</div>'}
        </section>

        <section class="card">
          <div class="card-head"><div><h2>Compartidos</h2><p>Derechos de cobro y obligaciones con otras personas</p></div><button class="card-link" data-nav="compartidos" type="button">Abrir ${icono('chevron', 13)}</button></div>
          ${compRows || '<div class="hint">Sin saldos pendientes.</div>'}
          <div class="money-total"><span>Neto</span><strong class="${comp.neto >= 0 ? 'pct-good' : 'pct-bad'}">${comp.neto >= 0 ? '+' : '−'}${eur(Math.abs(comp.neto))}</strong></div>
        </section>

        <section class="card">
          <div class="card-head"><div><h2>Mes a mes</h2><p>Últimos 12 registros</p></div></div>
          <div class="pat-history">${historial || '<div class="hint">Todavía no hay registros.</div>'}</div>
        </section>
      </div>
    </details>
  `;

  cablearNavegacion(view);
  const reg = $('#pat-registrar');
  if (reg) reg.onclick = () => modalRegistrar(mesActual);
  const addCuenta = $('#pat-add-cuenta');
  if (addCuenta) addCuenta.onclick = () => modalCuenta();
  const addDeuda = $('#pat-add-deuda');
  if (addDeuda) addDeuda.onclick = () => modalDeuda();
  const addDeuda2 = $('#pat-add-deuda-2');
  if (addDeuda2) addDeuda2.onclick = () => modalDeuda();
  const bannerBtn = $('#pat-banner-btn');
  if (bannerBtn) bannerBtn.onclick = () => pagaPendiente ? aplicarPaga(pagaPendienteMk || mesActual) : modalRegistrar(mesActual);
  view.querySelectorAll('[data-open]').forEach((el) => {
    el.onclick = () => {
      const hid = el.dataset.open;
      const h = holdingPorId(hid);
      if (!h) return;
      if (esCuentaEfectivo(h)) modalAjustarCuenta(hid);
      else modalEditarPosicion(hid);
    };
  });
  view.querySelectorAll('[data-deuda-edit]').forEach((b) => {
    b.onclick = () => modalDeuda(b.dataset.deudaEdit);
  });
  view.querySelectorAll('[data-deuda-del]').forEach((b) => {
    b.onclick = () => {
      const d = deudaPorId(b.dataset.deudaDel);
      if (!d) return;
      if (!confirm(`¿Eliminar la deuda «${d.nombre}»?`)) return;
      tumba('deudas', d.id);
      state.deudas = state.deudas.filter((x) => x.id !== d.id);
      guardarEstado(); toast('Deuda eliminada'); render();
    };
  });
  view.querySelectorAll('[data-mes]').forEach((el) => {
    el.onclick = () => modalRegistrar(el.dataset.mes);
  });
}

/* ============ Modales de cuentas, posiciones y deudas ============ */
function modalCuenta(hid = null) {
  const h = hid ? holdingPorId(hid) : null;
  const esNueva = !h;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  const cubos = state.cubos.map((c) => `<option value="${c.id}" ${h && h.cubo === c.id ? 'selected' : ''}>${escapeHtml(c.nombre)}</option>`).join('');
  overlay.innerHTML = `
    <div class="modal">
      <h3>${esNueva ? 'Nueva cuenta o posición' : 'Editar posición'}</h3>
      <div class="form-card">
        <div class="field"><label for="cta-nombre">Nombre</label>
          <input id="cta-nombre" type="text" value="${h ? escapeHtml(h.nombre) : ''}" placeholder="Ej.: Cuenta remunerada MyInvestor" /></div>
        <div class="field-row">
          <div class="field"><label for="cta-entidad">Entidad</label>
            <input id="cta-entidad" type="text" value="${h ? escapeHtml(h.entidad || '') : ''}" placeholder="Ej.: MyInvestor" /></div>
          <div class="field"><label for="cta-tipo">Tipo</label>
            <select id="cta-tipo">
              ${[['efectivo', 'Efectivo / cuenta'], ['inversion', 'Inversión'], ['inmueble', 'Inmueble'], ['otro', 'Otro']].map(([v, t]) => `<option value="${v}" ${h && h.tipo === v ? 'selected' : (!h && v === 'efectivo' ? 'selected' : '')}>${t}</option>`).join('')}
            </select></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="cta-clase">Clase de activo</label>
            <select id="cta-clase">
              ${[['efectivo', 'Efectivo'], ['rentaVariable', 'Renta variable'], ['rentaFija', 'Renta fija'], ['cripto', 'Cripto'], ['inmueble', 'Inmueble'], ['otro', 'Otro']].map(([v, t]) => `<option value="${v}" ${h && h.clase === v ? 'selected' : ''}>${t}</option>`).join('')}
            </select></div>
          <div class="field"><label for="cta-cubo">Espacio / objetivo</label>
            <select id="cta-cubo">${cubos}</select></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="cta-plan">Aportación planificada (€/mes)</label>
            <input id="cta-plan" type="text" inputmode="decimal" value="${h ? String(h.plan || 0).replace('.', ',') : '0'}" /></div>
          <div class="field"><label for="cta-moneda">Moneda</label>
            <input id="cta-moneda" type="text" value="${h ? escapeHtml(h.moneda || 'EUR') : 'EUR'}" maxlength="3" /></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="cta-saldo">Saldo base / valor inicial (€)</label>
            <input id="cta-saldo" type="text" inputmode="decimal" value="${h ? String(h.saldoBase != null ? h.saldoBase : 0).replace('.', ',') : '0'}" /></div>
          <div class="field"><label for="cta-fecha">Fecha del saldo base</label>
            <input id="cta-fecha" type="date" value="${h && h.fechaBase ? h.fechaBase : hoyISO()}" /></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="cta-auto">Nómina automática</label>
            <select id="cta-auto">
              <option value="0" ${!h || !h.autoNomina ? 'selected' : ''}>No</option>
              <option value="1" ${h && h.autoNomina ? 'selected' : ''}>Sí (solo cuentas de efectivo)</option>
            </select></div>
          <div class="field"><label for="cta-dia">Día de cobro</label>
            <input id="cta-dia" type="number" min="1" max="31" value="${h && h.diaCobro ? h.diaCobro : (state.ajustes.diaCobro || 1)}" /></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="cta-isin">ISIN / ticker</label>
            <input id="cta-isin" type="text" value="${h ? escapeHtml(h.isin || '') : ''}" placeholder="IE00BK5BQT80" /></div>
          <div class="field"><label for="cta-comision">Comisión anual (%)</label>
            <input id="cta-comision" type="text" inputmode="decimal" value="${h ? String(h.comision || 0).replace('.', ',') : '0,20'}" /></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="cta-unidades">Unidades</label>
            <input id="cta-unidades" type="text" inputmode="decimal" value="${h ? String(h.unidades || 0).replace('.', ',') : '0'}" /></div>
          <div class="field"><label for="cta-precio">Precio por unidad (€)</label>
            <input id="cta-precio" type="text" inputmode="decimal" value="${h ? String(h.precio || 0).replace('.', ',') : '0'}" /></div>
        </div>
        <p class="hint">En cuentas de efectivo, el saldo se deriva del saldo base más nóminas, gastos, bizums, compartidos y traspasos. En inversión, si rellenas unidades y precio se usa el valor de mercado; si no, se usa el último registro mensual.</p>
      </div>
      <div class="modal-actions">
        ${h ? '<button class="btn danger" id="cta-archivar" type="button">Archivar</button>' : ''}
        <button class="btn secondary" id="cta-cancel" type="button">Cancelar</button>
        <button class="btn" id="cta-save" type="button">${esNueva ? 'Crear' : 'Guardar'}</button>
      </div>
    </div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);
  $('#cta-cancel', overlay).onclick = cerrar;
  if (h) $('#cta-archivar', overlay).onclick = () => {
    if (!confirm(`¿Archivar «${h.nombre}»? Su historial se conserva y deja de contar en el patrimonio actual.`)) return;
    h.archivada = true;
    h.activa = false;
    stamp(h);
    guardarEstado(); cerrar(); toast('Posición archivada'); render();
  };
  $('#cta-save', overlay).onclick = () => {
    const nombre = $('#cta-nombre', overlay).value.trim();
    if (!nombre) return toast('Ponle un nombre', 'error');
    const datos = {
      nombre,
      entidad: $('#cta-entidad', overlay).value.trim() || 'Otra',
      tipo: $('#cta-tipo', overlay).value,
      clase: $('#cta-clase', overlay).value,
      cubo: $('#cta-cubo', overlay).value,
      plan: Math.max(0, parseAmount($('#cta-plan', overlay).value) ?? 0),
      moneda: ($('#cta-moneda', overlay).value.trim() || 'EUR').toUpperCase().slice(0, 3),
      saldoBase: parseAmount($('#cta-saldo', overlay).value) ?? 0,
      fechaBase: $('#cta-fecha', overlay).value || hoyISO(),
      autoNomina: $('#cta-auto', overlay).value === '1',
      diaCobro: Math.min(31, Math.max(1, parseInt($('#cta-dia', overlay).value, 10) || 1)),
      isin: $('#cta-isin', overlay).value.trim(),
      comision: Math.max(0, parseAmount($('#cta-comision', overlay).value) ?? 0),
      unidades: Math.max(0, parseAmount($('#cta-unidades', overlay).value) ?? 0),
      precio: Math.max(0, parseAmount($('#cta-precio', overlay).value) ?? 0),
    };
    if (h) Object.assign(h, datos);
    else state.holdings.push({ id: uid(), ...datos });
    stamp(h || state.holdings[state.holdings.length - 1]);
    guardarEstado(); cerrar(); toast(esNueva ? 'Cuenta creada' : 'Posición actualizada'); render();
  };
}

function modalEditarPosicion(hid) { return modalCuenta(hid); }

function modalDeuda(id = null) {
  const d = id ? deudaPorId(id) : null;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>${d ? 'Editar deuda' : 'Nueva deuda'}</h3>
      <div class="form-card">
        <div class="field"><label for="deu-nombre">Nombre</label>
          <input id="deu-nombre" type="text" value="${d ? escapeHtml(d.nombre) : ''}" placeholder="Ej.: Hipoteca vivienda" /></div>
        <div class="field-row">
          <div class="field"><label for="deu-tipo">Tipo</label>
            <select id="deu-tipo">
              ${[['hipoteca', 'Hipoteca'], ['prestamo', 'Préstamo'], ['tarjeta', 'Tarjeta'], ['otro', 'Otra']].map(([v, t]) => `<option value="${v}" ${d && d.tipo === v ? 'selected' : ''}>${t}</option>`).join('')}
            </select></div>
          <div class="field"><label for="deu-entidad">Entidad</label>
            <input id="deu-entidad" type="text" value="${d ? escapeHtml(d.entidad || '') : ''}" placeholder="Ej.: Ibercaja" /></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="deu-saldo">Saldo pendiente (€)</label>
            <input id="deu-saldo" type="text" inputmode="decimal" value="${d ? String(d.saldo || 0).replace('.', ',') : '0'}" /></div>
          <div class="field"><label for="deu-interes">Tipo de interés (%)</label>
            <input id="deu-interes" type="text" inputmode="decimal" value="${d ? String(d.tipoInteres || 0).replace('.', ',') : '0'}" /></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="deu-cuota">Cuota mensual (€)</label>
            <input id="deu-cuota" type="text" inputmode="decimal" value="${d ? String(d.cuota || 0).replace('.', ',') : '0'}" /></div>
          <div class="field"><label for="deu-plazo">Plazo restante (meses)</label>
            <input id="deu-plazo" type="number" min="0" value="${d ? d.plazoMeses || 0 : 0}" /></div>
        </div>
        <div class="field"><label for="deu-notas">Notas</label>
          <input id="deu-notas" type="text" value="${d ? escapeHtml(d.notas || '') : ''}" placeholder="Opcional" /></div>
        <p class="hint">Las deudas se restan del patrimonio neto. Si registras un pago de deuda como movimiento, reduce el saldo pendiente y la cuenta de efectivo.</p>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" id="deu-cancel" type="button">Cancelar</button>
        <button class="btn" id="deu-save" type="button">${d ? 'Guardar' : 'Crear'}</button>
      </div>
    </div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);
  $('#deu-cancel', overlay).onclick = cerrar;
  $('#deu-save', overlay).onclick = () => {
    const nombre = $('#deu-nombre', overlay).value.trim();
    if (!nombre) return toast('Ponle un nombre', 'error');
    const datos = {
      nombre,
      tipo: $('#deu-tipo', overlay).value,
      entidad: $('#deu-entidad', overlay).value.trim(),
      saldo: Math.max(0, parseAmount($('#deu-saldo', overlay).value) ?? 0),
      tipoInteres: Math.max(0, parseAmount($('#deu-interes', overlay).value) ?? 0),
      cuota: Math.max(0, parseAmount($('#deu-cuota', overlay).value) ?? 0),
      plazoMeses: Math.max(0, parseInt($('#deu-plazo', overlay).value, 10) || 0),
      notas: $('#deu-notas', overlay).value.trim(),
    };
    if (d) Object.assign(d, datos);
    else state.deudas.push({ id: uid(), ...datos });
    stamp(d || state.deudas[state.deudas.length - 1]);
    guardarEstado(); cerrar(); toast(d ? 'Deuda actualizada' : 'Deuda creada'); render();
  };
}


/* ============ Vista: Plan financiero ============ */
function planConfig() { return state.plan; }

function gastoMensualReferencia() {
  const p = +state.plan.gastoMensual || 0;
  if (p > 0) return p;
  const meses = [0, 1, 2].map((i) => addMonths(currentMonthKey(), -i));
  const vals = meses.map((mk) => totalGastado(mk)).filter((v) => v > 0);
  if (vals.length) return vals.reduce((a, b) => a + b, 0) / vals.length;
  return presupuestoTotalMes(currentMonthKey()) || 250;
}

function resumenPlan() {
  const p = state.plan;
  const ingresoMensual = +state.ajustes.ingreso || 0;
  const paga = pagasConfig();
  const numeroPagas = paga.activo ? Math.min(Math.max(+paga.numero || 2, 1), 2) : 0;
  const pagasAnuales = paga.activo ? (+paga.importe || 0) * numeroPagas : 0;
  const gastoMensual = gastoMensualReferencia();
  const ingresoAnual = ingresoMensual * 12 + pagasAnuales;
  const gastoAnual = gastoMensual * 12;
  const ahorroAnual = ingresoAnual - gastoAnual;
  const ahorroMensual = ingresoMensual - gastoMensual;
  const tasaAhorro = ingresoAnual > 0 ? ahorroAnual / ingresoAnual : null;
  const saldos = saldosActuales();
  const mesesColchon = gastoMensual > 0 ? saldos.colchon / gastoMensual : null;
  const fire = fireNumber(gastoAnual, p.tasaRetirada);
  const aniosFire = aniosHastaFIRE({
    patrimonio: saldos.total,
    aportacionMensual: Math.max(0, ahorroMensual + pagasAnuales / 12),
    rentabilidadAnualPct: p.rentabilidadCartera,
    gastoAnual,
    tasaRetiradaPct: p.tasaRetirada,
  });
  return {
    p,
    ingresoMensual,
    pagasAnuales,
    numeroPagas,
    ingresoAnual,
    gastoMensual,
    gastoAnual,
    ahorroMensual,
    ahorroAnual,
    tasaAhorro,
    saldos,
    patrimonio: saldos.total,
    colchon: saldos.colchon,
    mesesColchon,
    fire,
    aniosFire,
    edadFire: aniosFire != null ? (+p.edadActual || 0) + aniosFire : null,
    deudas: saldos.deudas,
  };
}

function proyeccionPlan(anios = 30) {
  const r = resumenPlan();
  const p = r.p;
  return proyeccionCompuesta({
    capitalInicial: r.patrimonio,
    aportacionMensual: Math.max(0, r.ahorroMensual),
    aportacionAnual: Math.max(0, r.pagasAnuales),
    rentabilidadAnualPct: p.rentabilidadCartera,
    inflacionPct: p.inflacion,
    anios,
    crecimientoAportacionPct: p.crecimientoSalarial,
    comisionAnualPct: p.comisionCartera,
    impuestoGananciasPct: p.impuestoAhorro ? 0.19 : 0,
  });
}

function comparativaPlanes(anios = 30) {
  const r = resumenPlan();
  const p = r.p;
  const base = {
    capitalInicial: r.patrimonio,
    aportacionMensual: Math.max(0, r.ahorroMensual),
    aportacionAnual: Math.max(0, r.pagasAnuales),
    inflacionPct: p.inflacion,
    anios,
    crecimientoAportacionPct: p.crecimientoSalarial,
    impuestoGananciasPct: p.impuestoAhorro ? 0.19 : 0,
  };
  const planes = [
    { nombre: 'Solo cuenta remunerada', rentabilidad: p.rentabilidadCuenta, comision: 0, color: '#60a5fa' },
    { nombre: 'Mixto 30 % cartera / 70 % cuenta', rentabilidad: 0.3 * p.rentabilidadCartera + 0.7 * p.rentabilidadCuenta, comision: 0.3 * p.comisionCartera, color: '#a78bfa' },
    { nombre: '50 / 50', rentabilidad: 0.5 * p.rentabilidadCartera + 0.5 * p.rentabilidadCuenta, comision: 0.5 * p.comisionCartera, color: '#f5c451' },
    { nombre: '100 % cartera indexada', rentabilidad: p.rentabilidadCartera, comision: p.comisionCartera, color: '#2eea8b' },
  ];
  return planes.map((x) => {
    const serie = proyeccionCompuesta({ ...base, rentabilidadAnualPct: x.rentabilidad, comisionAnualPct: x.comision });
    const ultimo = serie[serie.length - 1] || { nominal: r.patrimonio, real: r.patrimonio, neto: r.patrimonio };
    return { ...x, serie, final: ultimo.nominal, real: ultimo.real, neto: ultimo.neto };
  });
}

function casaResumen() {
  const p = state.plan;
  const h = p.hipoteca;
  const oc = state.ajustes.objetivoCasa || {};
  const v = datosVivienda();
  const ingresoMensual = (+state.ajustes.ingreso || 0) + (+h.ingresoPareja || 0);
  const cuotaMax = ingresoMensual * 0.35;
  const i = (+h.tipo || 0) / 100 / 12;
  const n = Math.max(1, Math.round((+h.plazo || 30) * 12));
  const capitalMax = i > 0 ? cuotaMax * (1 - Math.pow(1 + i, -n)) / i : cuotaMax * n;
  const precio = +oc.precio || +h.precio || 0;
  const entrada = oc.pctEntrada != null ? +oc.pctEntrada : (+h.entrada || 20);
  const gastos = oc.pctGastos != null ? +oc.pctGastos : (+h.gastos || 11);
  const fecha = oc.fechaObjetivo || h.fecha || null;
  const precioMaxHipoteca = capitalMax / Math.max(0.01, 1 - entrada / 100);
  const saldos = saldosActuales();
  const efectivoBruto = saldos.vivienda + saldos.colchon + (+h.ahorroPareja || 0);
  const efectivo = Math.max(0, efectivoBruto - (+h.colchon || 0));
  const precioMaxEfectivo = efectivo / Math.max(0.01, (entrada + gastos) / 100);
  const precioMax = Math.min(precioMaxHipoteca, precioMaxEfectivo);
  const hipoteca = precio * Math.max(0, 1 - entrada / 100);
  const cuota = cuotaHipoteca(hipoteca, h.tipo, h.plazo);
  const dti = ingresoMensual > 0 ? cuota / ingresoMensual : null;
  const cashNeeded = precio * ((entrada + gastos) / 100);
  const faltan = Math.max(0, cashNeeded - efectivo);
  const meses = (v.aporteMes || 0) > 0 ? faltan / v.aporteMes : null;
  const llegada = meses != null ? addMonths(currentMonthKey(), Math.ceil(meses)) : null;
  const stressCuota = cuotaHipoteca(hipoteca, (+h.tipo || 0) + 2, h.plazo);
  const stressDti = ingresoMensual > 0 ? stressCuota / ingresoMensual : null;
  const intereses = interesesHipoteca(hipoteca, h.tipo, h.plazo);
  const totalPagado = cuota * Math.max(1, Math.round((+h.plazo || 30) * 12)) + cashNeeded;
  const alquiler = Math.max(0, +h.alquiler || 0);
  const diferenciaAlquiler = cuota - alquiler;
  const mesesHastaFecha = fecha ? Math.max(monthsBetween(currentMonthKey(), fecha), 0) : null;
  const proyectado = mesesHastaFecha != null
    ? saldos.vivienda + Math.max(0, saldos.colchon - (+h.colchon || 0)) + (+h.ahorroPareja || 0) + v.aporteMes * mesesHastaFecha
    : null;
  const onTrack = proyectado != null ? proyectado >= cashNeeded : efectivo >= cashNeeded;
  return {
    p, h, v, ingresoMensual, cuotaMax, capitalMax, precioMaxHipoteca, precioMaxEfectivo,
    efectivo, efectivoBruto, precioMax, precio, entrada, gastos, hipoteca, cuota, dti, cashNeeded, faltan, meses, llegada,
    stressCuota, stressDti, intereses, totalPagado, alquiler, diferenciaAlquiler, onTrack, proyectado, mesesHastaFecha, fecha,
  };
}

function impuestosResumen() {
  const p = state.plan;
  const r = resumenPlan();
  const proy = proyeccionPlan(30);
  const ultimo = proy[proy.length - 1] || { ganancias: 0, nominal: 0 };
  const impuestoPlusvalias = irpfAhorro(ultimo.ganancias);
  const interesesCuenta = Math.max(0, r.saldos.efectivo) * (p.rentabilidadCuenta / 100);
  const impuestoIntereses = irpfAhorro(interesesCuenta);
  return {
    proy, ultimo, impuestoPlusvalias, interesesCuenta, impuestoIntereses,
    netoPlusvalias: Math.max(0, ultimo.ganancias - impuestoPlusvalias),
    netoIntereses: Math.max(0, interesesCuenta - impuestoIntereses),
  };
}

function reconciliarCuentasAuto() {
  for (const h of holdingsActivos()) {
    if (!h.autoNomina) continue;
    const actual = saldoCuenta(h.id);
    h.saldoBase = actual;
    h.fechaBase = hoyISO();
    stamp(h);
  }
}

function vistaPlan(view) {
  view.classList.add('view-plan');
  const r = resumenPlan();
  const p = r.p;
  const proy = proyeccionPlan(30);
  const planes = comparativaPlanes(30);
  const casa = casaResumen();
  const imp = impuestosResumen();
  const primas = (state.seguros || []).reduce((a, x) => a + (+x.primaAnual || 0), 0);
  const aniosJub = Math.max(0, (+p.edadJubilacion || 67) - (+p.edadActual || 22));
  const proyJub = proyeccionPlan(aniosJub);
  const capitalJub = proyJub.length ? proyJub[proyJub.length - 1].nominal : r.patrimonio;
  const capitalJubReal = proyJub.length ? proyJub[proyJub.length - 1].real : r.patrimonio;
  const fireCubre = capitalJubReal >= r.fire;
  const labels = proy.map((x) => `${x.anio}a`);
  const chart = lineaChart(proy.map((x) => x.nominal), labels, { color: '#2eea8b' });
  const filas = [1, 5, 10, 15, 20, 25, 30].map((a) => {
    const x = proy[a - 1] || proy[proy.length - 1];
    if (!x) return '';
    return `<tr><td>${a} años</td><td>${eur0(x.aportado)}</td><td>${eur0(x.nominal)}</td><td>${eur0(x.real)}</td><td>${eur0(x.ganancias)}</td><td>${eur0(x.neto)}</td></tr>`;
  }).join('');
  const filasPlanes = planes.map((x) => `<tr>
    <td><span class="plan-dot" style="background:${x.color}"></span>${escapeHtml(x.nombre)}</td>
    <td>${eur0(x.final)}</td>
    <td>${eur0(x.real)}</td>
    <td>${eur0(x.neto)}</td>
  </tr>`).join('');

  const objetivoClases = state.plan.asignacionObjetivo || {};
  const clasesActuales = distribucionClases();
  const filasClases = clasesActuales.map((x) => {
    const obj = +objetivoClases[x.clase] || 0;
    const desvio = x.pct * 100 - obj;
    return `<div class="money-row">
      <div><div class="lbl">${escapeHtml(x.clase)}</div><div class="sub">Objetivo ${obj} % · real ${(x.pct * 100).toFixed(1).replace('.', ',')} %</div></div>
      <div class="val ${Math.abs(desvio) > 5 ? 'pct-warn' : 'pct-good'}">${desvio > 0 ? '+' : ''}${desvio.toFixed(1).replace('.', ',')} pp</div>
    </div>`;
  }).join('') || '<div class="hint">Sin posiciones.</div>';

  view.innerHTML = `
    <div class="plan-page">
      <header class="page-head">
        <div><span class="eyebrow">Estrategia</span><h1>Plan financiero</h1><p class="page-sub">Tus supuestos, tu proyección y las decisiones importantes en un solo sitio.</p></div>
        <div class="page-head-actions">
          <button class="btn secondary small" id="plan-export-csv" type="button">${icono('descargar', 15)} CSV movimientos</button>
          <button class="btn secondary small" id="plan-print" type="button">${icono('editar', 15)} Imprimir</button>
        </div>
      </header>

      <div class="stat-grid plan-kpis">
        <div class="stat"><div class="label">Tasa de ahorro</div><div class="value ${r.tasaAhorro != null && r.tasaAhorro >= 0.2 ? 'pct-good' : 'pct-bad'}">${fmtPct(r.tasaAhorro, { conSigno: false, decimales: 1 })}</div><div class="hint">${eur(r.ahorroAnual)}/año · ${eur(r.ahorroMensual)}/mes</div></div>
        <div class="stat"><div class="label">Patrimonio neto</div><div class="value">${eur0(r.patrimonio)}</div><div class="hint">${r.deudas > 0 ? `Deudas ${eur0(r.deudas)}` : 'Sin deudas registradas'}</div></div>
        <div class="stat"><div class="label">Colchón</div><div class="value ${r.mesesColchon != null && r.mesesColchon >= p.colchonMeses ? 'pct-good' : 'pct-bad'}">${r.mesesColchon == null ? '—' : r.mesesColchon.toFixed(1).replace('.', ',') + ' meses'}</div><div class="hint">${eur0(r.colchon)} · objetivo ${p.colchonMeses} meses</div></div>
        <div class="stat"><div class="label">Número FIRE</div><div class="value">${eur0(r.fire)}</div><div class="hint">${r.aniosFire == null ? 'Sin fecha con estos supuestos' : `${r.aniosFire} años · edad ${r.edadFire}`}</div></div>
      </div>

      <section class="card">
        <div class="card-head"><div><h2>Supuestos</h2><p>Lo que la app usa para proyectar. Cambia y todo se recalcula.</p></div></div>
        <div class="form-grid">
          <div class="field"><label for="pl-ingreso">Ingreso neto mensual (€)</label><input id="pl-ingreso" data-ajuste-ingreso type="text" inputmode="decimal" value="${String(r.ingresoMensual).replace('.', ',')}" /></div>
          <div class="field"><label for="pl-gasto">Gasto mensual del plan (€)</label><input id="pl-gasto" data-plan="gastoMensual" type="text" inputmode="decimal" value="${String(p.gastoMensual || 0).replace('.', ',')}" /></div>
          <div class="field"><label for="pl-crec">Crecimiento salarial (%/año)</label><input id="pl-crec" data-plan="crecimientoSalarial" type="text" inputmode="decimal" value="${String(p.crecimientoSalarial).replace('.', ',')}" /></div>
          <div class="field"><label for="pl-infl">Inflación (%)</label><input id="pl-infl" data-plan="inflacion" type="text" inputmode="decimal" value="${String(p.inflacion).replace('.', ',')}" /></div>
          <div class="field"><label for="pl-rc">Rentabilidad cartera (%)</label><input id="pl-rc" data-plan="rentabilidadCartera" type="text" inputmode="decimal" value="${String(p.rentabilidadCartera).replace('.', ',')}" /></div>
          <div class="field"><label for="pl-rcta">Rentabilidad cuenta (%)</label><input id="pl-rcta" data-plan="rentabilidadCuenta" type="text" inputmode="decimal" value="${String(p.rentabilidadCuenta).replace('.', ',')}" /></div>
          <div class="field"><label for="pl-com">Comisión cartera (%/año)</label><input id="pl-com" data-plan="comisionCartera" type="text" inputmode="decimal" value="${String(p.comisionCartera).replace('.', ',')}" /></div>
          <div class="field"><label for="pl-edad">Edad actual</label><input id="pl-edad" data-plan="edadActual" type="number" min="0" max="100" value="${p.edadActual}" /></div>
          <div class="field"><label for="pl-jub">Edad de jubilación</label><input id="pl-jub" data-plan="edadJubilacion" type="number" min="0" max="100" value="${p.edadJubilacion}" /></div>
          <div class="field"><label for="pl-tasa">Tasa de retirada (%)</label><input id="pl-tasa" data-plan="tasaRetirada" type="text" inputmode="decimal" value="${String(p.tasaRetirada).replace('.', ',')}" /></div>
          <div class="field"><label for="pl-colchon">Colchón objetivo (meses)</label><input id="pl-colchon" data-plan="colchonMeses" type="number" min="0" max="36" value="${p.colchonMeses}" /></div>
        </div>
        <div class="card-head" style="margin-top:16px"><div><h2>Asignación objetivo</h2><p>Porcentaje de los activos que quieres en cada clase</p></div></div>
        <div class="form-grid form-grid-4">
          ${[['efectivo', 'Efectivo'], ['rentaVariable', 'Renta variable'], ['rentaFija', 'Renta fija'], ['cripto', 'Cripto']].map(([k, t]) => `<div class="field"><label>${t} (%)</label><input data-alloc="${k}" type="text" inputmode="decimal" value="${String(objetivoClases[k] || 0).replace('.', ',')}" /></div>`).join('')}
        </div>
        <div class="plan-classes">${filasClases}</div>
      </section>

      <section class="card">
        <div class="card-head"><div><h2>Proyección a 30 años</h2><p>Capital inicial ${eur0(r.patrimonio)} · aportación ${eur0(r.ahorroMensual)}/mes · pagas ${eur0(r.pagasAnuales)}/año</p></div></div>
        <div class="chart-wrap">${chart}</div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Horizonte</th><th>Aportado</th><th>Nominal</th><th>Euros de hoy</th><th>Ganancias</th><th>Neto tras impuestos</th></tr></thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
        <p class="hint">Modelo con rentabilidad constante, comisión anual, inflación y una aproximación fiscal del 19 % sobre ganancias. La realidad será irregular; no es una promesa.</p>
      </section>

      <section class="card">
        <div class="card-head"><div><h2>Comparador de planes</h2><p>Mismo esfuerzo de ahorro, distinta asignación</p></div></div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Plan</th><th>Final nominal</th><th>Euros de hoy</th><th>Neto tras impuestos</th></tr></thead>
            <tbody>${filasPlanes}</tbody>
          </table>
        </div>
      </section>

      <section class="card">
        <div class="card-head"><div><h2>Casa y hipoteca</h2><p>Capacidad de compra, cuota, esfuerzo y estrés test</p></div></div>
        <div class="form-grid">
          <div class="field"><label>Precio de la vivienda (€)</label><input data-hip="precio" type="text" inputmode="decimal" value="${String(casa.precio || 0).replace('.', ',')}" /></div>
          <div class="field"><label>Entrada (%)</label><input data-hip="entrada" type="text" inputmode="decimal" value="${String(casa.entrada || 20).replace('.', ',')}" /></div>
          <div class="field"><label>Gastos de compra (%)</label><input data-hip="gastos" type="text" inputmode="decimal" value="${String(casa.gastos || 11).replace('.', ',')}" /></div>
          <div class="field"><label>Tipo de hipoteca (%)</label><input data-hip="tipo" type="text" inputmode="decimal" value="${String(casa.h.tipo || 3.5).replace('.', ',')}" /></div>
          <div class="field"><label>Plazo (años)</label><input data-hip="plazo" type="number" min="1" max="40" value="${casa.h.plazo || 30}" /></div>
          <div class="field"><label>Ingreso neto pareja (€/mes)</label><input data-hip="ingresoPareja" type="text" inputmode="decimal" value="${String(casa.h.ingresoPareja || 0).replace('.', ',')}" /></div>
          <div class="field"><label>Ahorro pareja para entrada (€)</label><input data-hip="ahorroPareja" type="text" inputmode="decimal" value="${String(casa.h.ahorroPareja || 0).replace('.', ',')}" /></div>
          <div class="field"><label>Colchón que no tocas (€)</label><input data-hip="colchon" type="text" inputmode="decimal" value="${String(casa.h.colchon || 5000).replace('.', ',')}" /></div>
          <div class="field"><label>Alquiler equivalente (€/mes)</label><input data-hip="alquiler" type="text" inputmode="decimal" value="${String(casa.h.alquiler || 0).replace('.', ',')}" /></div>
        </div>
        <div class="stat-grid two" style="margin-top:14px">
          <div class="stat"><div class="label">Precio máximo estimado</div><div class="value">${eur0(casa.precioMax)}</div><div class="hint">Por hipoteca ${eur0(casa.precioMaxHipoteca)} · por efectivo ${eur0(casa.precioMaxEfectivo)}</div></div>
          <div class="stat"><div class="label">Cuota hipotecaria</div><div class="value">${eur(casa.cuota)}</div><div class="hint">${casa.dti == null ? 'Sin ingresos' : fmtPct(casa.dti, { conSigno: false, decimales: 0 }) + ' de ingresos'} · estrés ${eur(casa.stressCuota)} (${casa.stressDti == null ? '—' : fmtPct(casa.stressDti, { conSigno: false, decimales: 0 })})</div></div>
          <div class="stat"><div class="label">Efectivo necesario</div><div class="value">${eur0(casa.cashNeeded)}</div><div class="hint">Tienes ${eur0(casa.efectivo)} tras colchón (${eur0(casa.efectivoBruto)} bruto) · faltan ${eur0(casa.faltan)}</div></div>
          <div class="stat"><div class="label">Intereses totales</div><div class="value">${eur0(casa.intereses)}</div><div class="hint">Coste total compra + hipoteca ${eur0(casa.totalPagado)}</div></div>
          ${casa.alquiler > 0 ? `<div class="stat"><div class="label">Cuota vs alquiler</div><div class="value ${casa.diferenciaAlquiler <= 0 ? 'pct-good' : 'pct-warn'}">${casa.diferenciaAlquiler > 0 ? '+' : ''}${eur(casa.diferenciaAlquiler)}</div><div class="hint">Cuota ${eur(casa.cuota)} · alquiler ${eur(casa.alquiler)} · comparación simplificada (la compra genera patrimonio)</div></div>` : ''}
          <div class="stat"><div class="label">Llegada estimada</div><div class="value ${casa.onTrack ? 'pct-good' : 'pct-warn'}">${casa.onTrack ? 'Cubierto' : casa.llegada ? fmtMes(casa.llegada) : 'Sin aporte'}</div><div class="hint">Aporte vivienda ${eur0(casa.v.aporteMes)}/mes · fecha ${casa.fecha ? fmtMes(casa.fecha) : 'sin fecha'}${casa.proyectado != null ? ` · proyectado ${eur0(casa.proyectado)}` : ''}</div></div>
        </div>
      </section>

      <section class="card">
        <div class="card-head"><div><h2>Impuestos y comisiones</h2><p>Estimación orientativa de la fiscalidad del ahorro en España</p></div></div>
        <div class="stat-grid two">
          <div class="stat"><div class="label">Plusvalías latentes a 30 años</div><div class="value">${eur0(imp.ultimo.ganancias)}</div><div class="hint">IRPF estimado ${eur0(imp.impuestoPlusvalias)} · neto ${eur0(imp.netoPlusvalias)}</div></div>
          <div class="stat"><div class="label">Intereses anuales de la cuenta</div><div class="value">${eur0(imp.interesesCuenta)}</div><div class="hint">IRPF estimado ${eur0(imp.impuestoIntereses)} · neto ${eur0(imp.netoIntereses)}</div></div>
          <div class="stat"><div class="label">Comisión cartera</div><div class="value">${p.comisionCartera} %/año</div><div class="hint">Ya incluida en la proyección</div></div>
          <div class="stat"><div class="label">Primas de seguros</div><div class="value">${eur0(primas)}/año</div><div class="hint">${(state.seguros || []).length} seguros registrados · ${eur0(primas / 12)}/mes</div></div>
          <div class="stat"><div class="label">Fiscalidad aplicada</div><div class="value">${p.impuestoAhorro ? '19 % aprox.' : 'Sin impuestos'}</div><div class="hint">La proyección usa 19 % simplificado; el detalle aplica tramos 19 / 21 / 23 / 27 %.</div></div>
        </div>
      </section>

      <section class="card">
        <div class="card-head"><div><h2>Jubilación / FIRE</h2><p>Con tu gasto actual y la tasa de retirada elegida</p></div></div>
        <div class="stat-grid two">
          <div class="stat"><div class="label">Número FIRE</div><div class="value">${eur0(r.fire)}</div><div class="hint">Gasto anual ${eur0(r.gastoAnual)} ÷ ${p.tasaRetirada} %</div></div>
          <div class="stat"><div class="label">Años hasta FIRE</div><div class="value">${r.aniosFire == null ? '—' : r.aniosFire}</div><div class="hint">${r.edadFire == null ? 'Ajusta aportación o rentabilidad' : `Edad estimada ${r.edadFire}`}</div></div>
          <div class="stat"><div class="label">Patrimonio actual</div><div class="value">${eur0(r.patrimonio)}</div><div class="hint">${fmtPct(r.fire > 0 ? r.patrimonio / r.fire : null, { conSigno: false, decimales: 1 })} del objetivo</div></div>
          <div class="stat"><div class="label">Ahorro necesario</div><div class="value">${eur0(Math.max(0, r.ahorroMensual))}/mes</div><div class="hint">${r.ahorroMensual < 0 ? 'Déficit: recorta gasto o sube ingresos' : 'Aportación actual del plan'}</div></div>
          <div class="stat"><div class="label">Capital a los ${p.edadJubilacion} años</div><div class="value ${fireCubre ? 'pct-good' : 'pct-warn'}">${eur0(capitalJub)}</div><div class="hint">${eur0(capitalJubReal)} en euros de hoy · ${fireCubre ? 'cubre el número FIRE' : 'no llega al número FIRE'}</div></div>
        </div>
      </section>

      <section class="card">
        <div class="card-head"><div><h2>Informes</h2><p>Exporta tus datos para revisarlos o llevarlos a otro sitio</p></div></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn secondary small" id="plan-export-csv-2" type="button">${icono('descargar', 15)} Exportar movimientos CSV</button>
          <button class="btn secondary small" id="plan-print-2" type="button">${icono('editar', 15)} Imprimir plan</button>
        </div>
      </section>

      <p class="hint" style="text-align:center;margin-top:18px">Cifras orientativas, no asesoramiento financiero personalizado. Revisa los supuestos cada año.</p>
    </div>
  `;

  const guardarPlan = (clave, valor) => {
    state.plan[clave] = valor;
    state.plan.mod = Date.now();
    guardarEstado();
    render();
  };
  view.querySelectorAll('[data-plan]').forEach((el) => {
    el.addEventListener('change', () => {
      const clave = el.dataset.plan;
      const valor = parseAmount(el.value);
      if (valor == null) return toast('Valor no válido', 'error');
      guardarPlan(clave, valor);
    });
  });
  view.querySelectorAll('[data-alloc]').forEach((el) => {
    el.addEventListener('change', () => {
      const clave = el.dataset.alloc;
      const valor = parseAmount(el.value);
      if (valor == null) return toast('Valor no válido', 'error');
      state.plan.asignacionObjetivo[clave] = Math.max(0, Math.min(100, valor));
      state.plan.mod = Date.now();
      guardarEstado(); render();
    });
  });
  view.querySelectorAll('[data-hip]').forEach((el) => {
    el.addEventListener('change', () => {
      const clave = el.dataset.hip;
      const valor = parseAmount(el.value);
      if (valor == null) return toast('Valor no válido', 'error');
      state.plan.hipoteca[clave] = Math.max(0, valor);
      if (clave === 'precio') state.ajustes.objetivoCasa.precio = Math.max(0, valor);
      if (clave === 'entrada') state.ajustes.objetivoCasa.pctEntrada = Math.min(100, Math.max(0, valor));
      if (clave === 'gastos') state.ajustes.objetivoCasa.pctGastos = Math.min(100, Math.max(0, valor));
      state.plan.mod = Date.now();
      state.ajustes.mod = Date.now();
      guardarEstado(); render();
    });
  });
  const ingreso = $('#pl-ingreso');
  if (ingreso) ingreso.addEventListener('change', () => {
    const valor = parseAmount(ingreso.value);
    if (valor == null) return toast('Valor no válido', 'error');
    state.ajustes.ingreso = valor;
    state.ajustes.mod = Date.now();
    reconciliarCuentasAuto();
    guardarEstado(); render();
  });
  const exportar = () => descargarCSVMovimientos();
  ['#plan-export-csv', '#plan-export-csv-2'].forEach((sel) => { const b = $(sel); if (b) b.onclick = exportar; });
  ['#plan-print', '#plan-print-2'].forEach((sel) => { const b = $(sel); if (b) b.onclick = () => window.print(); });
}

/* ============ Informes y exportación ============ */
function descargarArchivo(nombre, contenido, tipo = 'text/plain;charset=utf-8') {
  const blob = new Blob([contenido], { type: tipo });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nombre;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function csvCelda(v) {
  const s = String(v == null ? '' : v).replace(/"/g, '""');
  return `"${s}"`;
}

function descargarCSVMovimientos() {
  const filas = [['fecha', 'tipo', 'categoria', 'cuenta', 'importe', 'nota']];
  const todos = [
    ...(state.gastos || []).map((g) => ({ fecha: g.fecha, tipo: 'gasto', catId: g.catId, cuentaId: g.cuentaId, importe: g.monto, nota: g.nota })),
    ...(state.movimientos || []).map((m) => ({ fecha: m.fecha, tipo: m.tipo, catId: m.catId, cuentaId: m.cuentaId, importe: m.importe, nota: m.nota })),
  ].sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  for (const x of todos) {
    const cat = catPorId(x.catId);
    const cuenta = holdingPorId(x.cuentaId);
    filas.push([x.fecha, x.tipo, cat ? cat.nombre : '', cuenta ? cuenta.nombre : '', x.importe, x.nota || '']);
  }
  const csv = filas.map((f) => f.map(csvCelda).join(';')).join('\n');
  descargarArchivo(`finanzas-movimientos-${hoyISO()}.csv`, '\ufeff' + csv, 'text/csv;charset=utf-8');
  toast('CSV de movimientos descargado');
}

function descargarResumenCSV() {
  const filas = [['mes', 'ingresos', 'gastos', 'ahorro', 'tasa_ahorro', 'patrimonio']];
  const meses = [];
  for (let i = 11; i >= 0; i--) meses.push(addMonths(currentMonthKey(), -i));
  for (const mk of meses) {
    const f = flujoMes(mk);
    const snap = snapPorMes(mk);
    const pat = snap ? Object.values(snap.valores || {}).reduce((a, b) => a + (+b || 0), 0) : '';
    filas.push([mk, f.ingresos.total, f.gastos, f.ahorro, f.tasaAhorro == null ? '' : (f.tasaAhorro * 100).toFixed(1), pat]);
  }
  const csv = filas.map((f) => f.map(csvCelda).join(';')).join('\n');
  descargarArchivo(`finanzas-resumen-${hoyISO()}.csv`, '\ufeff' + csv, 'text/csv;charset=utf-8');
  toast('Resumen CSV descargado');
}


/* ============ Movimientos e importación ============ */
function modalMovimiento(id = null) {
  const m = id ? (state.movimientos || []).find((x) => x.id === id) : null;
  const cuentas = holdingsActivos().filter(esCuentaEfectivo);
  const inversiones = holdingsActivos().filter(esInversion);
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>${m ? 'Editar movimiento' : 'Nuevo movimiento'}</h3>
      <div class="form-card">
        <div class="field-row">
          <div class="field"><label for="mov-tipo">Tipo</label>
            <select id="mov-tipo">
              ${[['ingreso', 'Ingreso'], ['traspaso', 'Traspaso entre cuentas'], ['inversion', 'Aportación a inversión'], ['retirada', 'Retirada de inversión'], ['pagoDeuda', 'Pago de deuda'], ['devolucion', 'Devolución / reembolso'], ['dividendo', 'Dividendo / cupón']].map(([v, t]) => `<option value="${v}" ${m && m.tipo === v ? 'selected' : ''}>${t}</option>`).join('')}
            </select></div>
          <div class="field"><label for="mov-fecha">Fecha</label>
            <input id="mov-fecha" type="date" value="${m ? m.fecha : hoyISO()}" /></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="mov-importe">Importe (€)</label>
            <input id="mov-importe" type="text" inputmode="decimal" value="${m ? String(m.importe).replace('.', ',') : ''}" placeholder="0,00" autofocus /></div>
          <div class="field"><label for="mov-cuenta">Cuenta de origen / destino</label>
            <select id="mov-cuenta">
              ${cuentas.map((h) => `<option value="${h.id}" ${m && m.cuentaId === h.id ? 'selected' : ''}>${escapeHtml(h.nombre)}</option>`).join('')}
            </select></div>
        </div>
        <div class="field" id="mov-destino-wrap"><label for="mov-destino">Cuenta destino (solo traspaso)</label>
          <select id="mov-destino">
            ${cuentas.map((h) => `<option value="${h.id}" ${m && m.cuentaDestinoId === h.id ? 'selected' : ''}>${escapeHtml(h.nombre)}</option>`).join('')}
          </select></div>
        <div class="field-row">
          <div class="field" id="mov-cat-wrap"><label for="mov-cat">Categoría</label>
            <select id="mov-cat">
              <option value="__none">Sin categoría</option>
              ${state.categorias.map((c) => `<option value="${c.id}" ${m && m.catId === c.id ? 'selected' : ''}>${escapeHtml(c.nombre)}</option>`).join('')}
            </select></div>
          <div class="field" id="mov-holding-wrap"><label for="mov-holding">Posición de inversión</label>
            <select id="mov-holding">
              ${inversiones.map((h) => `<option value="${h.id}" ${m && m.holdingId === h.id ? 'selected' : ''}>${escapeHtml(h.nombre)}</option>`).join('')}
            </select></div>
        </div>
        <div class="field" id="mov-deuda-wrap"><label for="mov-deuda">Deuda</label>
          <select id="mov-deuda">
            ${(state.deudas || []).map((d) => `<option value="${d.id}" ${m && m.deudaId === d.id ? 'selected' : ''}>${escapeHtml(d.nombre)} · ${eur(d.saldo)}</option>`).join('')}
          </select></div>
        <div class="field"><label for="mov-nota">Nota</label>
          <input id="mov-nota" type="text" value="${m ? escapeHtml(m.nota || '') : ''}" placeholder="Opcional" /></div>
        <p class="hint">Los traspasos mueven dinero entre cuentas sin ser gasto. Las aportaciones a inversión salen de la cuenta y quedan registradas para calcular XIRR.</p>
      </div>
      <div class="modal-actions">
        ${m ? '<button class="btn danger" id="mov-borrar" type="button">Borrar</button>' : ''}
        <button class="btn secondary" id="mov-cancel" type="button">Cancelar</button>
        <button class="btn" id="mov-save" type="button">${m ? 'Guardar' : 'Añadir'}</button>
      </div>
    </div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);
  const tipoSel = $('#mov-tipo', overlay);
  const refrescar = () => {
    const tipo = tipoSel.value;
    $('#mov-destino-wrap', overlay).style.display = tipo === 'traspaso' ? '' : 'none';
    $('#mov-holding-wrap', overlay).style.display = (tipo === 'inversion' || tipo === 'retirada' || tipo === 'dividendo') ? '' : 'none';
    $('#mov-deuda-wrap', overlay).style.display = tipo === 'pagoDeuda' ? '' : 'none';
    $('#mov-cat-wrap', overlay).style.display = (tipo === 'ingreso' || tipo === 'devolucion' || tipo === 'dividendo') ? '' : 'none';
  };
  tipoSel.onchange = refrescar;
  refrescar();
  $('#mov-cancel', overlay).onclick = cerrar;
  $('#mov-save', overlay).onclick = () => {
    const tipo = tipoSel.value;
    const importe = parseAmount($('#mov-importe', overlay).value);
    const fecha = $('#mov-fecha', overlay).value;
    if (importe == null || importe <= 0) return toast('Importe inválido', 'error');
    if (!fecha) return toast('Fecha inválida', 'error');
    const datos = {
      tipo,
      importe,
      fecha,
      cuentaId: $('#mov-cuenta', overlay).value || 'h-ibercaja',
      cuentaDestinoId: tipo === 'traspaso' ? $('#mov-destino', overlay).value : null,
      catId: $('#mov-cat', overlay).value || '__none',
      holdingId: (tipo === 'inversion' || tipo === 'retirada' || tipo === 'dividendo') ? $('#mov-holding', overlay).value : null,
      deudaId: tipo === 'pagoDeuda' ? $('#mov-deuda', overlay).value : null,
      nota: $('#mov-nota', overlay).value.trim(),
      unidadesMov: null,
    };
    if (tipo === 'traspaso' && (!datos.cuentaDestinoId || datos.cuentaDestinoId === datos.cuentaId)) return toast('Elige una cuenta destino distinta', 'error');
    if ((tipo === 'inversion' || tipo === 'retirada' || tipo === 'dividendo') && !datos.holdingId) return toast('Elige una posición de inversión', 'error');
    if (tipo === 'pagoDeuda' && !datos.deudaId) return toast('Elige una deuda', 'error');

    if (m && m.tipo === 'pagoDeuda' && m.deudaId) {
      const d0 = deudaPorId(m.deudaId);
      if (d0) { d0.saldo = Math.round((+d0.saldo + (+m.importe || 0)) * 100) / 100; stamp(d0); }
    }
    if (m && m.holdingId && m.unidadesMov) {
      const h0 = holdingPorId(m.holdingId);
      if (h0) { h0.unidades = Math.max(0, (+h0.unidades || 0) - (+m.unidadesMov || 0)); stamp(h0); }
    }
    if (m) Object.assign(m, datos);
    else state.movimientos.push({ id: uid(), ...datos });
    const mov = m || state.movimientos[state.movimientos.length - 1];
    if ((tipo === 'inversion' || tipo === 'retirada') && datos.holdingId) {
      const h = holdingPorId(datos.holdingId);
      if (h && +h.precio > 0) {
        const um = importe / +h.precio;
        mov.unidadesMov = tipo === 'inversion' ? um : -um;
        h.unidades = Math.max(0, (+h.unidades || 0) + mov.unidadesMov);
        stamp(h);
      }
    }
    stamp(mov);
    if (tipo === 'pagoDeuda' && datos.deudaId) {
      const d = deudaPorId(datos.deudaId);
      if (d) { d.saldo = Math.max(0, Math.round((+d.saldo - importe) * 100) / 100); stamp(d); }
    }
    guardarEstado(); cerrar(); toast(m ? 'Movimiento actualizado' : 'Movimiento añadido'); render();
  };
  if (m) $('#mov-borrar', overlay).onclick = () => {
    if (!confirm('¿Borrar este movimiento?')) return;
    if (m.tipo === 'pagoDeuda' && m.deudaId) {
      const d = deudaPorId(m.deudaId);
      if (d) { d.saldo = Math.round((+d.saldo + (+m.importe || 0)) * 100) / 100; stamp(d); }
    }
    if (m.holdingId && m.unidadesMov) {
      const h = holdingPorId(m.holdingId);
      if (h) { h.unidades = Math.max(0, (+h.unidades || 0) - (+m.unidadesMov || 0)); stamp(h); }
    }
    tumba('movimientos', m.id);
    state.movimientos = state.movimientos.filter((x) => x.id !== m.id);
    guardarEstado(); cerrar(); toast('Movimiento borrado'); render();
  };
}

function parseCSV(texto) {
  const lineas = String(texto || '').replace(/\r/g, '').split('\n').filter((l) => l.trim());
  if (!lineas.length) return [];
  const delim = (lineas[0].match(/;/g) || []).length >= (lineas[0].match(/,/g) || []).length ? ';' : ',';
  const parseLinea = (linea) => {
    const out = [];
    let actual = '', comillas = false;
    for (let i = 0; i < linea.length; i++) {
      const c = linea[i];
      if (c === '"') {
        if (comillas && linea[i + 1] === '"') { actual += '"'; i++; }
        else comillas = !comillas;
      } else if (c === delim && !comillas) { out.push(actual); actual = ''; }
      else actual += c;
    }
    out.push(actual);
    return out.map((x) => x.trim());
  };
  const cab = parseLinea(lineas[0]).map((x) => x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
  return lineas.slice(1).map((l) => {
    const vals = parseLinea(l);
    const obj = {};
    cab.forEach((k, i) => { obj[k] = vals[i] != null ? vals[i] : ''; });
    return obj;
  });
}

function modalImportarCSV() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>Importar movimientos CSV</h3>
      <p class="hint">Cabeceras admitidas: <strong>fecha</strong>, <strong>importe</strong>, <strong>concepto</strong> o <strong>nota</strong>, <strong>categoria</strong> (opcional), <strong>tipo</strong> (opcional: gasto/ingreso/traspaso/inversion/retirada), <strong>cuenta</strong> (opcional). Separador ; o ,.</p>
      <div class="field"><label for="csv-file">Archivo CSV</label><input id="csv-file" type="file" accept=".csv,text/csv" /></div>
      <div class="field"><label for="csv-cuenta">Cuenta por defecto</label>
        <select id="csv-cuenta">${holdingsActivos().filter(esCuentaEfectivo).map((h) => `<option value="${h.id}">${escapeHtml(h.nombre)}</option>`).join('')}</select></div>
      <p class="hint">Se ignorarán las filas sin fecha o importe válidos. Los gastos se añaden a Gastos; el resto a Movimientos.</p>
      <div class="modal-actions">
        <button class="btn secondary" id="csv-cancel" type="button">Cancelar</button>
        <button class="btn" id="csv-save" type="button">Importar</button>
      </div>
    </div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);
  $('#csv-cancel', overlay).onclick = cerrar;
  $('#csv-save', overlay).onclick = () => {
    const file = $('#csv-file', overlay).files[0];
    if (!file) return toast('Elige un archivo CSV', 'error');
    const cuentaDef = $('#csv-cuenta', overlay).value || 'h-ibercaja';
    const reader = new FileReader();
    reader.onload = () => {
      const filas = parseCSV(reader.result);
      let importados = 0, omitidos = 0;
      for (const f of filas) {
        const fechaRaw = f.fecha || f.date || '';
        const fecha = /^\d{4}-\d{2}-\d{2}$/.test(fechaRaw) ? fechaRaw : (() => {
          const m = fechaRaw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
          return m ? `${m[3].length === 2 ? '20' + m[3] : m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : '';
        })();
        const importe = parseAmount(f.importe || f.amount || f.cantidad || '');
        if (!fecha || importe == null || importe === 0) { omitidos++; continue; }
        const tipoRaw = String(f.tipo || 'gasto').toLowerCase();
        const tipo = ['ingreso', 'gasto', 'traspaso', 'inversion', 'retirada', 'pagoDeuda', 'devolucion', 'dividendo'].includes(tipoRaw) ? tipoRaw : 'gasto';
        const catNombre = String(f.categoria || f.category || '').trim().toLowerCase();
        const cat = state.categorias.find((c) => c.nombre.toLowerCase() === catNombre) || state.categorias[0];
        const cuentaNombre = String(f.cuenta || f.account || '').trim().toLowerCase();
        const cuenta = holdingsActivos().find((h) => (h.nombre || '').toLowerCase() === cuentaNombre || (h.entidad || '').toLowerCase() === cuentaNombre) || holdingPorId(cuentaDef) || holdingsActivos()[0];
        const nota = String(f.concepto || f.nota || f.descripcion || '').trim();
        const duplicado = state.gastos.some((g) => g.fecha === fecha && Math.abs(+g.monto - importe) < 0.005 && (g.nota || '') === nota);
        if (duplicado) { omitidos++; continue; }
        if (tipo === 'gasto') {
          state.gastos.push(stamp({ id: uid(), monto: Math.abs(importe), fecha, catId: cat ? cat.id : '__none', nota, cuentaId: cuenta ? cuenta.id : cuentaDef, creado: Date.now() }));
        } else {
          state.movimientos.push(stamp({ id: uid(), tipo, importe: Math.abs(importe), fecha, catId: cat ? cat.id : '__none', nota, cuentaId: cuenta ? cuenta.id : cuentaDef, creado: Date.now() }));
        }
        importados++;
      }
      guardarEstado(); cerrar(); toast(`${importados} movimientos importados${omitidos ? ` · ${omitidos} omitidos` : ''}`); render();
    };
    reader.readAsText(file);
  };
}

function modalRecurrente(id = null) {
  const r = id ? (state.recurrentes || []).find((x) => x.id === id) : null;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>${r ? 'Editar recurrente' : 'Nuevo recurrente'}</h3>
      <div class="form-card">
        <div class="field"><label for="rec-nombre">Nombre</label><input id="rec-nombre" type="text" value="${r ? escapeHtml(r.nombre) : ''}" placeholder="Ej.: Alquiler, suscripción, nómina" /></div>
        <div class="field-row">
          <div class="field"><label for="rec-tipo">Tipo</label>
            <select id="rec-tipo">${[['gasto', 'Gasto'], ['ingreso', 'Ingreso']].map(([v, t]) => `<option value="${v}" ${r && r.tipo === v ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
          <div class="field"><label for="rec-importe">Importe (€)</label><input id="rec-importe" type="text" inputmode="decimal" value="${r ? String(r.importe).replace('.', ',') : ''}" /></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="rec-frecuencia">Frecuencia</label>
            <select id="rec-frecuencia"><option value="mensual" ${!r || r.frecuencia === 'mensual' ? 'selected' : ''}>Mensual</option><option value="anual" ${r && r.frecuencia === 'anual' ? 'selected' : ''}>Anual</option></select></div>
          <div class="field"><label for="rec-dia">Día del mes</label><input id="rec-dia" type="number" min="1" max="31" value="${r ? r.dia : 1}" /></div>
        </div>
        <div class="field" id="rec-mes-wrap"><label for="rec-mes">Mes (solo anual)</label>
          <select id="rec-mes">${MESES.map((m, i) => `<option value="${i + 1}" ${r && r.mes === i + 1 ? 'selected' : ''}>${m}</option>`).join('')}</select></div>
        <div class="field-row">
          <div class="field"><label for="rec-cuenta">Cuenta</label>
            <select id="rec-cuenta">${holdingsActivos().filter(esCuentaEfectivo).map((h) => `<option value="${h.id}" ${r && r.cuentaId === h.id ? 'selected' : ''}>${escapeHtml(h.nombre)}</option>`).join('')}</select></div>
          <div class="field"><label for="rec-cat">Categoría</label>
            <select id="rec-cat"><option value="__none">Sin categoría</option>${state.categorias.map((c) => `<option value="${c.id}" ${r && r.catId === c.id ? 'selected' : ''}>${escapeHtml(c.nombre)}</option>`).join('')}</select></div>
        </div>
        <div class="field"><label><input type="checkbox" id="rec-activo" style="width:auto" ${!r || r.activo !== false ? 'checked' : ''} /> Activo</label></div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" id="rec-cancel" type="button">Cancelar</button>
        <button class="btn" id="rec-save" type="button">${r ? 'Guardar' : 'Crear'}</button>
      </div>
    </div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);
  const refrescar = () => { $('#rec-mes-wrap', overlay).style.display = $('#rec-frecuencia', overlay).value === 'anual' ? '' : 'none'; };
  $('#rec-frecuencia', overlay).onchange = refrescar; refrescar();
  $('#rec-cancel', overlay).onclick = cerrar;
  $('#rec-save', overlay).onclick = () => {
    const nombre = $('#rec-nombre', overlay).value.trim();
    const importe = parseAmount($('#rec-importe', overlay).value);
    if (!nombre) return toast('Ponle un nombre', 'error');
    if (importe == null || importe <= 0) return toast('Importe inválido', 'error');
    const datos = {
      nombre, importe,
      tipo: $('#rec-tipo', overlay).value,
      frecuencia: $('#rec-frecuencia', overlay).value,
      dia: Math.min(31, Math.max(1, parseInt($('#rec-dia', overlay).value, 10) || 1)),
      mes: parseInt($('#rec-mes', overlay).value, 10) || 1,
      cuentaId: $('#rec-cuenta', overlay).value,
      catId: $('#rec-cat', overlay).value,
      activo: $('#rec-activo', overlay).checked,
    };
    if (r) Object.assign(r, datos);
    else state.recurrentes.push({ id: uid(), ...datos, ultimaAplicacion: null });
    stamp(r || state.recurrentes[state.recurrentes.length - 1]);
    guardarEstado(); cerrar(); toast(r ? 'Recurrente actualizado' : 'Recurrente creado'); render();
  };
}

function aplicarRecurrente(r, mk) {
  if (!r || r.activo === false) return 0;
  if (r.ultimaAplicacion && String(r.ultimaAplicacion) >= String(mk)) return 0;
  const [y, m] = mk.split('-').map(Number);
  const ultimoDia = new Date(y, m, 0).getDate();
  const dia = Math.min(r.dia || 1, ultimoDia);
  const fecha = `${mk}-${String(dia).padStart(2, '0')}`;
  if (String(fecha) > hoyISO()) return 0;
  if (r.frecuencia === 'anual' && (+r.mes || 1) !== m) return 0;
  const cat = catPorId(r.catId);
  if (r.tipo === 'ingreso') {
    state.movimientos.push(stamp({ id: uid(), tipo: 'ingreso', importe: r.importe, fecha, catId: r.catId, nota: r.nombre, cuentaId: r.cuentaId, recurrenteId: r.id, creado: Date.now() }));
  } else {
    state.gastos.push(stamp({ id: uid(), monto: r.importe, fecha, catId: cat ? cat.id : '__none', nota: r.nombre, cuentaId: r.cuentaId, recurrenteId: r.id, creado: Date.now() }));
  }
  r.ultimaAplicacion = mk;
  stamp(r);
  return 1;
}

function recurrentesPendientes() {
  let n = 0;
  for (const r of state.recurrentes || []) {
    if (!r.activo) continue;
    let mk = r.ultimaAplicacion ? addMonths(r.ultimaAplicacion, 1) : currentMonthKey();
    for (let i = 0; i < 24 && String(mk) <= currentMonthKey(); i++) {
      if (r.frecuencia === 'anual' && (+r.mes || 1) !== +mk.split('-')[1]) { mk = addMonths(mk, 1); continue; }
      const [y, m] = mk.split('-').map(Number);
      const dia = Math.min(r.dia || 1, new Date(y, m, 0).getDate());
      if (`${mk}-${String(dia).padStart(2, '0')}` <= hoyISO()) n++;
      mk = addMonths(mk, 1);
    }
  }
  return n;
}

function aplicarRecurrentes() {
  let n = 0;
  for (const r of state.recurrentes || []) {
    if (!r.activo) continue;
    let mk = r.ultimaAplicacion ? addMonths(r.ultimaAplicacion, 1) : currentMonthKey();
    for (let i = 0; i < 24 && String(mk) <= currentMonthKey(); i++) {
      n += aplicarRecurrente(r, mk);
      mk = addMonths(mk, 1);
    }
  }
  if (n) { guardarEstado(); toast(`${n} movimientos recurrentes aplicados`); render(); }
  else toast('No hay recurrentes pendientes');
  return n;
}

function modalSeguro() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>Nuevo seguro</h3>
      <div class="form-card">
        <div class="field"><label for="seg-nombre">Nombre</label><input id="seg-nombre" type="text" placeholder="Ej.: Seguro de vida" /></div>
        <div class="field-row">
          <div class="field"><label for="seg-tipo">Tipo</label>
            <select id="seg-tipo">${[['vida', 'Vida'], ['salud', 'Salud'], ['hogar', 'Hogar'], ['coche', 'Coche'], ['otro', 'Otro']].map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select></div>
          <div class="field"><label for="seg-aseguradora">Aseguradora</label><input id="seg-aseguradora" type="text" /></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="seg-prima">Prima anual (€)</label><input id="seg-prima" type="text" inputmode="decimal" placeholder="0,00" /></div>
          <div class="field"><label for="seg-renov">Renovación</label><input id="seg-renov" type="date" /></div>
        </div>
        <div class="field"><label for="seg-cobertura">Cobertura / notas</label><input id="seg-cobertura" type="text" placeholder="Capital asegurado, condiciones…" /></div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" id="seg-cancel" type="button">Cancelar</button>
        <button class="btn" id="seg-save" type="button">Crear</button>
      </div>
    </div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);
  $('#seg-cancel', overlay).onclick = cerrar;
  $('#seg-save', overlay).onclick = () => {
    const nombre = $('#seg-nombre', overlay).value.trim();
    if (!nombre) return toast('Ponle un nombre', 'error');
    state.seguros.push(stamp({
      id: uid(), nombre,
      tipo: $('#seg-tipo', overlay).value,
      aseguradora: $('#seg-aseguradora', overlay).value.trim(),
      primaAnual: Math.max(0, parseAmount($('#seg-prima', overlay).value) ?? 0),
      renovacion: $('#seg-renov', overlay).value || null,
      cobertura: $('#seg-cobertura', overlay).value.trim(),
      creado: Date.now(),
    }));
    guardarEstado(); cerrar(); toast('Seguro creado'); render();
  };
}

async function hashPin(pin) {
  const texto = `finanzas-personal:${pin}`;
  if (crypto.subtle && crypto.subtle.digest) {
    const bytes = new TextEncoder().encode(texto);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Respaldo simple para navegadores sin WebCrypto
  let h = 0;
  for (let i = 0; i < texto.length; i++) h = ((h << 5) - h + texto.charCodeAt(i)) | 0;
  return 'fallback-' + Math.abs(h);
}

function modalPin() {
  const tiene = !!state.ajustes.pinHash;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>${tiene ? 'Cambiar PIN' : 'Configurar PIN'}</h3>
      <div class="form-card">
        ${tiene ? '<div class="field"><label for="pin-actual">PIN actual</label><input id="pin-actual" type="password" inputmode="numeric" maxlength="8" /></div>' : ''}
        <div class="field"><label for="pin-nuevo">Nuevo PIN (4–8 dígitos)</label><input id="pin-nuevo" type="password" inputmode="numeric" maxlength="8" /></div>
        <div class="field"><label for="pin-rep">Repite el PIN</label><input id="pin-rep" type="password" inputmode="numeric" maxlength="8" /></div>
        <p class="hint">Se guarda hasheado en este dispositivo. Si lo olvidas, puedes borrar los datos del sitio desde el navegador, pero perderás la copia local.</p>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" id="pin-cancel" type="button">Cancelar</button>
        <button class="btn" id="pin-save" type="button">Guardar PIN</button>
      </div>
    </div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);
  $('#pin-cancel', overlay).onclick = cerrar;
  $('#pin-save', overlay).onclick = async () => {
    const actual = tiene ? $('#pin-actual', overlay).value : '';
    const nuevo = $('#pin-nuevo', overlay).value.trim();
    const rep = $('#pin-rep', overlay).value.trim();
    if (tiene && await hashPin(actual) !== state.ajustes.pinHash) return toast('PIN actual incorrecto', 'error');
    if (!/^\d{4,8}$/.test(nuevo)) return toast('El PIN debe tener 4–8 dígitos', 'error');
    if (nuevo !== rep) return toast('Los PIN no coinciden', 'error');
    state.ajustes.pinHash = await hashPin(nuevo);
    state.ajustes.mod = Date.now();
    guardarEstado(); cerrar(); toast('PIN guardado'); render();
  };
}

function bloquearApp() {
  if (document.querySelector('.pin-lock')) return;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay pin-lock';
  overlay.innerHTML = `
    <div class="modal pin-modal">
      <div class="pin-logo">🔒</div>
      <h3>Finanzas Personal</h3>
      <p class="hint">Introduce tu PIN para desbloquear</p>
      <div class="field"><input id="pin-unlock" type="password" inputmode="numeric" maxlength="8" autofocus /></div>
      <button class="btn full" id="pin-unlock-btn" type="button">Desbloquear</button>
      <p class="hint" id="pin-error" style="color:var(--rose)"></p>
    </div>`;
  document.body.appendChild(overlay);
  const intentar = async () => {
    const pin = $('#pin-unlock', overlay).value.trim();
    if (await hashPin(pin) === state.ajustes.pinHash) overlay.remove();
    else { $('#pin-error', overlay).textContent = 'PIN incorrecto'; $('#pin-unlock', overlay).value = ''; }
  };
  $('#pin-unlock-btn', overlay).onclick = intentar;
  $('#pin-unlock', overlay).addEventListener('keydown', (e) => { if (e.key === 'Enter') intentar(); });
  setTimeout(() => { const el = $('#pin-unlock', overlay); if (el) el.focus(); }, 80);
}

function syncHeaders(extra = {}) {
  const h = { ...extra };
  if (state.ajustes.syncToken) h['X-Sync-Token'] = state.ajustes.syncToken;
  return h;
}

async function modalVersiones() {
  const url = syncUrl();
  if (!url) return toast('Configura primero el servidor de sincronización', 'error');
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal"><h3>Versiones del servidor</h3><p class="hint">Cargando…</p><div class="modal-actions"><button class="btn secondary" id="ver-cerrar" type="button">Cerrar</button></div></div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);
  $('#ver-cerrar', overlay).onclick = cerrar;
  try {
    const res = await fetch(url + '/api/versions', { headers: syncHeaders(), cache: 'no-store' });
    if (!res.ok) throw new Error('status');
    const versiones = await res.json();
    const lista = Array.isArray(versiones) && versiones.length
      ? versiones.map((v) => `<div class="panel-item"><span style="flex:1">#${v.id}<span class="tiny" style="display:block">${new Date(v.ts).toLocaleString('es-ES')} · ${(v.bytes / 1024).toFixed(1)} KB</span></span><button class="btn secondary small" data-restore="${v.id}" type="button">Restaurar</button></div>`).join('')
      : '<div class="hint">Todavía no hay versiones.</div>';
    overlay.querySelector('.modal').innerHTML = `<h3>Versiones del servidor</h3><p class="hint">Restaurar copia esa versión como última. Después pulsa «Descargar de la nube» en Ajustes.</p><div style="max-height:50vh;overflow:auto">${lista}</div><div class="modal-actions"><button class="btn secondary" id="ver-cerrar2" type="button">Cerrar</button></div>`;
    $('#ver-cerrar2', overlay).onclick = cerrar;
    overlay.querySelectorAll('[data-restore]').forEach((b) => {
      b.onclick = async () => {
        if (!confirm(`¿Restaurar la versión #${b.dataset.restore}?`)) return;
        try {
          const r = await fetch(url + '/api/restore', { method: 'POST', headers: syncHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify({ id: +b.dataset.restore }) });
          if (!r.ok) throw new Error('status');
          toast('Versión restaurada en el servidor; descargando…');
          await syncBajar();
          cerrar();
        } catch { toast('No se pudo restaurar la versión', 'error'); }
      };
    });
  } catch {
    overlay.querySelector('.modal').innerHTML = '<h3>Versiones del servidor</h3><p class="hint">No se pudo conectar con el servidor. Revisa la URL y el token.</p><div class="modal-actions"><button class="btn secondary" id="ver-cerrar3" type="button">Cerrar</button></div>';
    $('#ver-cerrar3', overlay).onclick = cerrar;
  }
}

const COLECCIONES = ['gastos', 'snapshots', 'categorias', 'holdings', 'cubos', 'personas', 'compartidosEventos', 'bizums', 'objetivos', 'deudas', 'movimientos', 'recurrentes', 'presupuestosHistorial', 'seguros'];

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
  if (!o || typeof o !== 'object' || !Array.isArray(o.categorias) || !Array.isArray(o.holdings ?? [])) return false;
  for (const col of COLECCIONES) {
    if (o[col] != null && !Array.isArray(o[col])) return false;
  }
  return true;
}

/* Contenido sin datos propios del dispositivo (para no publicar en balde) */
function contenidoSync() {
  let copia;
  try { copia = JSON.parse(JSON.stringify(state)); } catch (e) { return ''; }
  if (copia.ajustes) { delete copia.ajustes.syncUrl; delete copia.ajustes.syncAuto; delete copia.ajustes.syncToken; delete copia.ajustes.github; delete copia.ajustes.pinHash; }
  return JSON.stringify(copia);
}

function estadoSyncLocal() {
  try { return JSON.parse(contenidoSync() || '{}'); } catch (e) { return {}; }
}

function sinConfigSync(o) {
  try {
    const c = JSON.parse(JSON.stringify(o || {}));
    if (c.ajustes) { delete c.ajustes.syncUrl; delete c.ajustes.syncAuto; delete c.ajustes.syncToken; delete c.ajustes.github; delete c.ajustes.pinHash; }
    return c;
  } catch (e) { return {}; }
}

/* ---- Nube gratis: GitHub (JSON en un repo privado, la app en Pages) ---- */
const ghEstado = { etag: null, sha: null, remoto: null, existe: null };

function ghModoActivo() {
  const gh = state.ajustes.github;
  return !!(gh && gh.repo && gh.token);
}

/* Acepta «usuario/repo», URLs completas de GitHub, etc. */
function normalizarRepo(v) {
  let s = String(v || '').trim();
  s = s.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  s = s.replace(/^github\.com\//i, '');
  s = s.split(/[?#]/)[0].replace(/\/+$/, '').replace(/\.git$/i, '');
  const partes = s.split('/').filter(Boolean);
  if (partes.length >= 2) return `${partes[0]}/${partes[1]}`;
  return partes[0] || '';
}

function ghUrl(cfg) {
  return `https://api.github.com/repos/${normalizarRepo(cfg.repo)}/contents/${encodeURIComponent(cfg.ruta || 'finanzas.json')}`;
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
    return ghGuardar(cfg, fusionarLocal(estadoSyncLocal(), sinConfigSync(remoto) || { v: 2 }), intento + 1);
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
    const fusionado = fusionarLocal(estadoSyncLocal(), sinConfigSync(remoto) || { v: 2 });
    const mismoRemoto = remoto && JSON.stringify(fusionado) === JSON.stringify(sinConfigSync(remoto));
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

/* Diagnóstico: qué usuario y repos ve el token */
async function ghDiagnostico() {
  const cfg = state.ajustes.github || {};
  const el = $('#sync-estado');
  const set = (t) => { if (el) el.textContent = t; };
  if (!cfg.token) return toast('Añade primero el token', 'error');
  const cab = { Authorization: `Bearer ${cfg.token}`, Accept: 'application/vnd.github+json' };
  try {
    const ru = await fetch('https://api.github.com/user', { headers: cab, cache: 'no-store' });
    if (!ru.ok) throw Object.assign(new Error('token'), { status: ru.status });
    const u = await ru.json();
    let repos = [];
    const rr = await fetch('https://api.github.com/user/repos?per_page=100&affiliation=owner,collaborator,organization_member', { headers: cab, cache: 'no-store' });
    if (rr.ok) {
      const l = await rr.json();
      if (Array.isArray(l)) repos = l.map((r) => r.full_name);
    }
    const objetivo = normalizarRepo(cfg.repo || '');
    const acceso = repos.some((n) => n.toLowerCase() === objetivo.toLowerCase());
    set(`🔍 Token de ${u.login}. Repos visibles: ${repos.length ? repos.join(', ') : 'ninguno'}. Acceso a ${objetivo || '(sin repo)'}: ${acceso ? 'SÍ ✅' : 'NO ❌'}`);
    toast(acceso ? 'El token ve el repo' : 'El token NO ve ese repo', acceso ? '' : 'error');
  } catch (e) {
    const msg = e.status === 401 ? 'Token inválido o revocado (401)' : 'No se pudo comprobar el token';
    set('⚠️ ' + msg);
    toast(msg, 'error');
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
  const mia = { syncUrl: state.ajustes.syncUrl, syncAuto: state.ajustes.syncAuto, syncToken: state.ajustes.syncToken, github: state.ajustes.github, pinHash: state.ajustes.pinHash };
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
      const res = await fetch(url + '/api/state', { headers: syncHeaders(), cache: 'no-store' });
      if (!res.ok) throw new Error('status ' + res.status);
      const rec = await res.json();
      if (esBackupValido(rec) && rec.syncT && rec.syncT !== state.syncT) {
        adoptarSync(rec);
        subidoPrevio = contenidoSync();
      }
    } else {
      const res = await fetch(url + '/api/state', {
        method: 'POST',
        headers: syncHeaders({ 'Content-Type': 'application/json' }),
        body: contenidoSync(),
      });
      if (!res.ok) throw new Error('status ' + res.status);
      const fusionado = await res.json();
      if (!esBackupValido(fusionado)) throw new Error('formato');
      adoptarSync(fusionado);
      subidoPrevio = contenidoSync();
    }
    ultimoSyncOK = Date.now();
    actualizarEstadoSync();
  } catch (e) {
    const msg = e && e.status === 401 ? 'Token del servidor incorrecto (401)' : 'No se pudo sincronizar (¿servidor activo?, ¿URL correcta?)';
    if (forzar) toast(msg, 'error');
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
    const res = await fetch(url + '/api/state', { headers: syncHeaders(), cache: 'no-store' });
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
  const ts = ultimoSyncOK
    ? new Date(ultimoSyncOK).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '';
  el.textContent = extra || (ts ? `Última sincronización con la nube: ${ts}` : 'Aún no sincronizado en esta sesión');
}

/* ============ Vista: Análisis ============ */
const ANALISIS_DESCARTADOS = new Set(state.analisisDescartados || []);

function analisisPeriodoHasta(finMk, n) {
  const meses = [];
  for (let i = n - 1; i >= 0; i--) meses.push(addMonths(finMk, -i));
  return meses.map((mk) => {
    const gastos = gastosDelMes(mk);
    const porCat = { __none: 0 };
    const porCatPresu = {};
    for (const c of state.categorias) { porCat[c.id] = 0; porCatPresu[c.id] = presupuestoCategoria(c.id, mk); }
    let total = 0;
    for (const g of gastos) {
      const id = state.categorias.some((c) => c.id === g.catId) ? g.catId : '__none';
      porCat[id] = (porCat[id] || 0) + g.monto;
      total += g.monto;
    }
    return { mk, porCat, porCatPresu, presupuesto: presupuestoTotalMes(mk), total, n: gastos.length };
  });
}

function esMesEnCursoIncompleto(mk) {
  if (mk !== currentMonthKey()) return false;
  const ahora = new Date();
  const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0).getDate();
  return ahora.getDate() < ultimoDia;
}

function construirAnalisis(nPedido) {
  const n = [3, 6, 12].includes(+nPedido) ? +nPedido : 6;
  const filasActuales = analisisPeriodo(n);
  const filasPrevias = analisisPeriodoHasta(addMonths(currentMonthKey(), -n), n);
  const mesActual = currentMonthKey();
  const mesActualIncompleto = esMesEnCursoIncompleto(mesActual);

  filasActuales.forEach((f) => { f.incompleto = f.mk === mesActual && mesActualIncompleto; });
  filasPrevias.forEach((f) => { f.incompleto = false; });

  const actualesCompletos = filasActuales.filter((f) => !f.incompleto);
  const baseActual = actualesCompletos.length ? actualesCompletos : filasActuales;
  const basePrevia = filasPrevias.slice(-baseActual.length);
  const mesesBase = baseActual.filter((f) => f.n > 0);
  const mesesPreviosBase = basePrevia.filter((f) => f.n > 0);

  const presu = presupuestoTotalMes(currentMonthKey());
  const totalPeriodo = filasActuales.reduce((a, f) => a + f.total, 0);
  const totalBase = baseActual.reduce((a, f) => a + f.total, 0);
  const totalPrevio = basePrevia.reduce((a, f) => a + f.total, 0);
  const media = mesesBase.length ? totalBase / mesesBase.length : 0;
  const mediaPrevia = mesesPreviosBase.length ? totalPrevio / mesesPreviosBase.length : 0;
  const masCaro = filasActuales.filter((f) => f.n > 0).sort((a, b) => b.total - a.total)[0] || null;
  const mesesPorEncima = mesesBase.filter((f) => f.presupuesto > 0 && f.total > f.presupuesto + 0.005).length;
  const comparacionFiable = mesesBase.length >= 1 && mesesPreviosBase.length >= 1;
  const variacionPeriodo = comparacionFiable ? pctSeguro(media, mediaPrevia) : null;
  const variacionMedia = comparacionFiable ? pctSeguro(media, mediaPrevia) : null;
  const tendenciaFiable = mesesBase.length >= 3 && mesesPreviosBase.length >= 2 && baseActual.length >= 3;

  const cats = state.categorias.map((c) => {
    const presupuesto = presupuestoCategoria(c.id, currentMonthKey());
    const serieBase = mesesBase.map((f) => f.porCat[c.id] || 0);
    const seriePresu = mesesBase.map((f) => (f.porCatPresu && f.porCatPresu[c.id]) || 0);
    const serieBasePrevia = mesesPreviosBase.map((f) => f.porCat[c.id] || 0);
    const totalActual = serieBase.reduce((a, b) => a + b, 0);
    const totalPrevioCat = serieBasePrevia.reduce((a, b) => a + b, 0);
    const mediaActual = mesesBase.length ? totalActual / mesesBase.length : 0;
    const mediaPreviaCat = mesesPreviosBase.length ? totalPrevioCat / mesesPreviosBase.length : 0;
    const delta = mediaActual - mediaPreviaCat;
    const pct = pctSeguro(mediaActual, mediaPreviaCat);
    const med = mediana(serieBase);
    const max = Math.max(...serieBase, 0);
    const min = Math.min(...serieBase, 0);
    const cv = mediaYDesviacion(serieBase).cv;
    const mesesSobre = serieBase.filter((x, i) => (seriePresu[i] || 0) > 0 && x > (seriePresu[i] || 0) + 0.005).length;
    const mesesConGasto = serieBase.filter((x) => x > 0).length;
    const mesesPrevioConGasto = serieBasePrevia.filter((x) => x > 0).length;
    const excesoMedio = serieBase.reduce((a, x, i) => a + Math.max(x - (seriePresu[i] || 0), 0), 0) / Math.max(1, serieBase.length);

    return {
      ...c,
      presupuesto,
      serieBase,
      seriePresu,
      serieBasePrevia,
      totalActual,
      totalPrevio: totalPrevioCat,
      mediaActual,
      mediaPrevia: mediaPreviaCat,
      delta,
      pct,
      med,
      max,
      min,
      cv,
      mesesSobre,
      mesesConGasto,
      mesesPrevioConGasto,
      excesoMedio,
    };
  });

  const sinEtiquetaActual = mesesBase.reduce((a, f) => a + (f.porCat.__none || 0), 0);
  const sinEtiquetaPrevia = mesesPreviosBase.reduce((a, f) => a + (f.porCat.__none || 0), 0);
  if (sinEtiquetaActual > 0 || sinEtiquetaPrevia > 0) {
    const serieBase = mesesBase.map((f) => f.porCat.__none || 0);
    const serieBasePrevia = mesesPreviosBase.map((f) => f.porCat.__none || 0);
    cats.push({
      id: '__none',
      nombre: 'Sin etiqueta',
      color: '#64748b',
      presupuesto: 0,
      serieBase,
      serieBasePrevia,
      totalActual: sinEtiquetaActual,
      totalPrevio: sinEtiquetaPrevia,
      mediaActual: mesesBase.length ? sinEtiquetaActual / mesesBase.length : 0,
      mediaPrevia: mesesPreviosBase.length ? sinEtiquetaPrevia / mesesPreviosBase.length : 0,
      delta: sinEtiquetaActual - sinEtiquetaPrevia,
      pct: pctSeguro(sinEtiquetaActual, sinEtiquetaPrevia),
      med: mediana(serieBase),
      max: Math.max(...serieBase, 0),
      min: Math.min(...serieBase, 0),
      cv: mediaYDesviacion(serieBase).cv,
      mesesSobre: 0,
      mesesConGasto: serieBase.filter((x) => x > 0).length,
      mesesPrevioConGasto: serieBasePrevia.filter((x) => x > 0).length,
      excesoMedio: 0,
    });
  }

  const catsOrdenadas = cats.slice().sort((a, b) => b.totalActual - a.totalActual);

  const cambios = tendenciaFiable
    ? cats
      .filter((c) => c.id !== '__none' && (c.totalActual >= 10 || c.totalPrevio >= 10))
      .filter((c) => (c.pct != null ? Math.abs(c.pct) >= 0.1 && Math.abs(c.delta) >= 5 : c.delta >= 15))
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, 5)
    : [];

  const datos = {
    n,
    filasActuales,
    filasPrevias,
    baseActual,
    basePrevia,
    mesesBase,
    mesesPreviosBase,
    presu,
    totalPeriodo,
    totalBase,
    totalPrevio,
    media,
    mediaPrevia,
    masCaro,
    mesesPorEncima,
    variacionPeriodo,
    variacionMedia,
    comparacionFiable,
    tendenciaFiable,
    mesActualIncompleto,
    cats: catsOrdenadas,
    cambios,
  };

  datos.propuestas = construirPropuestasPresupuesto(datos);
  datos.conclusiones = construirConclusionesAnalisis(datos);
  datos.plan = construirPlanAnalisis(datos);
  return datos;
}

function construirPropuestasPresupuesto(d) {
  const vacio = {
    suficiente: false,
    propuestas: [],
    totalDelta: 0,
    totalNuevo: presupuestoTotal(),
    ahorro: 0,
    coste: 0,
    irregulares: [],
    evaluadas: 0,
  };
  if (d.mesesBase.length < 3) return vacio;

  const numMeses = d.mesesBase.length;
  const propuestas = [];
  const irregulares = [];

  for (const c of d.cats) {
    if (c.id === '__none') continue;
    const presupuesto = c.presupuesto;
    const serie = c.serieBase;
    const total = serie.reduce((a, b) => a + b, 0);
    const media = total / numMeses;
    const med = mediana(serie);
    const max = Math.max(...serie, 0);
    const cv = mediaYDesviacion(serie).cv;
    const mesesSobre = c.mesesSobre != null ? c.mesesSobre : serie.filter((x) => presupuesto > 0 && x > presupuesto + 0.005).length;
    const mesesConGasto = serie.filter((x) => x > 0).length;

    const confianza = numMeses >= 6 && mesesConGasto >= 3 && cv <= 0.35
      ? 'alta'
      : numMeses >= 3 && mesesConGasto >= 2 && cv <= 0.7
        ? 'media'
        : 'baja';

    if (presupuesto >= 30 && mesesConGasto === 0 && numMeses >= 3) {
      irregulares.push({ c, media, med, max, cv, mesesSobre, motivo: `No has gastado en ${numMeses} meses; revisa si el límite sigue teniendo sentido.` });
      continue;
    }

    if (confianza === 'baja') {
      if (presupuesto > 0 && mesesSobre >= 2) {
        irregulares.push({
          c,
          media,
          med,
          max,
          cv,
          mesesSobre,
          motivo: med > presupuesto
            ? 'Hay pocos meses con datos; revisa el límite manualmente antes de cambiarlo.'
            : 'Tiene picos puntuales; no se propone cambiar el límite solo por esos meses.',
        });
      }
      continue;
    }

    if (presupuesto > 0 && cv > 0.65 && max > med * 2.2 && mesesSobre <= 1) {
      irregulares.push({
        c,
        media,
        med,
        max,
        cv,
        mesesSobre,
        motivo: `Gasto irregular: ${eur0(max)} en un mes frente a una mediana de ${eur0(med)}. Mantén el límite y usa una bolsa para picos.`,
      });
      continue;
    }

    let sugerido = presupuesto;
    let motivo = '';

    if (presupuesto <= 0) {
      if (med >= 15 && mesesConGasto >= 2) {
        sugerido = redondear5(med * 1.1);
        motivo = `No tienes límite definido; tu gasto mediano es ${eur0(med)}.`;
      }
    } else if (med > presupuesto * 1.1 && mesesSobre >= 2) {
      sugerido = redondear5(Math.max(presupuesto, med * 1.1));
      motivo = `Has superado el límite en ${mesesSobre} de ${numMeses} meses; tu gasto mediano es ${eur0(med)}.`;
    } else if (med < presupuesto * 0.65 && presupuesto - med >= 20 && mesesSobre === 0) {
      sugerido = redondear5(Math.max(med * 1.15, media * 1.05));
      sugerido = Math.min(sugerido, presupuesto - 5);
      motivo = `Tu gasto mediano es ${eur0(med)} y no has superado el límite en ${numMeses} meses; podrías liberar ${eur0(presupuesto - sugerido)}/mes.`;
    }

    const delta = sugerido - presupuesto;
    if (Math.abs(delta) < 5) continue;

    const key = `${d.n}:${c.id}:${sugerido}`;
    if (ANALISIS_DESCARTADOS.has(key)) continue;

    propuestas.push({
      c,
      actual: presupuesto,
      sugerido,
      delta,
      motivo,
      confianza,
      media,
      med,
      max,
      cv,
      mesesSobre,
      mesesConGasto,
      numMeses,
      key,
      prioridad: delta > 0 ? 3 : presupuesto > 0 ? 1 : 2,
    });
  }

  propuestas.sort((a, b) => (b.prioridad - a.prioridad) || Math.abs(b.delta) - Math.abs(a.delta));
  const visibles = propuestas.slice(0, 5);
  const totalDelta = visibles.reduce((a, p) => a + p.delta, 0);

  return {
    suficiente: true,
    propuestas: visibles,
    totalDelta,
    totalNuevo: presupuestoTotal() + totalDelta,
    ahorro: visibles.filter((p) => p.delta < 0).reduce((a, p) => a - p.delta, 0),
    coste: visibles.filter((p) => p.delta > 0).reduce((a, p) => a + p.delta, 0),
    irregulares,
    evaluadas: d.cats.filter((c) => c.id !== '__none' && c.presupuesto > 0).length,
  };
}

function construirConclusionesAnalisis(d) {
  const out = [];
  const add = (item) => { if (item && item.texto) out.push(item); };
  const datosSuficientes = d.mesesBase.length >= 3;

  if (!d.mesesBase.length) {
    return [{
      tipo: 'info',
      icono: 'analisis',
      titulo: 'Faltan datos para analizar',
      texto: 'Añade gastos durante al menos 3 meses y aquí aparecerán conclusiones basadas en tu histórico real.',
      impacto: 0,
      detalle: null,
    }];
  }

  if (d.mesesBase.length < 3) {
    add({
      tipo: 'info',
      icono: 'calendario',
      titulo: 'Histórico todavía corto',
      texto: `Solo hay ${pluralMeses(d.mesesBase.length)} con datos. Las tendencias se mostrarán cuando haya al menos 3.`,
      impacto: 0,
      detalle: null,
    });
  }

  if (d.variacionPeriodo != null && Math.abs(d.variacionPeriodo) >= 0.05 && d.tendenciaFiable) {
    const sube = d.variacionPeriodo > 0;
    add({
      tipo: sube ? 'negative' : 'positive',
      icono: sube ? 'tendencia' : 'check',
      titulo: sube ? 'Gasto al alza' : 'Gasto a la baja',
      texto: `Tu gasto medio ha ${sube ? 'subido' : 'bajado'} ${eur0(Math.abs(d.media - d.mediaPrevia))}/mes (${fmtPct(d.variacionPeriodo, { decimales: 1 })}) respecto al periodo anterior.`,
      impacto: Math.abs(d.totalBase - d.totalPrevio),
      detalle: { tipo: 'periodo' },
    });
  }

  if (d.masCaro) {
    const sobreMedia = d.media > 0 ? (d.masCaro.total - d.media) / d.media : null;
    add({
      tipo: sobreMedia != null && sobreMedia > 0.15 ? 'negative' : 'info',
      icono: 'calendario',
      titulo: `${fmtMes(d.masCaro.mk)}${d.masCaro.incompleto ? ' (en curso)' : ''} fue tu mes más caro`,
      texto: `Gastaste ${eur0(d.masCaro.total)}${sobreMedia != null ? ` (${fmtPct(sobreMedia, { decimales: 0 })} sobre tu media)` : ''}.`,
      impacto: d.media > 0 ? Math.max(0, d.masCaro.total - d.media) : 0,
      detalle: { tipo: 'mes', mk: d.masCaro.mk },
    });
  }

  const conCambio = d.cats.filter((c) => c.id !== '__none' && (c.totalActual >= 10 || c.totalPrevio >= 10));
  const subidas = conCambio
    .filter((c) => c.delta >= 10 && (c.pct == null || c.pct >= 0.12) && c.mesesConGasto >= 2)
    .sort((a, b) => b.delta - a.delta);
  const bajadas = conCambio
    .filter((c) => c.delta <= -10 && (c.pct == null || c.pct <= -0.12) && c.mesesPrevioConGasto >= 2)
    .sort((a, b) => a.delta - b.delta);

  if (subidas.length && d.tendenciaFiable) {
    const c = subidas[0];
    add({
      tipo: 'negative',
      icono: 'tendencia',
      titulo: `Más gasto en ${c.nombre}`,
      texto: `Has aumentado ${eur0(c.delta)}/mes${c.pct != null ? ` (${fmtPct(c.pct, { decimales: 0 })})` : ''} respecto al periodo anterior.`,
      impacto: c.delta,
      detalle: { tipo: 'cat', id: c.id },
    });
  }

  if (bajadas.length && d.tendenciaFiable) {
    const c = bajadas[0];
    add({
      tipo: 'positive',
      icono: 'check',
      titulo: `Menos gasto en ${c.nombre}`,
      texto: `Has reducido ${eur0(Math.abs(c.delta))}/mes${c.pct != null ? ` (${fmtPct(c.pct, { decimales: 0 })})` : ''} respecto al periodo anterior.`,
      impacto: Math.abs(c.delta),
      detalle: { tipo: 'cat', id: c.id },
    });
  }

  const sobre = datosSuficientes ? d.cats
    .filter((c) => c.id !== '__none' && c.presupuesto > 0 && c.mesesSobre >= 2)
    .sort((a, b) => b.excesoMedio - a.excesoMedio) : [];
  if (sobre.length) {
    const c = sobre[0];
    add({
      tipo: 'negative',
      icono: 'alerta',
      titulo: `Presupuesto superado en ${c.nombre}`,
      texto: `Te has pasado en ${c.mesesSobre} de ${pluralMeses(d.mesesBase.length)}; el exceso medio es ${eur0(c.excesoMedio)}/mes.`,
      impacto: c.excesoMedio,
      detalle: { tipo: 'cat', id: c.id },
    });
  }

  const holgura = datosSuficientes ? d.cats
    .filter((c) => c.id !== '__none' && c.presupuesto > 0 && c.mesesConGasto >= 2 && c.med < c.presupuesto * 0.65 && c.presupuesto - c.med >= 20 && c.mesesSobre === 0)
    .sort((a, b) => (b.presupuesto - b.med) - (a.presupuesto - a.med)) : [];
  if (holgura.length) {
    const c = holgura[0];
    add({
      tipo: 'info',
      icono: 'objetivo',
      titulo: `Holgura en ${c.nombre}`,
      texto: `Tu media es ${eur0(c.mediaActual)} y el límite ${eur0(c.presupuesto)}; podrías liberar ${eur0(c.presupuesto - c.med)}/mes.`,
      impacto: c.presupuesto - c.med,
      detalle: { tipo: 'cat', id: c.id },
    });
  }

  const irregulares = datosSuficientes ? d.cats
    .filter((c) => c.id !== '__none' && c.totalActual >= 50 && c.mesesConGasto >= 2 && c.cv > 0.65 && c.max > c.med * 2.2)
    .sort((a, b) => b.max - a.max) : [];
  if (irregulares.length) {
    const c = irregulares[0];
    add({
      tipo: 'info',
      icono: 'analisis',
      titulo: `${c.nombre} es irregular`,
      texto: `Un mes concentra ${eur0(c.max)} frente a una mediana de ${eur0(c.med)}. No ajustes el presupuesto solo por ese pico.`,
      impacto: 0,
      detalle: { tipo: 'cat', id: c.id },
    });
  }

  if (datosSuficientes && d.presu > 0 && d.mesesPorEncima >= 2) {
    add({
      tipo: 'negative',
      icono: 'alerta',
      titulo: 'Meses por encima del presupuesto',
      texto: `Has superado tu presupuesto global en ${d.mesesPorEncima} de ${pluralMeses(d.mesesBase.length)}.`,
      impacto: d.mesesPorEncima * 5,
      detalle: { tipo: 'periodo' },
    });
  }

  const aumentoIds = new Set(d.propuestas.propuestas.filter((x) => x.delta > 0).map((x) => x.c.id));
  const ahorro = datosSuficientes ? Math.max(0, d.propuestas.ahorro + d.cats
    .filter((c) => c.id !== '__none' && c.presupuesto > 0 && c.mesesSobre >= 2 && !aumentoIds.has(c.id))
    .reduce((a, c) => a + c.excesoMedio, 0) - d.propuestas.coste) : 0;
  if (ahorro >= 20) {
    add({
      tipo: 'positive',
      icono: 'objetivo',
      titulo: 'Oportunidad de ahorro',
      texto: `Ajustando presupuestos y excesos podrías liberar ~${eur0(ahorro)}/mes.`,
      impacto: ahorro,
      detalle: { tipo: 'plan' },
    });
  }

  const vistos = new Set();
  return out
    .sort((a, b) => b.impacto - a.impacto)
    .filter((item) => {
      const key = item.detalle
        ? `${item.detalle.tipo}:${item.detalle.id || item.detalle.mk || ''}`
        : item.titulo;
      if (vistos.has(key)) return false;
      vistos.add(key);
      return true;
    })
    .slice(0, 5);
}

function construirPlanAnalisis(d) {
  const p = d.propuestas;
  const datosSuficientes = d.mesesBase.length >= 3;
  const sobre = datosSuficientes ? d.cats
    .filter((c) => c.id !== '__none' && c.presupuesto > 0 && c.mesesSobre >= 2 && !p.propuestas.some((x) => x.c.id === c.id && x.delta > 0))
    .sort((a, b) => b.excesoMedio - a.excesoMedio) : [];
  const ahorroExcesos = datosSuficientes ? sobre.reduce((a, c) => a + c.excesoMedio, 0) : 0;
  const ahorroMin = datosSuficientes ? Math.max(0, p.ahorro - p.coste) : 0;
  const ahorroMax = datosSuficientes ? Math.max(0, p.ahorro + ahorroExcesos - p.coste) : 0;
  const subir = p.propuestas.filter((x) => x.delta > 0).sort((a, b) => b.delta - a.delta)[0];
  const bajar = p.propuestas.filter((x) => x.delta < 0).sort((a, b) => a.delta - b.delta)[0];
  const margen = d.presu > 0 ? d.presu - d.media : 0;

  let titulo = 'Sin cambios claros';
  let texto = 'No hay recortes ni ajustes evidentes con los datos actuales.';
  let tipo = 'info';
  let icono = 'analisis';

  if (!d.mesesBase.length) {
    titulo = 'Faltan datos';
    texto = 'Añade gastos durante al menos 3 meses para generar un plan personalizado.';
  } else if (d.mesesBase.length < 3) {
    texto = `Solo hay ${pluralMeses(d.mesesBase.length)} con datos. El plan será más fiable cuando haya al menos 3.`;
  } else {
    const acciones = [];
    if (subir) acciones.push(`sube el límite de ${subir.c.nombre} a ${eur0(subir.sugerido)}`);
    if (bajar) acciones.push(`baja el límite de ${bajar.c.nombre} a ${eur0(bajar.sugerido)}`);
    if (sobre.length) acciones.push(`reduce el gasto en ${sobre[0].nombre} hacia ${eur0(sobre[0].presupuesto)}`);

    if (acciones.length) {
      titulo = 'Tu próximo paso';
      texto = `Ajusta tus presupuestos: ${acciones.slice(0, 2).join(' y ')}.`;
      if (ahorroMax >= 20) {
        texto += ahorroMin > 0
          ? ` Podrías liberar entre ${eur0(ahorroMin)} y ${eur0(ahorroMax)}/mes.`
          : ` Podrías liberar ~${eur0(ahorroMax)}/mes.`;
      }
      tipo = ahorroMax >= 20 ? 'positive' : 'info';
      icono = 'objetivo';
    } else if (d.presu > 0 && d.media < d.presu) {
      titulo = 'Vas dentro de presupuesto';
      texto = `Tu gasto medio es ${eur0(d.media)} y tu límite ${eur0(d.presu)}. Te quedan ~${eur0(margen)}/mes de margen; formaliza una transferencia automática a ahorro.`;
      tipo = 'positive';
      icono = 'check';
    }
  }

  return {
    titulo,
    texto,
    ahorro: ahorroMax,
    ahorroMin,
    ahorroMax,
    ahorroExcesos,
    tipo,
    icono,
    subir,
    bajar,
    sobre,
    margen,
    confianza: d.mesesBase.length >= 6 ? 'alta' : d.mesesBase.length >= 3 ? 'media' : 'baja',
  };
}

function graficoEvolucionAnalisis(d) {
  const filas = d.filasActuales;
  const w = 340;
  const h = 172;
  const margen = { top: 18, right: 10, bottom: 30, left: 38 };
  const ancho = w - margen.left - margen.right;
  const alto = h - margen.top - margen.bottom;
  const max = maxBonito(Math.max(...filas.map((f) => f.total), d.presu, 1));
  const x = (i) => filas.length === 1 ? margen.left + ancho / 2 : margen.left + (i / (filas.length - 1)) * ancho;
  const y = (valor) => margen.top + alto - (Math.max(0, valor) / max) * alto;
  const puntos = filas.map((f, i) => ({ x: x(i), y: y(f.total), f, i }));
  const linea = puntos.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const area = puntos.length > 1
    ? `${linea} L${puntos[puntos.length - 1].x.toFixed(1)} ${(margen.top + alto).toFixed(1)} L${puntos[0].x.toFixed(1)} ${(margen.top + alto).toFixed(1)} Z`
    : '';
  const yTicks = [0, max / 2, max];
  const grid = yTicks.map((valor) => {
    const py = y(valor);
    return `<line x1="${margen.left}" x2="${w - margen.right}" y1="${py.toFixed(1)}" y2="${py.toFixed(1)}" stroke="rgba(255,255,255,.065)" stroke-width="1"/>
      <text x="${margen.left - 6}" y="${(py + 3).toFixed(1)}" text-anchor="end">${eur0(valor)}</text>`;
  }).join('');
  const pasoEtiqueta = filas.length > 8 ? 2 : 1;
  const etiquetasX = filas.map((f, i) => {
    if (i % pasoEtiqueta !== 0 && i !== filas.length - 1) return '';
    const label = `${etiquetaMes(f.mk)}${f.incompleto ? '*' : ''}`;
    return `<text x="${x(i).toFixed(1)}" y="${h - 8}" text-anchor="${i === 0 ? 'start' : i === filas.length - 1 ? 'end' : 'middle'}">${label}</text>`;
  }).join('');
  const maxIdx = filas.reduce((best, f, i) => f.total > filas[best].total ? i : best, 0);
  const mostrarTodos = filas.length <= 6;
  const etiquetasValor = puntos.map((p) => {
    if (!mostrarTodos && p.i !== maxIdx && p.i !== filas.length - 1) return '';
    const ancla = p.i === 0 ? 'start' : p.i === filas.length - 1 ? 'end' : 'middle';
    return `<text class="chart-value" x="${p.x.toFixed(1)}" y="${(p.y - 7).toFixed(1)}" text-anchor="${ancla}">${eur0(p.f.total)}</text>`;
  }).join('');
  const puntosSvg = puntos.map((p) => {
    const titulo = `${fmtMes(p.f.mk)}: ${eur(p.f.total)}${p.f.incompleto ? ' (mes en curso)' : ''}`;
    return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.f.incompleto ? 3.4 : 3}" fill="${p.f.incompleto ? '#080a0c' : '#2eea8b'}" stroke="#2eea8b" stroke-width="${p.f.incompleto ? 1.6 : 0}"><title>${titulo}</title></circle>`;
  }).join('');
  const lineaPresupuesto = d.presu > 0
    ? `<line x1="${margen.left}" x2="${w - margen.right}" y1="${y(d.presu).toFixed(1)}" y2="${y(d.presu).toFixed(1)}" stroke="rgba(255,255,255,.32)" stroke-width="1.2" stroke-dasharray="4 4"/>`
    : '';

  return `<svg class="analysis-chart-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Evolución del gasto mensual y presupuesto">
    ${grid}
    ${lineaPresupuesto}
    ${d.presu > 0 ? `<text x="${w - margen.right}" y="${(y(d.presu) - 5).toFixed(1)}" text-anchor="end">Presupuesto ${eur0(d.presu)}</text>` : ''}
    ${area ? `<path d="${area}" fill="rgba(46,234,139,.065)"/>` : ''}
    ${puntos.length > 1 ? `<path d="${linea}" fill="none" stroke="#2eea8b" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>` : ''}
    ${puntosSvg}
    ${etiquetasValor}
    ${etiquetasX}
  </svg>`;
}

function vistaAnalisis(view) {
  view.classList.add('view-analisis');
  const d = construirAnalisis(ui.analisisMeses || 6);
  const n = d.n;
  const pctMedia = d.presu > 0 ? d.media / d.presu : null;
  const mostrarVariacion = d.variacionPeriodo != null && d.mesesBase.length >= 2 && d.mesesPreviosBase.length >= 2;
  const variacionClase = mostrarVariacion ? d.variacionPeriodo > 0 ? 'pct-bad' : d.variacionPeriodo < 0 ? 'pct-good' : '' : '';
  const variacionTxt = mostrarVariacion
    ? `${fmtPct(d.variacionPeriodo, { decimales: 1 })} vs. periodo anterior${d.tendenciaFiable ? '' : ' · poca muestra'}`
    : 'Sin periodo anterior comparable';
  const sobreMedia = d.masCaro && d.media > 0 ? (d.masCaro.total - d.media) / d.media : null;
  const mesesTxt = pluralMeses(d.mesesBase.length);
  const propuestas = d.propuestas;
  const plan = d.plan;

  const kpis = `
    <div class="analysis-kpis stat-grid two">
      <div class="stat analysis-kpi">
        <div class="label">Gasto total</div>
        <div class="value">${eur0(d.totalPeriodo)}</div>
        <div class="hint ${variacionClase}">${variacionTxt}${d.mesActualIncompleto ? ' · incluye mes en curso' : ''}</div>
      </div>
      <div class="stat analysis-kpi">
        <div class="label">Media mensual</div>
        <div class="value">${eur0(d.media)}</div>
        <div class="hint ${pctMedia != null ? pctClass(pctMedia) : ''}">${pctMedia != null ? `${fmtPct(pctMedia, { conSigno: false, decimales: 0 })} del presupuesto` : 'Sin presupuesto'} · ${mesesTxt}</div>
      </div>
      <div class="stat analysis-kpi">
        <div class="label">Mes más caro</div>
        <div class="value">${d.masCaro ? eur0(d.masCaro.total) : '—'}</div>
        <div class="hint">${d.masCaro ? `${fmtMes(d.masCaro.mk)}${d.masCaro.incompleto ? ' (en curso)' : ''}` : 'Sin datos'}${sobreMedia != null && sobreMedia > 0.05 ? ` · ${fmtPct(sobreMedia, { decimales: 0 })} sobre la media` : ''}</div>
      </div>
      <div class="stat analysis-kpi">
        <div class="label">Meses por encima</div>
        <div class="value ${d.mesesPorEncima ? 'pct-bad' : 'pct-good'}">${d.mesesPorEncima}</div>
        <div class="hint">de ${mesesTxt} con datos${d.presu > 0 ? ` · límite ${eur0(d.presu)}` : ' · sin límite'}</div>
      </div>
    </div>`;

  const filasTabla = d.filasActuales.map((f) => {
    const presuMes = +f.presupuesto || 0;
    const pct = presuMes > 0 ? f.total / presuMes : null;
    const estado = f.n === 0
      ? '<span class="trend-neutral">sin datos</span>'
      : pct == null
        ? '—'
        : `<span class="${pct > 1 ? 'pct-bad' : pct > 0.7 ? 'pct-warn' : 'pct-good'}">${fmtPct(pct, { conSigno: false, decimales: 0 })}</span>`;
    return `<tr>
      <td>${etiquetaMes(f.mk)}${f.incompleto ? ' *' : ''}</td>
      <td>${f.n ? eur0(f.total) : '—'}</td>
      <td>${presuMes > 0 ? eur0(presuMes) : '—'}</td>
      <td>${estado}</td>
    </tr>`;
  }).join('');

  const detalleMensual = `
    <details class="analysis-details">
      <summary>Ver detalle mensual <span class="chev">${icono('chevron', 14)}</span></summary>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Mes</th><th>Gasto</th><th>Presupuesto</th><th>% límite</th></tr></thead>
          <tbody>${filasTabla}</tbody>
        </table>
      </div>
      ${d.mesActualIncompleto ? '<p class="analysis-note">* El mes en curso está incompleto y no se usa para la media ni para las tendencias.</p>' : ''}
    </details>`;

  const conclusionesHtml = d.conclusiones.map((c) => {
    const contenido = `
      <span class="conclusion-ico">${icono(c.icono || 'analisis', 16)}</span>
      <span class="conclusion-body"><strong>${escapeHtml(c.titulo)}</strong><span>${c.texto}</span></span>
      ${c.detalle ? `<span class="conclusion-chev">${icono('chevron', 14)}</span>` : ''}`;
    if (!c.detalle) return `<div class="conclusion-item ${c.tipo}">${contenido}</div>`;
    const attr = c.detalle.tipo === 'cat'
      ? `data-detalle-cat="${escapeHtml(c.detalle.id)}"`
      : c.detalle.tipo === 'mes'
        ? `data-detalle-mes="${escapeHtml(c.detalle.mk)}"`
        : c.detalle.tipo === 'plan'
          ? 'data-detalle-plan="1"'
          : 'data-detalle-periodo="1"';
    return `<button class="conclusion-item ${c.tipo}" type="button" ${attr}>${contenido}</button>`;
  }).join('');

  const cambiosHtml = d.cambios.length ? d.cambios.map((c) => {
    const clase = claseTendencia(c.pct);
    const pctTxt = c.pct != null ? fmtPct(c.pct, { decimales: 0 }) : (c.totalPrevio === 0 && c.totalActual > 0 ? 'nuevo' : c.totalActual === 0 && c.totalPrevio > 0 ? 'sin gasto' : '—');
    const flecha = c.pct == null ? '' : c.pct > 0.02 ? '↑ ' : c.pct < -0.02 ? '↓ ' : '→ ';
    return `<button class="change-row" type="button" data-detalle-cat="${escapeHtml(c.id)}" aria-label="Ver detalle de ${escapeHtml(c.nombre)}">
      <span class="change-ico" style="background:${c.color}1f;border-color:${c.color}33">${emojiCategoria(c.nombre)}</span>
      <span class="change-main"><strong>${escapeHtml(c.nombre)}</strong><small>media ${eur0(c.mediaActual)}/mes</small></span>
      <span class="change-value ${clase}"><strong>${fmtEurDelta(c.delta)}</strong><small>${flecha}${pctTxt}</small></span>
      <span class="change-chev">${icono('chevron', 14)}</span>
    </button>`;
  }).join('') : `<div class="analysis-empty">${d.tendenciaFiable ? 'No hay cambios suficientemente grandes en el periodo seleccionado.' : 'Necesitas al menos 3 meses con datos para comparar cambios de forma fiable.'}</div>`;

  const comparativa = d.cats
    .filter((c) => c.totalActual > 0 || c.totalPrevio > 0 || c.presupuesto > 0)
    .sort((a, b) => b.mediaActual - a.mediaActual)
    .map((c) => {
      const pctTxt = c.pct != null && d.tendenciaFiable
        ? `${c.pct > 0.02 ? '↑ ' : c.pct < -0.02 ? '↓ ' : '→ '}${fmtPct(c.pct, { decimales: 0 })}`
        : c.totalPrevio === 0 && c.totalActual > 0
          ? 'nuevo'
          : c.totalActual === 0 && c.totalPrevio > 0
            ? 'sin gasto'
            : '—';
      return `<button class="cat-compare-row" type="button" data-detalle-cat="${escapeHtml(c.id)}" aria-label="Ver detalle de ${escapeHtml(c.nombre)}">
        <span class="cat-compare-main">
          <span class="cat-compare-ico" style="background:${c.color}1f;border-color:${c.color}33">${emojiCategoria(c.nombre)}</span>
          <span class="cat-compare-name"><strong>${escapeHtml(c.nombre)}</strong><small>${c.presupuesto > 0 ? `límite ${eur0(c.presupuesto)}` : 'sin límite'}</small></span>
        </span>
        <span class="cat-compare-media">${eur0(c.mediaActual)}<small>/mes</small></span>
        <span class="cat-compare-trend ${d.tendenciaFiable ? claseTendencia(c.pct) : 'trend-neutral'}">${pctTxt}</span>
      </button>`;
    }).join('');

  const propuestasHtml = !propuestas.suficiente
    ? `<div class="analysis-empty"><strong>Necesitas al menos 3 meses con datos</strong><br>Cuando tengas más histórico podremos comparar tus límites con tu gasto real sin reaccionar a un mes atípico.</div>`
    : propuestas.propuestas.length
      ? propuestas.propuestas.map((p) => {
        const sube = p.delta > 0;
        const confianzaCls = p.confianza === 'alta' ? 'pct-good' : p.confianza === 'media' ? 'pct-warn' : 'trend-neutral';
        return `<div class="budget-item">
          <div class="budget-top">
            <span class="budget-ico" style="background:${p.c.color}1f;border-color:${p.c.color}33">${emojiCategoria(p.c.nombre)}</span>
            <div class="budget-main"><strong>${escapeHtml(p.c.nombre)}</strong><span class="${confianzaCls}">Confianza ${p.confianza}</span></div>
            <span class="budget-delta ${sube ? 'up' : 'down'}">${fmtEurDelta(p.delta)}</span>
          </div>
          <div class="budget-line">
            <span>Actual <strong>${eur0(p.actual)}</strong></span>
            <span class="arrow">→</span>
            <span>Nuevo <strong>${eur0(p.sugerido)}</strong></span>
          </div>
          <p class="budget-reason">${escapeHtml(p.motivo)}</p>
          <div class="budget-actions">
            <button class="btn small" type="button" data-presupuesto-aceptar="${escapeHtml(p.c.id)}" data-presupuesto-valor="${p.sugerido}" data-key="${escapeHtml(p.key)}">Aceptar</button>
            <button class="btn small ghost" type="button" data-presupuesto-rechazar="1" data-key="${escapeHtml(p.key)}">Descartar</button>
          </div>
        </div>`;
      }).join('')
      : `<div class="analysis-empty">${propuestas.irregulares.length ? 'No hay ajustes automáticos claros; revisa las categorías con picos antes de cambiar límites.' : 'Tus presupuestos están alineados con tu gasto habitual. No hay ajustes claros con los datos actuales.'}</div>`;

  const irregularesHtml = propuestas.irregulares.length
    ? `<div class="analysis-note"><strong>Revisión manual:</strong> ${propuestas.irregulares.slice(0, 2).map((x) => `${escapeHtml(x.c.nombre)}: ${escapeHtml(x.motivo)}`).join(' ')}${propuestas.irregulares.length > 2 ? ` Y ${propuestas.irregulares.length - 2} más.` : ''}</div>`
    : '';

  const totalPropuestas = propuestas.propuestas.length
    ? `<div class="budget-total">
        <div><span>Si aceptas las visibles</span><strong>${eur0(propuestas.totalNuevo)}/mes</strong></div>
        <span class="pill ${propuestas.totalDelta > 0 ? 'pct-warn' : 'pct-good'}">${fmtEurDelta(propuestas.totalDelta)}/mes</span>
      </div>`
    : '';

  const ahorroTxt = plan.ahorroMax > 0
    ? plan.ahorroMin > 0 && plan.ahorroMax > plan.ahorroMin + 5
      ? `~${eur0(plan.ahorroMin)}–${eur0(plan.ahorroMax)}/mes`
      : `~${eur0(plan.ahorroMax)}/mes`
    : 'Sin ahorro claro';

  view.innerHTML = `
    <div class="analysis-page">
      <header class="page-head analysis-head">
        <div>
          <span class="eyebrow">Inteligencia de gastos</span>
          <h1>Análisis</h1>
          <p class="page-sub">Patrones, comparativas y decisiones para el próximo mes.</p>
        </div>
        <div class="chips period-chips" aria-label="Periodo de análisis">
          ${[3, 6, 12].map((m) => `<button class="chip ${n === m ? 'selected' : ''}" data-periodo="${m}" type="button">${m} meses</button>`).join('')}
        </div>
      </header>

      ${kpis}

      <section class="card analysis-card">
        <div class="card-head">
          <div><h2>Evolución del gasto</h2><p>Gasto real frente a tu presupuesto mensual</p></div>
          ${mostrarVariacion ? `<span class="pill ${variacionClase}" title="${d.tendenciaFiable ? 'Comparación con el periodo anterior de igual duración' : 'Comparación orientativa: menos de 3 meses con datos'}">${fmtPct(d.variacionPeriodo, { decimales: 1 })}</span>` : '<span class="pill trend-neutral">Sin comparación</span>'}
        </div>
        ${d.mesesBase.length ? graficoEvolucionAnalisis(d) : '<div class="analysis-empty">Aún no hay gastos registrados en este periodo.</div>'}
        ${d.mesesBase.length ? `<div class="analysis-chart-legend">
          <span class="analysis-legend-item"><i class="analysis-legend-dot"></i> Gasto real</span>
          ${d.presu > 0 ? '<span class="analysis-legend-item"><i class="analysis-legend-line dashed"></i> Presupuesto</span>' : ''}
          ${d.mesActualIncompleto ? '<span class="analysis-legend-item"><i class="analysis-legend-dot" style="background:transparent;border:1.5px solid var(--accent)"></i> Mes en curso *</span>' : ''}
        </div>` : ''}
        ${d.presu > 0 ? '<p class="analysis-note">El presupuesto es el actual y se aplica a todos los meses; no hay histórico de cambios de límites.</p>' : '<p class="analysis-note">No tienes un presupuesto mensual definido. Puedes crearlo en Ajustes.</p>'}
        ${detalleMensual}
      </section>

      <section class="card analysis-card">
        <div class="card-head"><div><h2>Principales conclusiones</h2><p>Lo más relevante de tus datos, ordenado por impacto</p></div></div>
        <div class="conclusion-list">${conclusionesHtml}</div>
      </section>

      <section class="card analysis-card">
        <div class="card-head"><div><h2>Cambios destacados</h2><p>Variación frente al periodo anterior de la misma duración</p></div></div>
        <div class="change-list">${cambiosHtml}</div>
        <p class="analysis-note">Un aumento no siempre es malo: puede reflejar más actividad o una compra puntual. La tendencia es una señal, no un juicio.</p>
      </section>

      <section class="card analysis-card">
        <div class="card-head"><div><h2>Comparativa por categoría</h2><p>Media mensual y tendencia del periodo</p></div></div>
        <div class="cat-compare">
          <div class="cat-compare-head"><span>Categoría</span><span>Media</span><span>Tendencia</span></div>
          ${comparativa || '<div class="analysis-empty">Sin categorías con datos en el periodo.</div>'}
        </div>
        <p class="analysis-note">${d.tendenciaFiable ? `Media calculada sobre ${mesesTxt} con datos. Tendencia frente al periodo anterior de igual duración.` : 'Tendencia orientativa: todavía no hay 3 meses con datos suficientes para consolidarla.'}</p>
      </section>

      <section class="card analysis-card">
        <div class="card-head">
          <div><h2>Ajuste de presupuestos</h2><p>Propuesta para el próximo mes basada en tu gasto real</p></div>
          <span class="pill">${propuestas.propuestas.length} ${propuestas.propuestas.length === 1 ? 'propuesta' : 'propuestas'}</span>
        </div>
        <p class="analysis-note" style="margin-top:0;margin-bottom:10px">Nada se modifica sin tu permiso. Cada propuesta se puede aceptar o descartar.</p>
        <div class="budget-list">${propuestasHtml}</div>
        ${irregularesHtml}
        ${totalPropuestas}
      </section>

      <section class="card analysis-card plan-card">
        <div class="card-head">
          <div><h2>Plan sugerido</h2><p>La acción con más impacto para el próximo mes</p></div>
          <span class="pill ${plan.tipo === 'positive' ? 'pct-good' : 'trend-neutral'}">Confianza ${plan.confianza}</span>
        </div>
        <div class="plan-hero">
          <span class="plan-ico">${icono(plan.icono || 'objetivo', 17)}</span>
          <div><strong>${escapeHtml(plan.titulo)}</strong><p>${escapeHtml(plan.texto)}</p></div>
        </div>
        <div class="plan-savings">
          <div><span>Ahorro potencial estimado</span><strong>${ahorroTxt}</strong></div>
          <small>${plan.ahorroExcesos > 0 ? 'Incluye ajustes de límites y reducción de excesos recurrentes.' : 'Calculado con tus límites y tu gasto histórico.'}</small>
        </div>
        <button class="btn secondary full" type="button" data-detalle-plan="1">Ver detalle del plan ${icono('flecha', 14)}</button>
      </section>

      <p class="hint">Sugerencias calculadas con tus propios límites y gastos; no son asesoramiento financiero.</p>
    </div>
  `;

  view.querySelectorAll('[data-periodo]').forEach((b) => {
    b.onclick = () => { ui.analisisMeses = +b.dataset.periodo; render(); };
  });

  view.querySelectorAll('[data-presupuesto-aceptar]').forEach((b) => {
    b.onclick = () => {
      const c = catPorId(b.dataset.presupuestoAceptar);
      const valor = parseAmount(b.dataset.presupuestoValor);
      if (!c || valor == null) return;
      c.presupuesto = valor;
      registrarPresupuesto(c.id, valor, currentMonthKey());
      stamp(c);
      ANALISIS_DESCARTADOS.delete(b.dataset.key);
      state.analisisDescartados = [...ANALISIS_DESCARTADOS];
      guardarEstado();
      toast(`Presupuesto de ${c.nombre} actualizado a ${eur0(valor)}`);
      render();
    };
  });

  view.querySelectorAll('[data-presupuesto-rechazar]').forEach((b) => {
    b.onclick = () => {
      ANALISIS_DESCARTADOS.add(b.dataset.key);
      state.analisisDescartados = [...ANALISIS_DESCARTADOS];
      guardarEstado(state, true);
      toast('Propuesta descartada');
      render();
    };
  });

  view.querySelectorAll('[data-detalle-cat]').forEach((b) => {
    b.onclick = () => modalDetalleCategoriaAnalisis(b.dataset.detalleCat);
  });
  view.querySelectorAll('[data-detalle-mes]').forEach((b) => {
    b.onclick = () => modalDetalleMesAnalisis(b.dataset.detalleMes);
  });
  view.querySelectorAll('[data-detalle-periodo]').forEach((b) => {
    b.onclick = () => modalDetallePeriodoAnalisis();
  });
  view.querySelectorAll('[data-detalle-plan]').forEach((b) => {
    b.onclick = () => modalDetallePlanAnalisis();
  });
}

function abrirModalAnalisis(html) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal">${html}</div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);
  overlay.querySelectorAll('[data-cerrar-modal]').forEach((b) => { b.onclick = cerrar; });
  return overlay;
}

function modalDetalleCategoriaAnalisis(id) {
  const d = construirAnalisis(ui.analisisMeses || 6);
  const c = d.cats.find((x) => x.id === id);
  if (!c) return;
  const filas = d.baseActual.map((f) => {
    const gasto = f.porCat[c.id] || 0;
    const p = (f.porCatPresu && f.porCatPresu[c.id]) || 0;
    const diff = f.n > 0 && p > 0 ? gasto - p : null;
    return `<tr>
      <td>${etiquetaMes(f.mk)}${f.incompleto ? ' *' : ''}</td>
      <td>${f.n ? eur0(gasto) : '—'}</td>
      <td>${p > 0 ? eur0(p) : '—'}</td>
      <td class="${diff == null ? '' : diff > 0 ? 'pct-bad' : 'pct-good'}">${diff == null ? '—' : fmtEurDelta(diff)}</td>
    </tr>`;
  }).join('');
  abrirModalAnalisis(`
    <h3>${escapeHtml(c.nombre)}</h3>
    <p class="hint">Detalle de los últimos ${pluralMeses(d.mesesBase.length)} con datos. Periodo anterior: media ${eur0(c.mediaPrevia)} · variación ${c.pct != null ? fmtPct(c.pct, { decimales: 1 }) : '—'}.</p>
    <div class="stat-grid two" style="margin:14px 0">
      <div class="stat"><div class="label">Media mensual</div><div class="value">${eur0(c.mediaActual)}</div></div>
      <div class="stat"><div class="label">Presupuesto</div><div class="value">${c.presupuesto > 0 ? eur0(c.presupuesto) : 'Sin límite'}</div></div>
      <div class="stat"><div class="label">Mediana</div><div class="value">${eur0(c.med)}</div></div>
      <div class="stat"><div class="label">Meses sobre límite</div><div class="value">${c.mesesSobre} de ${d.mesesBase.length}</div></div>
    </div>
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Mes</th><th>Gasto</th><th>Presupuesto</th><th>Diferencia</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
    </div>
    <div class="modal-actions"><button class="btn secondary" type="button" data-cerrar-modal="1">Cerrar</button></div>
  `);
}

function modalDetalleMesAnalisis(mk) {
  const gastos = gastosDelMes(mk).slice().sort((a, b) => b.monto - a.monto);
  const total = gastos.reduce((a, g) => a + g.monto, 0);
  const presu = presupuestoTotalMes(currentMonthKey());
  const lista = gastos.length
    ? gastos.slice(0, 12).map((g) => {
      const c = catPorId(g.catId);
      return `<div class="exp-item" style="cursor:default">
        <span class="dot" style="background:${c ? c.color : '#64748b'}"></span>
        <span class="exp-main"><span class="exp-note">${escapeHtml(c ? c.nombre : 'Sin etiqueta')}</span><span class="exp-cat">${fmtDia(g.fecha)}${g.nota ? ' · ' + escapeHtml(g.nota) : ''}</span></span>
        <span class="exp-amount">${eur(g.monto)}</span>
      </div>`;
    }).join('')
    : '<div class="analysis-empty">No hay gastos registrados en este mes.</div>';
  abrirModalAnalisis(`
    <h3>${fmtMes(mk)}</h3>
    <p class="hint">${gastos.length} ${gastos.length === 1 ? 'gasto' : 'gastos'} registrados${presu > 0 ? ` · presupuesto ${eur0(presu)}` : ''}.</p>
    <div class="stat-grid two" style="margin:14px 0">
      <div class="stat"><div class="label">Gasto total</div><div class="value">${eur0(total)}</div></div>
      <div class="stat"><div class="label">Estado</div><div class="value ${presu > 0 && total > presu ? 'pct-bad' : 'pct-good'}">${presu > 0 ? (total > presu ? 'Por encima' : 'Dentro') : 'Sin límite'}</div></div>
    </div>
    ${gastos.length > 12 ? `<p class="hint">Se muestran los 12 gastos más altos de ${gastos.length}.</p>` : ''}
    <div>${lista}</div>
    <div class="modal-actions"><button class="btn secondary" type="button" data-cerrar-modal="1">Cerrar</button></div>
  `);
}

function modalDetallePeriodoAnalisis() {
  const d = construirAnalisis(ui.analisisMeses || 6);
  const filas = d.baseActual.map((f) => {
    const presuMes = +f.presupuesto || 0;
    const pct = presuMes > 0 ? f.total / presuMes : null;
    return `<tr>
      <td>${etiquetaMes(f.mk)}${f.incompleto ? ' *' : ''}</td>
      <td>${f.n ? eur0(f.total) : '—'}</td>
      <td>${presuMes > 0 ? eur0(presuMes) : '—'}</td>
      <td class="${pct == null ? '' : pct > 1 ? 'pct-bad' : pct > 0.7 ? 'pct-warn' : 'pct-good'}">${pct == null ? '—' : fmtPct(pct, { conSigno: false, decimales: 0 })}</td>
    </tr>`;
  }).join('');
  abrirModalAnalisis(`
    <h3>Comparativa del periodo</h3>
    <p class="hint">Periodo actual frente al inmediatamente anterior de la misma duración.</p>
    <div class="stat-grid two" style="margin:14px 0">
      <div class="stat"><div class="label">Media actual</div><div class="value">${eur0(d.media)}</div></div>
      <div class="stat"><div class="label">Media anterior</div><div class="value">${eur0(d.mediaPrevia)}</div></div>
      <div class="stat"><div class="label">Variación</div><div class="value ${d.variacionPeriodo == null ? '' : d.variacionPeriodo > 0 ? 'pct-bad' : 'pct-good'}">${d.variacionPeriodo == null ? '—' : fmtPct(d.variacionPeriodo, { decimales: 1 })}</div></div>
      <div class="stat"><div class="label">Meses con datos</div><div class="value">${d.mesesBase.length}</div></div>
    </div>
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Mes</th><th>Gasto</th><th>Presupuesto</th><th>% límite</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
    </div>
    <div class="modal-actions"><button class="btn secondary" type="button" data-cerrar-modal="1">Cerrar</button></div>
  `);
}

function modalDetallePlanAnalisis() {
  const d = construirAnalisis(ui.analisisMeses || 6);
  const p = d.propuestas;
  const propuestas = p.propuestas.length
    ? p.propuestas.map((x) => `<div class="budget-item">
        <div class="budget-top">
          <span class="budget-ico" style="background:${x.c.color}1f;border-color:${x.c.color}33">${emojiCategoria(x.c.nombre)}</span>
          <div class="budget-main"><strong>${escapeHtml(x.c.nombre)}</strong><span>${x.delta > 0 ? 'Subir límite' : 'Bajar límite'} · confianza ${x.confianza}</span></div>
          <span class="budget-delta ${x.delta > 0 ? 'up' : 'down'}">${fmtEurDelta(x.delta)}</span>
        </div>
        <div class="budget-line"><span>Actual <strong>${eur0(x.actual)}</strong></span><span class="arrow">→</span><span>Nuevo <strong>${eur0(x.sugerido)}</strong></span></div>
        <p class="budget-reason">${escapeHtml(x.motivo)}</p>
      </div>`).join('')
    : '<div class="analysis-empty">No hay propuestas de presupuesto con los datos actuales.</div>';
  const excesos = d.cats
    .filter((c) => c.id !== '__none' && c.presupuesto > 0 && c.mesesSobre >= 2)
    .sort((a, b) => b.excesoMedio - a.excesoMedio)
    .slice(0, 4)
    .map((c) => `<div class="history-item" style="cursor:default"><span class="m">${escapeHtml(c.nombre)}<span class="c" style="display:block">${c.mesesSobre} meses por encima</span></span><span class="v pct-bad">${eur0(c.excesoMedio)}/mes</span></div>`)
    .join('');
  abrirModalAnalisis(`
    <h3>Detalle del plan</h3>
    <p class="hint">${escapeHtml(d.plan.texto)}</p>
    <div class="plan-savings" style="margin-top:12px">
      <div><span>Ahorro potencial estimado</span><strong>${d.plan.ahorroMax > 0 ? (d.plan.ahorroMin > 0 && d.plan.ahorroMax > d.plan.ahorroMin + 5 ? `~${eur0(d.plan.ahorroMin)}–${eur0(d.plan.ahorroMax)}/mes` : `~${eur0(d.plan.ahorroMax)}/mes`) : 'Sin ahorro claro'}</strong></div>
      <small>Confianza ${d.plan.confianza}</small>
    </div>
    <h3 style="margin:16px 0 8px;font-size:0.92rem">Ajustes de presupuesto</h3>
    ${propuestas}
    ${excesos ? `<h3 style="margin:16px 0 4px;font-size:0.92rem">Excesos recurrentes</h3>${excesos}` : ''}
    <p class="analysis-note">Las propuestas son sugerencias. No se aplicará ningún cambio hasta que lo aceptes en la pantalla de Análisis.</p>
    <div class="modal-actions"><button class="btn secondary" type="button" data-cerrar-modal="1">Cerrar</button></div>
  `);
}

/* ============ Vista: Compartidos / Bizum ============ */
function vistaCompartidos(view) {
  const bal = balancesCompartidos();
  const gente = personasLista();
  const evs = (state.compartidosEventos || []).slice().sort((a, b) => String(b.fecha || '').localeCompare(String(a.fecha || '')) || (b.creado || 0) - (a.creado || 0));
  const bzs = (state.bizums || []).slice().sort((a, b) => String(b.fecha || '').localeCompare(String(a.fecha || '')) || (b.creado || 0) - (a.creado || 0));

  const filasGente = gente.length ? gente.map((p) => {
    const s = bal.saldo[p.id] || 0;
    const cls = s > 0.004 ? 'pct-good' : s < -0.004 ? 'pct-bad' : '';
    return `<div class="history-item" style="cursor:default">
      <span class="m" style="flex:1">${escapeHtml(p.nombre)}<span class="c" style="display:block">${s > 0.004 ? 'te debe' : s < -0.004 ? 'le debes' : 'en paz'}</span></span>
      <span class="v ${cls}">${s > 0 ? '+' : s < 0 ? '−' : ''}${eur(Math.abs(s))}</span>
      <button class="icon-btn danger" data-del-per="${p.id}" type="button" aria-label="Eliminar persona">🗑</button>
    </div>`;
  }).join('') : '<div class="empty" style="padding:14px">Añade personas para controlar cenas y bizums.</div>';

  const filasEv = evs.length ? evs.slice(0, 25).map((ev) => {
    const mi = (ev.participantes || []).find((x) => x.id === 'yo');
    const miParte = mi ? +mi.importe || 0 : 0;
    return `<div class="history-item" style="cursor:default">
      <span class="m" style="flex:1">${escapeHtml(ev.descripcion || 'Gasto compartido')}
        <span class="c" style="display:block">${fmtDia(ev.fecha)} · pagó ${escapeHtml(nombreParticipante(ev.pagador))} · tu parte ${eur(miParte)}</span></span>
      <span class="v">${eur(ev.importe)}</span>
      <button class="icon-btn danger" data-del-ev="${ev.id}" type="button" aria-label="Eliminar gasto">🗑</button>
    </div>`;
  }).join('') : '<div class="empty" style="padding:14px">Aún no hay gastos compartidos. Añade una cena y reparte.</div>';

  const filasBz = bzs.length ? bzs.slice(0, 25).map((b) => {
    const importe = +b.importe || 0;
    const mePagan = importe > 0;
    return `<div class="history-item" style="cursor:default">
      <span class="m" style="flex:1">${escapeHtml(nombreParticipante(b.personaId))}
        <span class="c" style="display:block">${fmtDia(b.fecha)} · ${mePagan ? 'me pagó' : 'le pagué'}${b.nota ? ' · ' + escapeHtml(b.nota) : ''}</span></span>
      <span class="v ${mePagan ? 'pct-good' : 'pct-bad'}">${mePagan ? '+' : '−'}${eur(Math.abs(importe))}</span>
      <button class="icon-btn danger" data-del-bz="${b.id}" type="button" aria-label="Eliminar bizum">🗑</button>
    </div>`;
  }).join('') : '<div class="empty" style="padding:14px">Sin bizums registrados.</div>';

  view.innerHTML = `
    <header class="page-head">
      <div>
        <span class="eyebrow">Gastos en común</span>
        <h1>Compartidos y Bizum</h1>
        <p class="page-sub">Cenas, regalos y transferencias: quién te debe y cuánto.</p>
      </div>
      <button class="btn secondary small" id="comp-back" type="button">← Volver a gastos</button>
    </header>
    <div class="summary-strip">
      <div><div class="label">Te deben</div><div class="value pct-good">${eur(bal.debido)}</div></div>
      <div><div class="label">Debes</div><div class="value pct-bad">${eur(bal.debo)}</div></div>
      <div><div class="label">Neto</div><div class="value ${bal.neto >= 0 ? 'pct-good' : 'pct-bad'}">${bal.neto >= 0 ? '+' : '−'}${eur(Math.abs(bal.neto))}</div></div>
    </div>
    <button class="btn full" id="add-evento" type="button">+ Gasto compartido</button>
    <div style="display:flex;gap:10px;margin:10px 0 6px;flex-wrap:wrap">
      <button class="btn secondary small" id="add-persona" type="button">+ Añadir persona</button>
      <button class="btn secondary small" id="add-bizum" type="button">💸 Registrar Bizum</button>
    </div>

    <h2 style="margin:16px 4px 10px">Personas</h2>
    <div class="card" style="padding-top:4px;padding-bottom:4px">${filasGente}</div>

    <h2 style="margin:16px 4px 10px">Gastos compartidos</h2>
    <div class="card" style="padding-top:4px;padding-bottom:4px">${filasEv}</div>

    <h2 style="margin:16px 4px 10px">Bizums</h2>
    <div class="card" style="padding-top:4px;padding-bottom:4px">${filasBz}</div>
  `;

  $('#comp-back').onclick = () => irTab('gastos');
  $('#add-evento').onclick = () => modalEventoCompartido();
  $('#add-persona').onclick = () => modalPersona();
  $('#add-bizum').onclick = () => modalBizum();
  view.querySelectorAll('[data-del-per]').forEach((b) => {
    b.onclick = () => {
      const id = b.dataset.delPer;
      const p = personasLista().find((x) => x.id === id);
      if (!p) return;
      const usada = (state.compartidosEventos || []).some((ev) => ev.pagador === id || (ev.participantes || []).some((x) => x.id === id)) || (state.bizums || []).some((b2) => b2.personaId === id);
      if (usada) return toast('No puedes borrar a ' + p.nombre + ': tiene gastos o bizums', 'error');
      if (!confirm('¿Eliminar a ' + p.nombre + '?')) return;
      tumba('personas', id);
      state.personas = state.personas.filter((x) => x.id !== id);
      guardarEstado(); render();
    };
  });
  view.querySelectorAll('[data-del-ev]').forEach((b) => {
    b.onclick = () => {
      const id = b.dataset.delEv;
      const ev = (state.compartidosEventos || []).find((x) => x.id === id);
      if (!ev) return;
      if (!confirm('¿Eliminar este gasto compartido?' + (ev.gastoId ? ' También se borrará de Gastos.' : ''))) return;
      tumba('compartidosEventos', id);
      state.compartidosEventos = state.compartidosEventos.filter((x) => x.id !== id);
      if (ev.gastoId) {
        tumba('gastos', ev.gastoId);
        state.gastos = state.gastos.filter((g) => g.id !== ev.gastoId);
      }
      guardarEstado(); render();
    };
  });
  view.querySelectorAll('[data-del-bz]').forEach((b) => {
    b.onclick = () => {
      const id = b.dataset.delBz;
      if (!confirm('¿Eliminar este bizum?')) return;
      tumba('bizums', id);
      state.bizums = state.bizums.filter((x) => x.id !== id);
      guardarEstado(); render();
    };
  });
}

/* ---- Modal: nueva persona ---- */
function modalPersona() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>Añadir persona</h3>
      <div class="field"><label for="per-nombre">Nombre</label>
        <input id="per-nombre" type="text" placeholder="Ej.: María" autofocus /></div>
      <div class="modal-actions">
        <button class="btn secondary" id="per-cancel" type="button">Cancelar</button>
        <button class="btn" id="per-save" type="button">Guardar</button>
      </div>
    </div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);
  $('#per-cancel', overlay).onclick = cerrar;
  $('#per-save', overlay).onclick = () => {
    const nombre = $('#per-nombre', overlay).value.trim();
    if (!nombre) return toast('Escribe un nombre', 'error');
    if (personasLista().some((p) => p.nombre.toLowerCase() === nombre.toLowerCase())) return toast('Esa persona ya existe', 'error');
    state.personas = state.personas || [];
    state.personas.push(stamp({ id: uid(), nombre }));
    guardarEstado(); cerrar(); toast('Persona añadida'); render();
  };
  $('#per-nombre', overlay).addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#per-save', overlay).click(); });
}

/* ---- Modal: gasto compartido ---- */
function modalEventoCompartido() {
  if (!personasLista().length) {
    toast('Añade al menos una persona primero', 'error');
    return modalPersona();
  }
  const cats = state.categorias;
  const catDef = cats.find((c) => /ocio/i.test(c.nombre)) || cats[0];
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>Gasto compartido</h3>
      <div class="form-card">
        <div class="field"><label for="ev-desc">Descripción</label>
          <input id="ev-desc" type="text" placeholder="Cena, regalo, taxi…" /></div>
        <div class="field-row" style="margin-bottom:12px">
          <div class="field"><label for="ev-importe">Importe total (€)</label>
            <input id="ev-importe" type="text" inputmode="decimal" placeholder="0,00" /></div>
          <div class="field"><label for="ev-fecha">Fecha</label>
            <input id="ev-fecha" type="date" value="${hoyISO()}" /></div>
        </div>
        <div class="field"><label for="ev-pagador">Pagó</label>
          <select id="ev-pagador">
            <option value="yo">Yo</option>
            ${personasLista().map((p) => `<option value="${p.id}">${escapeHtml(p.nombre)}</option>`).join('')}
          </select></div>
        <div class="field"><label for="ev-cuenta">Cuenta de la que sale / saldrá el dinero</label>
          <select id="ev-cuenta">
            ${holdingsActivos().filter(esCuentaEfectivo).map((h) => `<option value="${h.id}">${escapeHtml(h.nombre)}</option>`).join('')}
          </select></div>
        <div class="field"><label>Participantes</label>
          <div id="ev-parts">
            ${[
              { id: 'yo', nombre: 'Yo' },
              ...personasLista().map((p) => ({ id: p.id, nombre: p.nombre })),
            ].map((p) => `
              <div class="panel-item" data-part="${p.id}">
                <label style="display:flex;align-items:center;gap:8px;flex:1;color:var(--text)">
                  <input type="checkbox" class="ev-chk" style="width:auto" checked />
                  ${escapeHtml(p.nombre)}
                </label>
                <input type="text" class="w-budget ev-share" inputmode="decimal" placeholder="0,00" />
              </div>`).join('')}
          </div>
          <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap">
            <button class="btn secondary small" id="ev-split" type="button">Repartir a partes iguales</button>
          </div>
        </div>
        <div class="field">
          <label style="display:flex;align-items:center;gap:8px;color:var(--text)">
            <input type="checkbox" id="ev-gasto" style="width:auto" checked />
            Añadir mi parte a Gastos
          </label>
          <select id="ev-cat" style="margin-top:8px">
            ${cats.map((c) => `<option value="${c.id}" ${c.id === catDef?.id ? 'selected' : ''}>${escapeHtml(c.nombre)}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" id="ev-cancel" type="button">Cancelar</button>
        <button class="btn" id="ev-save" type="button">Guardar</button>
      </div>
    </div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);

  const filas = () => [...overlay.querySelectorAll('[data-part]')];
  const idsMarcados = () => filas().filter((f) => $('.ev-chk', f).checked).map((f) => f.dataset.part);

  const repartir = () => {
    const total = parseAmount($('#ev-importe', overlay).value) || 0;
    const ids = idsMarcados();
    const partes = repartirIgual(total, ids);
    filas().forEach((f) => {
      const inp = $('.ev-share', f);
      inp.value = partes[f.dataset.part] != null ? String(partes[f.dataset.part]).replace('.', ',') : '';
    });
  };
  $('#ev-split', overlay).onclick = repartir;
  $('#ev-importe', overlay).addEventListener('blur', () => {
    if (filas().every((f) => !$('.ev-share', f).value)) repartir();
  });
  filas().forEach((f) => $('.ev-chk', f).addEventListener('change', () => {
    // al cambiar participantes, reparte de nuevo si las cuotas estaban vacías
    if (filas().every((x) => !$('.ev-share', x).value)) repartir();
  }));

  $('#ev-cancel', overlay).onclick = cerrar;
  $('#ev-save', overlay).onclick = () => {
    const descripcion = $('#ev-desc', overlay).value.trim();
    const importe = parseAmount($('#ev-importe', overlay).value);
    const fecha = $('#ev-fecha', overlay).value;
    const pagador = $('#ev-pagador', overlay).value;
    if (!descripcion) return toast('Escribe una descripción', 'error');
    if (!importe || importe <= 0) return toast('Importe total inválido', 'error');
    if (!fecha) return toast('Fecha inválida', 'error');
    const participantes = [];
    let suma = 0;
    for (const f of filas()) {
      if (!$('.ev-chk', f).checked) continue;
      const share = parseAmount($('.ev-share', f).value) || 0;
      if (share < 0) return toast('Las partes no pueden ser negativas', 'error');
      participantes.push({ id: f.dataset.part, importe: Math.round(share * 100) / 100 });
      suma += share;
    }
    if (!participantes.length) return toast('Elige al menos un participante', 'error');
    if (Math.abs(suma - importe) > 0.02) {
      return toast(`Las partes suman ${eur(suma)} y el total es ${eur(importe)}; ajusta`, 'error');
    }
    if (participantes.length === 1 && participantes[0].id === 'yo') {
      return toast('Marca a alguien más o registra el gasto normal en Gastos', 'error');
    }
    const cuentaId = $('#ev-cuenta', overlay).value || 'h-ibercaja';
    const ev = stamp({
      id: uid(),
      fecha,
      descripcion,
      importe: Math.round(importe * 100) / 100,
      pagador,
      cuentaId,
      participantes,
      gastoId: null,
      creado: Date.now(),
    });
    const miParte = participantes.find((p) => p.id === 'yo');
    if ($('#ev-gasto', overlay).checked && miParte && miParte.importe > 0) {
      const g = stamp({
        id: uid(),
        monto: miParte.importe,
        fecha,
        catId: $('#ev-cat', overlay).value,
        cuentaId,
        nota: `${descripcion} (compartido)`,
        creado: Date.now(),
      });
      state.gastos.push(g);
      ev.gastoId = g.id;
    }
    state.compartidosEventos = state.compartidosEventos || [];
    state.compartidosEventos.push(ev);
    guardarEstado(); cerrar(); toast('Gasto compartido guardado'); render();
  };
}

/* ---- Modal: bizum / liquidación ---- */
function modalBizum() {
  if (!personasLista().length) {
    toast('Añade primero una persona', 'error');
    return modalPersona();
  }
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>Registrar Bizum</h3>
      <div class="form-card">
        <div class="field"><label for="bz-persona">Persona</label>
          <select id="bz-persona">
            ${personasLista().map((p) => `<option value="${p.id}">${escapeHtml(p.nombre)}</option>`).join('')}
          </select></div>
        <div class="field"><label for="bz-cuenta">Cuenta</label>
          <select id="bz-cuenta">
            ${holdingsActivos().filter(esCuentaEfectivo).map((h) => `<option value="${h.id}">${escapeHtml(h.nombre)}</option>`).join('')}
          </select></div>
        <div class="field-row" style="margin-bottom:12px">
          <div class="field"><label for="bz-dir">Dirección</label>
            <select id="bz-dir">
              <option value="recibo">Me ha pagado</option>
              <option value="envio">Le he pagado</option>
            </select></div>
          <div class="field"><label for="bz-importe">Importe (€)</label>
            <input id="bz-importe" type="text" inputmode="decimal" placeholder="0,00" /></div>
        </div>
        <div class="field"><label for="bz-fecha">Fecha</label>
          <input id="bz-fecha" type="date" value="${hoyISO()}" /></div>
        <div class="field"><label for="bz-nota">Nota (opcional)</label>
          <input id="bz-nota" type="text" placeholder="Ej.: cena sábado" /></div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" id="bz-cancel" type="button">Cancelar</button>
        <button class="btn" id="bz-save" type="button">Guardar</button>
      </div>
    </div>`;
  const cerrar = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  $('#modal-root').appendChild(overlay);
  activarModal(overlay);
  $('#bz-cancel', overlay).onclick = cerrar;
  $('#bz-save', overlay).onclick = () => {
    const personaId = $('#bz-persona', overlay).value;
    const importe = parseAmount($('#bz-importe', overlay).value);
    const fecha = $('#bz-fecha', overlay).value;
    if (!importe || importe <= 0) return toast('Importe inválido', 'error');
    if (!fecha) return toast('Fecha inválida', 'error');
    const signo = $('#bz-dir', overlay).value === 'recibo' ? 1 : -1;
    state.bizums = state.bizums || [];
    state.bizums.push(stamp({ id: uid(), personaId, importe: signo * Math.round(importe * 100) / 100, fecha, cuentaId: $('#bz-cuenta', overlay).value || 'h-ibercaja', nota: $('#bz-nota', overlay).value.trim(), creado: Date.now() }));
    guardarEstado(); cerrar(); toast('Bizum registrado'); render();
  };
}

/* ============ Vista: Ajustes ============ */
function vistaAjustes(view) {
  const presupuesto = state.categorias.map((c, i) => `
    <div class="panel-item">
      <span class="dot" style="width:12px;height:12px;border-radius:50%;background:${c.color};flex:none"></span>
      <input type="text" data-cnombre="${c.id}" value="${escapeHtml(c.nombre)}" aria-label="Nombre de categoría" />
      <input type="text" class="w-budget" inputmode="decimal" data-cpres="${c.id}" value="${String(c.presupuesto || 0).replace('.', ',')}" aria-label="Presupuesto" />
      <select data-ctipo="${c.id}" aria-label="Tipo de gasto" style="max-width:110px">
        ${[['fijo', 'Fijo'], ['variable', 'Variable'], ['irregular', 'Irregular']].map(([v, t]) => `<option value="${v}" ${(c.tipo || 'variable') === v ? 'selected' : ''}>${t}</option>`).join('')}
      </select>
      <button class="icon-btn danger" data-cdel="${c.id}" type="button" aria-label="Eliminar categoría">🗑</button>
    </div>`).join('');

  const portaleras = holdingsActivos().map((h) => `
    <div class="panel-item">
      <input type="text" data-hnombre="${h.id}" value="${escapeHtml(h.nombre)}" aria-label="Nombre de posición" />
      <select data-hcubo="${h.id}" aria-label="Espacio al que pertenece">
        ${state.cubos.map((cb) => `<option value="${cb.id}" ${cb.id === h.cubo ? 'selected' : ''}>${escapeHtml(cb.nombre)}</option>`).join('')}
      </select>
      <input type="text" class="w-budget" inputmode="decimal" data-hplan="${h.id}" value="${String(h.plan || 0).replace('.', ',')}" aria-label="Aportación plan" />
      <button class="icon-btn" data-hedit="${h.id}" type="button" aria-label="Editar posición">✏️</button>
      <button class="icon-btn danger" data-hdel="${h.id}" type="button" aria-label="Archivar posición">📦</button>
    </div>`).join('');

  const archivadas = state.holdings.filter((h) => h.archivada).map((h) => `
    <div class="panel-item">
      <span style="flex:1">${escapeHtml(h.nombre)}<span class="tiny" style="display:block">Archivada · ${escapeHtml(h.entidad || '')}</span></span>
      <button class="btn secondary small" data-hrestore="${h.id}" type="button">Restaurar</button>
    </div>`).join('');

  const recurrentes = (state.recurrentes || []).length
    ? state.recurrentes.map((r) => `<div class="panel-item">
        <span class="dot" style="width:10px;height:10px;border-radius:50%;background:${r.tipo === 'ingreso' ? 'var(--accent)' : 'var(--rose)'};flex:none"></span>
        <span style="flex:1">${escapeHtml(r.nombre)}<span class="tiny" style="display:block">${r.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'} · ${r.frecuencia} · día ${r.dia} · ${eur(r.importe)}</span></span>
        <button class="icon-btn" data-recedit="${r.id}" type="button" aria-label="Editar recurrente">✏️</button>
        <button class="icon-btn danger" data-recdel="${r.id}" type="button" aria-label="Eliminar recurrente">🗑</button>
      </div>`).join('')
    : '<div class="hint">Sin gastos ni ingresos recurrentes. Añade alquiler, suscripciones o nómina.</div>';

  const seguros = (state.seguros || []).length
    ? state.seguros.map((x) => `<div class="panel-item">
        <span style="flex:1">${escapeHtml(x.nombre)}<span class="tiny" style="display:block">${escapeHtml(x.tipo || 'Seguro')}${x.aseguradora ? ' · ' + escapeHtml(x.aseguradora) : ''} · ${eur(x.primaAnual)}/año</span></span>
        <button class="icon-btn danger" data-segdel="${x.id}" type="button" aria-label="Eliminar seguro">🗑</button>
      </div>`).join('')
    : '<div class="hint">Sin seguros registrados. Añade vida, salud, hogar o coche.</div>';

  const objetivos = state.cubos.map((cb) => `
    <div class="panel-item">
      <input type="text" data-cubonombre="${cb.id}" value="${escapeHtml(cb.nombre)}" aria-label="Nombre del espacio" />
      <input type="text" class="w-budget" inputmode="decimal" data-obj="${cb.id}" value="${String(cb.objetivo || 0).replace('.', ',')}" aria-label="Porcentaje objetivo" /> %
      <button class="icon-btn danger" data-cubodel="${cb.id}" type="button" aria-label="Eliminar espacio">🗑</button>
    </div>`).join('');

  const pg = state.ajustes.pagas || {};
  const pgRep = pg.reparto || {};
  const mesOpt = (sel) => MESES.map((m, i) => `<option value="${i + 1}" ${+sel === i + 1 ? 'selected' : ''}>${m.charAt(0).toUpperCase() + m.slice(1)}</option>`).join('');
  const sumaPct = (+pgRep.vivienda || 0) + (+pgRep.etf || 0) + (+pgRep.viajes || 0);

  view.innerHTML = `
    <div class="settings-page">
    ${cabecera('Ajustes', false)}

    <div class="card">
      <div class="card-title"><span>Perfil y nómina</span></div>
      <div class="field"><label for="aj-nombre">Tu nombre</label>
        <input id="aj-nombre" type="text" placeholder="Ej.: Juan" value="${escapeHtml(state.ajustes.nombre || '')}" /></div>
      <div class="field"><label for="aj-ingreso">Ingreso neto mensual (€)</label>
        <input id="aj-ingreso" type="text" inputmode="decimal" value="${String(state.ajustes.ingreso || 0).replace('.', ',')}" /></div>
      <p class="hint">El nombre se usa en el saludo de Inicio. El ingreso alimenta el indicador de ahorro del mes y la nómina automática de Ibercaja. El día de cobro se ajusta desde la cuenta Ibercaja en Patrimonio.</p>
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
        <div class="field"><label for="pg-resto">Resto → día a día</label>
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
      ${archivadas ? `<div class="card-title" style="margin-top:16px"><span>Archivadas</span></div>${archivadas}` : ''}
      <button class="btn secondary small" id="btn-add-holding" type="button" style="margin-top:10px">+ Nueva posición</button>
    </div>

    <div class="card">
      <div class="card-title"><span>Reparto objetivo del patrimonio</span></div>
      ${objetivos}
      <button class="btn secondary small" id="btn-add-cubo" type="button" style="margin-top:10px">+ Nuevo espacio</button>
      <p class="hint">Estos porcentajes se comparan con tu cartera real en Plan y Patrimonio. No es obligatorio que sumen 100 %, pero conviene.</p>
    </div>

    <div class="card">
      <div class="card-title"><span>Gastos e ingresos recurrentes</span></div>
      ${recurrentes}
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">
        <button class="btn secondary small" id="btn-add-rec" type="button">+ Nuevo recurrente</button>
        <button class="btn secondary small" id="btn-apply-rec" type="button">Aplicar pendientes</button>
      </div>
      <p class="hint">Al aplicar, se crean los gastos o ingresos de los meses pendientes hasta hoy. No se duplican si ya se aplicaron.</p>
    </div>

    <div class="card">
      <div class="card-title"><span>Seguros</span></div>
      ${seguros}
      <button class="btn secondary small" id="btn-add-seg" type="button" style="margin-top:10px">+ Nuevo seguro</button>
      <p class="hint">La prima anual se usa como referencia de protección; no se suma automáticamente al gasto mensual salvo que la registres como recurrente.</p>
    </div>

    <div class="card">
      <div class="card-title"><span>Seguridad</span></div>
      <p class="hint">Bloquea la app con un PIN local. No sustituye al cifrado del dispositivo, pero evita que cualquiera que abra el navegador vea tus finanzas.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn secondary small" id="btn-pin-set" type="button">${state.ajustes.pinHash ? 'Cambiar PIN' : 'Configurar PIN'}</button>
        ${state.ajustes.pinHash ? '<button class="btn danger small" id="btn-pin-del" type="button">Quitar PIN</button>' : ''}
      </div>
      <p class="hint">El PIN se guarda hasheado en este dispositivo y no se sincroniza.</p>
    </div>

    <div class="card">
      <div class="card-title"><span>Historial de versiones</span></div>
      <p class="hint">El servidor local guarda una versión por cada sincronización. Puedes consultar y restaurar una versión anterior.</p>
      <button class="btn secondary small" id="btn-versiones" type="button">Ver versiones del servidor</button>
    </div>

    <div class="card" style="border-color:var(--accent)">
      <div class="card-title"><span>☁️ Nube gratis (GitHub · recomendado)</span></div>
      <p class="hint" style="margin-top:-4px;margin-bottom:10px">Tus datos van a un <strong>repo privado</strong> de GitHub (JSON invisible a todos + historial de cambios como commits). Funciona desde cualquier lugar, sin PC encendido. Publica la app en Pages con <strong>publicar_github.sh</strong>.</p>
      <div class="field"><label for="gh-repo">Repo de DATOS (usuario/repo, privado — NO el de la app)</label>
        <input id="gh-repo" type="text" placeholder="jstrunkgarcia/finanzas-datos" value="${escapeHtml((state.ajustes.github || {}).repo || '')}" />
        <p class="hint" style="margin-top:6px">El de datos es el <strong>privado</strong> (contiene <code>finanzas.json</code>). El repo público <code>finanzas-app</code> es solo el código de la web: no lo pongas aquí. Puedes pegar la URL completa y se corrige sola.</p></div>
      <div class="field"><label for="gh-token">Token de acceso (fine-grained: solo ese repo, permiso «Contents: Read and write»)</label>
        <input id="gh-token" type="password" placeholder="github_pat_…" value="${escapeHtml((state.ajustes.github || {}).token || '')}" /></div>
      <div class="field"><label for="gh-ruta">Archivo de datos</label>
        <input id="gh-ruta" type="text" placeholder="finanzas.json" value="${escapeHtml((state.ajustes.github || {}).ruta || '')}" /></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
        <button class="btn small" id="btn-gh-probar" type="button">🔄 Sincronizar con GitHub</button>
        <button class="btn secondary small" id="btn-gh-check" type="button">🔍 Comprobar token</button>
      </div>
      <p class="hint">Si lo configuras, se usa NUBE GITHUB y el servidor casero queda como respaldo. El token se guarda <strong>solo en este dispositivo</strong> (no se sincroniza ni se exporta). Crea el token en github.com → Settings → Developer settings → Fine-grained tokens.</p>
    </div>

    <div class="card">
      <div class="card-title"><span>Sincronizar dispositivos en red local</span></div>
      <div class="field"><label for="aj-sync">Servidor de sincronización</label>
        <input id="aj-sync" type="url" placeholder="http://192.168.1.x:8750" value="${escapeHtml(state.ajustes.syncUrl || '')}" /></div>
      <div class="field"><label for="aj-sync-token">Token del servidor (opcional, recomendado)</label>
        <input id="aj-sync-token" type="password" placeholder="Si configuras SYNC_TOKEN en el servidor" value="${escapeHtml(state.ajustes.syncToken || '')}" /></div>
      <p class="hint">Si el servidor tiene <code>SYNC_TOKEN</code>, la app debe enviar el mismo token. Se guarda solo en este dispositivo y no se sincroniza.</p>
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
        <button class="btn secondary small" id="btn-export-csv" type="button">⬇️ Movimientos CSV</button>
        <button class="btn secondary small" id="btn-export-resumen" type="button">⬇️ Resumen CSV</button>
        <button class="btn secondary small" id="btn-import" type="button">⬆️ Importar datos</button>
        <button class="btn danger small" id="btn-reset" type="button">Borrar todo</button>
      </div>
      <p class="hint">Los datos se guardan <strong>solo en este dispositivo</strong> (navegador). Exporta de vez en cuando para tener una copia o para pasarlos al móvil.</p>
      <input type="file" id="file-import" accept="application/json" style="display:none" />
    </div>

    <div class="card">
      <div class="card-title"><span>Instalar la app</span></div>
      <button class="btn full" id="btn-install" type="button" ${deferredInstall ? '' : 'disabled'}>📲 Instalar en este dispositivo</button>
      <button class="btn secondary small full" id="btn-update" type="button" style="margin-top:10px">🔄 Buscar actualización de la app</button>
      <div class="hint" id="version-info">Comprobando versión publicada…</div>
      <p class="hint">Si has publicado cambios y este dispositivo sigue con la versión vieja, pulsa «Buscar actualización»: recarga la última versión <strong>sin borrar tus datos ni el token</strong>.</p>
      <p class="hint"><strong>Android:</strong> abre la web en Chrome → menú (⋮) → «Añadir a pantalla de inicio».<br>
      <strong>iPhone:</strong> abre la web en Safari → botón Compartir → «Añadir a pantalla de inicio».<br>
      <strong>Ordenador:</strong> en Chrome, icono de instalación en la barra de direcciones.</p>
    </div>

    <p class="hint" style="text-align:center;margin-top:20px">Finanzas Personal · ${APP_VERSION} · datos locales; si configuras nube o servidor, se sincronizan</p>
    </div>
  `;

  // Perfil
  const nombreInput = $('#aj-nombre');
  if (nombreInput) nombreInput.addEventListener('change', (e) => {
    state.ajustes.nombre = e.target.value.trim();
    state.ajustes.mod = Date.now();
    guardarEstado();
    toast('Nombre guardado');
  });

  // Ingreso
  $('#aj-ingreso').addEventListener('change', (e) => {
    const v = parseAmount(e.target.value);
    state.ajustes.ingreso = v ?? 0;
    state.ajustes.mod = Date.now();
    reconciliarCuentasAuto();
    guardarEstado(); toast('Ingreso actualizado y cuentas reconciliadas');
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
    reconciliarCuentasAuto();
    guardarEstado(); toast(e.target.checked ? 'Pagas extra activadas' : 'Pagas extra desactivadas'); render();
  });
  $('#pg-importe').addEventListener('change', (e) => {
    pgActual().importe = parseAmount(e.target.value) ?? 0;
    reconciliarCuentasAuto();
    guardarEstado(); toast('Importe de paga guardado y cuentas reconciliadas');
  });
  $('#pg-numero').addEventListener('change', (e) => {
    pgActual().numero = +e.target.value === 1 ? 1 : 2;
    reconciliarCuentasAuto();
    guardarEstado(); pgRefrescar();
  });
  $('#pg-mes1').addEventListener('change', (e) => {
    pgActual().mes1 = +e.target.value || 6;
    reconciliarCuentasAuto();
    guardarEstado();
  });
  $('#pg-mes2').addEventListener('change', (e) => {
    pgActual().mes2 = +e.target.value || 12;
    reconciliarCuentasAuto();
    guardarEstado();
  });
  [['#pg-viv', 'vivienda'], ['#pg-etf', 'etf'], ['#pg-via', 'viajes']].forEach(([sel, clave]) => {
    $(sel).addEventListener('change', (e) => {
      const p = pgActual();
      p.reparto = p.reparto || {};
      p.reparto[clave] = Math.min(Math.max(parseAmount(e.target.value) ?? 0, 0), 100);
      reconciliarCuentasAuto();
      guardarEstado(); pgRefrescar();
    });
  });

  // Categorías
  view.querySelectorAll('[data-cnombre]').forEach((el) => el.addEventListener('change', () => {
    const c = catPorId(el.dataset.cnombre); c.nombre = el.value.trim() || c.nombre; stamp(c); guardarEstado();
  }));
  view.querySelectorAll('[data-cpres]').forEach((el) => el.addEventListener('change', () => {
    const c = catPorId(el.dataset.cpres);
    const valor = Math.max(0, parseAmount(el.value) ?? 0);
    c.presupuesto = valor;
    registrarPresupuesto(c.id, valor, currentMonthKey());
    stamp(c); guardarEstado();
  }));
  view.querySelectorAll('[data-ctipo]').forEach((el) => el.addEventListener('change', () => {
    const c = catPorId(el.dataset.ctipo);
    c.tipo = el.value;
    stamp(c); guardarEstado();
  }));
  view.querySelectorAll('[data-cdel]').forEach((el) => el.onclick = () => {
    const id = el.dataset.cdel;
    const c = catPorId(id);
    const usada = state.gastos.some((g) => g.catId === id);
    if (!confirm(usada ? 'Esta etiqueta tiene gastos guardados. Al borrarla seguirán como «Sin categoría». ¿Borrar?' : '¿Borrar esta etiqueta?')) return;
    if (c) tumba('categorias', id);
    for (const p of (state.presupuestosHistorial || []).filter((x) => x.catId === id)) tumba('presupuestosHistorial', p.id);
    state.presupuestosHistorial = (state.presupuestosHistorial || []).filter((x) => x.catId !== id);
    state.categorias = state.categorias.filter((x) => x.id !== id);
    guardarEstado(); render();
  });
  $('#btn-add-cat').onclick = () => {
    const nueva = stamp({ id: uid(), nombre: 'Nueva etiqueta', presupuesto: 0, color: PALETA[state.categorias.length % PALETA.length], tipo: 'variable' });
    state.categorias.push(nueva);
    registrarPresupuesto(nueva.id, 0, currentMonthKey());
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
  view.querySelectorAll('[data-hedit]').forEach((el) => el.onclick = () => modalCuenta(el.dataset.hedit));
  view.querySelectorAll('[data-hrestore]').forEach((el) => el.onclick = () => {
    const h = holdingPorId(el.dataset.hrestore);
    if (!h) return;
    h.archivada = false; h.activa = true; stamp(h);
    guardarEstado(); toast('Posición restaurada'); render();
  });
  view.querySelectorAll('[data-hdel]').forEach((el) => el.onclick = () => {
    const id = el.dataset.hdel;
    const h = holdingPorId(id);
    if (!h) return;
    if (!confirm(`¿Archivar «${h.nombre}»? Su historial se conserva y deja de contar en el patrimonio actual.`)) return;
    h.archivada = true;
    h.activa = false;
    stamp(h);
    guardarEstado(); toast('Posición archivada'); render();
  });
  $('#btn-add-holding').onclick = () => modalCuenta();

  // Recurrentes
  const addRec = $('#btn-add-rec');
  if (addRec) addRec.onclick = () => modalRecurrente();
  const applyRec = $('#btn-apply-rec');
  if (applyRec) applyRec.onclick = () => aplicarRecurrentes();
  view.querySelectorAll('[data-recedit]').forEach((el) => el.onclick = () => modalRecurrente(el.dataset.recedit));
  view.querySelectorAll('[data-recdel]').forEach((el) => el.onclick = () => {
    const r = (state.recurrentes || []).find((x) => x.id === el.dataset.recdel);
    if (!r) return;
    if (!confirm(`¿Eliminar el recurrente «${r.nombre}»?`)) return;
    tumba('recurrentes', r.id);
    state.recurrentes = state.recurrentes.filter((x) => x.id !== r.id);
    guardarEstado(); toast('Recurrente eliminado'); render();
  });

  // Seguros
  const addSeg = $('#btn-add-seg');
  if (addSeg) addSeg.onclick = () => modalSeguro();
  view.querySelectorAll('[data-segdel]').forEach((el) => el.onclick = () => {
    const x = (state.seguros || []).find((s) => s.id === el.dataset.segdel);
    if (!x) return;
    if (!confirm(`¿Eliminar el seguro «${x.nombre}»?`)) return;
    tumba('seguros', x.id);
    state.seguros = state.seguros.filter((s) => s.id !== x.id);
    guardarEstado(); toast('Seguro eliminado'); render();
  });

  // Seguridad: PIN
  const pinSet = $('#btn-pin-set');
  if (pinSet) pinSet.onclick = () => modalPin();
  const pinDel = $('#btn-pin-del');
  if (pinDel) pinDel.onclick = () => {
    if (!confirm('¿Quitar el PIN de este dispositivo?')) return;
    state.ajustes.pinHash = null;
    state.ajustes.mod = Date.now();
    guardarEstado(); toast('PIN eliminado'); render();
  };

  // Historial de versiones
  const btnVersiones = $('#btn-versiones');
  if (btnVersiones) btnVersiones.onclick = () => modalVersiones();

  // Objetivos
  view.querySelectorAll('[data-obj]').forEach((el) => el.addEventListener('change', () => {
    const cb = cuboPorId(el.dataset.obj);
    const n = parseAmount(el.value);
    cb.objetivo = Math.min(Math.max(n ?? 0, 0), 100);
    stamp(cb);
    guardarEstado();
  }));
  view.querySelectorAll('[data-cubonombre]').forEach((el) => el.addEventListener('change', () => {
    const cb = cuboPorId(el.dataset.cubonombre);
    cb.nombre = el.value.trim() || cb.nombre;
    stamp(cb); guardarEstado();
  }));
  view.querySelectorAll('[data-cubodel]').forEach((el) => el.onclick = () => {
    const id = el.dataset.cubodel;
    const cb = cuboPorId(id);
    if (!cb) return;
    const usado = state.holdings.some((h) => h.cubo === id) || (state.objetivos || []).some((g) => g.cuboId === id);
    if (usado) return toast('No puedes borrar un espacio con posiciones u objetivos', 'error');
    if (!confirm(`¿Eliminar el espacio «${cb.nombre}»?`)) return;
    tumba('cubos', id);
    state.cubos = state.cubos.filter((x) => x.id !== id);
    guardarEstado(); toast('Espacio eliminado'); render();
  });
  const addCubo = $('#btn-add-cubo');
  if (addCubo) addCubo.onclick = () => {
    state.cubos.push(stamp({ id: uid(), nombre: 'Nuevo espacio', objetivo: 0 }));
    guardarEstado(); render();
  };

  // Datos
  $('#btn-export').onclick = () => {
    const copia = JSON.parse(JSON.stringify(state));
    if (copia.ajustes) {
      delete copia.ajustes.github;
      delete copia.ajustes.syncUrl;
      delete copia.ajustes.syncAuto;
      delete copia.ajustes.syncToken;
      delete copia.ajustes.pinHash;
    }
    descargarArchivo(`finanzas-backup-${hoyISO()}.json`, JSON.stringify(copia, null, 2), 'application/json');
    toast('Backup JSON descargado');
  };
  const exportCsvAjustes = $('#btn-export-csv');
  if (exportCsvAjustes) exportCsvAjustes.onclick = () => descargarCSVMovimientos();
  const exportResumen = $('#btn-export-resumen');
  if (exportResumen) exportResumen.onclick = () => descargarResumenCSV();
  $('#btn-import').onclick = () => $('#file-import').click();
  $('#file-import').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const bruto = JSON.parse(reader.result);
        if (!bruto || typeof bruto !== 'object' || !Array.isArray(bruto.categorias)) throw new Error('formato');
        // Backup automático antes de reemplazar
        const copia = JSON.parse(JSON.stringify(state));
        if (copia.ajustes) { delete copia.ajustes.github; delete copia.ajustes.syncUrl; delete copia.ajustes.syncAuto; delete copia.ajustes.syncToken; delete copia.ajustes.pinHash; }
        descargarArchivo(`finanzas-antes-de-importar-${hoyISO()}.json`, JSON.stringify(copia, null, 2), 'application/json');
        const anterior = state;
        const importado = normalizarEstado(bruto);
        const ahora = Date.now();
        const tombas = [];
        for (const col of COLECCIONES) {
          const idsNuevos = new Set((importado[col] || []).map((x) => x && x.id).filter(Boolean));
          for (const x of (anterior[col] || [])) {
            if (x && x.id && !idsNuevos.has(x.id)) tombas.push({ t: col, id: x.id, mod: ahora });
          }
        }
        importado.eliminados = [...(importado.eliminados || []), ...tombas];
        importado.ajustes = {
          ...(importado.ajustes || {}),
          github: anterior.ajustes.github,
          syncUrl: anterior.ajustes.syncUrl,
          syncAuto: anterior.ajustes.syncAuto,
          syncToken: anterior.ajustes.syncToken,
          pinHash: anterior.ajustes.pinHash,
          mod: ahora,
        };
        guardarEstado(importado);
        toast('Datos importados; se descargó un backup del estado anterior');
        render();
      } catch {
        toast('El archivo no es un backup válido; no se ha cambiado nada', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };
  $('#btn-reset').onclick = () => {
    if (!confirm('Se borrarán TODOS los datos en este dispositivo Y en los otros conectados (gastos, inversiones, deudas y ajustes). ¿Continuar?')) return;
    if (!confirm('¿Seguro? Se descargará un backup antes. La acción no se puede deshacer en los dispositivos.')) return;
    const copia = JSON.parse(JSON.stringify(state));
    if (copia.ajustes) { delete copia.ajustes.github; delete copia.ajustes.syncUrl; delete copia.ajustes.syncAuto; delete copia.ajustes.syncToken; delete copia.ajustes.pinHash; }
    descargarArchivo(`finanzas-antes-de-borrar-${hoyISO()}.json`, JSON.stringify(copia, null, 2), 'application/json');
    const ahora = Date.now();
    const tombas = [];
    for (const col of COLECCIONES) {
      for (const x of (state[col] || [])) if (x && x.id) tombas.push({ t: col, id: x.id, mod: ahora });
    }
    const urlSync = state.ajustes.syncUrl;
    const autoSync = state.ajustes.syncAuto;
    const github = state.ajustes.github;
    const syncToken = state.ajustes.syncToken;
    const pinHash = state.ajustes.pinHash;
    state = normalizarEstado(seedState());
    state.eliminados = [...(state.eliminados || []), ...tombas];
    state.ajustes.syncUrl = urlSync;
    state.ajustes.syncAuto = autoSync;
    state.ajustes.github = github;
    state.ajustes.syncToken = syncToken;
    state.ajustes.pinHash = pinHash;
    state.ajustes.mod = ahora;
    guardarEstado(); // se sincroniza el borrado a los demás dispositivos
    ui.month = currentMonthKey();
    toast('Todo borrado; backup descargado');
    render();
  };

  // Sincronización (config: datos propios de cada dispositivo, no se publican)
  $('#aj-sync').addEventListener('change', (e) => {
    state.ajustes.syncUrl = e.target.value.trim();
    guardarEstado(state, true);
    toast('URL de sincronización guardada');
  });
  const syncTokenInput = $('#aj-sync-token');
  if (syncTokenInput) syncTokenInput.addEventListener('change', (e) => {
    state.ajustes.syncToken = e.target.value.trim();
    guardarEstado(state, true);
    toast('Token del servidor guardado');
  });
  $('#aj-sync-auto').addEventListener('change', (e) => {
    state.ajustes.syncAuto = e.target.checked;
    guardarEstado(state, true);
    if (e.target.checked && syncUrl()) syncAhora();
  });
  $('#btn-sync-up').onclick = () => syncAhora(true);
  $('#btn-sync-down').onclick = () => syncBajar();
  $('#btn-gh-probar').onclick = () => syncAhora(true);
  const btnGhCheck = $('#btn-gh-check');
  if (btnGhCheck) btnGhCheck.onclick = () => ghDiagnostico();

  // Config GitHub (por dispositivo, no se sincroniza)
  const ghCampo = (id, clave, esUltimo = false) => {
    const guardar = () => {
      const g = { ...(state.ajustes.github || {}) };
      let valor = $(id).value.trim();
      if (clave === 'repo' && valor) {
        valor = normalizarRepo(valor);
        $(id).value = valor;
        if (/^[^/]+\/finanzas-app$/i.test(valor)) {
          toast('Ese es el repo de la APP (público). El de DATOS es el privado; usa jstrunkgarcia/finanzas-datos', 'error');
        }
      }
      g[clave] = valor;
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
  const bu = $('#btn-update');
  if (bu) bu.onclick = buscarActualizacion;
  comprobarVersionPublicada();
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

const quickAdd = $('#btn-quick-gasto');
if (quickAdd) quickAdd.onclick = () => modalGasto(null);
const brandHome = $('.brand');
if (brandHome) brandHome.addEventListener('click', (e) => { e.preventDefault(); irTab('inicio'); });

// Accesibilidad: activar botones "role=button" con teclado
document.addEventListener('keydown', (e) => {
  const t = e.target;
  if ((e.key === 'Enter' || e.key === ' ') && t && t.matches && t.matches('[role="button"][tabindex]')) {
    e.preventDefault();
    t.click();
  }
});

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
  const tab = TAB_LEGACY[h] || h;
  if (['inicio', 'gastos', 'patrimonio', 'analisis', 'objetivos', 'plan', 'compartidos', 'ajustes'].includes(tab)) {
    ui.tab = tab;
  }
  marcarTabActiva(ui.tab);
  render();
  if (state.ajustes.pinHash) bloquearApp();
  if (autoSyncActivo()) syncAhora();
})();

// Sincronización continua: cada 15 s y al volver a ver la app
setInterval(() => { if (autoSyncActivo()) syncAhora(); }, 15000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && autoSyncActivo()) syncAhora(); });
window.addEventListener('online', () => { if (autoSyncActivo()) syncAhora(); });
