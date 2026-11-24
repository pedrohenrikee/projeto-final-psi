let vinhos = [];
const grade = document.getElementById("grade");
const mensagem = document.getElementById("mensagem");

async function iniciar() {
  try {
    vinhos = await api.listar();
    renderizar();
  } catch (e) {
    mensagem.textContent = "Não foi possível carregar os vinhos. Verifique a URL da API em config.js.";
    mensagem.classList.add("erro");
  }
}

function renderizar() {
  const lista = vinhos;
  mensagem.classList.remove("erro");
  mensagem.style.display = lista.length ? "none" : "block";
  if (!lista.length) mensagem.textContent = "Nenhum vinho encontrado.";

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

iniciar();