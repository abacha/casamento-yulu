// ============================================================
//  CONFIG DO SITE — edite só este arquivo para mudar conteúdo
// ============================================================
window.WEDDING_CONFIG = {
  // --- Casal ---
  noivos: "Luana & Yudi",
  hashtag: "#yulu",

  // --- Data e local ---
  dataISO: "2026-09-19T10:30:00-03:00", // 19/set 10h30 (usado na contagem regressiva)
  dataTexto: "19 de Setembro de 2026",
  horaTexto: "10h30",
  local: "Sítio Aliança dos Avós",
  cidade: "Santa Isabel — SP",
  enderecoLinha: "Estr. do Pouso Alegre, s/n — Pouso Alegre, Santa Isabel — SP",
  mapsUrl: "https://maps.app.goo.gl/rSJznMTTpLtq34Bf6",

  // --- Pix (recebedor) ---
  pix: {
    key: "d832233e-edf4-41d6-b170-8e1526b076a1",  // chave aleatória (Pix)
    name: "Vitor Yudi Hashimoto",
    city: "Sao Paulo",
  },

  // --- RSVP ---
  // Cole aqui a URL do Web App do Apps Script depois de publicar (veja APPS_SCRIPT.md).
  // Enquanto estiver vazio, o form mostra aviso e NÃO envia.
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbyze0un8DawxaBEEM2yCBAQUOTDFRiWs3_K5OrBxDr6xhY1f-rj-P0QwBOFg6xiexhZ2g/exec",

  // --- Lista de presentes ---
  // Múltipla escolha: o convidado escolhe quantidades e gera UM QR Pix com o total.
  presentes: [
    { nome: "Poupança do bebê",                          valor: 200,  emoji: "👶" },
    { nome: "Tênis pro Yudi",                             valor: 700,  emoji: "👟" },
    { nome: "Terapia anti estresse pra Luana",           valor: 300,  emoji: "🧘" },
    { nome: "Adestrador pro Joey e Julie",               valor: 200,  emoji: "🐶" },
    { nome: "Vale abraço da Luana",                       valor: 3000, emoji: "🤗" },
    { nome: "12ª viagem pra Orlando do casal",            valor: 500,  emoji: "🎢" },
    { nome: "Contribuição pras bodas de 50 anos",         valor: 50,   emoji: "💍" },
    { nome: "Ingresso pra próxima Bravus (equipe Luana)", valor: 150,  emoji: "🏅" },
    { nome: "1 mês de academia do Yudi",                  valor: 1000, emoji: "💪" },
    { nome: "Day spa pro casal",                         valor: 1500, emoji: "💆" },
  ],
};
