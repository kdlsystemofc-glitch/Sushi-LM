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
