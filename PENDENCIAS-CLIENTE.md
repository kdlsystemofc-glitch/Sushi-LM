# PENDENCIAS-CLIENTE.md — o que falta o cliente informar

O site está pronto e testado, mas **não deve ser publicado** antes dos itens marcados como **BLOQUEIA**. Os demais melhoram o site e podem entrar depois.

## Como preencher e reconstruir

1. Abra **`cliente.config.json`**: é o único arquivo de dados do cliente. `null` quer dizer "ainda não informado".
2. Preencha o campo com o dado confirmado pelo cliente (formato de cada um na tabela abaixo e nos campos `_exemplo` do próprio arquivo).
3. Rode:
   ```
   npm run build        # reconstrói site/ e lista as pendências que ainda restam
   npm test             # regressão visual, auditoria responsiva, motion, SEO
   ```
4. O build imprime "PENDÊNCIAS DO CLIENTE (n)". Enquanto houver item que **bloqueia**, não publique.

Itens que dependem de **arquivo** (foto, logo) têm passos próprios, descritos na tabela.

## Lista

| # | O que falta | Onde entra | Efeito quando resolvido | Bloqueia? |
|---|---|---|---|---|
| 1 | **Autorização de uso das fotos** (todas vieram do Google/Instagram) | `autorizacoes.fotos: true` | Libera a publicação. A imagem de compartilhamento pode passar a usar foto (hoje é o noren, sem foto). | **BLOQUEIA** |
| 2 | **Domínio** | `dominio: "https://…"` | Ativa canonical, og:url, og:image absoluta, twitter:image, url/image do JSON-LD, sitemap.xml e a linha Sitemap do robots.txt. | **BLOQUEIA** |
| 3 | **Preço oficial do rodízio** (almoço/jantar/fim de semana, criança) e o que inclui | `rodizio.precoTexto` (frase exibida) e `rodizio.priceRange` (ex. `"R$ 80–100"`) | Aparece uma linha sob "Rodízio japonês"; `priceRange` entra no JSON-LD. Hoje o único número é o "R$ 80–100 por pessoa" que usuários informaram ao Google, e não é publicado. | **BLOQUEIA** (é a informação que o visitante mais procura) |
| 4 | **Horário por dia da semana** | `horarios: [{ "dias": ["Mo",…], "abre": "HH:MM", "fecha": "HH:MM" }]` | Rodapé mostra o horário agrupado ("Ter a Sáb · 11h–15h e 18h30–23h"); JSON-LD ganha `openingHoursSpecification`, o que ajuda no Google. | **BLOQUEIA** |
| 5 | **O (11) 94032-0412 é WhatsApp?** Aceitam reserva? | `whatsapp.numeroEhWhatsapp`, `whatsapp.aceitaReserva` | `false` → os botões viram ligação (tel:). Reserva `true` → rodapé "Reserve pelo WhatsApp" + `acceptsReservations`. | **BLOQUEIA** (os botões podem estar levando a um número sem WhatsApp) |
| 6 | **Autorização para citar avaliações com o primeiro nome** (Karlen F., Anderson F.) | `autorizacoes.citarAvaliacoesComNome` | `true` → mantém os nomes. `false` → as citações ficam como "Avaliação no Google". | **BLOQUEIA** (uso de nome de terceiros) |
| 7 | **Nome oficial**: "Sushi LM" (Google) ou "Sushi L&M" (logo) | `nome.oficial` | Troca título, h1, rodapé, Open Graph, manifest e JSON-LD (com o outro nome como `alternateName`). A imagem de compartilhamento precisa ser refeita: `node scripts/seo-assets.mjs`. | não |
| 8 | **Pratos**: nigiri de salmão, temaki de salmão, shimeji e sobremesas estão no rodízio/cardápio? Nomes corretos? | `pratos: { "Nome": true/false }` | `false` remove a faixa do prato. Nome errado: corrigir no `src/index.html` (h3 e alt). | não |
| 9 | **Foto do shimeji** (um dos "mais pedidos") | arquivo em `imagens/` → `scripts/assets.py` (novo item em `JOBS`) → `src/index.html` (trocar a faixa `prato--sem-foto` por uma com `<picture>`, igual às outras) | A faixa do shimeji ganha foto como as demais. | não |
| 10 | **Fotos em alta** (originais do celular, sem filtro) de salão, fachada, sushiman, pratos | `imagens/` → `python scripts/assets.py` | Tira o desfoque das fotos ampliadas (Mesa, Salão). Foto de sushiman permite trocar o close repetido na seção Cozinha. Se alguma for ampliada por IA, registrar em `assets.md` com "recriada por IA — confirmar com o cliente". | não |
| 11 | **Logo em vetor** (SVG/PDF/AI) | `logoVetor: "imagens/logo.svg"` | Substitui o logo de 150 px no rodapé e entra como `logo` no JSON-LD. Para favicon e ícones com o logo: adaptar `scripts/seo-assets.mjs`. | não |
| 12 | **Link do cardápio** (o Google aponta para um wa.me incompleto) | `links.cardapio` | Link "Cardápio" no rodapé + `hasMenu` no JSON-LD. | não |
| 13 | **Pedido on-line / delivery** (plataforma, área de entrega) | `links.pedidoOnline` | Link "Pedir on-line" no rodapé. | não |
| 14 | **Instagram** | `links.instagram` | Link no rodapé + `sameAs` no JSON-LD. | não |
| 15 | **Nota do Google** (4,8 · 330 avaliações, em 29/09/2026) | `src/index.html`, seção Avaliações | Atualizar o número pouco antes de publicar. Não entra no JSON-LD (regra: avaliação de terceiros não se marca no próprio site). | não |

## Mensagem pronta para o cliente

> Oi! O site do Sushi LM está pronto 🍣 Para colocar no ar, preciso só confirmar algumas coisas:
>
> 1. **Fotos**: podemos usar no site as fotos de vocês que estão no Google e no Instagram? Se tiverem as originais (do celular, sem filtro) do salão, da fachada, do sushiman e dos pratos, mandem também. Falta principalmente uma do **shimeji**.
> 2. **Rodízio**: qual o valor hoje (almoço, jantar, fim de semana, criança)? O que está incluso?
> 3. **Horário**: quais dias e horários vocês abrem?
> 4. **WhatsApp**: o (11) 94032-0412 é WhatsApp? Vocês aceitam reserva por ele?
> 5. **Avaliações**: podemos mostrar trechos de avaliações do Google com o primeiro nome de quem escreveu (ex.: "Karlen F.")?
> 6. **Nome**: o nome certo é "Sushi LM" ou "Sushi L&M"? Têm o logo em arquivo de boa qualidade (PDF, SVG ou AI)?
> 7. **Cardápio**: nigiri de salmão, temaki de salmão, shimeji e sobremesas fazem parte do rodízio? Têm um link do cardápio?
> 8. **Delivery**: usam iFood ou outra plataforma? Qual o link?
> 9. **Instagram**: qual o @?
> 10. **Domínio**: já têm um endereço (ex.: sushilm.com.br) ou querem que a gente registre?
>
> Pode mandar aos poucos. Assim que chegar, atualizo e publico. Obrigado! 🙏
