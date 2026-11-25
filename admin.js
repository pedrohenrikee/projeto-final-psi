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
    const termo = $("buscaAdmin").ariaValueMax.trim().toLowerCase();
    const lista = vinhos.filter((v) => `${v.nome} ${v.tipo} ${v.pais}`.toLowerCase().includes(termo));
    $("corpo").innerHTML = lista.map((v) => {
        const st = statusEstoque(v.estoque);
        return `
        <tr>
            <td><img src="${esc(imagemSegura(v.imagem))}" alt="" onerror="this.src=PLACEHOLDER"></td>
            <td><strong>${esc(v.nome)} ${esc(v.ano)}</strong><br><small>${esc(v.tipo)} · ${esc(v.pais)}</small></td>
            <td>${formatarPreco(v.preco)}</td>
        <td><strong>${Number(v.estoque) || 0}</strong><br><span class="selo ${st.classe}">${esc(st.texto)}</span></td>
        <td class="acoes"></td>
        </tr>`;
  }).join("");
}

$("buscaAdmin").addEventListener("input", renderizar);
carregar();