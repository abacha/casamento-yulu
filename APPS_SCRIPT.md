# RSVP → Google Sheets (Apps Script Web App)

A planilha já foi criada:
**Casamento Luana & Yudi - Confirmações (RSVP)**
https://docs.google.com/spreadsheets/d/1R3BWhKWgj6qLoNDJOP-_wIn6SKIHJ9GgF2v9YIX3REM/edit

Falta publicar o endpoint que recebe os RSVPs do site. São ~1 minuto:

## Passo a passo

1. Abra a planilha (link acima) com a conta **abacha@gmail.com**.
2. Menu **Extensões → Apps Script**.
3. Apague o conteúdo padrão e cole o código do bloco abaixo (`Código.gs`).
4. Clique em **Implantar → Nova implantação**.
5. Em "Tipo", escolha **App da Web**.
   - **Executar como:** Eu (abacha@gmail.com)
   - **Quem pode acessar:** **Qualquer pessoa**
6. Clique **Implantar**, autorize o acesso quando pedir.
7. Copie a **URL do app da Web** (termina em `/exec`).
8. Cole essa URL em `config.js` no campo `rsvpEndpoint`.

Pronto — o formulário do site passa a gravar direto na planilha.

## Código (`Código.gs`)

```javascript
const SHEET_ID = "1R3BWhKWgj6qLoNDJOP-_wIn6SKIHJ9GgF2v9YIX3REM";

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    sheet.appendRow([
      new Date(),
      data.nome || "",
      data.confirma || "",
      data.bebe || "",
      data.qtd_ate5 || 0,
      data.qtd_ate10 || 0,
      data.qtd_acima10 || 0,
      data.total_acompanhantes || 0,
      data.acompanhantes || "",
      data.mensagem || ""
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("RSVP endpoint ativo.");
}
```

> Cabeçalho da planilha (linha 1) já está configurado:
> `Data/Hora | Nome | Confirmou? | Bebe (titular) | Qtd até 5 | Qtd 6-10 | Qtd acima 10 | Total acompanhantes | Acompanhantes (nome/faixa/bebe) | Mensagem`
