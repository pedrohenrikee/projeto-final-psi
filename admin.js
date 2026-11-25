let vinhos = [];
const $ = (id) => document.getElementById(id);
const form = $("form");

function aviso(texto){
    const t = $("toast");
    t.textContent = texto;
    t.classList.add("mostrar")
    setTimeout(() => t.classList.remove("mostrar"), 2500);
}