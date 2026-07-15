# 🎁 Chá dos Noivos — Lista de Presentes

> Sistema web de lista de presentes para eventos de casamento, desenvolvido para o Chá dos Noivos de Fernando & Priscila.

🌐 **Acesse online:** [https://ferparaguassu.github.io]([https://fernandopri.github.io/cha-noivos](https://ferparaguassu.github.io/))

---

## 🛠️ Tecnologias utilizadas

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Backend** | Node.js, Express.js |
| **Banco de dados** | JSON file-based (sem dependência externa) |
| **Hospedagem** | GitHub Pages (frontend) / Railway ou Render (full-stack) |
| **Runtime** | Node.js ≥ 18 |

---

## 📋 Funcionalidades

- 🎁 Lista de 23 presentes organizados por categoria (Cozinha, Banheiro, Decoração)
- 👤 Convidado informa nome e email para reservar um presente
- 🔒 Um presente por convidado — bloqueado após a escolha
- ⚡ Presente desaparece da lista assim que alguém o reserva, em tempo real
- 📱 Design responsivo para mobile e desktop

---

## 🗂️ Estrutura do projeto

```
cha-noivos/
├── public/
│   └── index.html      # Frontend completo (HTML + CSS + JS em um único arquivo)
├── server.js           # API REST com Express.js
├── data/
│   └── db.json         # Banco de dados gerado automaticamente na primeira execução
├── package.json
└── README.md
```

---

## 🚀 Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor
npm start

# 3. Abrir no navegador
# http://localhost:3000
```

---

## ☁️ Deploy

### GitHub Pages (somente frontend estático)
1. Faça o push do repositório para o GitHub
2. Vá em **Settings → Pages**
3. Selecione a branch `main` e a pasta `/public`
4. O site ficará disponível em `https://<seu-usuario>.github.io/cha-noivos`

### Railway (full-stack recomendado)
1. Conecte o repositório em [railway.app](https://railway.app)
2. O Railway detecta o `package.json` automaticamente
3. Build: `npm install` · Start: `npm start`
4. Gera uma URL pública em segundos

### Render
1. Conecte o repositório em [render.com](https://render.com)
2. **New → Web Service**
3. Build: `npm install` · Start: `npm start`

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/gifts` | Lista todos os presentes com status |
| `POST` | `/api/login` | Verifica se o email já tem seleção |
| `POST` | `/api/select` | Reserva um presente |

---

## 📦 Dependências

```json
{
  "express": "^4.19.2",
  "cors": "^2.8.5"
}
```

---

<sub>Made with ❤️ and [Claude Code](https://claude.ai/code)</sub>
