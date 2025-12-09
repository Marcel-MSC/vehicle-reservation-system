# 🚗 Sistema de Gestão de Reservas de Veículos

Sistema completo para gestão de reservas de veículos desenvolvido em Node.js + TypeScript + MongoDB (Backend) e Angular 18 (Frontend).

## 📋 Funcionalidades

### ✅ Backend API (100% Concluído)
- **Autenticação JWT** - Login e registro de usuários
- **CRUD de Usuários** - Cadastro, edição, remoção e perfil
- **CRUD de Veículos** - Cadastro, edição, remoção e listagem
- **Sistema de Reservas** - Reserva, cancelamento e finalização
- **Validação e Tratamento de Erros** - Middleware robusto
- **Seed de Dados** - Dados iniciais para testes

### 🔄 Frontend (Estrutura criada)
- **Angular 18** - Estrutura base configurada
- **Material Design** - Componentes prontos
- **Interface Responsiva** - Design moderno

## 🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação por tokens
- **bcryptjs** - Hash de senhas
- **express-validator** - Validação de dados

### Frontend
- **Angular 18** - Framework frontend
- **TypeScript** - Tipagem estática
- **Angular Material** - Componentes UI
- **RxJS** - Programação reativa

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd vehicle-reservation-system
```

### 2. Configure o Backend

#### Instale as dependências:
```bash
cd backend
npm install
```

#### Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vehicle-reservation
JWT_SECRET=vehicle_reservation_secret_key_2024
JWT_EXPIRES_IN=7d
```

#### Execute o seed de dados (opcional):
```bash
npm run seed
```

#### Inicie o servidor:
```bash
npm run dev
```

O backend estará disponível em: `http://localhost:3000`

### 3. Configure o Frontend

#### Instale as dependências:
```bash
cd frontend
npm install
```

#### Inicie o servidor de desenvolvimento:
```bash
npm start
```

O frontend estará disponível em: `http://localhost:4200`

## 📚 Documentação da API

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrar novo usuário |
| POST | `/api/auth/login` | Fazer login |
| GET | `/api/auth/profile` | Obter perfil do usuário |
| PUT | `/api/auth/profile` | Atualizar perfil |
| DELETE | `/api/auth/profile` | Remover usuário |

### Veículos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/vehicles` | Listar todos os veículos |
| GET | `/api/vehicles/available` | Listar veículos disponíveis |
| GET | `/api/vehicles/:id` | Obter veículo por ID |
| POST | `/api/vehicles` | Cadastrar novo veículo |
| PUT | `/api/vehicles/:id` | Atualizar veículo |
| DELETE | `/api/vehicles/:id` | Remover veículo |

### Reservas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/reservations/my-reservations` | Listar minhas reservas |
| GET | `/api/reservations/all` | Listar todas as reservas |
| GET | `/api/reservations/:id` | Obter reserva por ID |
| POST | `/api/reservations` | Criar nova reserva |
| PATCH | `/api/reservations/:id/release` | Finalizar reserva |
| PATCH | `/api/reservations/:id/cancel` | Cancelar reserva |

### Headers de Autenticação
Todas as rotas (exceto login) requieren o header:
```
Authorization: Bearer <token>
```

## 🔐 Usuário Padrão

O sistema cria automaticamente um usuário administrador durante o seed:

- **Email**: admin@veiclereserva.com
- **Senha**: admin123

## 📁 Estrutura do Projeto

```
vehicle-reservation-system/
├── backend/                 # API Node.js + TypeScript
│   ├── src/
│   │   ├── config/         # Configuração do banco
│   │   ├── controllers/    # Controladores da API
│   │   ├── middleware/     # Middleware de autenticação
│   │   ├── models/         # Modelos do MongoDB
│   │   ├── routes/         # Rotas da API
│   │   ├── seeds/          # Seed de dados
│   │   └── server.ts       # Servidor principal
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/               # Angular 18
│   ├── src/
│   │   └── app/           # Componentes Angular
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
├── assets/                 # Assets do design
│   ├── carros.json        # Dados dos veículos
│   └── Carros/            # Imagens dos veículos
└── README.md
```

## 🧪 Testando a API

### 1. Registrar um usuário:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### 2. Fazer login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456"
  }'
```

### 3. Listar veículos:
```bash
curl -X GET http://localhost:3000/api/vehicles \
  -H "Authorization: Bearer <seu-token>"
```

## 🛡️ Segurança

- **Hash de senhas** com bcryptjs
- **JWT para autenticação** com expiração
- **Validação de dados** com express-validator
- **Sanitização de inputs** contra SQL injection
- **CORS configurado** para domínios específicos
- **Tratamento de erros** robusto

## 📋 Regras de Negócio Implementadas

✅ **Todas as rotas protegidas por token JWT** (exceto login)
✅ **Veículo não pode ser reservado se já estiver reservado**
✅ **Usuário não pode ter mais de um veículo reservado simultaneamente**
✅ **Validação completa de dados** em todas as operações
✅ **Controle de disponibilidade** de veículos em tempo real

## 🎯 Status do Projeto

- ✅ **Backend API**: 100% concluído e funcional
- 🔄 **Frontend**: Estrutura criada, componentes em desenvolvimento
- ✅ **Documentação**: README completo
- ✅ **Configuração**: Pronta para deployment

## 👨‍💻 Desenvolvido por

Marcelo Carramanhos - Sistema de Reserva de Veículos para teste técnico.

---

**📅 Data de entrega**: 15/12/2025
**🎯 Objetivo**: Demonstrar habilidades em desenvolvimento full-stack com tecnologias modernas.
