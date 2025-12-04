# PEN2-Stack Backend

A robust Express.js 5 API server with TypeScript, TypeORM, and PostgreSQL.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5.x
- **Language:** TypeScript
- **Database:** PostgreSQL with TypeORM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **Testing:** Jest, Supertest, Testcontainers

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # App configuration & validation
│   ├── database/         # Database setup
│   │   ├── models/       # TypeORM entities
│   │   └── migrations/   # Database migrations
│   ├── helpers/          # Utility helpers
│   ├── middlewares/      # Express middlewares
│   ├── modules/          # Feature modules (DI pattern)
│   │   └── todo/         # Example module
│   │       ├── index.ts          # Module entry (composition root)
│   │       ├── todo.model.ts     # TypeORM entity
│   │       ├── todo.repo.ts      # Repository layer
│   │       ├── todo.services.ts  # Business logic layer
│   │       ├── todo.controller.ts# HTTP handlers
│   │       ├── todo.routes.ts    # Route definitions
│   │       ├── todo.validations.ts# Zod schemas
│   │       └── todo.d.ts         # Type definitions
│   ├── routes/           # Route aggregation
│   ├── types/            # Global type definitions
│   └── utils/            # Utility functions
├── test/                 # Test files
└── build/                # Compiled output
```

## 🏗️ Architecture Patterns

### Dependency Injection
Each module uses constructor-based dependency injection:

```
TodoRepository → TodoService → TodoController → TodoRoutes
```

- **Repository**: Database operations (never exposed outside module)
- **Service**: Business logic with validation
- **Controller**: HTTP request/response handling
- **Routes**: API endpoint definitions

### Module Entry Point (`index.ts`)
The composition root where dependencies are wired:
- Creates instances with proper injection order
- Exports only router and service (for cross-module use)

### Cross-Module Communication
- Only **Service** classes can be injected into other modules
- Never inject Repository, Controller, or Routes across modules

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20 or higher)
- PostgreSQL database

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with hot-reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm test` | Run tests |
| `npm run test:watch` | Watch mode tests |
| `npm run test:ci` | CI test mode |
| `npm run check` | Build, lint, and test |

## 🔒 Security

- **Helmet.js** - HTTP security headers
- **CORS** - Cross-origin request handling
- **JWT Authentication** - Token-based auth
- **Zod Validation** - Input validation

