# Database Schemas

This directory contains modular database schema definitions organized by feature for better maintainability and separation of concerns.

## Structure

### Files

- **`index.ts`** - Main entry point that re-exports all schemas and defines relations
- **`roles.ts`** - RBAC roles table schema
- **`users.ts`** - Users table schema
- **`auth.ts`** - Authentication-related tables (sessions, accounts, verifications)

### Usage

Import schemas from the main schema file (which re-exports everything):

```typescript
import { users, roles, sessions } from '@/db/schema';
// or
import type { User, Role, Session } from '@/db/schema';
```

### Adding New Schemas

1. Create a new schema file in this directory (e.g., `products.ts`)
2. Define your table schema and types
3. Add the export to `index.ts`
4. Define any relations in `index.ts` to avoid circular imports

### Relations

All table relations are defined in `index.ts` to prevent circular import issues between schema files.

### Benefits

- **Modularity**: Each feature has its own schema file
- **Maintainability**: Easier to find and modify specific schemas
- **Separation of Concerns**: Related tables are grouped together
- **Scalability**: Easy to add new schemas without cluttering a single file