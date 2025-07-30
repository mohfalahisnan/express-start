# Dynamic Router Configuration Guide

This guide explains how to configure and use the dynamic router system with the centralized MODEL_REGISTRY in the Express boilerplate.

## Overview

The dynamic router system provides automatic REST API endpoint generation for any registered model. With the recent architectural improvement, all model configurations are now centralized in `src/config.ts` for better organization and maintainability.

## Architecture

### Configuration Structure

The MODEL_REGISTRY is defined in `src/config.ts` with the following structure:

```typescript
// src/config.ts
interface Config {
  VALID_FILE_EXTENSIONS: string[];
  INVALID_NAME_SUFFIXES: string[];
  IGNORE_PREFIX_CHAR: string;
  DEFAULT_METHOD_EXPORTS: string[];
  SENSITIVE_KEYS: string[];
  MODEL_REGISTRY: Record<string, ModelConfig>;
}

// src/types.ts
export interface ModelConfig {
  table: any; // Drizzle table definition
  service: AppService<any>; // Service instance
  createSchema: z.ZodSchema; // Zod schema for creation
  updateSchema: z.ZodSchema; // Zod schema for updates
}
```

### Current Configuration

```typescript
// src/config.ts
const config: Config = {
  // ... other configuration properties
  MODEL_REGISTRY: {
    users: {
      table: users,
      service: new AppService(db, users),
      createSchema: CreateUserSchema.shape.body,
      updateSchema: UpdateUserSchema.shape.body,
    },
    roles: {
      table: roles,
      service: new AppService(db, roles),
      createSchema: CreateRoleSchema.shape.body,
      updateSchema: UpdateRoleSchema.shape.body,
    },
  },
};
```

## Benefits of Centralized Configuration

### 1. **Single Source of Truth**
- All model configurations in one location
- Easier to maintain and update
- Reduced risk of configuration drift

### 2. **Better Type Safety**
- Full TypeScript support with proper typing
- Compile-time validation of model configurations
- IntelliSense support for model properties

### 3. **Improved Organization**
- Clear separation of concerns
- Configuration separate from business logic
- Easier to understand project structure

### 4. **Reduced Circular Dependencies**
- Cleaner import structure
- Better module organization
- Easier testing and mocking

## Adding New Models

### Step 1: Create Database Schema

First, define your table schema in `src/db/schema.ts`:

```typescript
// src/db/schema.ts
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  categoryId: integer('category_id').references(() => categories.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### Step 2: Create Validation Schemas

Create validation schemas in your module directory:

```typescript
// src/module/products/productModel.ts
import { z } from 'zod';

export const CreateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    categoryId: z.number().int().positive().optional(),
  }),
});

export const UpdateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive').optional(),
    categoryId: z.number().int().positive().optional(),
  }),
});

export type CreateProductRequest = z.infer<typeof CreateProductSchema>;
export type UpdateProductRequest = z.infer<typeof UpdateProductSchema>;
```

### Step 3: Register in MODEL_REGISTRY

Add your model to the registry in `src/config.ts`:

```typescript
// src/config.ts
import { products } from './db/schema';
import { CreateProductSchema, UpdateProductSchema } from './module/products/productModel';

const config: Config = {
  // ... other properties
  MODEL_REGISTRY: {
    // ... existing models
    products: {
      table: products,
      service: new AppService(db, products),
      createSchema: CreateProductSchema.shape.body,
      updateSchema: UpdateProductSchema.shape.body,
    },
  },
};
```

### Step 4: Update TypeScript Types

The `ModelName` type is automatically updated based on the MODEL_REGISTRY keys:

```typescript
// src/config.ts
export type ModelName = keyof typeof config.MODEL_REGISTRY;
// Now includes: 'users' | 'roles' | 'products'
```

## API Endpoints

Once registered, your model automatically gets the following endpoints:

```
GET    /v1/dynamic/products          # Get all products with pagination/filtering
POST   /v1/dynamic/products          # Create a new product
GET    /v1/dynamic/products/:id      # Get a specific product
PUT    /v1/dynamic/products/:id      # Update a product (full update)
PATCH  /v1/dynamic/products/:id      # Partially update a product
DELETE /v1/dynamic/products/:id      # Delete a product
```

## Configuration Best Practices

### 1. **Schema Organization**

```typescript
// Organize schemas by feature module
src/module/
├── users/
│   ├── userModel.ts      # Schemas and types
│   ├── userService.ts    # Business logic (if needed)
│   └── userController.ts # Custom endpoints (if needed)
├── products/
│   ├── productModel.ts
│   └── productService.ts
└── orders/
    ├── orderModel.ts
    └── orderService.ts
```

### 2. **Validation Schema Guidelines**

```typescript
// Use consistent naming
export const CreateProductSchema = z.object({ body: z.object({...}) });
export const UpdateProductSchema = z.object({ body: z.object({...}) });

// Include proper validation
name: z.string().min(1).max(255),
email: z.string().email(),
age: z.number().int().min(0).max(150),
status: z.enum(['active', 'inactive', 'pending']),

// Use optional() for update schemas
name: z.string().min(1).max(255).optional(),
```

### 3. **Service Configuration**

```typescript
// Use AppService for standard CRUD operations
service: new AppService(db, tableName)

// For custom business logic, extend AppService
class ProductService extends AppService<typeof products> {
  async findByCategory(categoryId: number) {
    // Custom logic
  }
}

service: new ProductService(db, products)
```

## Migration Guide

### From Static Routes to Dynamic Router

If you're migrating from static routes:

1. **Identify CRUD patterns** in your existing routes
2. **Extract validation logic** into Zod schemas
3. **Register models** in MODEL_REGISTRY
4. **Update tests** to use dynamic endpoints
5. **Remove redundant** static route files

### From Old Dynamic Router

If you're updating from the previous dynamic router implementation:

1. **Move MODEL_REGISTRY** from `dynamicRouter.ts` to `config.ts`
2. **Update imports** to use config
3. **Restructure schemas** to follow the new pattern
4. **Update documentation** references

## Testing

### Unit Tests

```typescript
// Test model configuration
describe('Model Configuration', () => {
  it('should have valid product configuration', () => {
    const productConfig = config.MODEL_REGISTRY.products;
    
    expect(productConfig).toBeDefined();
    expect(productConfig.table).toBeDefined();
    expect(productConfig.service).toBeInstanceOf(AppService);
    expect(productConfig.createSchema).toBeDefined();
    expect(productConfig.updateSchema).toBeDefined();
  });
});
```

### Integration Tests

```typescript
// Test dynamic endpoints
describe('Dynamic Product Endpoints', () => {
  it('should create a product', async () => {
    const productData = {
      name: 'Test Product',
      price: 99.99,
      description: 'A test product'
    };
    
    const response = await request(app)
      .post('/v1/dynamic/products')
      .send(productData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.responseObject.name).toBe(productData.name);
  });
});
```

## Troubleshooting

### Common Issues

1. **Model Not Found Error**
   ```
   Error: Model 'products' not found
   ```
   **Solution**: Ensure the model is registered in `MODEL_REGISTRY` in `src/config.ts`

2. **Schema Validation Error**
   ```
   Error: Invalid request data
   ```
   **Solution**: Check your Zod schema definitions and ensure they match the request data

3. **Import Errors**
   ```
   Error: Cannot resolve module '@/config'
   ```
   **Solution**: Ensure your TypeScript path mapping is correct and the config file exists

4. **Type Errors**
   ```
   Error: Property 'products' does not exist on type ModelRegistry
   ```
   **Solution**: Restart your TypeScript server to pick up the new ModelName type

### Debug Tips

1. **Enable debug logging**:
   ```typescript
   // Add to your environment variables
   DEBUG=dynamic-router
   ```

2. **Check model registration**:
   ```typescript
   console.log('Registered models:', Object.keys(config.MODEL_REGISTRY));
   ```

3. **Validate schemas**:
   ```typescript
   const result = CreateProductSchema.safeParse({ body: requestData });
   if (!result.success) {
     console.log('Validation errors:', result.error.issues);
   }
   ```

## Future Enhancements

The centralized configuration opens up possibilities for:

- **Dynamic schema generation** from database introspection
- **Automatic OpenAPI documentation** generation
- **Runtime model registration** for plugins
- **Configuration validation** at startup
- **Model relationship mapping** for advanced queries
- **Caching configuration** per model
- **Custom middleware** per model type

## Conclusion

The centralized MODEL_REGISTRY configuration provides a robust foundation for the dynamic router system. It improves maintainability, type safety, and developer experience while maintaining the flexibility and power of automatic endpoint generation.

For more detailed API documentation, see the [Dynamic Router README](../src/router/README.md).