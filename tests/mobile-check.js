'use strict';
/* Auditoría de layout móvil: detecta desbordamientos horizontales y guarda capturas.
   Uso: CDP_PORT=9222 node tests/mobile-check.js
   Requiere Chrome con --remote-debugging-port y la app servida en 3005. */
const fs = require('fs');
const path = require('path');

const PORT = process.env.CDP_PORT || 9222;
const BASE = process.env.APP_URL || 'http://127.0.0.1:3005';
const OUT = process.env.OUT_DIR || '/tmp/opencode/mobile';
const TABS = ['inicio', 'gastos', 'patrimonio', 'analisis', 'objetivos', 'plan', 'ajustes', 'compartidos'];
const VIEWPORTS = [
  { width: 360, height: 800, name: '360' },
  { width: 390, height: 844, name: '390' },
  { width: 414, height: 896, name: '414' },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
  const page = list.find((p) => p.type === 'page' && p.url.includes('127.0.0.1:3005'));
  if (!page) throw new Error('No encuentro la pestaña de la app en CDP');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pend = new Map();
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
  };
  const send = (method, params = {}) => new Promise((res) => {
    const i = ++id;
    pend.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  const evalJs = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.result && r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
    return r.result && r.result.result ? r.result.result.value : undefined;
  };
  await send('Runtime.enable');
  await send('Page.enable');

  const resultados = [];
  for (const vp of VIEWPORTS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width, height: vp.height, deviceScaleFactor: 2, mobile: true,
    });
    await send('Page.reload', { ignoreCache: true });
    await new Promise((r) => setTimeout(r, 2000));
    for (const tab of TABS) {
      await evalJs(`irTab('${tab}'); true`);
      await new Promise((r) => setTimeout(r, 350));
      const info = await evalJs(`(() => {
        const vw = window.innerWidth;
        const doc = document.documentElement;
        const bad = [];
        for (const el of document.querySelectorAll('body *')) {
          const s = getComputedStyle(el);
          if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 1 || r.height < 1) continue;
          if (r.right > vw + 1 || r.left < -1) {
            // Ignorar descendientes de contenedores con scroll horizontal propio
            if (el.closest('.table-wrap, .chart-wrap')) continue;
            bad.push({
              tag: el.tagName.toLowerCase(),
              id: el.id || '',
              cls: String(el.className || '').slice(0, 80),
              left: Math.round(r.left),
              right: Math.round(r.right),
              width: Math.round(r.width),
              text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 50),
            });
          }
        }
        const tabs = [...document.querySelectorAll('#tabs .tab')].map((b) => {
          const r = b.getBoundingClientRect();
          return { label: b.textContent.trim(), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) };
        });
        return {
          vw,
          docScroll: doc.scrollWidth,
          bodyScroll: document.body.scrollWidth,
          overflow: doc.scrollWidth > vw + 1,
          bad: bad.slice(0, 12),
          tabs,
          planGrid: document.querySelector('.form-grid') ? getComputedStyle(document.querySelector('.form-grid')).gridTemplateColumns : null,
          kpis: document.querySelector('.plan-kpis') ? getComputedStyle(document.querySelector('.plan-kpis')).gridTemplateColumns : null,
        };
      })()`);
      resultados.push({ viewport: vp.name, tab, ...info });
      const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(path.join(OUT, `${vp.name}-${tab}.png`), Buffer.from(shot.result.data, 'base64'));
    }
  }

  let fallos = 0;
  for (const r of resultados) {
    const problemas = [];
    if (r.overflow) problemas.push(`documento ${r.docScroll}px > viewport ${r.vw}px`);
    if (r.bad.length) problemas.push(`${r.bad.length} elementos fuera: ` + r.bad.map((x) => `${x.tag}${x.id ? '#' + x.id : ''}${x.cls ? '.' + x.cls.split(' ')[0] : ''}(${x.left}..${x.right})`).join(', '));
    const tabsFuera = r.tabs.filter((t) => t.right > r.vw + 1 || t.left < -1);
    if (tabsFuera.length) problemas.push('tabs fuera: ' + tabsFuera.map((t) => t.label).join(', '));
    if (problemas.length) {
      fallos++;
      console.log(`✗ ${r.viewport}px ${r.tab}: ${problemas.join(' | ')}`);
    } else {
      console.log(`✓ ${r.viewport}px ${r.tab}`);
    }
  }
  console.log(`\nCapturas en ${OUT}`);
  console.log(fallos ? `\n${fallos} vistas con problemas de layout` : '\nTodas las vistas caben sin desbordamiento horizontal');
  ws.close();
  if (fallos) process.exitCode = 2;
}

main().catch((e) => { console.error(e); process.exit(1); });
