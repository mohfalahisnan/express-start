# Neon + Drizzle Migration Guide

This guide explains how to set up and use the migrated Express boilerplate with Neon (PostgreSQL) and Drizzle ORM.

## Prerequisites

1. **Neon Account**: Sign up at [neon.tech](https://neon.tech)
2. **Node.js**: Version 20.17.0 or higher
3. **pnpm**: Package manager (recommended)

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Neon Database

1. Create a new project in Neon Console
2. Copy your connection string from the Neon dashboard
3. Create a `.env` file based on `.env.template`:

```env
# Database
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

# Other environment variables...
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:8080
```

### 3. Run Database Migrations

```bash
# Generate migration files (if schema changes)
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Or push schema directly (for development)
pnpm db:push
```

### 4. Seed Initial Data

```bash
pnpm seed
```

### 5. Start Development Server

```bash
pnpm dev
```

## Database Schema

### Tables

#### `roles`
- `id` (serial, primary key)
- `name` (varchar, unique)
- `is_system` (boolean, default: false)
- `permissions` (text array)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `users`
- `id` (serial, primary key)
- `name` (varchar)
- `email` (varchar, unique)
- `password` (varchar)
- `email_verified` (boolean, default: false)
- `role_id` (integer, foreign key to roles)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### Better-Auth Tables
- `sessions` - User sessions
- `accounts` - OAuth accounts
- `verifications` - Email/phone verifications

## Available Scripts

### Database Operations

```bash
# Generate migration files from schema changes
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Push schema directly (development only)
pnpm db:push

# Open Drizzle Studio (database GUI)
pnpm db:studio

# Seed database with initial data
pnpm seed
```

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Lint and format
pnpm check
```

## Migration Changes

### What Changed

1. **Database**: MongoDB → PostgreSQL (Neon)
2. **ORM**: Mongoose → Drizzle ORM
3. **Authentication**: MongoDB adapter → Drizzle adapter
4. **Data Access**: Direct model usage → Repository pattern
5. **Validation**: ObjectId → PostgreSQL integer IDs

### File Structure

```
src/
├── db/
│   ├── index.ts          # Database connection
│   ├── schema.ts         # Drizzle schema definitions
│   ├── seed.ts           # Database seeding
│   └── migrations/       # SQL migration files
├── repositories/
│   ├── userRepository.ts # User data access
│   └── roleRepository.ts # Role data access
├── module/
│   └── users/
│       ├── userModel.ts  # Updated Zod schemas
│       └── userService.ts # Updated to use repositories
└── lib/
    ├── auth.ts           # Updated better-auth config
    └── database.ts       # Compatibility exports
```

### API Compatibility

All existing API endpoints remain the same. The migration maintains backward compatibility at the API level.

## Development Workflow

### Making Schema Changes

1. Update `src/db/schema.ts`
2. Generate migration: `pnpm db:generate`
3. Review generated SQL in `src/db/migrations/`
4. Apply migration: `pnpm db:migrate`

### Adding New Tables

1. Define table in `src/db/schema.ts`
2. Add relations if needed
3. Create repository in `src/repositories/`
4. Update service layer
5. Generate and apply migration

### Working with Data

```typescript
// Using repositories
import { userRepository } from '@/repositories/userRepository';

// Find all users with roles
const users = await userRepository.find();

// Find user by ID
const user = await userRepository.findById('123');

// Create new user
const newUser = await userRepository.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedPassword'
});
```

## Production Deployment

### Environment Variables

Ensure these are set in production:

```env
NODE_ENV=production
DATABASE_URL=your-neon-connection-string
BETTER_AUTH_SECRET=secure-random-string
BETTER_AUTH_URL=https://your-domain.com
```

### Database Setup

1. Create production database in Neon
2. Run migrations: `pnpm db:migrate`
3. Seed initial data: `pnpm seed`

### Performance Considerations

- Neon automatically handles connection pooling
- Use indexes for frequently queried columns
- Consider read replicas for high-traffic applications
- Monitor query performance with Neon's built-in tools

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify DATABASE_URL format
   - Check Neon project status
   - Ensure SSL mode is enabled

2. **Migration Errors**
   - Check for syntax errors in SQL
   - Verify table dependencies
   - Use `pnpm db:push` for development

3. **Authentication Issues**
   - Verify better-auth configuration
   - Check session table exists
   - Ensure proper schema mapping

### Getting Help

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Neon Documentation](https://neon.tech/docs)
- [Better-Auth Documentation](https://better-auth.com/)

## Benefits of Migration

1. **Performance**: PostgreSQL offers better performance for complex queries
2. **Type Safety**: Drizzle provides full TypeScript support
3. **Scalability**: Neon offers serverless PostgreSQL with auto-scaling
4. **Developer Experience**: Better tooling and debugging capabilities
5. **SQL Compatibility**: Standard SQL queries and advanced PostgreSQL features
6. **Migrations**: Proper schema versioning and migration management

## Next Steps

1. Set up monitoring and logging
2. Implement database backups
3. Configure CI/CD pipelines
4. Add performance monitoring
5. Consider implementing read replicas for scaling