# 🚗 Sistema de Reserva de Veículos

Sistema completo para gestão de reservas de veículos com backend em Node.js + TypeScript + MongoDB e frontend em Angular 18.

## 📋 Funcionalidades Implementadas

### Backend (API)
- ✅ Autenticação JWT
- ✅ CRUD de Usuários
- ✅ CRUD de Veículos
- ✅ CRUD de Reservas
- ✅ Validação e tratamento de erros
- ✅ Proteção de rotas com token JWT

### Frontend (Angular 18)
- ✅ Tela de Login
- ✅ Tela de Cadastro
- ✅ Tela de Boas-vindas
- ✅ Listagem de Veículos Disponíveis
- ✅ Sistema de Reservas
- ✅ Perfil de Usuário com Reservas
- ✅ Gerenciamento de Usuários (Admin)
- ✅ Gerenciamento de Veículos (Admin)
- ✅ Painel de Administração Completo
- ✅ Interface Responsiva com Material Design
- ✅ Diálogos Modais para CRUD
- ✅ Proteção de rotas com Auth Guard

## 🧩 Regras de Negócio
- Todas as rotas, exceto login, são protegidas por token JWT
- Um veículo não pode ser reservado caso já esteja reservado
- Um usuário não pode ter mais de um veículo reservado simultaneamente

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v18+)
- MongoDB (local ou Atlas)
- Angular CLI (v18+)

### Backend
1. Navegue até a pasta `backend`:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o MongoDB no arquivo `.env` (copie de `.env.example`):
   ```env
   MONGODB_URI=mongodb://localhost:27017/vehicle-reservation
   JWT_SECRET=sua_chave_secreta_aqui
   PORT=3000
   ```

4. Execute o backend:
   ```bash
   npm run dev
   ```

5. (Opcional) Execute o seed para popular o banco com dados de teste:
   ```bash
   npm run seed
   ```

### Frontend
1. Navegue até a pasta `frontend`:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o frontend:
   ```bash
   ng serve
   ```

4. Acesse a aplicação em: `http://localhost:4200`

## 📱 Telas Disponíveis

### Públicas
- `/login` - Tela de login
- `/register` - Tela de cadastro
- `/welcome` - Tela de boas-vindas

### Privadas (requer autenticação)
- `/vehicles` - Listagem de veículos disponíveis
- `/vehicles/create` - Criar novo veículo (Admin)
- `/profile` - Perfil do usuário e reservas
- `/users` - Gerenciamento de usuários (Admin)
- `/admin` - Painel de administração completo

## 🔧 Tecnologias Utilizadas

### Backend
- Node.js
- TypeScript
- Express
- MongoDB com Mongoose
- JWT para autenticação
- Express Validator para validação

### Frontend
- Angular 18
- Angular Material
- RxJS
- TypeScript
- SCSS

## 🎨 Interface

A interface foi desenvolvida com base no protótipo oficial no Figma:
- Design responsivo
- Material Design components
- Navegação intuitiva
- Feedback visual para ações do usuário

## 📂 Estrutura do Projeto

```
vehicle-reservation-system/
├── backend/              # API Node.js
│   ├── src/
│   │   ├── config/       # Configurações
│   │   ├── controllers/  # Controladores
│   │   ├── middleware/   # Middlewares
│   │   ├── models/       # Modelos MongoDB
│   │   ├── routes/       # Rotas
│   │   └── server.ts     # Servidor principal
│   └── package.json
│
├── frontend/             # Aplicação Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Componentes compartilhados
│   │   │   ├── guards/     # Guards de rota
│   │   │   ├── pages/      # Páginas da aplicação
│   │   │   │   ├── admin/          # Painel admin
│   │   │   │   ├── login/          # Tela de login
│   │   │   │   ├── profile/        # Perfil usuário
│   │   │   │   ├── register/       # Cadastro
│   │   │   │   ├── users/          # Gerenciamento usuários
│   │   │   │   ├── vehicles/       # Veículos e criação
│   │   │   │   └── welcome/        # Boas-vindas
│   │   │   ├── services/   # Serviços (API, Auth)
│   │   └── app.routes.ts   # Configuração de rotas
│   └── package.json
│
└── README.md             # Documentação
```

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:

```env
MONGODB_URI=mongodb://localhost:27017/vehicle-reservation
JWT_SECRET=sua_chave_secreta_aqui
PORT=3000
NODE_ENV=development
```

## 🎯 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Cadastro de usuário
- `GET /api/auth/profile` - Perfil do usuário (protegido)
- `PUT /api/auth/profile` - Atualizar perfil (protegido)
- `DELETE /api/auth/profile` - Excluir perfil (protegido)

### Veículos
- `GET /api/vehicles` - Listar todos veículos (protegido)
- `GET /api/vehicles/available` - Listar veículos disponíveis (protegido)
- `GET /api/vehicles/:id` - Detalhes de veículo (protegido)
- `POST /api/vehicles` - Criar veículo (protegido)
- `PUT /api/vehicles/:id` - Atualizar veículo (protegido)
- `DELETE /api/vehicles/:id` - Excluir veículo (protegido)

### Reservas
- `POST /api/reservations` - Criar reserva (protegido)
- `GET /api/reservations/user` - Minhas reservas (protegido)
- `GET /api/reservations/:id` - Detalhes de reserva (protegido)
- `PUT /api/reservations/:id/release` - Liberar reserva (protegido)
- `PUT /api/reservations/:id/cancel` - Cancelar reserva (protegido)
- `GET /api/reservations` - Todas reservas (protegido - admin)

## 🤝 Contribuição

Este projeto foi desenvolvido como parte de um desafio técnico. Para contribuições:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

MIT
