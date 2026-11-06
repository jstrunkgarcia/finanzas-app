/* Finanzas Personal — utilidades puras compartidas por la app y los tests.
   Sin DOM. Se carga antes de app.js y también se puede require() desde Node. */
'use strict';

/* ---------- Importes y formato ---------- */
function parseAmount(v) {
  if (typeof v === 'number') return isFinite(v) ? Math.round(v * 100) / 100 : null;
  let s = String(v == null ? '' : v).trim();
  if (!s) return null;

  // Paréntesis contables: (1.234,56) => negativo
  let negativo = false;
  if (/^\(.*\)$/.test(s)) { negativo = true; s = s.slice(1, -1); }

  // Quitar símbolos de moneda, espacios finos y espacios normales
  s = s.replace(/[€$£\u00a0\s]/g, '');

  const tieneComa = s.includes(',');
  const tienePunto = s.includes('.');
  if (tieneComa && tienePunto) {
    // El último separador es el decimal; el otro es de miles
    const ultimaComa = s.lastIndexOf(',');
    const ultimoPunto = s.lastIndexOf('.');
    if (ultimaComa > ultimoPunto) {
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      s = s.replace(/,/g, '');
    }
  } else if (tieneComa) {
    // En español la coma es decimal. Varias comas: la última decimal.
    const partes = s.split(',');
    if (partes.length > 2) {
      const decimal = partes.pop();
      s = partes.join('') + '.' + decimal;
    } else {
      s = s.replace(',', '.');
    }
  } else if (tienePunto) {
    // Solo puntos: si hay exactamente 3 dígitos detrás del último punto,
    // se interpreta como separador de miles (1.300 => 1300). Si no, decimal.
    const partes = s.split('.');
    const ultima = partes[partes.length - 1];
    if (partes.length > 2 || (partes.length === 2 && ultima.length === 3 && /^\d+$/.test(partes[0]))) {
      s = partes.join('');
    }
  }

  // Dejar solo dígitos, signo y punto decimal
  s = s.replace(/[^0-9.\-]/g, '');
  if (!s || s === '-' || s === '.') return null;
  // Si hay varios puntos tras la normalización, conservar el último como decimal
  const puntos = s.split('.');
  if (puntos.length > 2) {
    const decimal = puntos.pop();
    s = puntos.join('') + '.' + decimal;
  }
  const n = parseFloat(s);
  if (!isFinite(n)) return null;
  return Math.round((negativo ? -n : n) * 100) / 100;
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

/* ---------- Fechas / meses ---------- */
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const currentMonthKey = () => monthKey(new Date());
const prevMonthKey = (mk) => { const [y, m] = mk.split('-').map(Number); return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`; };
const nextMonthKey = (mk) => { const [y, m] = mk.split('-').map(Number); return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`; };

function fmtMes(mk) {
  if (!mk || !/^\d{4}-\d{2}$/.test(String(mk))) return '—';
  const [y, m] = mk.split('-').map(Number);
  return `${MESES[m - 1].charAt(0).toUpperCase() + MESES[m - 1].slice(1)} ${y}`;
}

function fmtDia(iso) {
  const d = new Date(iso + 'T12:00:00');
  if (!isFinite(d.getTime())) return String(iso || '—');
  const hoy = new Date();
  const dia = `${d.getDate()} ${MESES_CORTOS[d.getMonth()]}`;
  if (d.getFullYear() === hoy.getFullYear()) return dia;
  return `${dia} ${d.getFullYear()}`;
}

function addMonths(mk, n) {
  let [y, m] = String(mk).split('-').map(Number);
  m += n;
  while (m > 12) { m -= 12; y++; }
  while (m < 1) { m += 12; y--; }
  return `${y}-${String(m).padStart(2, '0')}`;
}

function monthsBetween(mkA, mkB) {
  const [y1, m1] = String(mkA).split('-').map(Number);
  const [y2, m2] = String(mkB).split('-').map(Number);
  return (y2 - y1) * 12 + (m2 - m1);
}

function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------- Estadística básica ---------- */
function mediana(nums) {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function mediaYDesviacion(serie) {
  const valores = serie.filter((n) => isFinite(n));
  if (!valores.length) return { media: 0, sd: 0, cv: 0 };
  const media = valores.reduce((a, b) => a + b, 0) / valores.length;
  const varianza = valores.reduce((a, b) => a + (b - media) ** 2, 0) / valores.length;
  const sd = Math.sqrt(varianza);
  return { media, sd, cv: media > 0 ? sd / media : 0 };
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

/* ---------- Finanzas: TIR / XIRR ---------- */
function fechaMs(f) {
  if (f instanceof Date) return f.getTime();
  const s = String(f || '');
  const d = new Date(s.length === 10 ? s + 'T12:00:00' : s);
  return isFinite(d.getTime()) ? d.getTime() : NaN;
}

/**
 * XIRR: rentabilidad anual ponderada por el dinero y el tiempo.
 * cashflows: [{fecha:'YYYY-MM-DD', importe: number}] con signos (inversión negativa, valor final positiva).
 * Devuelve tanto anual (0.08 = 8 %) o null.
 */
function xirr(cashflows, guess = 0.1) {
  const flujos = (cashflows || [])
    .map((c) => ({ t: fechaMs(c.fecha), v: +c.importe || 0 }))
    .filter((c) => isFinite(c.t) && c.v !== 0)
    .sort((a, b) => a.t - b.t);
  if (flujos.length < 2) return null;
  const t0 = flujos[0].t;
  const anios = flujos.map((c) => (c.t - t0) / (365.25 * 24 * 3600 * 1000));
  const valor = (r) => flujos.reduce((a, c, i) => a + c.v / Math.pow(1 + r, anios[i]), 0);
  const derivada = (r) => flujos.reduce((a, c, i) => a - (anios[i] * c.v) / Math.pow(1 + r, anios[i] + 1), 0);

  // Newton-Raphson
  let r = guess;
  for (let i = 0; i < 80; i++) {
    const f = valor(r);
    if (Math.abs(f) < 1e-7) return r;
    const d = derivada(r);
    if (!isFinite(f) || !isFinite(d) || Math.abs(d) < 1e-12) break;
    const nuevo = r - f / d;
    if (!isFinite(nuevo) || nuevo <= -0.999999) break;
    if (Math.abs(nuevo - r) < 1e-9) return nuevo;
    r = nuevo;
  }

  // Bisección de respaldo
  let lo = -0.9999, hi = 10;
  let flo = valor(lo), fhi = valor(hi);
  if (!isFinite(flo) || !isFinite(fhi) || flo * fhi > 0) return null;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = valor(mid);
    if (Math.abs(fm) < 1e-7) return mid;
    if (flo * fm <= 0) { hi = mid; fhi = fm; } else { lo = mid; flo = fm; }
  }
  return (lo + hi) / 2;
}

/* ---------- Finanzas: hipoteca ---------- */
function cuotaHipoteca(capital, tipoAnualPct, anios) {
  const c = +capital || 0;
  const n = Math.round((+anios || 0) * 12);
  if (c <= 0 || n <= 0) return 0;
  const i = (+tipoAnualPct || 0) / 100 / 12;
  if (i <= 0) return c / n;
  return (c * i) / (1 - Math.pow(1 + i, -n));
}

function interesesHipoteca(capital, tipoAnualPct, anios) {
  const cuota = cuotaHipoteca(capital, tipoAnualPct, anios);
  return Math.max(0, cuota * Math.round((+anios || 0) * 12) - (+capital || 0));
}

/* ---------- Finanzas: impuestos del ahorro (España) ---------- */
function irpfAhorro(base) {
  let resto = Math.max(0, +base || 0);
  let impuesto = 0;
  const tramos = [
    [6000, 0.19],
    [44000, 0.21],   // 6.000–50.000
    [150000, 0.23],  // 50.000–200.000
    [Infinity, 0.27],
  ];
  for (const [tramo, tipo] of tramos) {
    if (resto <= 0) break;
    const baseTramo = Math.min(resto, tramo);
    impuesto += baseTramo * tipo;
    resto -= baseTramo;
  }
  return Math.round(impuesto * 100) / 100;
}

/* ---------- Finanzas: proyección compuesta ---------- */
/**
 * Proyección anual con aportaciones mensuales, crecimiento salarial/anual de la aportación,
 * inflación, comisión anual y fiscalidad opcional sobre ganancias.
 * Devuelve [{anio, aportado, nominal, real, ganancias, impuestos, neto}]
 */
function proyeccionCompuesta({
  capitalInicial = 0,
  aportacionMensual = 0,
  aportacionAnual = 0,
  rentabilidadAnualPct = 5,
  inflacionPct = 2,
  anios = 30,
  crecimientoAportacionPct = 0,
  comisionAnualPct = 0,
  impuestoGananciasPct = 0,
} = {}) {
  const r = (+rentabilidadAnualPct || 0) / 100;
  const infl = (+inflacionPct || 0) / 100;
  const g = (+crecimientoAportacionPct || 0) / 100;
  const com = (+comisionAnualPct || 0) / 100;
  const imp = (+impuestoGananciasPct || 0) / 100;
  let nominal = +capitalInicial || 0;
  let aportado = +capitalInicial || 0;
  const out = [];
  for (let a = 1; a <= Math.max(0, Math.round(anios)); a++) {
    const mensual = (+aportacionMensual || 0) * Math.pow(1 + g, a - 1);
    const anual = (+aportacionAnual || 0) * Math.pow(1 + g, a - 1);
    // Aportaciones mensuales a lo largo del año, con interés compuesto mensual aproximado
    const rm = Math.pow(1 + r, 1 / 12) - 1;
    let saldoAnio = nominal;
    for (let m = 0; m < 12; m++) saldoAnio = saldoAnio * (1 + rm) + mensual;
    saldoAnio += anual; // la paga anual se añade al final del año
    // Comisión anual sobre el saldo medio (aproximación)
    saldoAnio = saldoAnio * (1 - com);
    const aportadoAnio = aportado + mensual * 12 + anual;
    const ganancias = Math.max(0, saldoAnio - aportadoAnio);
    const impuestos = imp > 0 ? ganancias * imp : 0;
    const neto = saldoAnio - impuestos;
    out.push({
      anio: a,
      aportado: Math.round(aportadoAnio * 100) / 100,
      nominal: Math.round(saldoAnio * 100) / 100,
      real: Math.round((saldoAnio / Math.pow(1 + infl, a)) * 100) / 100,
      ganancias: Math.round(ganancias * 100) / 100,
      impuestos: Math.round(impuestos * 100) / 100,
      neto: Math.round(neto * 100) / 100,
    });
    nominal = saldoAnio;
    aportado = aportadoAnio;
  }
  return out;
}

/* ---------- Finanzas: FIRE / jubilación ---------- */
function fireNumber(gastoAnual, tasaRetiradaPct = 4) {
  const tasa = (+tasaRetiradaPct || 4) / 100;
  return tasa > 0 ? Math.max(0, +gastoAnual || 0) / tasa : 0;
}

function aniosHastaFIRE({ patrimonio = 0, aportacionMensual = 0, rentabilidadAnualPct = 5, gastoAnual = 0, tasaRetiradaPct = 4 } = {}) {
  const objetivo = fireNumber(gastoAnual, tasaRetiradaPct);
  const r = (+rentabilidadAnualPct || 0) / 100 / 12;
  const aporte = +aportacionMensual || 0;
  let capital = +patrimonio || 0;
  if (objetivo <= 0) return null;
  if (capital >= objetivo) return 0;
  if (aporte <= 0 && r <= 0) return null;
  for (let mes = 1; mes <= 12 * 100; mes++) {
    capital = capital * (1 + r) + aporte;
    if (capital >= objetivo) return Math.ceil(mes / 12 * 10) / 10;
  }
  return null;
}

/* ---------- Export para tests Node ---------- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseAmount, eur, eur0, fmtPct, pctClass,
    MESES, MESES_CORTOS, monthKey, currentMonthKey, prevMonthKey, nextMonthKey,
    fmtMes, fmtDia, addMonths, monthsBetween, hoyISO, escapeHtml,
    mediana, mediaYDesviacion, pctSeguro, fmtEurDelta, claseTendencia,
    redondear5, maxBonito, pluralMeses,
    xirr, cuotaHipoteca, interesesHipoteca, irpfAhorro,
    proyeccionCompuesta, fireNumber, aniosHastaFIRE,
  };
}
