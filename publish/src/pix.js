// Gerador de payload Pix "Copia e Cola" (BR Code / EMV-MPM).
// Spec: Manual BR Code do Banco Central. Suporta valor fixo por item.
// Sem dependências — roda no browser e no Node.

function emv(id, value) {
  const len = String(value.length).padStart(2, "0");
  return `${id}${len}${value}`;
}

// CRC16-CCITT (XModem): polinômio 0x1021, init 0xFFFF.
export function crc16(payload) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Remove acentos e limita tamanho (campos do BR Code são ASCII e têm limites).
function sanitize(str, max) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .toUpperCase()
    .slice(0, max)
    .trim();
}

// Gera o payload Pix estático.
// opts: { key, name, city, amount?, txid?, description? }
export function buildPixPayload({ key, name, city, amount, txid = "***" }) {
  // Merchant Account Information (GUI br.gov.bcb.pix + chave + descrição opcional)
  // MAI = GUI + chave. A descrição (campo 02) é omitida de propósito:
  // é opcional no BR Code e a maior fonte de incompatibilidade entre bancos.
  const mai = emv("00", "br.gov.bcb.pix") + emv("01", key);

  let payload =
    emv("00", "01") + // Payload Format Indicator
    emv("26", mai) + // Merchant Account Information
    emv("52", "0000") + // Merchant Category Code
    emv("53", "986") + // Moeda: BRL
    (amount != null ? emv("54", Number(amount).toFixed(2)) : "") +
    emv("58", "BR") + // País
    emv("59", sanitize(name, 25)) + // Nome do recebedor (máx 25)
    emv("60", sanitize(city, 15)) + // Cidade (máx 15)
    emv("62", emv("05", sanitize(txid, 25))); // Additional data: txid

  payload += "6304"; // CRC id + len, valor calculado a seguir
  return payload + crc16(payload);
}

