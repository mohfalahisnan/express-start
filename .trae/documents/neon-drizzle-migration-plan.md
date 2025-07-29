# Neon + Drizzle Migration Plan

## Overview
This document outlines the migration plan from MongoDB/Mongoose to Neon (PostgreSQL) with Drizzle ORM for the Express boilerplate project.

## Current Architecture
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: better-auth with MongoDB adapter
- **Models**: User, Role with RBAC permissions
- **Data Access**: Direct Mongoose model usage in services

## Target Architecture
- **Database**: Neon (PostgreSQL)
- **ORM**: Drizzle ORM with Drizzle Kit
- **Authentication**: better-auth with PostgreSQL adapter
- **Models**: Drizzle schema definitions
- **Data Access**: Drizzle queries in repositories

## Migration Steps

### 1. Dependencies Update
**Remove:**
- mongoose
- better-auth/adapters/mongodb

**Add:**
- drizzle-orm
- drizzle-kit
- @neondatabase/serverless
- better-auth/adapters/drizzle
- postgres (for local development)

### 2. Environment Variables
**Replace:**
- `MONGO_URI` → `DATABASE_URL` (Neon connection string)

**Add:**
- `DATABASE_URL` for Neon connection
- Optional: `LOCAL_DATABASE_URL` for local PostgreSQL

### 3. Database Schema Migration

#### Current Mongoose Schemas:
```javascript
// Role Schema
{
  id: Number,
  name: String,
  isSystem: Boolean,
  permissions: [String]
}

// User Schema
{
  name: String,
  email: String (unique),
  password: String,
  role: ObjectId (ref: Role),
  timestamps: true
}
```

#### Target Drizzle Schemas:
```typescript
// roles table
{
  id: serial primary key,
  name: varchar(255) not null unique,
  isSystem: boolean default false,
  permissions: text[] not null,
  createdAt: timestamp default now(),
  updatedAt: timestamp default now()
}

// users table
{
  id: serial primary key,
  name: varchar(255) not null,
  email: varchar(255) not null unique,
  password: varchar(255) not null,
  emailVerified: boolean default false,
  roleId: integer references roles(id),
  createdAt: timestamp default now(),
  updatedAt: timestamp default now()
}
```

### 4. File Structure Changes

**New Files:**
- `src/db/schema.ts` - Drizzle schema definitions
- `src/db/index.ts` - Database connection and client
- `src/db/migrations/` - Migration files
- `drizzle.config.ts` - Drizzle Kit configuration
- `src/repositories/userRepository.ts` - Data access layer
- `src/repositories/roleRepository.ts` - Role data access

**Modified Files:**
- `src/lib/database.ts` - Update to use Drizzle
- `src/lib/auth.ts` - Switch to Drizzle adapter
- `src/module/users/userModel.ts` - Update Zod schemas
- `src/module/users/userService.ts` - Use repository pattern
- `src/common/utils/envConfig.ts` - Update env variables

### 5. Data Migration Strategy

**Option A: Fresh Start**
- Create new PostgreSQL database
- Run Drizzle migrations
- Seed initial data

**Option B: Data Migration**
- Export existing MongoDB data
- Transform data format
- Import to PostgreSQL

### 6. Authentication Migration
- Update better-auth configuration
- Switch from MongoDB adapter to Drizzle adapter
- Ensure session management works with PostgreSQL

### 7. Testing Strategy
- Update existing tests to work with PostgreSQL
- Test data operations with Drizzle
- Verify authentication flows
- Test RBAC functionality

## Implementation Priority
1. **High Priority**: Core database setup and user management
2. **Medium Priority**: Authentication integration
3. **Low Priority**: Advanced RBAC features and optimizations

## Rollback Plan
- Keep MongoDB configuration as backup
- Use feature flags to switch between databases
- Maintain data export capabilities

## Performance Considerations
- PostgreSQL indexing strategy
- Connection pooling with Neon
- Query optimization with Drizzle
- Caching strategy for frequently accessed data

## Security Considerations
- Secure Neon connection strings
- Database user permissions
- SQL injection prevention (handled by Drizzle)
- Data encryption at rest (Neon feature)

## Timeline Estimate
- **Phase 1**: Dependencies and basic setup (2-3 hours)
- **Phase 2**: Schema migration and data layer (3-4 hours)
- **Phase 3**: Authentication integration (2-3 hours)
- **Phase 4**: Testing and refinement (2-3 hours)
- **Total**: 9-13 hours

## Success Criteria
- [ ] All existing API endpoints work with PostgreSQL
- [ ] Authentication flows function correctly
- [ ] RBAC permissions system operational
- [ ] Data integrity maintained
- [ ] Performance meets or exceeds current system
- [ ] All tests pass
- [ ] Documentation updated