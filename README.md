# Chá dos Noivos — Lista de Presentes

Site completo (frontend + backend) para a lista de presentes de Fernando & Priscila.

Não precisa de Claude, não pede login — qualquer convidado abre o link e usa direto.

## O que tem aqui

- `server.js` — backend (Node + Express), guarda os dados em `data/db.json`
- `public/index.html` — frontend (HTML/CSS/JS puro, sem build)
- 26 presentes pré-cadastrados

## Como funciona

- Convidado entra com nome + email (sem senha)
- Escolhe 1 presente — depois de escolhido, fica travado (não pode trocar)
- Presente escolhido some da lista pra todo mundo (não dá pra dois convidados pegarem o mesmo)
- Painel admin (senha: `fernando2026`) pra ver quem escolheu o quê, adicionar/remover presentes, liberar uma seleção se precisar

## Como rodar localmente (pra testar)

```bash
npm install
npm start
```

Depois abra `http://localhost:3000` no navegador.

## Como publicar (deixar online com link público)

### Opção recomendada: Render.com (gratuito)

1. Crie uma conta em https://render.com
2. Suba esta pasta para um repositório no GitHub (ou use o "Deploy from folder" se disponível)
3. No Render: **New > Web Service**, conecte o repositório
4. Configurações:
   - Build command: `npm install`
   - Start command: `npm start`
5. Em **Environment Variables**, adicione (opcional, recomendado):
   - `ADMIN_PASSWORD` = uma senha sua, diferente de `fernando2026`
6. Clique em Deploy. Em poucos minutos você terá um link como `https://cha-noivos-fernando.onrender.com`

**Importante:** no plano gratuito do Render, o disco não é permanente — se o serviço reiniciar, os dados podem ser perdidos. Para um evento real, vale considerar:
- O plano pago do Render com "persistent disk" (a partir de poucos dólares/mês), ou
- Trocar `data/db.json` por um banco de dados real (Render oferece PostgreSQL gratuito) — posso ajustar o código se quiser essa opção.

### Opção alternativa: Railway.app

Funciona de forma parecida ao Render — conecta o repositório, builda e gera link público. Railway costuma manter o disco entre reinicializações no plano gratuito, o que é mais seguro para este caso.

### Opção alternativa: Rodar em um VPS próprio

Se você já tem um servidor (ex: DigitalOcean, AWS, etc), basta:

```bash
git clone <seu-repositorio>
cd cha-noivos
npm install
npm start
```

E usar um processo como `pm2` para manter o servidor sempre rodando, com um domínio apontado para ele.

## Trocar a senha do admin

Edite a variável de ambiente `ADMIN_PASSWORD` na hospedagem, ou troque diretamente no `server.js` (linha com `ADMIN_PASSWORD`).

## Personalizar os presentes

Edite a lista em `server.js`, na função `defaultGifts()` — ou adicione/remova presentes direto pelo painel admin depois que o site estiver no ar.
