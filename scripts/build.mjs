// Build: src/ → site/
//   - CSS: fontes + tokens + base + seções. Crítico (fontes, tokens, base, hero, rodízio) inline
//     no <head>; o resto em css/site.min.css, carregado sem bloquear a renderização.
//   - Minificação CONSERVADORA: tira comentários e espaços, nada mais. Não funde nem reescreve
//     declarações, então os fallbacks duplicados (100vh→100svh, hidden→clip, font-size→min())
//     continuam lá para navegador antigo.
//   - JS próprio minificado com terser; referências com ?v=<hash> para cache longo.
//   - Preload de fontes só em http(s) (em file:// o preload com crossorigin dá erro de CORS).
// Uso: node scripts/build.mjs
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { minify } from 'terser';

const ROOT = resolve(import.meta.dirname, '..');
const SRC = resolve(ROOT, 'src'), SITE = resolve(ROOT, 'site');
const ler = f => readFileSync(resolve(SRC, f), 'utf8');
const hash = s => createHash('sha1').update(s).digest('hex').slice(0, 8);
const hashArq = f => hash(readFileSync(resolve(SITE, f)));

function minCSS(css) {
  let out = '', i = 0;
  while (i < css.length) {
    const c = css[i];
    if (c === '"' || c === "'") {                       // strings (inclui data: URIs) intocadas
      let j = i + 1;
      while (j < css.length && css[j] !== c) j += css[j] === '\\' ? 2 : 1;
      out += css.slice(i, j + 1); i = j + 1; continue;
    }
    if (c === '/' && css[i + 1] === '*') { const j = css.indexOf('*/', i + 2); i = j < 0 ? css.length : j + 2; continue; }
    if (/\s/.test(c)) {
      let j = i; while (j < css.length && /\s/.test(css[j])) j++;
      const prev = out[out.length - 1], next = css[j];
      if (!(prev === undefined || '{};,:>'.includes(prev) || '{};,>'.includes(next))) out += ' ';
      i = j; continue;
    }
    out += c; i++;
  }
  return out.replace(/;}/g, '}');
}

// ── CSS ───────────────────────────────────────────────────────────────
const secoes = ler('css/secoes.css');
const CORTE = secoes.indexOf('/* ═══ 03 · COZINHA');
if (CORTE < 0) throw new Error('marcador da seção 03 não encontrado em secoes.css');
const critico = minCSS(ler('css/fontes.css') + ler('css/tokens.css') + ler('css/base.css') + secoes.slice(0, CORTE));
const resto = minCSS(secoes.slice(CORTE));
mkdirSync(resolve(SITE, 'css'), { recursive: true });
writeFileSync(resolve(SITE, 'css/site.min.css'), resto);

// ── JS ────────────────────────────────────────────────────────────────
mkdirSync(resolve(SITE, 'js'), { recursive: true });
const opts = { compress: { passes: 2 }, mangle: true, format: { comments: false } };
const motion = (await minify(ler('js/motion.js'), opts)).code;
writeFileSync(resolve(SITE, 'js/motion.min.js'), motion);
let boot = ler('js/motion-boot.js');
for (const v of ['vendor/gsap.min.js', 'vendor/ScrollTrigger.min.js', 'vendor/lenis.min.js'])
  boot = boot.replace(`'${v}'`, `'${v}?v=${hashArq('js/' + v)}'`);
boot = boot.replace("'motion.js'", `'motion.min.js?v=${hash(motion)}'`);
if (!boot.includes('motion.min.js?v=')) throw new Error('referência a motion.js não encontrada no boot');
const bootMin = (await minify(boot, opts)).code;
writeFileSync(resolve(SITE, 'js/motion-boot.min.js'), bootMin);

// ── HTML ──────────────────────────────────────────────────────────────
// Preload das 3 fontes acima da dobra (Cormorant: nome; Source Serif: local e CTA; Shippori: 鮨).
// Medido: sem preload elas entram numa cadeia HTML → CSS → layout → fonte e o FCP simulado
// sobe de 1,2 s para 2,1 s. Só em http(s): em file:// o preload com crossorigin dá erro de CORS.
const FONTES_PRELOAD = ['fonts/cormorant-garamond-latin.woff2', 'fonts/source-serif-4-latin.woff2', 'fonts/shippori-mincho-sushi.woff2'];
const FONTES = ['fonts/cormorant-garamond-latin.woff2', 'fonts/source-serif-4-latin.woff2', 'fonts/shippori-mincho-sushi.woff2'];
const cssHref = `css/site.min.css?v=${hash(resto)}`;
const inlineJS = (await minify(`(function(){
  var d=document,h=d.head;
  // preload de fontes só em http(s)
  if(location.protocol!=='file:'){${JSON.stringify(FONTES_PRELOAD)}.forEach(function(f){var l=d.createElement('link');l.rel='preload';l.as='font';l.type='font/woff2';l.crossOrigin='anonymous';l.href=f;h.appendChild(l);});}
  // navegador sem suporte a rel=preload: carrega o CSS restante do jeito clássico
  var t=d.createElement('link');if(!(t.relList&&t.relList.supports&&t.relList.supports('preload'))){t.rel='stylesheet';t.href=${JSON.stringify(cssHref)};h.appendChild(t);}
})();`, opts)).code;
const head = [
  `<script>${inlineJS}</script>`,
  `<style>${critico}</style>`,
  `<link rel="preload" href="${cssHref}" as="style" onload="this.onload=null;this.rel='stylesheet'">`,
  `<noscript><link rel="stylesheet" href="${cssHref}"></noscript>`,
  `<script src="js/motion-boot.min.js?v=${hash(bootMin)}" defer></script>`
].join('\n');
const html = ler('index.html').replace(/<!-- build:head[^>]*-->/, head);
if (html.includes('build:head')) throw new Error('marcador build:head não substituído');
writeFileSync(resolve(SITE, 'index.html'), html);

// ── Relatório de peso ─────────────────────────────────────────────────
const kb = n => (n / 1024).toFixed(1) + ' KiB';
const linha = (nome, s, orig) => console.log(`${nome.padEnd(34)} ${kb(Buffer.byteLength(s)).padStart(10)}  gzip ${kb(gzipSync(s).length).padStart(9)}${orig ? `   (fonte ${kb(Buffer.byteLength(orig))})` : ''}`);
linha('index.html (com CSS crítico inline)', html);
linha('  └ CSS crítico inline', critico);
linha('css/site.min.css', resto, secoes.slice(CORTE));
linha('js/motion-boot.min.js', bootMin, ler('js/motion-boot.js'));
linha('js/motion.min.js', motion, ler('js/motion.js'));
for (const v of ['gsap.min.js', 'ScrollTrigger.min.js', 'lenis.min.js']) linha(`js/vendor/${v}`, readFileSync(resolve(SITE, 'js/vendor', v)));
for (const f of FONTES) console.log(`${f.padEnd(34)} ${kb(statSync(resolve(SITE, f)).size).padStart(10)}  (woff2, já comprimido)`);
