# Documentation

Welcome to the Express Boilerplate documentation. This directory contains comprehensive guides and API documentation for all features of the application.

## 📚 Table of Contents

### Core Documentation
- [Main README](../README.md) - Project overview and quick start guide
- [Project Structure](../README.md#-project-structure) - Understanding the codebase organization

### Dynamic Router System
- [Dynamic Router Configuration Guide](./dynamic-router-configuration.md) - Complete guide to configuring and using the dynamic router
- [Dynamic Router API Documentation](./dynamic-router-api.md) - Comprehensive API reference with examples
- [Dynamic Router README](../src/router/README.md) - Technical implementation details

### Database
- [Database Schema](../README.md#-database) - Database structure and commands
- [Neon Drizzle Setup Guide](../.trae/documents/neon-drizzle-setup-guide.md) - Setting up Neon with Drizzle ORM
- [Migration Plan](../.trae/documents/neon-drizzle-migration-plan.md) - Database migration strategies

### Authentication & Security
- [Authentication](../README.md#-authentication) - Auth system overview
- [RBAC](../README.md#-rbac-role-based-access-control) - Role-based access control

### Development
- [Testing](../README.md#-testing) - Testing strategies and commands
- [Development Workflow](../README.md#-development) - Development setup and best practices
- [Docker](../README.md#-docker) - Containerization guide

## 🚀 Quick Navigation

### For Developers
If you're new to the project:
1. Start with the [Main README](../README.md)
2. Review the [Project Structure](../README.md#-project-structure)
3. Follow the [Quick Start Guide](../README.md#-quick-start)

### For API Users
If you want to use the API:
1. Check the [Dynamic Router API Documentation](./dynamic-router-api.md)
2. Review available endpoints and schemas
3. Test with the provided examples

### For Contributors
If you want to extend the system:
1. Read the [Dynamic Router Configuration Guide](./dynamic-router-configuration.md)
2. Understand the [MODEL_REGISTRY system](./dynamic-router-configuration.md#architecture)
3. Follow the [Adding New Models guide](./dynamic-router-configuration.md#adding-new-models)

## 📖 Documentation Structure

```
docs/
├── README.md                           # This file - documentation index
├── dynamic-router-configuration.md     # Configuration guide
└── dynamic-router-api.md              # API reference

src/
└── router/
    └── README.md                       # Technical implementation details

.trae/
└── documents/
    ├── neon-drizzle-setup-guide.md     # Database setup
    └── neon-drizzle-migration-plan.md  # Migration strategies
```

## 🔧 Key Features Documented

### Dynamic Router System
- **Centralized Configuration**: MODEL_REGISTRY in `src/config.ts`
- **Automatic CRUD**: REST endpoints generated automatically
- **Type Safety**: Full TypeScript support with Zod validation
- **Extensible**: Easy to add new models and customize behavior

### Database Integration
- **Drizzle ORM**: Modern TypeScript ORM
- **PostgreSQL**: Production-ready database
- **Migrations**: Version-controlled schema changes
- **Seeding**: Sample data for development

### Authentication & Authorization
- **Session Management**: Secure user sessions
- **Role-Based Access**: Flexible permission system
- **OAuth Support**: Configurable third-party auth

## 🛠️ Development Tools

### API Documentation
- **Swagger UI**: Interactive API explorer at `/api-docs`
- **Health Checks**: System status endpoints
- **Dynamic API Health**: Router-specific health check

### Code Quality
- **TypeScript**: Full type safety
- **Biome**: Fast linting and formatting
- **Testing**: Comprehensive test suite with Vitest
- **Docker**: Containerized development and deployment

## 📝 Contributing to Documentation

When adding new features or making changes:

1. **Update relevant documentation** in this directory
2. **Keep examples current** with actual implementation
3. **Add new sections** for significant features
4. **Update this index** when adding new documentation files

### Documentation Standards

- Use clear, concise language
- Include practical examples
- Provide both overview and detailed information
- Keep code examples up-to-date
- Use consistent formatting and structure

## 🔗 External Resources

### Technologies Used
- [Express.js](https://expressjs.com/) - Web framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Zod](https://zod.dev/) - Schema validation
- [Vitest](https://vitest.dev/) - Testing framework
- [Biome](https://biomejs.dev/) - Linting and formatting
- [PostgreSQL](https://www.postgresql.org/) - Database

### Deployment
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Docker](https://www.docker.com/) - Containerization

## 📞 Support

If you need help:

1. **Check this documentation** first
2. **Review the specific feature documentation**
3. **Look at the code examples** in the repository
4. **Create an issue** if you find bugs or missing documentation
5. **Contribute improvements** via pull requests

---

*Documentation last updated: 2024-01-01*
*For the most current information, always refer to the source code and latest commits.*