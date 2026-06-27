# Casamento Luana & Yudi — `#yulu`

Site estático do casamento de **Luana & Yudi** — 19 de Setembro de 2026, 10h30, Sítio Aliança dos Avós (Santa Isabel — SP).

🔗 Produção: <https://www.luanaeyudi.com.br>

## O que o site faz

- **Hero + contagem regressiva** pra data do casamento.
- **Local** com botão "Abrir no mapa" (Google Maps) e aviso pra não usar o Waze (rota errada).
- **RSVP** — confirmação de presença com nome e bebida por pessoa. Grava direto numa planilha do Google via Apps Script.
- **Lista de presentes** — múltipla escolha com quantidades; gera **um único QR Pix** somando o total escolhido.

## Stack

Vanilla JS (ESM), HTML e CSS — sem build, sem framework, sem dependências de runtime além de uma lib local de QR code (`vendor/qrcode.min.js`). O backend do RSVP é um Google Apps Script Web App.

## Estrutura

```
.
├── docs/                 # versão publicada (servida pelo GitHub Pages)
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   ├── config.js
│   ├── src/pix.js        # geração do BR Code (Pix copia-e-cola)
│   ├── vendor/qrcode.min.js
│   ├── assets/
│   └── CNAME             # www.luanaeyudi.com.br
├── index.html            # fonte de desenvolvimento
├── app.js
├── style.css
├── config.js
├── src/
├── assets/
├── APPS_SCRIPT.md        # como publicar o backend do RSVP
└── COMO_RODAR_LOCAL.md   # como rodar localmente
```

> A pasta `docs/` é a cópia limpa que vai pro ar. Edite na raiz (fonte de dev) e copie para `docs/` ao publicar. Faça o *bump* do parâmetro `?v=N` nos assets em `index.html` para furar cache.

## Configuração

Todo o conteúdo editável fica em **`config.js`** (casal, data, local, chave Pix, endpoint do RSVP, lista de presentes). É o único arquivo que precisa ser tocado para mudar conteúdo.

## Rodar localmente

```sh
python3 -m http.server 8190
```

Acesse <http://localhost:8190>. Veja `COMO_RODAR_LOCAL.md` para detalhes.

## RSVP (backend)

O formulário envia para um Google Apps Script Web App (`/exec`) que grava na planilha. Para (re)publicar o backend, siga `APPS_SCRIPT.md` e cole a URL `/exec` em `config.js` → `rsvpEndpoint`.

## Deploy (GitHub Pages)

Servido pelo GitHub Pages a partir de `master` `/docs`, com domínio custom `www.luanaeyudi.com.br` (arquivo `docs/CNAME`).

DNS necessário no provedor do domínio:

- `www` → **CNAME** `abacha.github.io`
- apex (`luanaeyudi.com.br`) → 4 registros **A**: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

Após o DNS propagar, o build do Pages valida o CNAME e o site sobe; então ative *Enforce HTTPS*.
