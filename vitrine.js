let vinhos = [];
const grade = document.getElementById("grade");
const mensagem = document.getElementById("mensagem");
const modal = document.getElementById("modal");

const estado = { texto: "", tipo: "", pais: "", soEstoque: false };

async function iniciar() {
  try {
    vinhos = await api.listar();
    montarFiltros(); 
    renderizar();
  } catch (e) {
    mensagem.textContent = "Não foi possível carregar os vinhos. Verifique a URL da API em config.js.";
    mensagem.classList.add("erro");
  }
}

function montarFiltros() {
  const tipos = [...new Set(vinhos.map((v) => v.tipo))].sort();
  const paises = [...new Set(vinhos.map((v) => v.pais))].sort();

  const chips = document.getElementById("chipsTipo");
  chips.innerHTML = ["Todos", ...tipos]
    .map((t, i) => `<button class="chip ${i === 0 ? "ativo" : ""}" data-tipo="${i === 0 ? "" : esc(t)}">${esc(t)}</button>`)
    .join("");
  chips.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    chips.querySelectorAll(".chip").forEach((c) => c.classList.remove("ativo"));
    chip.classList.add("ativo");
    estado.tipo = chip.dataset.tipo;
    renderizar();
  });

  document.getElementById("filtroPais").innerHTML +=
    paises.map((p) => `<option value="${esc(p)}">${esc(p)}</option>`).join("");
}

function filtrar() {
  const termo = estado.texto.trim().toLowerCase();
  return vinhos.filter((v) => {
    const alvo = [v.nome, v.tipo, v.pais, v.regiao, v.uva, ...(v.caracteristicas || [])]
      .join(" ").toLowerCase();
    return (
      (!termo || alvo.includes(termo)) &&
      (!estado.tipo || v.tipo === estado.tipo) &&
      (!estado.pais || v.pais === estado.pais) &&
      (!estado.soEstoque || Number(v.estoque) > 0)
    );
  });
}

function renderizar() {
  const lista = filtrar();
  mensagem.classList.remove("erro");
  mensagem.style.display = lista.length ? "none" : "block";
  if (!lista.length) mensagem.textContent = "Nenhum vinho encontrado com esses filtros.";

  grade.innerHTML = lista.map((v) => {
    const st = statusEstoque(v.estoque);
    return `
      <article class="card ${st.classe === "esgotado" ? "sem-estoque" : ""}" data-id="${esc(v.id)}" tabindex="0">
        <img src="${esc(imagemSegura(v.imagem))}" alt="${esc(v.nome)}" loading="lazy" onerror="this.src=PLACEHOLDER">
        <div class="info">
          <h3>${esc(v.nome)} ${esc(v.ano)}</h3>
          <span class="meta">${esc(v.tipo)} · ${esc(v.pais)}</span>
          <span class="preco">${formatarPreco(v.preco)}</span>
          <span class="selo ${st.classe}">${esc(st.texto)}</span>
        </div>
      </article>`;
  }).join("");
}

function abrirDetalhe(id) {
  const v = vinhos.find((x) => String(x.id) === String(id));
  if (!v) return;
  const st = statusEstoque(v.estoque);
  document.getElementById("detalhe").innerHTML = `
    <img src="${esc(imagemSegura(v.imagem))}" alt="${esc(v.nome)}" onerror="this.src=PLACEHOLDER">
    <div>
      <h2>${esc(v.nome)} ${esc(v.ano)}</h2>
      <span class="selo ${st.classe}">${esc(st.texto)}</span>
      <p class="preco">${formatarPreco(v.preco)}</p>
      <dl>
        <dt>Tipo</dt><dd>${esc(v.tipo)}</dd>
        <dt>País</dt><dd>${esc(v.pais)}</dd>
        <dt>Região</dt><dd>${esc(v.regiao)}</dd>
        <dt>Uva</dt><dd>${esc(v.uva || "—")}</dd>
        <dt>Teor alcoólico</dt><dd>${v.teor ? esc(v.teor) + "%" : "—"}</dd>
        <dt>Características</dt><dd>${esc((v.caracteristicas || []).join(", "))}</dd>
        <dt>Em estoque</dt><dd>${Number(v.estoque) || 0} un.</dd>
      </dl>
      <p>${esc(v.descricao || "")}</p>
    </div>`;
  modal.showModal();
}

document.getElementById("busca").addEventListener("input", (e) => {
  estado.texto = e.target.value;
  renderizar();
});
document.getElementById("filtroPais").addEventListener("change", (e) => {
  estado.pais = e.target.value;
  renderizar();
});
document.getElementById("soEstoque").addEventListener("change", (e) => {
  estado.soEstoque = e.target.checked;
  renderizar();
});

grade.addEventListener("click", (e) => {
  const c = e.target.closest(".card");
  if (c) abrirDetalhe(c.dataset.id);
});
grade.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const c = e.target.closest(".card");
    if (c) abrirDetalhe(c.dataset.id);
  }
});
document.getElementById("fecharModal").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

iniciar();