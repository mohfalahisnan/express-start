# Express Boilerplate with Neon + Drizzle

A modern Express.js boilerplate with TypeScript, PostgreSQL (Neon), Drizzle ORM, and better-auth.

## 🚀 Features

- **Express.js** with TypeScript
- **PostgreSQL** database with Neon serverless
- **Drizzle ORM** for type-safe database operations
- **Better-auth** for authentication
- **RBAC** (Role-Based Access Control)
- **OpenAPI/Swagger** documentation
- **Zod** validation
- **Biome** for linting and formatting
- **Vitest** for testing
- **Docker** support

## 📋 Prerequisites

- Node.js 20.17.0+
- pnpm (recommended)
- Neon account ([neon.tech](https://neon.tech))

## 🛠️ Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd express-boilerplate
pnpm install
```

### 2. Environment Setup

Copy the environment template:

```bash
cp .env.template .env
```

Update `.env` with your Neon database URL:

```env
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=your-secure-secret-key
BETTER_AUTH_URL=http://localhost:8080
```

### 3. Database Setup

```bash
# Run migrations
pnpm db:migrate

# Seed initial data
pnpm seed
```

### 4. Start Development

```bash
pnpm dev
```

The server will start at `http://localhost:8080`

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: `http://localhost:8080/api-docs`
- **Health Check**: `http://localhost:8080/health-check`
- **Dynamic API Health**: `http://localhost:8080/v1/dynamic/health`

### Dynamic Router System

The application includes a dynamic router system that automatically generates REST API endpoints for registered models:

- **Base URL**: `/v1/dynamic/:model`
- **Available Models**: `users`, `roles`
- **Operations**: GET, POST, PUT, PATCH, DELETE
- **Features**: Pagination, filtering, validation

For detailed documentation, see [Dynamic Router README](./src/router/README.md).

## 🗄️ Database

### Schema

The application uses PostgreSQL with the following main tables:

- **users**: User accounts with authentication
- **roles**: User roles with permissions
- **sessions**: Authentication sessions
- **accounts**: OAuth provider accounts
- **verifications**: Email/phone verifications

### Available Commands

```bash
# Generate migrations from schema changes
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Push schema directly (development)
pnpm db:push

# Open database GUI
pnpm db:studio

# Seed database
pnpm seed
```

## 🔐 Authentication

The boilerplate includes:

- Email/password authentication
- Session management
- Role-based access control (RBAC)
- OAuth provider support (configurable)

### Example Usage

```bash
# Register a new user
POST /api/v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}

# Login
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

## 🛡️ RBAC (Role-Based Access Control)

The system includes a flexible permission system:

```typescript
// Available permissions
type Permission = 
  | 'user:create' | 'user:read' | 'user:update' | 'user:delete'
  | 'product:create' | 'product:read' | 'product:update' | 'product:delete'
  | 'order:create' | 'order:read' | 'order:update' | 'order:delete'
  | 'inventory:create' | 'inventory:read' | 'inventory:update' | 'inventory:delete';
```

## 📁 Project Structure

```
src/
├── api-docs/           # OpenAPI documentation
├── common/             # Shared utilities and middleware
├── db/                 # Database schema and migrations
│   ├── schema.ts       # Drizzle schema definitions
│   ├── index.ts        # Database connection
│   ├── seed.ts         # Database seeding
│   └── migrations/     # SQL migration files
├── lib/                # Core libraries (auth, database)
├── module/             # Feature modules
│   ├── auth/           # Authentication
│   ├── users/          # User management
│   └── rbac/           # Role-based access control
├── repositories/       # Data access layer
├── router/             # API routes
└── types/              # TypeScript type definitions
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run tests in watch mode
pnpm test --watch
```

## 🔧 Development

### Code Quality

```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Run all checks (lint + format + build + test)
pnpm check
```

### Adding New Features

1. **Database Changes**:
   - Update `src/db/schema.ts`
   - Generate migration: `pnpm db:generate`
   - Apply migration: `pnpm db:migrate`

2. **API Endpoints**:
   - Create module in `src/module/`
   - Add repository in `src/repositories/`
   - Update router in `src/router/`
   - Add OpenAPI documentation

3. **Authentication**:
   - Extend better-auth configuration
   - Add new providers or methods
   - Update RBAC permissions

## 🐳 Docker

```bash
# Build image
docker build -t express-boilerplate .

# Run container
docker run -p 8080:8080 express-boilerplate
```

## 🚀 Production Deployment

### Environment Variables

Ensure these are set in production:

```env
NODE_ENV=production
DATABASE_URL=your-neon-production-url
BETTER_AUTH_SECRET=secure-random-string
BETTER_AUTH_URL=https://your-domain.com
```

### Deployment Steps

1. Set up Neon production database
2. Configure environment variables
3. Run migrations: `pnpm db:migrate`
4. Seed initial data: `pnpm seed`
5. Build application: `pnpm build`
6. Start production server: `pnpm start`

## 📖 Documentation

- [Migration Guide](./.trae/documents/neon-drizzle-migration-plan.md) - Detailed migration information
- [Setup Guide](./.trae/documents/neon-drizzle-setup-guide.md) - Complete setup instructions
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM documentation
- [Neon](https://neon.tech/docs) - Serverless PostgreSQL documentation
- [Better-Auth](https://better-auth.com/) - Authentication library documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run `pnpm check` to ensure code quality
6. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [troubleshooting guide](./.trae/documents/neon-drizzle-setup-guide.md#troubleshooting)
2. Review the documentation links above
3. Open an issue in the repository

---

**Happy coding! 🎉**