# PROGRESSO — Sushi LM

## Etapa 1 — Análise (2026-09-29) ✅
- Mockup fatiado por bloco de conteúdo em `design/secoes/` (8 fatias, 01-hero-noren → 08-rodape-cta).
- `DESIGN.md` criado: leitura mockup × realidade, paleta + WCAG, tipografia, camadas, decorativos em CSS/SVG, motion, plano de imagens, perguntas e pendências do cliente.
- Commit: nenhum (a pasta não é repositório git).

- (Na etapa 1 faltavam as fotos; a pasta `imagens/` chegou depois e foi usada na etapa 2.)

## Etapa 2 — Construção estática (2026-09-29) ✅
- Site em `site/` (index.html + css/tokens.css, base.css, secoes.css; fotos em site/assets). Sem JS; motion ainda não feito.
- Inventário em `assets.md`. Scripts: `scripts/assets.py` (WebP), `scripts/shot.mjs` (screenshots seção/página/costura; `--final`).
- Commits: design pronto → hero → rodizio → cozinha → mesa → avaliacoes → cardapio → convite → rodape.
- Push: não feito (GH_TOKEN ausente; repositório sem remote).

## Aberto
- Sem foto: shimeji (faixa só texto), hot roll (trocado por sobremesas), sushiman (usado close do maçaricado), fachada.
- Fotos ≤1080px (salão 640px, borrado): sem versões 1600px; candidatas ao prompt A2.
- Logo real diz "Sushi L&M Delivery" em 150px — confirmar nome/arquivo com o cliente.
- Pendências do cliente: DESIGN.md §i (preço, horário, WhatsApp/reserva, autorizações).
- Próximo: fase de motion (DESIGN.md §f).

## Etapa 3 — Passada responsiva (2026-09-29) ✅
- `scripts/audit.mjs`: 12 telas (2560→320 + 844x390), zoom de texto 200%, sem fontes, reduced-motion+dark. Todas passam.
- Corrigido: color-mix → rgb(var(--*-rgb)/a) (Safari < 16.2); fallbacks 100vh/overflow hidden; color-scheme: only light;
  texto a 200% vazava (grids minmax(0,1fr), versais com teto em vw/cqi); kanji das cortinas em telas largas; amarra redesenhada.
- Lighthouse mobile (servidor local): Perf 69 · A11y 100 · BP 100 · SEO 100. FCP 3,2s, LCP 4,4s, Speed Index 16,3s. Otimização pendente.

## Motion — Fase 1: base global ✅ (tag motion-base)
- `motion-baseline.md`: auditoria 17/17, Lighthouse mobile mediana 78 (LCP 4,35s).
- Núcleo: `site/js/motion-boot.js` (modo full/reduced, qualidade high/low, carrega após load+1ª pintura+ocioso ou 1ª interação) e `site/js/motion.js` (Lenis, data-reveal, data-parallax, data-loop, pausa por aba oculta/fora da tela, API __motion.pausar/retomar).
- GSAP 3.15.0, ScrollTrigger, Lenis 1.3.26 auto-hospedados em `site/js/vendor/`.
- Testes: `scripts/motion-test.mjs` (global | secao <id> | custo), `scripts/ref.mjs` (estático idêntico), `scripts/lh.mjs`.
- Lighthouse depois da fase: mediana 78 (LCP 4,44s). 1ª tentativa deu 74: motion rodava antes da 1ª pintura do noren; corrigido esperando pintura + ocioso.

## Motion — Fase 2: seções ✅
| Seção | Motion | Quadro final × estático (1440/390) | LH (mediana 5) |
|---|---|---|---|
| 01 Hero | parallax da foto (top). Sem entrada: está acima da dobra | 0,000 / 0,000 % | 78 |
| 02 Rodízio | foto fade + parallax; título/nota sobem | 0,000 / 0,000 % | 78 |
| 03 Cozinha | citação/autoria sobem; foto fade + parallax (desktop) | 0,111 / 0,000 % | 78 |
| 04 Mesa | título + 3 serviços sobem; foto parada (texto em cima) | 0,000 / 0,000 % | 78 |
| 05 Avaliações | nota, fonte e citação sobem; shibori parado | 0,000 / 0,000 % | 78 |
| 06 Cardápio | por faixa: nome sobe, foto fade + parallax 0,06 | 0,107 / 0,388 % | 78 |
| 07 Convite | endereço sobe; borlas: pouso + balanço (único loop) | 0,000 / 0,000 % | 77 |
- Rejeitados pelo critério visual: balanço do noren e abertura das cortinas (superfícies caras), contagem 0→4,8, estrela/CTA pulsando, vapor/brilho/partículas.
- Custo (rolagem de 3s por seção, 1440): p95 de quadro 16,7–16,8 ms com e sem motion; script +25–40 ms; estilo/layout +12–29 ms.

## Motion — Fase 3: rodapé, pausa, coerência ✅ (tag motion-pronto)
- Rodapé: CTA e endereço com entrada. Bug corrigido no núcleo: grupos no fim da página nunca chegavam a 65% (768x1024) → gatilho com clamp(); nada parcialmente visível na 1ª tela é escondido.
- Botão de pausa (full+high), lembrado no localStorage. Menu: o site não tem menu; não foi criado.
- `motion-inventario.md`; orçamento por rolagem dentro do teto; parallax do cardápio retirado (seção mais agitada).
- Vídeo: screenshots/motion/video/*.webm (gitignored).
- Lighthouse final: mediana 78 (= base), LCP 4,43s, TBT 0, CLS 0.
- Push: não feito (GH_TOKEN ausente, sem remote).

## Hero — abertura do noren (pedido do cliente) ✅
- CSS puro na 1ª pintura: noren fechado → abre ~55% com a barra arrastando → volta balançando; foto com avanço de câmera; vinheta alivia; 鮨 carimba; nome/local/CTA sobem. 2,5s. Exceção registrada no DESIGN.md.
- Bug corrigido: o GSAP lia a escala da animação CSS e congelava a foto em scale(1.14); parallax agora monta depois das animações da foto.
- Quadros-chave: `node scripts/hero-quadros.mjs` → screenshots/motion/hero-abertura/.
- Testes: global verde, hero 0,015%/0,052%, auditoria 17/17, estático idêntico. Lighthouse 77 (base 78), LCP 4,43s, SI 3,56s.
