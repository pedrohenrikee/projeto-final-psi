# 🍷 Adega Vinho & Cia

Sistema de **delivery de adega** com vitrine de vinhos e painel administrativo, desenvolvido como trabalho final da disciplina de **Programação de Sítios Internet (PSI)**.

O front-end é feito com **HTML, CSS e JavaScript puro** e consome uma API REST criada com **json-server**, hospedada no **Render**. As imagens dos produtos ficam armazenadas no **Cloudinary**.

🔗 **Aplicação online:** https://pedrohenrikee.github.io/projeto-final-psi/
🔗 **API:** https://projeto-final-psi.onrender.com/vinhos

> ⏳ A API usa o plano gratuito do Render e "dorme" após alguns minutos sem uso. A primeira requisição pode levar cerca de 30 a 60 segundos para responder.

---

## ✨ Funcionalidades

### Vitrine (`index.html`)
- Listagem de vinhos em cards com foto, nome, ano, tipo, país e preço
- **Status de estoque** em cada card: `Em estoque`, `Últimas unidades` e `Esgotado`
- **Tela de detalhes** (modal) com região, uva, teor alcoólico, características, descrição e quantidade disponível
- **Busca por texto** (nome, tipo, país, região, uva e características)
- **Filtros** por tipo de vinho, país e disponibilidade ("somente disponíveis")

### Painel administrativo (`admin.html`)
- **CRUD completo** de produtos: cadastrar, listar, editar e excluir
- **Controle de estoque**: entrada e baixa de unidades, com bloqueio de baixa maior que o saldo
- **Upload de imagem** direto do computador para o Cloudinary, ou uso de uma URL pública
- Pré-visualização da imagem antes de salvar
- Busca na listagem e avisos (toasts) de sucesso e erro

---

## 🧱 Tecnologias

| Camada | Tecnologia |
|---|---|
| Front-end | HTML5, CSS3, JavaScript (ES6+) puro |
| API | [json-server](https://github.com/typicode/json-server) 0.17.4 |
| Containerização | Docker e Docker Compose |
| Hospedagem da API | Render |
| Imagens | Cloudinary (upload não assinado) |
| Hospedagem do site | GitHub Pages |
| Versionamento | Git e GitHub |

---

## 📁 Estrutura do projeto

```
projeto-final-psi/
├── api/
│   ├── Dockerfile            # imagem do json-server
│   ├── docker-compose.yml    # execução local da API
│   └── db.json               # banco de dados (vinhos)
├── index.html                # vitrine
├── admin.html                # painel administrativo
├── style.css                 # estilos
├── config.js                 # URL da API, Cloudinary e regra de estoque
├── api.js                    # requisições à API e utilitários
├── cloudinary.js             # upload de imagens
├── vitrine.js                # lógica da vitrine
├── admin.js                  # lógica do painel
└── README.md
```

---

## 🗂️ Modelo de dados

Cada vinho segue este formato:

```json
{
  "id": 1,
  "nome": "Merlot",
  "tipo": "Vinho Tinto",
  "ano": 2018,
  "pais": "França",
  "regiao": "Bordeaux",
  "uva": "Merlot",
  "teor": 13.5,
  "preco": 129.9,
  "estoque": 12,
  "imagem": "https://res.cloudinary.com/.../merlot.jpg",
  "descricao": "Tinto macio e frutado, ótimo com carnes assadas e queijos.",
  "caracteristicas": ["frutado", "complexo"]
}
```

### Regra de estoque

| Quantidade | Status exibido |
|---|---|
| 0 | 🔴 Esgotado (foto em preto e branco) |
| 1 a 5 | 🟠 Últimas unidades |
| acima de 5 | 🟢 Em estoque |

O limite de "últimas unidades" é configurável em `config.js` (`ESTOQUE_BAIXO`).

---

## 🔌 Endpoints da API

Base: `https://projeto-final-psi.onrender.com`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/vinhos` | Lista todos os vinhos |
| `GET` | `/vinhos/:id` | Busca um vinho |
| `POST` | `/vinhos` | Cadastra um vinho |
| `PUT` | `/vinhos/:id` | Atualiza um vinho por completo |
| `PATCH` | `/vinhos/:id` | Atualiza campos parciais (ex.: estoque) |
| `DELETE` | `/vinhos/:id` | Exclui um vinho |

---

## 🚀 Como executar

### 1. Clonar o repositório

```bash
git clone https://github.com/pedrohenrikee/projeto-final-psi.git
cd projeto-final-psi
```

### 2. Configurar o front-end

Edite o `config.js`:

```js
const API_URL = "https://projeto-final-psi.onrender.com"; // ou http://localhost:3000
const RECURSO = "vinhos";
const ESTOQUE_BAIXO = 5;

const CLOUDINARY_CLOUD_NAME = "seu_cloud_name";
const CLOUDINARY_UPLOAD_PRESET = "seu_upload_preset"; // preset do tipo Unsigned
```

### 3. Abrir o site

Use a extensão **Live Server** do VS Code (botão direito no `index.html` → *Open with Live Server*) ou rode:

```bash
npx serve
```

### 4. (Opcional) Rodar a API localmente com Docker

```bash
cd api
docker compose up --build
```

A API fica em `http://localhost:3000/vinhos`. Depois, ajuste o `API_URL` no `config.js` para essa URL.

Sem Docker, também é possível usar o Node.js:

```bash
cd api
npx json-server@0.17.4 --watch db.json --port 3000
```

---

## ☁️ Deploy

### API no Render
1. **New + → Web Service** e conecte este repositório.
2. **Root Directory:** `api`
3. **Language/Runtime:** `Docker`
4. **Instance Type:** `Free`
5. Após o deploy, use a URL gerada no `API_URL` do `config.js`.

### Site no GitHub Pages
1. **Settings → Pages**
2. **Source:** *Deploy from a branch* → branch `main`, pasta `/ (root)`
3. O site fica disponível em `https://pedrohenrikee.github.io/projeto-final-psi/`

### Imagens no Cloudinary
1. Anote o **Cloud name** no Dashboard.
2. Em **Settings → Upload → Upload presets**, crie um preset com **Signing mode: Unsigned**.
3. Informe os dois valores no `config.js`.

---

## 👨‍💻 Autor

**Pedro Henrique**
GitHub: [@pedrohenrikee](https://github.com/pedrohenrikee)

Trabalho final da disciplina **Programação de Sítios Internet (PSI)**.
