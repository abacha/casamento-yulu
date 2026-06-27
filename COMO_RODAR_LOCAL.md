# Rodar o site localmente

O site é 100% estático. Só precisa ser servido por HTTP (abrir o index.html
direto com duplo-clique NÃO funciona por causa dos módulos JavaScript).

## Opção 1 — Python (já vem no Mac/Linux)
Abra o terminal na pasta do site e rode:

    python3 -m http.server 8000

Depois abra no navegador: http://localhost:8000

## Opção 2 — Node
    npx serve .

## Opção 3 — VS Code
Instale a extensão "Live Server", clique direito no index.html → "Open with Live Server".

---
Para parar o servidor: Ctrl + C no terminal.
