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