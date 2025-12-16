# Backend API - Node.js + TypeScript

API REST completa do Sistema de Reserva de Veículos.

## Pré-requisitos

- Node.js (versão 16+)
- MongoDB local ou MongoDB Atlas
- npm ou yarn

## Instalação

```bash
cd backend
npm install
```

## Configuração

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Configure as variáveis no `.env`:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vehicle-reservation
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

## Executar

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start

# Seed dos dados
npm run seed
```

A API estará disponível em `http://localhost:3000`

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Obter perfil
- `PUT /api/auth/profile` - Atualizar perfil
- `DELETE /api/auth/profile` - Deletar usuário

### Veículos
- `GET /api/vehicles` - Listar veículos
- `GET /api/vehicles/available` - Veículos disponíveis
- `GET /api/vehicles/:id` - Detalhes do veículo
- `POST /api/vehicles` - Criar veículo
- `PUT /api/vehicles/:id` - Atualizar veículo
- `DELETE /api/vehicles/:id` - Deletar veículo

### Reservas
- `GET /api/reservations/my-reservations` - Minhas reservas
- `POST /api/reservations` - Criar reserva
- `GET /api/reservations/:id` - Detalhes da reserva
- `PATCH /api/reservations/:id/release` - Finalizar reserva
- `PATCH /api/reservations/:id/cancel` - Cancelar reserva

## Arquitetura

```
src/
├── config/           # Configurações (banco, etc.)
├── controllers/      # Controladores da API
├── middleware/       # Middlewares (auth, validation)
├── models/          # Modelos do MongoDB
├── routes/          # Definição das rotas
├── seeds/           # Seeds de dados
└── server.ts        # Ponto de entrada da aplicação
```

## Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express.js** - Framework web
- **MongoDB** - Banco de dados
- **Mongoose** - ODM
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **express-validator** - Validação

## Usuário Padrão

Após executar o seed (`npm run seed`), estará disponível:

- Email: `admin@veiclereserva.com`
- Senha: `admin123`
