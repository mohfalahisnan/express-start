# Dynamic Router System

This dynamic router system provides a flexible way to create REST API endpoints for any model with minimal configuration. It follows RESTful conventions and integrates seamlessly with the existing Express boilerplate.

## Features

- **Dynamic Model Support**: Automatically generates CRUD endpoints for any registered model
- **Type Safety**: Full TypeScript support with Zod validation
- **Pagination**: Built-in pagination support for GET requests
- **Filtering**: Query-based filtering for GET requests
- **Validation**: Automatic request validation using Zod schemas
- **Error Handling**: Consistent error responses using ServiceResponse
- **Extensible**: Easy to add new models and customize behavior

## API Endpoints

### Base Pattern
```
GET    /v1/dynamic/:model          # Get all records with optional filtering and pagination
POST   /v1/dynamic/:model          # Create a new record
GET    /v1/dynamic/:model/:id      # Get a specific record by ID
PUT    /v1/dynamic/:model/:id      # Update a record (full update)
PATCH  /v1/dynamic/:model/:id      # Partially update a record
DELETE /v1/dynamic/:model/:id      # Delete a record by ID
```

### Available Models

Currently registered models:
- `users`
- `roles`

## Usage Examples

### 1. Get All Users
```http
GET /v1/dynamic/users
```

**Response:**
```json
{
  "success": true,
  "message": "users retrieved successfully",
  "responseObject": {
    "data": [
      {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com",
        "roleId": 1,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
}
```

### 2. Get Users with Pagination
```http
GET /v1/dynamic/users?page=2&limit=5
```

### 3. Get Users with Filtering
```http
GET /v1/dynamic/users?roleId=1&name=John
```

### 4. Create a New User
```http
POST /v1/dynamic/users
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword",
  "roleId": 2
}
```

### 5. Get User by ID
```http
GET /v1/dynamic/users/1
```

### 6. Update User (Full Update)
```http
PUT /v1/dynamic/users/1
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "password": "newpassword",
  "roleId": 1
}
```

### 7. Update User (Partial Update)
```http
PATCH /v1/dynamic/users/1
Content-Type: application/json

{
  "name": "John Smith"
}
```

### 8. Delete User
```http
DELETE /v1/dynamic/users/1
```

## Query Parameters

### Pagination
- `page`: Page number (default: 1)
- `limit`: Number of records per page (default: 10)

### Filtering
Any field from the model can be used as a query parameter for filtering:
```http
GET /v1/dynamic/users?roleId=1&emailVerified=true
```

## Adding New Models

To add a new model to the dynamic router system:

### 1. Using the Registry (Recommended)

Add your model to the `MODEL_REGISTRY` in `dynamicRouter.ts`:

```typescript
const MODEL_REGISTRY = {
  // ... existing models
  products: {
    table: products,
    service: new AppService(db, products),
    createSchema: z.object({
      name: z.string().min(1),
      price: z.number().positive(),
      description: z.string().optional(),
      categoryId: z.number().optional()
    }),
    updateSchema: z.object({
      name: z.string().min(1).optional(),
      price: z.number().positive().optional(),
      description: z.string().optional(),
      categoryId: z.number().optional()
    })
  }
};
```

### 2. Using the Register Function

Alternatively, use the `registerModel` function:

```typescript
import { registerModel } from '@/router/dynamicRouter';
import { products } from '@/db/schema';

registerModel('products', {
  table: products,
  createSchema: z.object({
    name: z.string().min(1),
    price: z.number().positive(),
    description: z.string().optional()
  }),
  updateSchema: z.object({
    name: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    description: z.string().optional()
  })
});
```

## Validation Schemas

Each model requires two Zod schemas:

1. **createSchema**: Validates data for POST requests
2. **updateSchema**: Validates data for PUT/PATCH requests

### Schema Guidelines

- Use `.optional()` for fields that can be omitted in updates
- Include proper validation rules (min length, email format, etc.)
- Consider using `.partial()` for PATCH operations (handled automatically)

## Error Handling

The dynamic router provides consistent error responses:

### Validation Errors (400)
```json
{
  "success": false,
  "message": "Invalid request data",
  "responseObject": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "String must contain at least 1 character(s)",
      "path": ["name"]
    }
  ],
  "statusCode": 400
}
```

### Not Found Errors (404)
```json
{
  "success": false,
  "message": "users not found",
  "responseObject": null,
  "statusCode": 404
}
```

### Server Errors (500)
```json
{
  "success": false,
  "message": "An error occurred while retrieving records",
  "responseObject": null,
  "statusCode": 500
}
```

## Security Considerations

### Current Implementation
- Dynamic routes are currently **not protected** by authentication middleware
- This is intentional for demo purposes

### Production Recommendations

1. **Add Authentication**: Move dynamic routes after `authMiddleware`
2. **Add Authorization**: Implement role-based access control
3. **Rate Limiting**: Add rate limiting for dynamic endpoints
4. **Input Sanitization**: Ensure all inputs are properly sanitized
5. **Audit Logging**: Log all CRUD operations for security auditing

### Securing Dynamic Routes

To add authentication to dynamic routes, modify `v1Router.ts`:

```typescript
// Move dynamic routes after auth middleware
routerV1.use(authMiddleware);
routerV1.use("/", dynamicRouter); // Now protected
```

## Performance Considerations

1. **Pagination**: Always use pagination for large datasets
2. **Indexing**: Ensure database indexes on frequently queried fields
3. **Caching**: Consider adding caching for frequently accessed data
4. **Query Optimization**: Monitor and optimize database queries

## Extending Functionality

### Custom Middleware

Add custom middleware for specific models:

```typescript
// Add before model validation
dynamicRouter.use('/:model', customMiddleware);
```

### Custom Endpoints

Add model-specific endpoints:

```typescript
// Add after existing routes
dynamicRouter.get('/users/stats', getUserStats);
dynamicRouter.post('/users/bulk', bulkCreateUsers);
```

### Advanced Filtering

Extend the filtering system to support operators:

```typescript
// Example: GET /v1/dynamic/users?age[gte]=18&name[like]=John
```

## Testing

### Example Test Cases

```typescript
describe('Dynamic Router', () => {
  describe('GET /v1/dynamic/users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/v1/dynamic/users')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.responseObject.data).toBeInstanceOf(Array);
    });
    
    it('should support pagination', async () => {
      const response = await request(app)
        .get('/v1/dynamic/users?page=1&limit=5')
        .expect(200);
      
      expect(response.body.responseObject.pagination.page).toBe(1);
      expect(response.body.responseObject.pagination.limit).toBe(5);
    });
  });
  
  describe('POST /v1/dynamic/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/v1/dynamic/users')
        .send(userData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.responseObject.email).toBe(userData.email);
    });
  });
});
```

## Migration from Static Routes

To migrate from static routes to dynamic routes:

1. **Identify Common Patterns**: Look for repetitive CRUD operations
2. **Create Schemas**: Define Zod validation schemas
3. **Register Models**: Add models to the registry
4. **Update Tests**: Modify tests to use dynamic endpoints
5. **Remove Static Routes**: Clean up redundant static route files

## Troubleshooting

### Common Issues

1. **Model Not Found**: Ensure the model is registered in `MODEL_REGISTRY`
2. **Validation Errors**: Check Zod schema definitions
3. **Database Errors**: Verify table schema matches the service expectations
4. **Type Errors**: Ensure proper TypeScript types are defined

### Debug Mode

Enable debug logging to troubleshoot issues:

```typescript
// Add to your environment variables
DEBUG=dynamic-router
```

## Future Enhancements

- [ ] Advanced filtering with operators (gt, lt, like, in)
- [ ] Sorting support with multiple fields
- [ ] Bulk operations (bulk create, update, delete)
- [ ] Field selection (sparse fieldsets)
- [ ] Relationship expansion
- [ ] Caching layer integration
- [ ] GraphQL-style query support
- [ ] Real-time subscriptions
- [ ] API versioning support
- [ ] OpenAPI documentation generation