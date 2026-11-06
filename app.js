/* Finanzas Personal — app de gastos, inversión y patrimonio (PWA, datos en localStorage) */
'use strict';

/* ============ Utilidades ============ */
const $ = (sel, root = document) => root.querySelector(sel);
const APP_VERSION = 'versión 23 · 4 nov 2026';
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

function parseAmount(v) {
  if (typeof v === 'number') return isFinite(v) ? Math.round(v * 100) / 100 : null;
  const s = String(v || '').trim().replace(/\s/g, '').replace(',', '.');
  if (!s) return null;
  const n = parseFloat(s);
  return isFinite(n) ? Math.round(n * 100) / 100 : null;
}

const eur = (n, decimales = 2) => {
  const num = Number(n) || 0;
  const partes = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(Math.abs(num)).split(',');
  // es-ES no agrupa los miles de 4 cifras; lo forzamos (1.300 en vez de 1300)
  const entero = partes[0].replace(/\./g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${num < 0 ? '−' : ''}${entero}${partes[1] != null ? ',' + partes[1] : ''}\u00a0€`;
};

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
  return {
    v: 2,
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
    personas: [],
    compartidosEventos: [],
    bizums: [],
    objetivos: [],
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

function cargarEstado() {
  try { localStorage.removeItem(STORAGE_KEY_VIEJA); } catch (e) {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && Array.isArray(s.categorias)) {
        s.ajustes.nombre = typeof s.ajustes.nombre === 'string' ? s.ajustes.nombre : '';
        s.ajustes.diaCobro = Math.min(31, Math.max(1, +s.ajustes.diaCobro || 1));
        s.ajustes.cuentaIbercaja = s.ajustes.cuentaIbercaja || null;
        s.ajustes.objetivoCasa = s.ajustes.objetivoCasa || seedState().ajustes.objetivoCasa;
        s.ajustes.pagas = s.ajustes.pagas || seedState().ajustes.pagas;
        s.eliminados = Array.isArray(s.eliminados) ? s.eliminados : [];
        s.personas = Array.isArray(s.personas) ? s.personas : [];
        s.compartidosEventos = Array.isArray(s.compartidosEventos) ? s.compartidosEventos : [];
        s.bizums = Array.isArray(s.bizums) ? s.bizums : [];
        s.objetivos = Array.isArray(s.objetivos) ? s.objetivos : [];
        if (s.ajustes.github && s.ajustes.github.repo) {
          s.ajustes.github.repo = normalizarRepo(s.ajustes.github.repo);
        }
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

/* ============ Cuenta Ibercaja: saldo derivado ============ */
function holdingIbercaja() {
  return state.holdings.find((h) => h.id === 'h-ibercaja') || state.holdings.find((h) => h.cubo === 'diaadia') || null;
}

function totalAportesInversion() {
  const iber = holdingIbercaja();
  let total = 0;
  for (const sn of state.snapshots || []) {
    const ap = sn.aportes || {};
    for (const h of state.holdings || []) {
      if (iber && h.id === iber.id) continue;
      total += +ap[h.id] || 0;
    }
  }
  return Math.round(total * 100) / 100;
}

function ingresosAutomaticosIbercaja(cfg) {
  const ingreso = +state.ajustes.ingreso || 0;
  const paga = pagasConfig();
  const pagaMeses = new Set(mesesDePagas());
  const base = new Date(cfg.fechaBase);
  if (!isFinite(base.getTime())) return { nominas: 0, pagas: 0 };
  const hoy = new Date();
  const dia = Math.min(31, Math.max(1, +cfg.diaCobro || 1));
  let y = base.getFullYear(), m = base.getMonth(), nominas = 0, pagas = 0;
  while (y < hoy.getFullYear() || (y === hoy.getFullYear() && m <= hoy.getMonth())) {
    const ultimoDia = new Date(y, m + 1, 0).getDate();
    const pago = new Date(y, m, Math.min(dia, ultimoDia));
    if (pago > base && pago <= hoy) {
      nominas += ingreso;
      if (paga.activo && pagaMeses.has(m + 1)) pagas += +paga.importe || 0;
    }
    m += 1;
    if (m === 12) { m = 0; y += 1; }
  }
  return { nominas, pagas };
}

function cuentaIbercajaConfig() {
  const actual = state.ajustes.cuentaIbercaja;
  if (actual && isFinite(+actual.saldoBase)) {
    let cambio = false;
    if (!actual.fechaBase || !isFinite(new Date(actual.fechaBase).getTime())) { actual.fechaBase = new Date().toISOString(); cambio = true; }
    if (!isFinite(+actual.aportesBase)) { actual.aportesBase = totalAportesInversion(); cambio = true; }
    const dia = Math.min(31, Math.max(1, +actual.diaCobro || 1));
    if (+actual.diaCobro !== dia) { actual.diaCobro = dia; cambio = true; }
    if (cambio) { state.ajustes.mod = Date.now(); guardarEstado(state, true); }
    return actual;
  }
  const h = holdingIbercaja();
  const base = h ? statsHolding(h.id).valorActual : 0;
  state.ajustes.cuentaIbercaja = {
    saldoBase: Math.round(base * 100) / 100,
    fechaBase: new Date().toISOString(),
    aportesBase: totalAportesInversion(),
    diaCobro: Math.min(31, Math.max(1, +state.ajustes.diaCobro || 1)),
  };
  state.ajustes.mod = Date.now();
  guardarEstado(state, true);
  return state.ajustes.cuentaIbercaja;
}

function desgloseIbercaja() {
  const cfg = cuentaIbercajaConfig();
  const baseMs = new Date(cfg.fechaBase).getTime() || 0;
  const gastos = (state.gastos || [])
    .filter((g) => (+g.creado || 0) > baseMs)
    .reduce((a, g) => a + (+g.monto || 0), 0);
  const bizums = (state.bizums || [])
    .filter((b) => (+b.creado || 0) > baseMs)
    .reduce((a, b) => a + (+b.importe || 0), 0);
  const ingresosAuto = ingresosAutomaticosIbercaja(cfg);
  const nominas = ingresosAuto.nominas;
  const pagas = ingresosAuto.pagas;
  const traspasos = Math.max(0, totalAportesInversion() - (+cfg.aportesBase || 0));
  const actual = (+cfg.saldoBase || 0) + nominas + pagas + bizums - gastos - traspasos;
  return {
    cfg,
    base: +cfg.saldoBase || 0,
    gastos: Math.round(gastos * 100) / 100,
    bizums: Math.round(bizums * 100) / 100,
    nominas: Math.round(nominas * 100) / 100,
    pagas: Math.round(pagas * 100) / 100,
    traspasos: Math.round(traspasos * 100) / 100,
    actual: Math.round(actual * 100) / 100,
  };
}

function saldoIbercajaActual() {
  return desgloseIbercaja().actual;
}

function ajusteIbercaja() {
  const h = holdingIbercaja();
  if (!h) return 0;
  return Math.round((saldoIbercajaActual() - statsHolding(h.id).valorActual) * 100) / 100;
}

/* Saldos actuales agrupados por entidad y por función */
function saldosActuales() {
  const val = (hid) => statsHolding(hid).valorActual;
  const sumCubos = (ids) => state.holdings.filter((h) => ids.includes(h.cubo)).reduce((a, h) => a + val(h.id), 0);
  const diaadia = Math.round((sumCubos(['diaadia']) + ajusteIbercaja()) * 100) / 100;
  const colchon = sumCubos(['emergencia']);
  const vivienda = sumCubos(['vivienda']);
  const viajes = sumCubos(['viajes']);
  const inversion = sumCubos(['jubilacion']);
  const ahorro = vivienda + viajes;
  const efectivoTR = colchon + ahorro;
  const conocidos = ['diaadia', 'emergencia', 'vivienda', 'viajes', 'jubilacion'];
  const otros = state.holdings.filter((h) => !conocidos.includes(h.cubo)).reduce((a, h) => a + val(h.id), 0);
  const tr = efectivoTR + inversion + otros;
  return { diaadia, colchon, vivienda, viajes, ahorro, inversion, efectivoTR, otros, tr, total: Math.round((diaadia + tr) * 100) / 100 };
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
  return state.holdings.reduce((a, h) => a + (+h.plan || 0), 0);
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
  const pagaPendiente = pagasConfig().activo && esMesDePaga(mk) && (!snHoy || !snHoy.pagaAplicada);
  const excedidas = state.categorias.filter((c) => {
    const gastado = gastos.filter((g) => g.catId === c.id).reduce((a, g) => a + g.monto, 0);
    return c.presupuesto > 0 && gastado > c.presupuesto;
  });
  const avisos = [];
  if (!snHoy) avisos.push({ tipo: 'info', icono: icono('calendario', 15), html: `Aún no has registrado los valores de <strong>${fmtMes(mk)}</strong>.` });
  if (pagaPendiente) avisos.push({ tipo: 'info', icono: icono('calendario', 15), html: `Tienes una <strong>paga extra</strong> de ${eur(+pagasConfig().importe || 0)} pendiente de aplicar.` });
  if (excedidas.length) avisos.push({ tipo: 'alerta', icono: icono('alerta', 15), html: `Has superado el presupuesto en <strong>${excedidas.length} ${excedidas.length === 1 ? 'categoría' : 'categorías'}</strong> este mes.` });
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
      <div class="banner-text"><strong>Paga extra de ${fmtMes(mk).toLowerCase()}</strong>${eur(+pagasConfig().importe || 0)} pendiente de aplicar a tus aportaciones.</div>
      <button class="btn small" id="inicio-paga" type="button">Aplicar paga</button>
    </div>` : ''}

    <div class="dashboard-grid">
      <div class="dashboard-main">
        <section class="card networth-card">
          <div class="networth-top">
            <div class="networth-copy">
              <span class="networth-label">Patrimonio total</span>
              <div class="hero-value networth-value">${eur(saldos.total)}</div>
              <div class="networth-trend ${variacion == null ? 'neutral' : variacion < 0 ? 'negative' : 'positive'}">
                ${variacion != null ? `<span class="trend-mark" aria-hidden="true">${variacion < 0 ? '▼' : '▲'}</span>` : ''}
                <strong>${fmtPct(variacion, { decimales: 1 })}</strong>
                <span>${variacionEsMes ? 'este mes' : variacion != null ? 'desde el inicio' : 'sin datos'}</span>
              </div>
              <span class="networth-aportado">Aportado ${eur(stats.aportado)}</span>
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
  if (paga) paga.onclick = () => aplicarPaga(mk);
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
  const presupuesto = presupuestoTotal();
  const pctGlobal = presupuesto > 0 ? total / presupuesto : null;
  const quedan = presupuesto - total;
  const comp = balancesCompartidos();
  const resumenComp = (comp.debido > 0.004 || comp.debo > 0.004)
    ? `${comp.debido > 0.004 ? `Te deben ${eur(comp.debido)}` : ''}${comp.debido > 0.004 && comp.debo > 0.004 ? ' · ' : ''}${comp.debo > 0.004 ? `Debes ${eur(comp.debo)}` : ''}`
    : 'Controla cenas, regalos y bizums: quién te debe y cuánto.';

  const catsData = state.categorias
    .map((c) => ({ ...c, gastado: gastos.filter((g) => g.catId === c.id).reduce((a, g) => a + g.monto, 0) }))
    .sort((a, b) => b.gastado - a.gastado);

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

  view.innerHTML = `
    <header class="page-head gastos-head">
      <h1>Gastos</h1>
      ${monthNavHTML()}
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
            <div><h2>Detalle del mes</h2><p>${gastos.length} ${gastos.length === 1 ? 'movimiento' : 'movimientos'} en ${fmtMes(ui.month).toLowerCase()}</p></div>
          </div>
          ${lista}
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
  const btnComp = $('#btn-comp');
  if (btnComp) btnComp.onclick = () => irTab('compartidos');
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
    const actual = state.holdings
      .filter((h) => h.cubo === g.cuboId)
      .reduce((a, h) => a + statsHolding(h.id).valorActual, 0);
    const plan = state.holdings
      .filter((h) => h.cubo === g.cuboId)
      .reduce((a, h) => a + (+h.plan || 0), 0);
    const monto = +g.monto || 0;
    const faltan = Math.max(monto - actual, 0);
    const pct = monto > 0 ? Math.min(actual / monto, 1) : 0;
    const meses = faltan > 0 && plan > 0 ? Math.ceil(faltan / plan) : null;
    const llegada = meses ? addMonths(currentMonthKey(), meses) : null;
    return { ...g, cubo, actual, plan, monto, faltan, pct, meses, llegada, color: colorCubo(g.cuboId) };
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
        <span class="pill goal-badge">${(g.pct * 100).toFixed(1).replace('.', ',')} %</span>
      </div>
      <div class="goal-value-row"><strong>${eur0(g.actual)}</strong><span>de ${eur0(g.monto)}</span></div>
      <div class="progress"><span style="width:${g.pct * 100}%"></span></div>
      <div class="goal-stats">
        <div><span>Aportación</span><strong>${eur0(g.plan)}/mes</strong></div>
        <div><span>Faltan</span><strong>${eur0(g.faltan)}</strong></div>
        <div><span>Llegada</span><strong>${g.llegada ? fmtMes(g.llegada) : '—'}</strong></div>
      </div>
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
          <span class="pill goal-badge ${completado ? 'good' : ''}">${(pctCasaReal * 100).toFixed(1).replace('.', ',')} %</span>
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
    state.ajustes.objetivoCasa = {
      ...state.ajustes.objetivoCasa,
      precio,
      pctEntrada,
      pctGastos,
      margen: Math.max(margen, 0),
      fechaObjetivo: $('#oc-fecha', overlay).value || null,
    };
    state.ajustes.mod = Date.now();
    guardarEstado(); cerrar(); toast('Objetivo actualizado'); render();
  };
}

/* ---- Modal: nuevo / editar objetivo ---- */
function modalObjetivoNuevo(goal = null) {
  const usados = new Set((state.objetivos || []).filter((x) => x.id !== (goal && goal.id)).map((x) => x.cuboId));
  const disponibles = state.cubos.filter((c) => c.id !== 'vivienda' && !usados.has(c.id));
  if (!goal && !disponibles.length) {
    return toast('Todas las posiciones ya tienen un objetivo. Crea otra posición en Ajustes.', 'error');
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

/* ---- Modal: ajustar saldo actual de Ibercaja ---- */
function modalAjustarIbercaja() {
  const des = desgloseIbercaja();
  const cfg = des.cfg;
  const mesActual = currentMonthKey();
  const fechaBase = new Date(cfg.fechaBase);
  const fechaTxt = isFinite(fechaBase.getTime())
    ? fechaBase.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'sin fecha';
  const conSigno = (n, invertir = false) => {
    if (Math.abs(n) < 0.005) return eur(0);
    const positivo = invertir ? n < 0 : n > 0;
    return `${positivo ? '+' : '−'}${eur(Math.abs(n))}`;
  };
  const overlay = document.createElement('div');
  const pagasTxt = pagasConfig().activo ? ' y las pagas extra' : '';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <h3>Saldo de Ibercaja</h3>
      <p class="hint" style="margin-top:-6px">La nómina de ${eur(+state.ajustes.ingreso || 0)}${pagasTxt} se ${pagasConfig().activo ? 'añaden' : 'añade'} automáticamente el día de cobro. Los gastos, bizums y aportaciones a inversión se aplican en cuanto los registras.</p>
      <div class="ibercaja-desglose">
        <div><span>Saldo confirmado <small>${fechaTxt}</small></span><strong>${eur(des.base)}</strong></div>
        <div><span>Nóminas automáticas</span><strong class="pct-good">${conSigno(des.nominas)}</strong></div>
        ${des.pagas > 0 ? `<div><span>Pagas extra automáticas</span><strong class="pct-good">${conSigno(des.pagas)}</strong></div>` : ''}
        <div><span>Gastos</span><strong class="pct-bad">${des.gastos > 0 ? `−${eur(des.gastos)}` : eur(0)}</strong></div>
        <div><span>Bizums (neto)</span><strong class="${des.bizums >= 0 ? 'pct-good' : 'pct-bad'}">${conSigno(des.bizums)}</strong></div>
        <div><span>Traspasos a inversión</span><strong class="${des.traspasos > 0 ? 'pct-bad' : 'pct-good'}">${conSigno(des.traspasos, true)}</strong></div>
        <div class="total"><span>Saldo actual</span><strong>${eur(des.actual)}</strong></div>
      </div>
      <div class="field"><label for="ib-saldo">Nuevo saldo actual (€)</label>
        <input id="ib-saldo" type="text" inputmode="decimal" value="${des.actual.toFixed(2).replace('.', ',')}" autofocus /></div>
      <div class="field"><label for="ib-dia">Día de cobro de la nómina</label>
        <input id="ib-dia" type="number" min="1" max="31" value="${cfg.diaCobro || 1}" /></div>
      <p class="hint">Al guardar, este saldo será el nuevo punto de partida y debe incluir los gastos y bizums ya registrados. Los movimientos posteriores se aplican automáticamente.</p>
      <button class="card-link" id="ib-registrar" type="button">Registrar valores del mes ${icono('flecha', 14)}</button>
      <div class="modal-actions">
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
  $('#ib-guardar', overlay).onclick = () => {
    const saldo = parseAmount($('#ib-saldo', overlay).value);
    if (saldo == null) return toast('Introduce un saldo válido', 'error');
    const dia = Math.min(31, Math.max(1, parseInt($('#ib-dia', overlay).value, 10) || 1));
    const cuenta = cuentaIbercajaConfig();
    cuenta.saldoBase = saldo;
    cuenta.fechaBase = new Date().toISOString();
    cuenta.aportesBase = totalAportesInversion();
    cuenta.diaCobro = dia;
    state.ajustes.diaCobro = dia;
    state.ajustes.mod = Date.now();
    guardarEstado(); cerrar(); toast('Saldo de Ibercaja actualizado'); render();
  };
}

/* ============ Vista: Patrimonio ============ */
function vistaPatrimonio(view) {
  view.classList.add('view-patrimonio');
  const stats = statsPatrimonio();
  const saldos = saldosActuales();
  const totalActual = saldos.total;
  const ajuste = ajusteIbercaja();
  const iber = holdingIbercaja();
  const dist = distribucionCubos()
    .map((b) => ({ ...b, total: b.id === 'diaadia' ? b.total + ajuste : b.total }))
    .filter((b) => b.total > 0)
    .map((b) => ({ ...b, pct: totalActual > 0 ? b.total / totalActual : 0 }))
    .sort((a, b) => b.total - a.total);
  const ingresos = +state.ajustes.ingreso || 0;
  const gastoMes = totalGastado(currentMonthKey());
  const aportesMes = aportesSnap(currentMonthKey());
  const serie = stats.serie;
  const ultimoMes = stats.ultimo ? stats.ultimo.month : currentMonthKey();
  const mesActual = currentMonthKey();
  const snActual = snapPorMes(mesActual);
  const pagaPendiente = pagasConfig().activo && esMesDePaga(mesActual) && (!snActual || !snActual.pagaAplicada);
  const faltaMes = !snActual;
  const variacion = stats.perfMes != null ? stats.perfMes : stats.roi;
  const variacionEsMes = stats.perfMes != null;

  const chart = serie.length > 1
    ? lineaChart(serie.map((s) => s.post), serie.map((s) => `${MESES_CORTOS[+s.month.split('-')[1] - 1]} ${s.month.slice(2, 4)}`))
    : '';

  const donut = donutSVG(dist.map((b) => ({ valor: b.total, color: colorCubo(b.id) })), { size: 140, grosor: 22 });

  const leyenda = dist.map((b) => `
    <div class="pat-legend-row">
      <span class="pat-legend-dot" style="background:${colorCubo(b.id)}"></span>
      <span class="pat-legend-name">${escapeHtml(b.nombre)}</span>
      <span class="pat-legend-pct">${fmtPct(b.pct, { conSigno: false, decimales: 0 })}</span>
    </div>`).join('');

  const cuentas = state.holdings.map((h) => {
    const st = statsHolding(h.id);
    const cubo = cuboPorId(h.cubo);
    const esIber = iber && h.id === iber.id;
    const valor = st.valorActual + (esIber ? ajuste : 0);
    const pct = totalActual > 0 ? valor / totalActual : null;
    const color = colorCubo(h.cubo);
    const tipo = cubo ? cubo.nombre : 'Sin espacio';
    return `<button class="pat-account-row" type="button" data-open="${h.id}" aria-label="${esIber ? 'Ajustar saldo de ' : 'Ver y registrar '}${escapeHtml(h.nombre)}">
      <span class="pat-account-ico" style="color:${color};background:${color}1a;border-color:${color}30">${iconoCubo(h.cubo)}</span>
      <span class="pat-account-main">
        <strong class="pat-account-name" title="${escapeHtml(h.nombre)}">${escapeHtml(h.nombre)}</strong>
        <span class="pat-account-type">${escapeHtml(tipo)}${esIber ? ' · automático' : ''}</span>
        <span class="pat-account-amount">${eur(valor)}</span>
      </span>
      <span class="pat-account-pct">${pct == null ? '—' : fmtPct(pct, { conSigno: false, decimales: 0 })}</span>
      <span class="pat-account-arrow" aria-hidden="true">${esIber ? icono('editar', 15) : icono('chevron', 15)}</span>
    </button>`;
  }).join('');

  const metricas = state.holdings.map((h) => {
    const st = statsHolding(h.id);
    const perf = perfHolding(h.id, ultimoMes);
    const labelVar = stats.ultimo ? MESES_CORTOS[+ultimoMes.split('-')[1] - 1] : 'mes';
    return `<div class="pat-metric-row">
      <div class="pat-metric-name" title="${escapeHtml(h.nombre)}">${escapeHtml(h.nombre)}</div>
      <div class="pat-metric-values">
        <span><small>Aportado</small><strong>${eur(st.aportado)}</strong></span>
        <span><small>Rentab. total</small><strong class="${st.roi != null && st.roi >= 0 ? 'pct-good' : st.roi != null ? 'pct-bad' : ''}">${fmtPct(st.roi)}</strong></span>
        <span><small>Var. ${labelVar}</small><strong class="${perf != null && perf >= 0 ? 'pct-good' : perf != null ? 'pct-bad' : ''}">${fmtPct(perf)}</strong></span>
      </div>
    </div>`;
  }).join('');

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
      <h1>Patrimonio</h1>
      <button class="icon-btn pat-reg-btn" id="pat-registrar" type="button" aria-label="Registrar valores" title="Registrar valores">${icono('editar', 18)}</button>
    </header>

    ${pagaPendiente ? `
    <div class="banner">
      <span class="banner-ico">${icono('calendario', 19)}</span>
      <div class="banner-text"><strong>Paga extra de ${fmtMes(mesActual).toLowerCase()}</strong>${eur(+pagasConfig().importe || 0)} pendiente de aplicar a tus aportaciones.</div>
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
          <span class="pat-total-label">Patrimonio total</span>
          <div class="pat-total-value">${eur(totalActual)}</div>
          <div class="pat-total-trend ${variacion == null ? 'neutral' : variacion < 0 ? 'negative' : 'positive'}">
            ${variacion != null ? `<span class="trend-mark" aria-hidden="true">${variacion < 0 ? '▼' : '▲'}</span>` : ''}
            <strong>${variacion == null ? '—' : fmtPct(variacion, { decimales: 1 })}</strong>
            <span>${variacionEsMes ? 'este mes' : variacion != null ? 'desde el inicio' : 'sin datos'}</span>
          </div>
        </section>

        <section class="card pat-dist-card" aria-label="Distribución del patrimonio">
          <div class="pat-dist">
            <div class="pat-donut">${donut}</div>
            <div class="pat-legend">${leyenda || '<span class="pat-legend-empty">Sin posiciones registradas.</span>'}</div>
          </div>
        </section>
      </div>

      <div class="stack">
        <section class="card pat-accounts-card" aria-label="Cuentas y patrimonio">
          <div class="pat-account-list">${cuentas || '<div class="empty">Añade posiciones en Ajustes para empezar.</div>'}</div>
        </section>
      </div>
    </div>

    <details class="pat-more">
      <summary class="pat-more-summary">
        <span class="pat-more-summary-main"><strong>Historial y detalles</strong><span>Evolución, flujo mensual y entidades</span></span>
        ${icono('chevron', 16)}
      </summary>
      <div class="pat-more-body">
        <div class="pat-more-links">
          <button class="card-link" data-nav="analisis" type="button">Ver análisis ${icono('flecha', 14)}</button>
          <button class="card-link" data-nav="objetivos" type="button">Ver objetivos ${icono('flecha', 14)}</button>
        </div>

        <section class="card">
          <div class="card-head">
            <div><h2>Evolución</h2><p>Patrimonio registrado mes a mes · el saldo actual de Ibercaja incluye movimientos automáticos</p></div>
            ${stats.perfMes != null ? `<span class="pill ${stats.perfMes >= 0 ? 'good' : 'bad'}">${fmtPct(stats.perfMes)} último mes</span>` : ''}
          </div>
          ${chart ? `<div class="chart-wrap">${chart}</div>` : '<div class="empty" style="padding:18px"><span class="big">📈</span>Registra al menos dos meses para ver la evolución.</div>'}
        </section>

        <section class="card">
          <div class="card-head">
            <div><h2>Rentabilidad por posición</h2><p>Aportado total ${eur(stats.aportado)} · toca una cuenta para registrar valores</p></div>
          </div>
          <div class="pat-metrics">${metricas || '<div class="empty">Sin posiciones registradas.</div>'}</div>
        </section>

        <section class="card">
          <div class="card-head"><div><h2>Este mes</h2><p>Flujo del mes en curso</p></div></div>
          <div class="stat-grid two">
            <div class="stat"><div class="label">Ingreso mensual</div><div class="value">${eur(ingresos)}</div></div>
            <div class="stat"><div class="label">Gasto del mes</div><div class="value">${eur(gastoMes)} <span class="tiny ${gastoMes > ingresos && ingresos > 0 ? 'pct-bad' : ''}">${ingresos > 0 ? fmtPct(gastoMes / ingresos, { conSigno: false, decimales: 0 }) : ''}</span></div></div>
            <div class="stat"><div class="label">Aportación</div><div class="value">${aportesMes == null ? 'sin registrar' : eur0(aportesMes)}</div></div>
            <div class="stat"><div class="label">Sobra estimada</div><div class="value ${ingresos - gastoMes > 0 ? 'pct-good' : ingresos > 0 ? 'pct-bad' : ''}">${ingresos > 0 ? eur(ingresos - gastoMes) : '—'}</div></div>
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <div><h2>Tu dinero por entidad</h2><p>Dónde está el dinero ahora mismo</p></div>
            <button class="btn secondary small" id="pat-saldos" type="button">${icono('editar', 15)} Actualizar</button>
          </div>
          <div class="money-row">
            <div><div class="lbl">Ibercaja</div><div class="sub">Día a día</div></div>
            <div class="val">${eur(saldos.diaadia)}</div>
          </div>
          <div class="money-row">
            <div><div class="lbl">Trade Republic · efectivo</div><div class="sub">Colchón ${eur0(saldos.colchon)} · Ahorro ${eur0(saldos.ahorro)}${saldos.viajes > 0 ? ` (viajes ${eur0(saldos.viajes)})` : ''}</div></div>
            <div class="val">${eur(saldos.efectivoTR)}</div>
          </div>
          <div class="money-row">
            <div><div class="lbl">Trade Republic · inversión</div><div class="sub">ETF en cartera</div></div>
            <div class="val">${eur(saldos.inversion)}</div>
          </div>
          ${saldos.otros > 0.5 ? `<div class="money-row"><div><div class="lbl">Otras posiciones</div></div><div class="val">${eur(saldos.otros)}</div></div>` : ''}
          <div class="money-total"><span>Total</span><strong>${eur(saldos.total)}</strong></div>
        </section>

        <section class="card">
          <div class="card-head"><div><h2>Mes a mes</h2><p>Últimos 12 registros</p></div></div>
          <div class="pat-history">${historial || '<div class="hint">Todavía no hay registros.</div>'}</div>
        </section>
      </div>
    </details>
  `;

  cablearNavegacion(view);
  ['#pat-registrar', '#pat-saldos'].forEach((sel) => {
    const b = $(sel);
    if (b) b.onclick = () => modalRegistrar(mesActual);
  });
  const bannerBtn = $('#pat-banner-btn');
  if (bannerBtn) bannerBtn.onclick = () => pagaPendiente ? aplicarPaga(mesActual) : modalRegistrar(mesActual);
  view.querySelectorAll('[data-open]').forEach((el) => {
    el.onclick = () => {
      const hid = el.dataset.open;
      const h = holdingPorId(hid);
      const iberActual = holdingIbercaja();
      if (h && iberActual && h.id === iberActual.id) {
        modalAjustarIbercaja();
        return;
      }
      const serieH = serieHolding(hid);
      modalRegistrar(serieH.length ? serieH[serieH.length - 1].month : mesActual);
    };
  });
  view.querySelectorAll('[data-mes]').forEach((el) => {
    el.onclick = () => modalRegistrar(el.dataset.mes);
  });
}

/* === BEGIN-FUSIONAR === */
const COLECCIONES = ['gastos', 'snapshots', 'categorias', 'holdings', 'cubos', 'personas', 'compartidosEventos', 'bizums', 'objetivos'];

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
    ultimoSyncOK = Date.now();
    actualizarEstadoSync();
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
  const ts = ultimoSyncOK
    ? new Date(ultimoSyncOK).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '';
  el.textContent = extra || (ts ? `Última sincronización con la nube: ${ts}` : 'Aún no sincronizado en esta sesión');
}

/* ============ Vista: Análisis ============ */
const ANALISIS_DESCARTADOS = new Set();

function analisisPeriodoHasta(finMk, n) {
  const meses = [];
  for (let i = n - 1; i >= 0; i--) meses.push(addMonths(finMk, -i));
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

function esMesEnCursoIncompleto(mk) {
  if (mk !== currentMonthKey()) return false;
  const ahora = new Date();
  const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0).getDate();
  return ahora.getDate() < ultimoDia;
}

function pctSeguro(actual, anterior) {
  if (!(anterior > 0)) return null;
  return (actual - anterior) / anterior;
}

function fmtEurDelta(n) {
  if (n == null || !isFinite(n)) return '—';
  if (Math.abs(n) < 0.005) return eur0(0);
  return `${n > 0 ? '+' : '−'}${eur0(Math.abs(n))}`;
}

function claseTendencia(p) {
  if (p == null || !isFinite(p) || Math.abs(p) < 0.02) return 'trend-neutral';
  return p > 0 ? 'trend-up' : 'trend-down';
}

function redondear5(n) {
  if (!isFinite(n)) return 0;
  return Math.max(0, Math.round(n / 5) * 5);
}

function mediaYDesviacion(serie) {
  const valores = serie.filter((n) => isFinite(n));
  if (!valores.length) return { media: 0, sd: 0, cv: 0 };
  const media = valores.reduce((a, b) => a + b, 0) / valores.length;
  const varianza = valores.reduce((a, b) => a + (b - media) ** 2, 0) / valores.length;
  const sd = Math.sqrt(varianza);
  return { media, sd, cv: media > 0 ? sd / media : 0 };
}

function maxBonito(valor) {
  if (!(valor > 0)) return 1;
  const potencia = Math.pow(10, Math.floor(Math.log10(valor)));
  const normalizado = valor / potencia;
  const paso = [1, 2, 2.5, 5, 10].find((x) => normalizado <= x) || 10;
  return paso * potencia;
}

function pluralMeses(n) {
  return `${n} ${n === 1 ? 'mes' : 'meses'}`;
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

  const presu = presupuestoTotal();
  const totalPeriodo = filasActuales.reduce((a, f) => a + f.total, 0);
  const totalBase = baseActual.reduce((a, f) => a + f.total, 0);
  const totalPrevio = basePrevia.reduce((a, f) => a + f.total, 0);
  const media = mesesBase.length ? totalBase / mesesBase.length : 0;
  const mediaPrevia = mesesPreviosBase.length ? totalPrevio / mesesPreviosBase.length : 0;
  const masCaro = filasActuales.filter((f) => f.n > 0).sort((a, b) => b.total - a.total)[0] || null;
  const mesesPorEncima = mesesBase.filter((f) => presu > 0 && f.total > presu + 0.005).length;
  const comparacionFiable = mesesBase.length >= 1 && mesesPreviosBase.length >= 1;
  const variacionPeriodo = comparacionFiable ? pctSeguro(media, mediaPrevia) : null;
  const variacionMedia = comparacionFiable ? pctSeguro(media, mediaPrevia) : null;
  const tendenciaFiable = mesesBase.length >= 3 && mesesPreviosBase.length >= 2 && baseActual.length >= 3;

  const cats = state.categorias.map((c) => {
    const presupuesto = +c.presupuesto || 0;
    const serieBase = mesesBase.map((f) => f.porCat[c.id] || 0);
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
    const mesesSobre = serieBase.filter((x) => presupuesto > 0 && x > presupuesto + 0.005).length;
    const mesesConGasto = serieBase.filter((x) => x > 0).length;
    const mesesPrevioConGasto = serieBasePrevia.filter((x) => x > 0).length;
    const excesoMedio = serieBase.reduce((a, x) => a + Math.max(x - presupuesto, 0), 0) / Math.max(1, serieBase.length);

    return {
      ...c,
      presupuesto,
      serieBase,
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
    const mesesSobre = serie.filter((x) => presupuesto > 0 && x > presupuesto + 0.005).length;
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
    const pct = d.presu > 0 ? f.total / d.presu : null;
    const estado = f.n === 0
      ? '<span class="trend-neutral">sin datos</span>'
      : pct == null
        ? '—'
        : `<span class="${pct > 1 ? 'pct-bad' : pct > 0.7 ? 'pct-warn' : 'pct-good'}">${fmtPct(pct, { conSigno: false, decimales: 0 })}</span>`;
    return `<tr>
      <td>${etiquetaMes(f.mk)}${f.incompleto ? ' *' : ''}</td>
      <td>${f.n ? eur0(f.total) : '—'}</td>
      <td>${d.presu > 0 ? eur0(d.presu) : '—'}</td>
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
        <div><span>Si aceptas todas</span><strong>${eur0(propuestas.totalNuevo)}/mes</strong></div>
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
          <div><strong>${escapeHtml(plan.titulo)}</strong><p>${plan.texto}</p></div>
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
      stamp(c);
      ANALISIS_DESCARTADOS.delete(b.dataset.key);
      guardarEstado();
      toast(`Presupuesto de ${c.nombre} actualizado a ${eur0(valor)}`);
      render();
    };
  });

  view.querySelectorAll('[data-presupuesto-rechazar]').forEach((b) => {
    b.onclick = () => {
      ANALISIS_DESCARTADOS.add(b.dataset.key);
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
    const p = c.presupuesto;
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
  const presu = presupuestoTotal();
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
    const pct = d.presu > 0 ? f.total / d.presu : null;
    return `<tr>
      <td>${etiquetaMes(f.mk)}${f.incompleto ? ' *' : ''}</td>
      <td>${f.n ? eur0(f.total) : '—'}</td>
      <td>${d.presu > 0 ? eur0(d.presu) : '—'}</td>
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
    const ev = stamp({
      id: uid(),
      fecha,
      descripcion,
      importe: Math.round(importe * 100) / 100,
      pagador,
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
    state.bizums.push(stamp({ id: uid(), personaId, importe: signo * Math.round(importe * 100) / 100, fecha, nota: $('#bz-nota', overlay).value.trim(), creado: Date.now() }));
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
      <button class="btn secondary small" id="btn-add-holding" type="button" style="margin-top:10px">+ Nueva posición</button>
    </div>

    <div class="card">
      <div class="card-title"><span>Reparto objetivo del patrimonio</span></div>
      ${objetivos}
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
      <button class="btn secondary small full" id="btn-update" type="button" style="margin-top:10px">🔄 Buscar actualización de la app</button>
      <div class="hint" id="version-info">Comprobando versión publicada…</div>
      <p class="hint">Si has publicado cambios y este dispositivo sigue con la versión vieja, pulsa «Buscar actualización»: recarga la última versión <strong>sin borrar tus datos ni el token</strong>.</p>
      <p class="hint"><strong>Android:</strong> abre la web en Chrome → menú (⋮) → «Añadir a pantalla de inicio».<br>
      <strong>iPhone:</strong> abre la web en Safari → botón Compartir → «Añadir a pantalla de inicio».<br>
      <strong>Ordenador:</strong> en Chrome, icono de instalación en la barra de direcciones.</p>
    </div>

    <p class="hint" style="text-align:center;margin-top:20px">Finanzas Personal · ${APP_VERSION} · los datos nunca salen de tu dispositivo</p>
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
      ...(state.objetivos || []).map((g) => ({ t: 'objetivos', id: g.id, mod: ahora })),
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
  if (['inicio', 'gastos', 'patrimonio', 'analisis', 'objetivos', 'compartidos', 'ajustes'].includes(tab)) {
    ui.tab = tab;
  }
  marcarTabActiva(ui.tab);
  render();
  if (autoSyncActivo()) syncAhora();
})();

// Sincronización continua: cada 15 s y al volver a ver la app
setInterval(() => { if (autoSyncActivo()) syncAhora(); }, 15000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && autoSyncActivo()) syncAhora(); });
window.addEventListener('online', () => { if (autoSyncActivo()) syncAhora(); });
