# Contas a Receber

App web simples (mobile-first) para substituir a planilha de contas a receber: lançamentos por tutor/pet/procedimento/estabelecimento, formas de pagamento, flag **recebido/conferido**, filtros e painel com 3 indicadores.

Pasta local sugerida no Windows:

```text
C:\Projetos\App - Contas a Receber
```

Clone ou copie o repositório para essa pasta e use Docker (recomendado) ou Node local.

---

## Implementação com Docker

O app sobe em um container. O banco fica numa pasta do Windows e não se perde quando o container reinicia.

### 1. Instalar o Docker

1. Baixe e instale o [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Abra o Docker Desktop e espere o status ficar **Running**.
3. Confirme no PowerShell:

```powershell
docker version
docker compose version
```

Os dois comandos precisam responder com um número de versão.

### 2. Abrir a pasta do projeto

```powershell
cd "C:\Projetos\App - Contas a Receber"
```

### 3. Construir a imagem e subir o app

```powershell
docker compose up --build
```

Na primeira vez o download e o build levam alguns minutos. Quando aparecer `Ready`, o app está no ar.

Deixe esse terminal aberto. Para rodar em segundo plano, use:

```powershell
docker compose up --build -d
```

### 4. Abrir no navegador

Acesse [http://localhost:3847](http://localhost:3847).

| Usuário | Senha       |
| ------- | ----------- |
| `admin` | `admin`     |
| `Jamile` | `#Vet@2026` |

Na primeira subida o banco já traz os cadastros (tutores, procedimentos, estabelecimentos e formas de pagamento). Os lançamentos começam zerados: nada a receber e nada recebido.

### 5. Onde ficam os dados

O SQLite fica em `.\data\app.db`, ao lado do `docker-compose.yml`. Lançamentos e cadastros novos continuam nessa pasta depois de `docker compose down` ou de reiniciar o computador.

### 6. Parar o app

No terminal do projeto:

```powershell
docker compose down
```

Isso para o container e mantém a pasta `data`.

### 7. Subir de novo, ou atualizar depois de uma mudança

```powershell
cd "C:\Projetos\App - Contas a Receber"
docker compose up --build -d
```

O `--build` recria a imagem. O arquivo `.\data\app.db` é reaproveitado.

---

## Desenvolvimento local (sem Docker)

Requer Node.js 20+.

```powershell
copy .env.example .env
npm install
npm run db:setup
npm run dev
```

App em [http://localhost:3847](http://localhost:3847) — mesmas credenciais `admin` / `admin`.

---

## O que o app faz

- Login com usuário e senha
- Painel: recebido (3 meses), inadimplentes, a receber no mês
- CRUD de contas alinhado à planilha (DATA, TUTOR, PET, PROCEDIMENTO, TOTAL, Estabelecimento, Pagamento, conferido)
- Cadastros com criação inline ao selecionar
- Filtros na lista de contas
- Interface em português (Brasil), pensada para iPhone

Plano de produto: ver documentação no Project (`docs/plano-app.md`) quando disponível no ambiente Cursor.
