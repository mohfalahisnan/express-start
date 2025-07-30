# Changelog

All notable changes to the Express Boilerplate project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-01-01

### 🚀 Major Changes

#### MODEL_REGISTRY Centralization
- **BREAKING**: Moved `MODEL_REGISTRY` from `src/router/dynamicRouter.ts` to `src/config.ts`
- **Improved**: Centralized configuration for better maintainability
- **Enhanced**: Type safety with proper TypeScript interfaces
- **Added**: `ModelName` type export for better type checking

### ✨ Added

#### Documentation
- **New**: Comprehensive documentation in `/docs` directory
- **New**: [Dynamic Router Configuration Guide](./dynamic-router-configuration.md)
- **New**: [Dynamic Router API Documentation](./dynamic-router-api.md)
- **New**: [Documentation Index](./README.md) with navigation
- **Updated**: Main README with documentation links
- **Updated**: Router README with new configuration instructions

#### Configuration Structure
- **New**: Centralized `Config` interface in `src/config.ts`
- **New**: `ModelConfig` interface in `src/types.ts`
- **Improved**: Better organization of application configuration
- **Enhanced**: Single source of truth for model registry

### 🔄 Changed

#### Dynamic Router
- **Changed**: MODEL_REGISTRY import from config instead of local definition
- **Updated**: All documentation to reflect new configuration location
- **Improved**: Error messages and troubleshooting guides
- **Enhanced**: Type safety throughout the router system

#### Project Structure
- **Organized**: Configuration centralized in `src/config.ts`
- **Improved**: Separation of concerns between config and business logic
- **Enhanced**: Module organization and import structure

### 🛠️ Migration Guide

#### For Existing Projects

If you're upgrading from a previous version:

1. **Move MODEL_REGISTRY**:
   ```typescript
   // OLD: In src/router/dynamicRouter.ts
   const MODEL_REGISTRY = {
     users: { /* config */ },
     roles: { /* config */ }
   };
   
   // NEW: In src/config.ts
   const config: Config = {
     // ... other config
     MODEL_REGISTRY: {
       users: { /* config */ },
       roles: { /* config */ }
     }
   };
   ```

2. **Update Imports**:
   ```typescript
   // OLD
   import { MODEL_REGISTRY } from './dynamicRouter';
   
   // NEW
   import config from '@/config';
   const { MODEL_REGISTRY } = config;
   ```

3. **Update Schema References**:
   ```typescript
   // OLD
   createSchema: z.object({ /* schema */ })
   
   // NEW
   createSchema: CreateModelSchema.shape.body
   ```

4. **Update Documentation References**:
   - Replace references to MODEL_REGISTRY location
   - Update import statements in examples
   - Review custom model configurations

#### Breaking Changes

- **MODEL_REGISTRY location**: Moved from router to config
- **Import paths**: Updated import statements required
- **Schema structure**: Now uses `.shape.body` pattern
- **Type exports**: `ModelName` now exported from config

#### Compatibility

- **API endpoints**: No changes to REST API
- **Response formats**: Unchanged
- **Validation**: Same Zod validation behavior
- **Database**: No schema changes required

### 📝 Documentation Updates

#### New Documentation
- Complete configuration guide with examples
- Comprehensive API documentation with all endpoints
- Migration guide for existing projects
- Best practices and troubleshooting

#### Updated Documentation
- Main README with new documentation structure
- Router README with updated configuration instructions
- All examples updated to reflect new structure

### 🔧 Developer Experience

#### Improvements
- Better TypeScript support and IntelliSense
- Clearer error messages with specific guidance
- Centralized configuration for easier maintenance
- Comprehensive documentation for faster onboarding

#### Tools
- Updated troubleshooting guides
- Enhanced debugging information
- Better development workflow documentation

---

## [1.0.0] - 2023-12-01

### ✨ Initial Release

#### Core Features
- Dynamic router system with automatic CRUD endpoints
- MODEL_REGISTRY for model configuration
- Express.js boilerplate with TypeScript
- Drizzle ORM with PostgreSQL
- Authentication and RBAC system
- Comprehensive testing setup

#### API Endpoints
- RESTful CRUD operations for registered models
- Pagination and filtering support
- Zod validation for request/response
- Consistent error handling

#### Development Tools
- Docker containerization
- Database migrations and seeding
- Code quality tools (linting, formatting)
- Testing framework with coverage

---

## Migration Notes

### From v1.x to v2.0

The main change is the centralization of MODEL_REGISTRY. Follow these steps:

1. **Backup your current configuration**
2. **Move MODEL_REGISTRY to src/config.ts**
3. **Update all import statements**
4. **Test your endpoints**
5. **Update any custom documentation**

### Rollback Plan

If you need to rollback:

1. **Restore MODEL_REGISTRY to dynamicRouter.ts**
2. **Revert import statements**
3. **Update schema references**
4. **Test functionality**

---

## Support

For migration assistance or questions:

1. Review the [Configuration Guide](./dynamic-router-configuration.md)
2. Check the [API Documentation](./dynamic-router-api.md)
3. Consult the [Documentation Index](./README.md)
4. Create an issue in the repository

---

*This changelog follows [Keep a Changelog](https://keepachangelog.com/) format.*