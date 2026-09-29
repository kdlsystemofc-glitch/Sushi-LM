/* Motion — inicialização.
   Decide modo (full | reduced) e qualidade (high | low) e só então carrega GSAP,
   ScrollTrigger, Lenis e motion.js: depois do `load` ou na primeira interação,
   o que vier primeiro. Scripts clássicos, auto-hospedados (funciona em file://).
   Nada da página depende disto para aparecer.
   Testes: ?motion=off | reduced | full   ?quality=high | low */
(function () {
  'use strict';
  var q = new URLSearchParams(location.search);
  var forcado = q.get('motion');
  if (forcado === 'off') return;

  var reduzido = forcado === 'reduced' ||
    (forcado !== 'full' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var qualidade = q.get('quality');
  if (qualidade !== 'high' && qualidade !== 'low') {
    var con = navigator.connection || {};
    var fraco = !!con.saveData ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      Math.min(screen.width || innerWidth, innerWidth) < 768;
    qualidade = fraco ? 'low' : 'high';
  }

  window.__MOTION_CFG = { mode: reduzido ? 'reduced' : 'full', quality: qualidade };

  var base = document.currentScript.src.replace(/[^/]*$/, '');
  var lista = ['vendor/gsap.min.js', 'vendor/ScrollTrigger.min.js'];
  if (!reduzido && qualidade === 'high') lista.push('vendor/lenis.min.js');
  lista.push('motion.js');

  var eventos = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'];
  var iniciado = false;
  function iniciar() {
    if (iniciado) return;
    iniciado = true;
    eventos.forEach(function (e) { removeEventListener(e, iniciar, true); });
    (function proximo(i) {
      if (i >= lista.length) return;
      var s = document.createElement('script');
      s.src = base + lista[i];
      s.onload = function () { proximo(i + 1); };
      s.onerror = function () { /* sem motion: a página continua estática e completa */ };
      document.head.appendChild(s);
    })(0);
  }
  // Depois do load, espera a 1ª pintura do hero (a textura do noren é cara de pintar) e um
  // momento ocioso: o motion nunca atrasa o LCP. Interação do usuário antecipa.
  function aposPintura() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (window.requestIdleCallback) requestIdleCallback(iniciar, { timeout: 2500 });
        else setTimeout(iniciar, 300);
      });
    });
  }
  eventos.forEach(function (e) { addEventListener(e, iniciar, { capture: true, passive: true, once: true }); });
  if (document.readyState === 'complete') aposPintura();
  else addEventListener('load', aposPintura, { once: true });
})();
