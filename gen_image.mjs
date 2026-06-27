#!/usr/bin/env node
// Gera imagens via Gemini (Nanobanana / gemini-2.5-flash-image) com fotos de referência.
// Uso: node gen_image.mjs "<prompt>" <out.png> [ref1.jpg ref2.jpg ...]
import { readFileSync, writeFileSync } from "node:fs";

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!API_KEY) { console.error("Falta GEMINI_API_KEY"); process.exit(1); }

const MODEL = "gemini-2.5-flash-image";
const [, , prompt, outPath, ...refs] = process.argv;
if (!prompt || !outPath) { console.error("Uso: gen_image.mjs <prompt> <out> [refs...]"); process.exit(1); }

function imgPart(p) {
  const b = readFileSync(p);
  const ext = p.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
  return { inline_data: { mime_type: ext, data: b.toString("base64") } };
}

const parts = [{ text: prompt }, ...refs.map(imgPart)];

const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const ctrl = new AbortController();
const t = setTimeout(() => ctrl.abort(), 120000);
let res;
try {
  res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts }] }),
    signal: ctrl.signal,
  });
} catch (e) {
  console.error("Erro de rede:", e.message); process.exit(1);
} finally { clearTimeout(t); }

if (!res.ok) { console.error("HTTP", res.status, await res.text()); process.exit(1); }
const json = await res.json();
const cand = json?.candidates?.[0];
const imgPartOut = cand?.content?.parts?.find((p) => p.inline_data || p.inlineData);
const data = imgPartOut?.inline_data?.data || imgPartOut?.inlineData?.data;
if (!data) { console.error("Sem imagem na resposta:", JSON.stringify(json).slice(0, 800)); process.exit(1); }
writeFileSync(outPath, Buffer.from(data, "base64"));
console.log("OK ->", outPath);
