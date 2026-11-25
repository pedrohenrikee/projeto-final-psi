'use strict'

let vinhos = [];
const $ = (id) => document.getElementById(id);
const form = $("form");

function aviso(texto){
    const t = $("toast");
    t.textContent = texto;
    t.classList.add("mostrar")
    setTimeout(() => t.classList.remove("mostrar"), 2500);
}

async function carregar(){
    try {
        vinhos = await api.listar();
        $("mensagem").style.display = "none"
        renderizar();
    } catch (e) {
        $("mensagem").textContent = "Erro ao carregar. Verifique a URL da API em config.js";
        $("mensagem").classList.add("erro");
    }
}

function renderizar(){
    const termo = $("buscaAdmin").value.trim().toLowerCase();
    const lista = vinhos.filter((v) => `${v.nome} ${v.tipo} ${v.pais}`.toLowerCase().includes(termo));
    $("corpo").innerHTML = lista.map((v) => {
        const st = statusEstoque(v.estoque);
        return `
        <tr>
            <td><img src="${esc(imagemSegura(v.imagem))}" alt="" onerror="this.src=PLACEHOLDER"></td>
            <td><strong>${esc(v.nome)} ${esc(v.ano)}</strong><br><small>${esc(v.tipo)} · ${esc(v.pais)}</small></td>
            <td>${formatarPreco(v.preco)}</td>
        <td><strong>${Number(v.estoque) || 0}</strong><br><span class="selo ${st.classe}">${esc(st.texto)}</span></td>
        <td class="acoes">
        <button class="btn sec" data-acao="editar" data-id="${esc(v.id)}">Editar</button>
        </td>
        </tr>`;
  }).join("");
}

function lerFormulario(){
    return {
        nome: $("nome").value.trim(),
        tipo: $("tipo").value.trim(),
        ano: Number($("ano").value.trim()),
        pais: $("pais").value.trim(),
        regiao: $("regiao").value.trim(),
        uva: $("uva").value.trim(),
        teor: $("teor").value ? Number($("teor").value) : null,
        preco: Number($("preco").value),
        estoque: parseInt($("estoque").value, 10),
        caracteristicas: $("caracteristicas").value.split(",").map((s) => s.trim()).filter(Boolean),
        descricao: $("descricao").value.trim(),
        imagem: $("imagem").value.trim(),
    };
}

function limparFormulario() {
    form.reset();
    $("id").value = "";
    $("tituloForm").textContent = "Novo vinho";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dados = lerFormulario();
  const id = $("id").value;
  try {
    if (id) {
      const atualizado = await api.atualizar(id, dados); // PUT
      vinhos = vinhos.map((v) => (String(v.id) === String(id) ? atualizado : v));
      aviso("Vinho atualizado!");
    } else {
      const criado = await api.criar(dados); // POST
      vinhos.push(criado);
      aviso("Vinho cadastrado!");
    }
    limparFormulario();
    $("btnCancelar").hidden = true;
    renderizar();
  } catch (err) { aviso(err.message); }
});

function mostrarPreview(url) {
  const img = $("preview");
  if (url && /^(https?:|blob:)/.test(url)) { img.src = url; img.hidden = false; }
  else img.hidden = true;
}

$("arquivo").addEventListener("change", async (e) => {
  const arquivo = e.target.files[0];
  if (!arquivo) return;
  if (!arquivo.type.startsWith("image/")) return aviso("Escolha um arquivo de imagem.");
  if (arquivo.size > 5 * 1024 * 1024) return aviso("A imagem deve ter até 5 MB.");

  mostrarPreview(URL.createObjectURL(arquivo)); 

  const botao = $("btnSalvar");
  botao.disabled = true;
  botao.textContent = "Enviando imagem...";
  try {
    const link = await uploadParaCloudinary(arquivo);
    $("imagem").value = link;  
    mostrarPreview(link);
    aviso("Imagem enviada!");
  } catch (err) {
    aviso(err.message);
  } finally {
    botao.disabled = false;
    botao.textContent = "Salvar";
  }
});

function editar (id) {
    const v = vinhos.find((x) => String(x.id) === String(id));
    if (!v) return;
    $("id").value = v.id;
    $("nome").value = v.nome ?? "";
    $("tipo").value = v.tipo ?? "";
    $("ano").value = v.ano ?? "";
    $("pais").value = v.pais ?? "";
    $("regiao").value = v.regiao ?? "";
    $("uva").value = v.uva ?? "";
    $("teor").value = v.teor ?? "";
    $("preco").value = v.preco ?? "";$
    $("estoque").value = v.estoque ?? 0;
    $("características").value = (v.caracteristicas || []).join(", ");
    $("descricao").value = value = v.descricao ?? "";
    $("imagem").value = v.imagem ?? "";
    mostrarPreview(v.imagem);
    $("tituloForm").textContent = `Editando: ${v.nome}`;
    $("btnCancelar").hidden = false
    window.scrollTo({ top: 0, behavior: "smooth" });
}

$("btnCancelar").addEventListener("click", () => {limparFormulario(); $("btnCancelar").hidden = true;});

$("corpo").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-acao]");
    if (!b) return;
    const { acao, id } = b.dataset;
    if (acao == "editar") editar(id);
});

$("imagem").addEventListener("input", (e) => mostrarPreview(e.target.value));

$("buscaAdmin").addEventListener("input", renderizar);
carregar();