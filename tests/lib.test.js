'use strict';
const assert = require('assert');
const {
  parseAmount, eur, xirr, cuotaHipoteca, irpfAhorro,
  proyeccionCompuesta, fireNumber, aniosHastaFIRE,
  addMonths, monthsBetween,
} = require('../lib.js');

let ok = 0;
function test(nombre, fn) {
  try { fn(); ok++; console.log('  ✓', nombre); }
  catch (e) { console.error('  ✗', nombre); throw e; }
}

console.log('parseAmount');
test('número directo', () => assert.strictEqual(parseAmount(1234.567), 1234.57));
test('1.300,50 español', () => assert.strictEqual(parseAmount('1.300,50'), 1300.5));
test('1.300 miles', () => assert.strictEqual(parseAmount('1.300'), 1300));
test('1.234.567,89', () => assert.strictEqual(parseAmount('1.234.567,89'), 1234567.89));
test('1,300.50 inglés', () => assert.strictEqual(parseAmount('1,300.50'), 1300.5));
test('1 300,50 con espacios', () => assert.strictEqual(parseAmount('1 300,50'), 1300.5));
test('0,50', () => assert.strictEqual(parseAmount('0,50'), 0.5));
test('negativo', () => assert.strictEqual(parseAmount('-100'), -100));
test('paréntesis negativo', () => assert.strictEqual(parseAmount('(1.300,50)'), -1300.5));
test('vacío', () => assert.strictEqual(parseAmount(''), null));
test('texto inválido', () => assert.strictEqual(parseAmount('abc'), null));
test('1.3 decimal', () => assert.strictEqual(parseAmount('1.3'), 1.3));

console.log('eur');
test('formato miles', () => assert.ok(eur(1300).includes('1.300')));
test('negativo', () => assert.ok(eur(-50).includes('−')));

console.log('xirr');
test('10 % en un año', () => {
  const r = xirr([{ fecha: '2025-01-01', importe: -1000 }, { fecha: '2026-01-01', importe: 1100 }]);
  assert.ok(r != null && Math.abs(r - 0.1) < 0.01, 'r=' + r);
});
test('dos aportaciones', () => {
  const r = xirr([
    { fecha: '2024-01-01', importe: -1000 },
    { fecha: '2025-01-01', importe: -1000 },
    { fecha: '2026-01-01', importe: 2200 },
  ]);
  assert.ok(r != null && r > 0.05 && r < 0.15, 'r=' + r);
});

console.log('hipoteca');
test('cuota 300k al 3,5 % a 30 años', () => {
  const c = cuotaHipoteca(300000, 3.5, 30);
  assert.ok(c > 1300 && c < 1400, 'cuota=' + c);
});

console.log('irpf ahorro');
test('6.000 € al 19 %', () => assert.strictEqual(irpfAhorro(6000), 1140));
test('10.000 €', () => assert.strictEqual(irpfAhorro(10000), 1980));

console.log('proyección');
test('30 años crece', () => {
  const p = proyeccionCompuesta({ capitalInicial: 9000, aportacionMensual: 750, aportacionAnual: 3106, rentabilidadAnualPct: 5, inflacionPct: 2, anios: 30 });
  assert.strictEqual(p.length, 30);
  assert.ok(p[29].nominal > p[0].nominal);
  assert.ok(p[29].real < p[29].nominal);
});
test('FIRE number', () => assert.strictEqual(fireNumber(12000, 4), 300000));
test('años hasta FIRE', () => {
  const a = aniosHastaFIRE({ patrimonio: 10000, aportacionMensual: 1000, rentabilidadAnualPct: 5, gastoAnual: 12000, tasaRetiradaPct: 4 });
  assert.ok(a != null && a > 10 && a < 30, 'años=' + a);
});

console.log('meses');
test('addMonths', () => assert.strictEqual(addMonths('2026-01', -1), '2025-12'));
test('monthsBetween', () => assert.strictEqual(monthsBetween('2026-01', '2027-03'), 14));

console.log(`\n${ok} tests OK`);
