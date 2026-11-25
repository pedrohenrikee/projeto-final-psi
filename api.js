'use strict'

const BASE = `${API_URL}/${RECURSO}`;

async function requisicao(url, opcoes = {}) {
  const resp = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });
  if (!resp.ok) throw new Error(`Erro ${resp.status} ao acessar a API`);
  return resp.status === 204 ? null : resp.json();
}

const api = {
  listar: () => requisicao(BASE),
  criar: (dados) => requisicao(BASE, { method: "POST", body: JSON.stringify(dados) }),
  atualizar: (id, dados) => requisicao(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(dados) }),
};

function esc(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function formatarPreco(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="100%" height="100%" fill="#efe6e8"/><text x="50%" y="50%" font-size="60" text-anchor="middle">🍷</text></svg>`
  );

function imagemSegura(url) {
  return url && /^https?:\/\//.test(url) ? url : PLACEHOLDER;
}

function statusEstoque(qtd) {
  qtd = Number(qtd) || 0;
  if (qtd <= 0) return { texto: "Esgotado", classe: "esgotado" };
  if (qtd <= ESTOQUE_BAIXO) return { texto: `Últimas ${qtd} unidades`, classe: "baixo" };
  return { texto: "Em estoque", classe: "ok" };
}

