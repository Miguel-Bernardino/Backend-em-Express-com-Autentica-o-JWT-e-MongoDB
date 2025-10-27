## Backend em Express com Autenticação JWT e MongoDB

API RESTful construída com Node.js, Express 5, TypeScript e MongoDB (via Mongoose), com autenticação JWT, rotas protegidas e um CRUD de tarefas com exclusão lógica (soft delete).

---

## ✨ Recursos

- Cadastro e login de usuários com senha criptografada (bcrypt)
- Autenticação com JWT e middleware de proteção
- CRUD de tarefas por usuário (criar, listar, obter, atualizar total/parcial, deletar e restaurar)
- Exclusão lógica de tarefas (flag `deleted`)
- Validações básicas e middleware de erros
- Suporte a Docker (MongoDB + Mongo Express), TypeScript e scripts de desenvolvimento

---

## 🧰 Stack

- Node.js 20
- Express 5
- TypeScript 5
- Mongoose 8 (MongoDB)
- JSON Web Token (JWT)
- bcryptjs
- Docker (opcional para o banco)

---

## 📂 Estrutura de Pastas

```
.
├─ Dockerfile
├─ docker-compose.yml              # MongoDB + Mongo Express
├─ package.json
├─ tsconfig.json
├─ requests/
│  └─ resquests.yml                # Coleção Postman
└─ src/
	 ├─ server.ts                    # Bootstrap do servidor
	 ├─ database/
	 │  └─ connect.ts                # Conexão com MongoDB (MONGODB_URI)
	 ├─ models/
	 │  ├─ User.ts                   # Schema de usuário
	 │  └─ Task.ts                   # Schema de tarefa (soft delete)
	 ├─ services/
	 │  ├─ UserService.ts            # Login e registro + geração de JWT
	 │  └─ taskServices.ts           # Regras de negócio de tarefas
	 ├─ controllers/
	 │  ├─ userController.ts
	 │  ├─ taskController.ts
	 │  └─ protectedController.ts
	 ├─ middleware/
	 │  ├─ protectedMiddleware.ts    # Verifica e decodifica JWT
	 │  └─ errorMiddlleware.ts       # Tratamento de erros
	 ├─ routes/
	 │  ├─ userRoute.ts              # /api/register, /api/login
	 │  ├─ taskRoutes.ts             # /api/tasks...
	 │  └─ protectedRoute.ts         # /api/protected
	 └─ types/
			└─ environment.d.ts          # Tipagem das variáveis de ambiente
```

---

## ⚙️ Pré-requisitos

- Node.js 18+ (recomendado 20)
- npm 9+
- Docker (opcional, para subir MongoDB localmente)

---

## 🔐 Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto com:

```
PORT=3000
# Se usar o docker-compose deste repo, use auth básica (admin) e escolha um DB (ex.: miniprojeto)
MONGODB_URI=mongodb://root:example@localhost:27017/miniprojeto?authSource=admin
JWT_SECRET=uma_chave_muito_secreta
```

Observações:
- `MONGODB_URI` é obrigatório. O app encerra se estiver ausente.
- `JWT_SECRET` é obrigatório para assinar/verificar tokens.
- `PORT` é opcional (padrão 3000).

---

## 🚀 Como rodar

### 1) Subir somente o banco via Docker Compose (opcional, recomendado)

No diretório do projeto:

```powershell
docker compose up -d
```

Isso cria:
- MongoDB em `mongodb://root:example@localhost:27017/` (authSource=admin)
- Mongo Express em http://localhost:8081 (login: mongoexpressuser / mongoexpresspass)

Depois, aponte o `MONGODB_URI` no `.env` para seu banco (ex.: `.../miniprojeto?authSource=admin`).

### 2) Instalar dependências

```powershell
npm install
```

### 3a) Rodar em desenvolvimento (TypeScript com reload)

```powershell
npm run dev
```

Servidor em http://localhost:3000

### 3b) Rodar build de produção

```powershell
npm run build
npm start
```

### 3c) Rodar a API em Docker (sem docker-compose)

```powershell
# Build da imagem
docker build -t mini-projeto-api .

# Executar container passando o .env
docker run --name mini-projeto-api -p 3000:3000 --env-file .env mini-projeto-api
```

---

## 📜 Scripts

- `npm run dev` – Inicia em desenvolvimento com ts-node-dev
- `npm run build` – Compila TypeScript para `dist/`
- `npm start` – Executa `node dist/server.js`

---

## 🔎 Endpoints

Base URL: `http://localhost:3000`

### Saúde do servidor
- `GET /` → `{ message, status }` (rota pública)

### Autenticação
- `POST /api/register`
	- Body: `{ name: string, email: string, password: string }`
	- 200: `{ status, token, user: { id, name, email } }`
	- 400: Campos obrigatórios ausentes ou senha < 6
	- 409: Email em uso

- `POST /api/login`
	- Body: `{ email: string, password: string }`
	- 200: `{ status, token, user: { id, name, email } }`
	- 401: Credenciais inválidas

### Rota protegida (exemplo)
- `GET /api/protected`
	- Header: `Authorization: Bearer <TOKEN>`
	- 200: `{ message: '✅ Acesso autorizado.' }`
	- 401: Token ausente/inválido

### Tarefas (todas exigem JWT via `Authorization: Bearer <TOKEN>`) 

- `POST /api/tasks`
	- Body: `{ title: string, description?: string, userId: string }`
	- Observação: use no `userId` o mesmo `id` do usuário autenticado.
	- 201: `{ status: 201, task }`
	- 403: Usuário inválido
	- 500: Erro ao criar

- `GET /api/tasks`
	- Query opcional: `title`, `description`, `completed`
	- 200: `{ status: 200, tasks }` (somente `deleted: false`)
	- 404: Nenhuma tarefa encontrada

- `GET /api/tasks/:id`
	- 200: `{ status: 200, task }`
	- 403/404: Acesso negado ou não encontrada

- `PUT /api/tasks/:id`
	- Atualização total – exige todos os campos: `{ title, description, completed }`
	- Proíbe alterar `userId`
	- 200: `{ status: 200, task }`
	- 400/403/404 conforme validações

- `PATCH /api/tasks/:id`
	- Atualização parcial – exige ao menos um de `{ title, description, completed }`
	- 200: `{ status: 200, task }`
	- 400/403/404 conforme validações

- `DELETE /api/tasks/:id`
	- Soft delete (`deleted = true`)
	- 200: `{ status: 200, message: 'Tarefa deletada com sucesso.' }`
	- 403/404: Usuário inválido ou tarefa não encontrada

- `PATCH /api/tasks/:id/restore`
	- Restaura uma tarefa deletada (`deleted = false`)
	- 200: `{ status: 200, message: 'Tarefa restaurada com sucesso.' }`
	- 400: A tarefa não estava deletada
	- 403/404: Usuário inválido ou tarefa não encontrada

---

## 🧪 Testes rápidos (curl)

Substitua `<TOKEN>` pelo token retornado no login.

```powershell
# Registro
curl -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d '{"name":"Alice","email":"alice@example.com","password":"SenhaForte123"}'

# Login
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"alice@example.com","password":"SenhaForte123"}'

# Acesso protegido
curl http://localhost:3000/api/protected -H "Authorization: Bearer <TOKEN>"

# Criar tarefa
curl -X POST http://localhost:3000/api/tasks -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"title":"Tarefa 1","description":"Teste","userId":"<USER_ID>"}'

# Listar tarefas
curl http://localhost:3000/api/tasks -H "Authorization: Bearer <TOKEN>"
```

---

## 📦 Coleção Postman

Há uma coleção pronta em `requests/resquests.yml` com cenários de cadastro, login, rota protegida e tarefas (incluindo filtros e erros comuns).

---

## 🔧 Dicas e Solução de Problemas

- Verifique se o `.env` está correto e carregado antes de iniciar.
- Se usar o `docker-compose`, confira se o Mongo está rodando: `docker ps`.
- Para conectar no Mongo local com auth: use `...@localhost:27017/<database>?authSource=admin`.
- Express 5 está em uso; middlewares e handlers já seguem a tipagem atual.

---

## 📄 Licença

ISC — veja `LICENSE`.

---

## 🙌 Créditos

Autor: Miguel Bernardino


# ⚙️ Instalação de Dependências

Este guia descreve apenas os passos para instalar as dependências necessárias do projeto **Express + TypeScript**.

---

## 📦 1. Inicializar o projeto Node.js

No terminal, execute:

```bash

### instala o express 
npm install express

### adiciona o express ao ts
npm install -D typescript ts-node-dev @types/node @types/express

### instala o mongoDB 
npm install mongoose
npm install -D @types/mongoose

### instalacao do dotenv
npm install dotenv

### instalacao do bcryptjs
npm install bcryptjs
npm install --save-dev @types/bcryptjs

### instalacao do JWT
npm install jsonwebtoken
npm install -D @types/jsonwebtoken

### DOCKER

#Criar arquivo DockerFile(sem extensão) e docker-compose.yml

###Apos criar use os comandos abaixo
docker-compose up -d

###executar o comando abaixo para rodar o codigo
npm run dev
```
mini-projeto-v1:https://www.youtube.com/watch?v=mURPTHjxbvo
mini-projeto-v2:https://www.youtube.com/watch?v=47rgQUt6Y_Q
