import { buildPixPayload } from "./src/pix.js?v=8";

const CFG = window.WEDDING_CONFIG;

/* ---------- Preenche conteúdo dinâmico ---------- */
document.getElementById("endereco").textContent = CFG.enderecoLinha;
document.getElementById("mapsLink").href = CFG.mapsUrl;

/* ---------- Contagem regressiva ---------- */
const target = new Date(CFG.dataISO).getTime();
const cd = {
  dias: document.querySelector('[data-cd="dias"]'),
  horas: document.querySelector('[data-cd="horas"]'),
  min: document.querySelector('[data-cd="min"]'),
  seg: document.querySelector('[data-cd="seg"]'),
};
function tickCountdown() {
  const diff = target - Date.now();
  if (diff <= 0) {
    cd.dias.textContent = cd.horas.textContent = cd.min.textContent = cd.seg.textContent = "0";
    document.querySelector(".countdown h2").textContent = "Hoje é o grande dia! 🎉";
    return;
  }
  const s = Math.floor(diff / 1000);
  cd.dias.textContent = Math.floor(s / 86400);
  cd.horas.textContent = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
  cd.min.textContent = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  cd.seg.textContent = String(s % 60).padStart(2, "0");
}
tickCountdown();
setInterval(tickCountdown, 1000);

/* ---------- Lista de presentes (carrinho) ---------- */
const grid = document.getElementById("giftGrid");
const fmtBRL = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// quantidade escolhida por item (index -> qtd)
const cart = CFG.presentes.map(() => 0);

CFG.presentes.forEach((p, i) => {
  const card = document.createElement("div");
  card.className = "gift-card";
  card.innerHTML = `
    <span class="gift-emoji">${p.emoji || "🎁"}</span>
    <span class="gift-name">${p.nome}</span>
    <span class="gift-value">${fmtBRL(p.valor)}</span>
    <div class="qty-ctrl">
      <button type="button" class="qty-btn" data-dec="${i}" aria-label="Diminuir">−</button>
      <span class="qty-num" data-qty="${i}">0</span>
      <button type="button" class="qty-btn" data-inc="${i}" aria-label="Aumentar">+</button>
    </div>`;
  grid.appendChild(card);
});

const cartBar = document.getElementById("cartBar");
const cartSummary = document.getElementById("cartSummary");
const cartTotal = document.getElementById("cartTotal");

function cartCount() { return cart.reduce((a, b) => a + b, 0); }
function cartSum() { return cart.reduce((a, q, i) => a + q * CFG.presentes[i].valor, 0); }

function refreshCart() {
  const count = cartCount();
  cartSummary.textContent = count === 1 ? "1 item" : `${count} itens`;
  cartTotal.textContent = fmtBRL(cartSum());
  cartBar.hidden = count === 0;
}

grid.addEventListener("click", (e) => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  let idx = null;
  if (inc) { idx = +inc.dataset.inc; cart[idx]++; }
  else if (dec) { idx = +dec.dataset.dec; if (cart[idx] > 0) cart[idx]--; }
  if (idx === null) return;
  grid.querySelector(`[data-qty="${idx}"]`).textContent = cart[idx];
  refreshCart();
});

/* ---------- Modal Pix (total do carrinho) ---------- */
const modal = document.getElementById("pixModal");
const qrCanvas = document.getElementById("qrCanvas");
const pixCodeInput = document.getElementById("pixCode");
const pixItems = document.getElementById("pixItems");

function openPixCart() {
  const chosen = CFG.presentes
    .map((p, i) => ({ ...p, qtd: cart[i] }))
    .filter((p) => p.qtd > 0);
  if (chosen.length === 0) return;

  const total = cartSum();

  // Lista de itens no modal
  pixItems.innerHTML = chosen
    .map((p) => `<div class="pix-item"><span>${p.qtd}× ${p.nome}</span><span>${fmtBRL(p.valor * p.qtd)}</span></div>`)
    .join("");
  document.getElementById("pixAmount").textContent = "Total: " + fmtBRL(total);

  const payload = buildPixPayload({
    key: CFG.pix.key,
    name: CFG.pix.name,
    city: CFG.pix.city,
    amount: total,
  });

  pixCodeInput.value = payload;
  // qrcodejs (davidshimjs): new QRCode(el, {...}) injeta canvas/img no elemento.
  qrCanvas.innerHTML = "";
  if (window.QRCode) {
    new window.QRCode(qrCanvas, {
      text: payload,
      width: 240,
      height: 240,
      colorDark: "#4f6b4b",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.M,
    });
  } else {
    qrCanvas.innerHTML = '<p style="font-size:1.3rem;color:#b5564f">Não foi possível gerar o QR. Use o código abaixo.</p>';
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}
function closePix() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

document.getElementById("cartCheckout").addEventListener("click", openPixCart);
document.getElementById("modalClose").addEventListener("click", closePix);
modal.addEventListener("click", (e) => { if (e.target === modal) closePix(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePix(); });

document.getElementById("copyBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(pixCodeInput.value);
    const b = document.getElementById("copyBtn");
    const old = b.textContent; b.textContent = "Copiado!";
    setTimeout(() => (b.textContent = old), 1800);
  } catch {
    pixCodeInput.select(); document.execCommand("copy");
  }
});

/* ---------- RSVP: mostra/esconde campos conforme comparecimento ---------- */
const form = document.getElementById("rsvpForm");
const cond = document.getElementById("condicional");
form.addEventListener("change", (e) => {
  if (e.target.name === "confirma") {
    cond.style.display = e.target.value === "Sim" ? "block" : "none";
  }
});

/* ---------- RSVP: acompanhantes por faixa etária ---------- */
const MAX_POR_FAIXA = 5;
const FAIXAS = [
  { key: "ate5",    label: "Até 5 anos",      bebe: false },
  { key: "ate10",   label: "De 6 a 10 anos",  bebe: false },
  { key: "acima10", label: "Acima de 10 anos", bebe: true  },
];

// Popula os selects 0..5
document.querySelectorAll(".guests-counts select").forEach((sel) => {
  for (let i = 0; i <= MAX_POR_FAIXA; i++) {
    const o = document.createElement("option");
    o.value = String(i);
    o.textContent = String(i);
    sel.appendChild(o);
  }
});

const guestsFields = document.getElementById("guestsFields");

// Renderiza os campos de nome (e bebida quando aplicável) conforme as quantidades
function renderGuestFields() {
  // preserva valores já digitados
  const prev = {};
  guestsFields.querySelectorAll("[data-guest]").forEach((el) => { prev[el.name] = el.value; });
  guestsFields.querySelectorAll("[data-guest-bebe]:checked").forEach((el) => { prev[el.name] = el.value; });

  guestsFields.innerHTML = "";
  FAIXAS.forEach((faixa) => {
    const qtd = +form.querySelector(`select[data-faixa="${faixa.key}"]`).value;
    for (let i = 1; i <= qtd; i++) {
      const wrap = document.createElement("div");
      wrap.className = "guest-block";
      const nameField = `g_${faixa.key}_nome_${i}`;
      const bebeField = `g_${faixa.key}_bebe_${i}`;
      let html = `<p class="guest-title">${faixa.label} — acompanhante ${i}</p>
        <input type="text" data-guest name="${nameField}" placeholder="Nome completo" required value="${prev[nameField] ? prev[nameField].replace(/"/g, "&quot;") : ""}" />`;
      if (faixa.bebe) {
        const yes = prev[bebeField] === "Sim" ? "checked" : "";
        const no = prev[bebeField] === "Não" ? "checked" : "";
        html += `<div class="guest-bebe">
          <span>Bebe álcool?</span>
          <label class="radio"><input type="radio" data-guest-bebe name="${bebeField}" value="Sim" ${yes} /> Sim 🍷</label>
          <label class="radio"><input type="radio" data-guest-bebe name="${bebeField}" value="Não" ${no} /> Não 🥤</label>
        </div>`;
      }
      wrap.innerHTML = html;
      guestsFields.appendChild(wrap);
    }
  });
}

document.querySelectorAll(".guests-counts select").forEach((sel) =>
  sel.addEventListener("change", renderGuestFields)
);

/* ---------- RSVP: envio ---------- */
const msg = document.getElementById("rsvpMsg");
const rsvpBtn = document.getElementById("rsvpBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.className = "rsvp-feedback";
  msg.textContent = "";

  if (!CFG.rsvpEndpoint) {
    msg.classList.add("err");
    msg.textContent = "⚠️ Envio ainda não configurado (falta a URL do RSVP). Avise os noivos.";
    return;
  }

  const fd = new FormData(form);
  const compareceu = fd.get("confirma");

  // Monta lista de acompanhantes por faixa
  const acompanhantes = [];
  const contagem = { ate5: 0, ate10: 0, acima10: 0 };
  if (compareceu === "Sim") {
    FAIXAS.forEach((faixa) => {
      const qtd = +(fd.get(`qtd_${faixa.key}`) || 0);
      contagem[faixa.key] = qtd;
      for (let i = 1; i <= qtd; i++) {
        const nome = (fd.get(`g_${faixa.key}_nome_${i}`) || "").trim();
        const bebe = faixa.bebe ? (fd.get(`g_${faixa.key}_bebe_${i}`) || "") : "";
        acompanhantes.push({ nome, faixa: faixa.label, bebe });
      }
    });
  }
  const totalAcomp = acompanhantes.length;
  // Resumo textual: "Nome (faixa, bebe: Sim); ..."
  const acompResumo = acompanhantes
    .map((a) => `${a.nome} (${a.faixa}${a.bebe ? ", bebe: " + a.bebe : ""})`)
    .join("; ");

  const payload = {
    nome: fd.get("nome"),
    confirma: compareceu,
    bebe: compareceu === "Sim" ? (fd.get("bebe") || "") : "",
    qtd_ate5: contagem.ate5,
    qtd_ate10: contagem.ate10,
    qtd_acima10: contagem.acima10,
    total_acompanhantes: totalAcomp,
    acompanhantes: acompResumo,
    mensagem: fd.get("mensagem") || "",
  };

  rsvpBtn.disabled = true;
  rsvpBtn.textContent = "Enviando...";
  try {
    // Apps Script Web App: usa text/plain p/ evitar preflight CORS.
    await fetch(CFG.rsvpEndpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    // no-cors => resposta opaca; assumimos sucesso se não lançou.
    msg.classList.add("ok");
    msg.textContent = compareceu === "Sim"
      ? "🎉 Presença confirmada! Obrigado, nos vemos lá!"
      : "Obrigado por avisar 💛 Sentiremos sua falta.";
    form.reset();
    guestsFields.innerHTML = "";
    cond.style.display = "block";
  } catch (err) {
    msg.classList.add("err");
    msg.textContent = "Não foi possível enviar agora. Tente novamente em instantes.";
  } finally {
    rsvpBtn.disabled = false;
    rsvpBtn.textContent = "Enviar confirmação";
  }
});

// ============================================================
//  Easter egg — clique 5x no #yulu do rodapé revela o crédito.
//  (E um aceno no console pra quem abrir o DevTools.)
// ============================================================
(() => {
  const tag = document.getElementById("footerTag");
  const egg = document.getElementById("easterEgg");
  if (!tag || !egg) return;
  let clicks = 0;
  let timer = null;
  tag.addEventListener("click", () => {
    clicks++;
    clearTimeout(timer);
    timer = setTimeout(() => { clicks = 0; }, 1500);
    if (clicks >= 5) {
      egg.classList.add("show");
      clicks = 0;
    }
  });
  console.log("%c💚 Feito por Adriano, Enzo & Cia.", "color:#6f8f6a;font-size:14px;font-weight:bold;");
})();
