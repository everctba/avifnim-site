# Landing page — AVIFnim

Página de vendas/apresentação em **HTML + CSS + JavaScript puro** (sem frameworks, sem build).
Pasta isolada para publicar em qualquer host estático (GitHub Pages, Netlify, Vercel, Cloudflare Pages…).

```
landing/
├── index.html
├── historia.html        (artigo: história do GIF, patentes, PNG e AVIF)
├── styles.css
├── historia.css
├── script.js
├── historia.js
├── README.md
└── assets/
    ├── app-icon-512.png    (logo / ícone)
    ├── app-icon-64.png     (byline do artigo)
    ├── favicon.ico
    ├── app-preview.png     (screenshot real do app, 1590×1089)
    ├── og-avifnim.jpg      (banner OGP 1200×630)
    ├── news-cover.png      (capa do artigo, 1200×630)
    ├── demo.avif
    ├── instalar.avif
    └── features/           (imagens da seção “Na prática”)
```

## Seções

1. **Hero** — slogan exato do briefing: *“Chega de GIF. Agora é AVIF.”*, CTA de compra (Hotmart),
   screenshot do app e fatos rápidos (GPU, alpha, local).
2. **Recursos** — sequência/vídeo, encode por GPU, transparência, controle fino, CLI+MCP, 100% local.
3. **Como funciona** — 3 passos no desktop.
4. **GIF × AVIF** — comparativo por critério (cores, transparência, tamanho, qualidade, suporte).
5. **Para agentes de IA** — fluxo de 4 passos, tools MCP e blocos de código com botão copiar
   (`avifnim init`, `.mcp.json`, comando CLI).
6. **Compra** — Hotmart (R$ 19,90), o que está incluído e o passo a passo.
7. **FAQ** — compatibilidade, GPU, privacidade, uso com Claude/OpenCode, vídeo, sobrescrita.
8. **CTA final** + rodapé.

## Comportamentos (script.js)

- Menu mobile com `aria-expanded` e fechamento por Esc/clique fora.
- Header ganha borda após o scroll.
- Detecção de SO para trocar o rótulo do CTA (`Windows`, `Linux`, `macOS`).
  - macOS aparece como “em breve” até o PKG ser publicado.
- Botões “Copiar” nos blocos de código (Clipboard API + fallback `execCommand`).
- Reveal on scroll com `IntersectionObserver` (respeita `prefers-reduced-motion`).
- Link ativo no menu conforme a seção visível.

## Conteúdo / posicionamento (referência: beads `avif-97g.7`)

- Slogan único: **“Chega de GIF. Agora é AVIF.”**
- Público: devs, designers e criadores que “vibecodam” sites e precisam de assets leves.
- Dor: GIF é pesado e feio; converter PNGs manualmente quebra o fluxo.
- Diferencial: além do app, instala **CLI + MCP** no PATH — o agente converte e já usa o AVIF no HTML.
- Vídeo: MP4/MKV/MOV/WEBM/AVI com trim/crop; MKV vira proxy MP4 automaticamente.
- Não prometer compatibilidade universal: foco em **navegadores modernos**.

## Preço e checkout

- **Português (Brasil):** R$ 19,90, pagamento único, via **Hotmart**.
  - Link placeholder em `index.html`: `https://pay.hotmart.com/SEU_PRODUTO` (trocar pelo real).
  - A seção `#comprar` mostra o que está incluído e o passo a passo da compra.
- **Inglês (internacional):** US$ 9,90, com opção **Gumroad** e **itch.io** — página em inglês ainda
  a ser criada (`avif-i18n`/landing EN). O texto e os links estão anotados no beads.
- O site **não linka mais o GitHub**: o produto é vendido como software fechado.

## Publicar

O site é **100% estático** — não precisa de backend.

```bash
# local
python -m http.server 8080 --directory landing
```

### GitHub Pages

O site é publicado a partir do repo público **`avifnim-site`** (branch `main`, raiz).
Em **Settings → Pages**, use **Deploy from a branch → main / (root)**.

URL: **https://everctba.github.io/avifnim-site/**

Para atualizar: copie o conteúdo de `landing/` para o repo `avifnim-site`, commit e push.
As tags `og:url`, `og:image`, `canonical` e o JSON-LD usam essa URL absoluta. Quando o domínio
próprio existir, troque `https://everctba.github.io/avifnim-site` por `https://avifnim.com` nos
quatro HTMLs.

Ao publicar, troque também o link da Hotmart na seção `#comprar` e (quando existir) os links de
Gumroad/itch.io na versão em inglês.

## Assets que ainda faltam (opcional)

- GIF/vídeo curto demonstrando a conversão (hero ou seção “Como funciona”).
- Screenshot do modal “Gravar tela” e do fluxo de vídeo com crop.
- Print da configuração do MCP dentro do Claude/OpenCode.
- Fontes self-hosted (hoje Inter/Space Grotesk vêm do Google Fonts; offline cai no system-ui).
