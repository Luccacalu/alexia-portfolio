# Portfólio de Copywriting — Next.js + Sanity (100% gratuito)

Site estático (Next.js 14, export estático) + CMS headless (Sanity, plano gratuito) + hospedagem gratuita (Cloudflare Pages, permite uso comercial).

## Páginas
`/` Home · `/projects/` Cards de projetos (hover com resumo) · `/project/.../` Artigo do projeto (pode ter níveis: `/project/pai/filho/`) · `/categories/` Filtro por categoria · `/about/` Sobre · `/contact/` Contato

## 1. Rodar agora (dados de exemplo)
```bash
npm install
npm run dev        # http://localhost:3000
```
Sem Sanity configurado, o site usa `src/lib/sample.ts`.

## 2. Integrar com o Sanity (passo a passo)

### 2.1 Criar o projeto Sanity
```bash
cd studio
npm install
npx sanity login                 # entre com Google/GitHub/e-mail
npx sanity init --env            # "Create new project" → dataset "production"
                                 # (ele mostra o projectId; responda "n" se perguntar para sobrescrever os schemas)
```
Copie `studio/.env.example` para `studio/.env` e preencha `SANITY_STUDIO_PROJECT_ID`.

### 2.2 (Opcional) Importar o conteúdo de exemplo
```bash
npx sanity dataset import seed.ndjson production
```
Cria categorias, configurações do site e 5 projetos de exemplo (só texto) para o cliente enxergar a estrutura. Pode apagar depois. Para regerar o arquivo: `node studio/scripts/make-seed.mjs`.

### 2.3 Testar o Studio localmente e publicá-lo
```bash
npm run dev          # http://localhost:3333
npm run deploy       # escolha um nome → https://NOME.sanity.studio (grátis)
```
O endereço `NOME.sanity.studio` é o "painel" que o cliente vai usar.

### 2.4 Ligar o site ao Sanity
Na raiz do projeto:
```bash
cp .env.example .env.local
# NEXT_PUBLIC_SANITY_PROJECT_ID=<seu projectId>
# NEXT_PUBLIC_SANITY_DATASET=production
npm run build        # gera ./out com o conteúdo do Sanity
```
O dataset precisa ser **público** (padrão de um dataset novo), pois o site lê os dados no momento do build, sem token.

Se projetos ainda tiverem os campos antigos `blocks`, `closing`, `crew` ou `stats`, rode a migração antes de removê-los:
```bash
cd studio
npm run migrate:legacy-content
```
O comando mostra uma prévia primeiro. Depois de conferir, defina `SANITY_MIGRATION_APPLY=1` no ambiente e rode novamente para gravar a conversão no campo único **Artigo** (`body`), incluindo imagens antigas como itens `image` nativos. Nesse corpo, parágrafos, títulos, imagens, vídeos, galerias e cards podem ser inseridos quantas vezes quiser e em qualquer ordem.

Durante `npm run dev`, o site consulta o Sanity sem cache e atualiza a página aberta a cada 5 segundos; publique no Studio e aguarde alguns segundos. Isso vale apenas para desenvolvimento local. A versão exportada/hospedada continua estática e precisa de uma nova build após cada publicação.

### 2.5 Dar acesso ao cliente
No painel https://www.sanity.io/manage → seu projeto → **Members → Invite**: convide o e-mail do cliente com o papel **Editor** (edita e publica conteúdo, mas não mexe em configurações do projeto). Mantenha-se como Administrator.
Envie ao cliente o link `https://NOME.sanity.studio` e o arquivo `GUIA-CLIENTE.md`.

## 3. Hospedar (Cloudflare Pages)
1. Suba esta pasta para um repositório no GitHub (o `.gitignore` já exclui `node_modules`, `out` e `.env.local`).
2. Cloudflare → Workers & Pages → Create → Pages → conecte o repositório.
3. Build command: `npm run build` · Output directory: `out` · Node 20+ (variável `NODE_VERSION=20`).
4. Em *Environment variables*, adicione `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` e `NEXT_PUBLIC_SITE_URL`.
5. (Opcional) Domínio próprio em *Custom domains*.

## 4. Publicar automaticamente quando o cliente editar
O site é estático: ao publicar no Sanity ele precisa ser reconstruído.
1. Cloudflare Pages → Settings → Builds → **Deploy hooks** → crie um hook (branch `main`) e copie a URL.
2. Sanity (manage → **API → Webhooks → Create**):
   - URL: a URL do deploy hook · Method: `POST`
   - Dataset: `production` · Trigger on: Create, Update, Delete
   - Filter: `_type in ["project", "category", "siteSettings"]`
   - Marque "Drafts" **desligado** (só publicações).
3. Pronto: o cliente clica em **Publish** e o site atualiza em ~1–2 minutos.

## Estrutura do CMS (o que o cliente edita)
- **Configurações do site** (documento único): nome, textos da home e do Sobre, foto, currículo, clientes (logos), prêmios, e-mail e redes.
- **Projetos**: metadados do card (título, slug, cliente, agência, ano, capa, cor do hover, categorias) + **artigo livre** (Portable Text: texto formatado, títulos, citações, imagens, galerias, carrosséis, áudios, vídeos externos e cards para outras páginas). Carrosséis podem ser adicionados quantas vezes quiser com imagens e vídeos em qualquer ordem; a altura é limitada e a largura acompanha a proporção para não cortar imagens. Vídeos começam sem som no slide ativo e avançam ao terminar. Cada bloco de áudio tem player e seek próprios, com título e descrição opcionais. O campo **Vídeos e roteiros** aceita quantos itens forem necessários; cada um tem upload, título opcional, corpo Portable Text e métricas opcionais. Para criar um Story, adicione uma foto de capa e pelo menos um clipe extra no vídeo; somente esses clipes aparecem no modal. O estado visto fica guardado neste navegador. Campo **Página pai** cria hierarquia: a página some da listagem e aparece como card dentro do pai.
- **Categorias**.

## Cards de projeto (aba Trabalhos)
Grade responsiva (3 colunas no desktop, 2 no tablet, 1 no celular). Ao passar o mouse, a capa dá lugar a um card colorido com Cliente / Título / Agência (cor definida por projeto no Sanity). Em telas de toque não existe hover, então o título e o cliente ficam visíveis abaixo da capa.

## Personalização
- Cores e fontes: variáveis no topo de `src/app/globals.css` (serif: Instrument Serif; texto: Inter, ambos via `@fontsource`).
- Novos campos: edite `studio/schemaTypes/*`, a query GROQ e o mapeamento em `src/lib/sanity.ts` e os tipos em `src/lib/types.ts`.
- Obs.: o plano Hobby da Vercel não permite uso comercial; por isso a recomendação é Cloudflare Pages (ou Netlify).
