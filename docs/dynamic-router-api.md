# Dynamic Router API Documentation

This document provides comprehensive API documentation for the dynamic router system, including all available endpoints, request/response formats, and usage examples.

## Base URL

```
http://localhost:8080/v1/dynamic
```

## Available Models

Currently registered models in the system:

- **users** - User management
- **roles** - Role-based access control

## Authentication

> ⚠️ **Note**: Dynamic routes are currently **not protected** by authentication middleware for demo purposes. In production, ensure proper authentication and authorization are implemented.

## Common Response Format

All endpoints return responses in the following format:

```typescript
interface ServiceResponse<T> {
  success: boolean;
  message: string;
  responseObject: T | null;
  statusCode: number;
}
```

## Endpoints

### Health Check

#### GET /v1/dynamic/health

Returns the health status and available endpoints for the dynamic router.

**Response:**
```json
{
  "success": true,
  "message": "Dynamic router is healthy",
  "responseObject": {
    "status": "healthy",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "availableModels": ["users", "roles"],
    "endpoints": {
      "GET": "/v1/dynamic/:model",
      "POST": "/v1/dynamic/:model",
      "GET_BY_ID": "/v1/dynamic/:model/:id",
      "PUT": "/v1/dynamic/:model/:id",
      "PATCH": "/v1/dynamic/:model/:id",
      "DELETE": "/v1/dynamic/:model/:id"
    }
  },
  "statusCode": 200
}
```

---

### Get All Records

#### GET /v1/dynamic/:model

Retrieve all records for a specific model with optional filtering and pagination.

**Parameters:**
- `model` (path) - Model name (e.g., "users", "roles")
- `page` (query, optional) - Page number (default: 1)
- `limit` (query, optional) - Records per page (default: 10)
- `{field}` (query, optional) - Filter by any model field

**Example Requests:**

```bash
# Get all users
GET /v1/dynamic/users

# Get users with pagination
GET /v1/dynamic/users?page=2&limit=5

# Get users with filtering
GET /v1/dynamic/users?roleId=1&emailVerified=true

# Get roles
GET /v1/dynamic/roles
```

**Success Response (200):**
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
        "emailVerified": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  },
  "statusCode": 200
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Model 'invalid' not found",
  "responseObject": null,
  "statusCode": 404
}
```

---

### Create Record

#### POST /v1/dynamic/:model

Create a new record for the specified model.

**Parameters:**
- `model` (path) - Model name (e.g., "users", "roles")

**Request Body:**
Varies by model. See model-specific schemas below.

**Example Requests:**

```bash
# Create a new user
POST /v1/dynamic/users
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123",
  "roleId": 2
}

# Create a new role
POST /v1/dynamic/roles
Content-Type: application/json

{
  "name": "Editor",
  "description": "Can edit content"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "users created successfully",
  "responseObject": {
    "id": "2",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "roleId": 2,
    "emailVerified": false,
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  },
  "statusCode": 201
}
```

**Validation Error Response (400):**
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

---

### Get Record by ID

#### GET /v1/dynamic/:model/:id

Retrieve a specific record by its ID.

**Parameters:**
- `model` (path) - Model name
- `id` (path) - Record ID

**Example Requests:**

```bash
# Get user by ID
GET /v1/dynamic/users/1

# Get role by ID
GET /v1/dynamic/roles/1
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "users retrieved successfully",
  "responseObject": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "roleId": 1,
    "emailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "statusCode": 200
}
```

**Not Found Response (404):**
```json
{
  "success": false,
  "message": "users not found",
  "responseObject": null,
  "statusCode": 404
}
```

---

### Update Record (Full)

#### PUT /v1/dynamic/:model/:id

Perform a full update of a record. All fields should be provided.

**Parameters:**
- `model` (path) - Model name
- `id` (path) - Record ID

**Request Body:**
Complete record data (varies by model).

**Example Request:**

```bash
# Update user (full update)
PUT /v1/dynamic/users/1
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "password": "newpassword123",
  "roleId": 1
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "users updated successfully",
  "responseObject": {
    "id": "1",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "roleId": 1,
    "emailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T12:30:00Z"
  },
  "statusCode": 200
}
```

---

### Update Record (Partial)

#### PATCH /v1/dynamic/:model/:id

Perform a partial update of a record. Only provided fields will be updated.

**Parameters:**
- `model` (path) - Model name
- `id` (path) - Record ID

**Request Body:**
Partial record data (varies by model).

**Example Request:**

```bash
# Update user (partial update)
PATCH /v1/dynamic/users/1
Content-Type: application/json

{
  "name": "John Smith"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "users updated successfully",
  "responseObject": {
    "id": "1",
    "name": "John Smith",
    "email": "john@example.com",
    "roleId": 1,
    "emailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T12:45:00Z"
  },
  "statusCode": 200
}
```

---

### Delete Record

#### DELETE /v1/dynamic/:model/:id

Delete a specific record by its ID.

**Parameters:**
- `model` (path) - Model name
- `id` (path) - Record ID

**Example Request:**

```bash
# Delete user
DELETE /v1/dynamic/users/1
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "users deleted successfully",
  "responseObject": null,
  "statusCode": 200
}
```

**Not Found Response (404):**
```json
{
  "success": false,
  "message": "users not found",
  "responseObject": null,
  "statusCode": 404
}
```

---

## Model Schemas

### Users Model

#### Create User Schema
```typescript
{
  name: string;           // Required, min 1 character
  email: string;          // Required, valid email format
  password: string;       // Required, min 6 characters
  roleId?: number;        // Optional, must be valid role ID
}
```

#### Update User Schema
```typescript
{
  name?: string;          // Optional, min 1 character
  email?: string;         // Optional, valid email format
  password?: string;      // Optional, min 6 characters
  roleId?: number;        // Optional, must be valid role ID
}
```

#### User Response Format
```typescript
{
  id: string;
  name: string;
  email: string;
  roleId: number | null;
  emailVerified: boolean;
  createdAt: string;      // ISO 8601 format
  updatedAt: string;      // ISO 8601 format
}
```

### Roles Model

#### Create Role Schema
```typescript
{
  name: string;           // Required, min 1 character
  description?: string;   // Optional
}
```

#### Update Role Schema
```typescript
{
  name?: string;          // Optional, min 1 character
  description?: string;   // Optional
}
```

#### Role Response Format
```typescript
{
  id: number;
  name: string;
  description: string | null;
  createdAt: string;      // ISO 8601 format
  updatedAt: string;      // ISO 8601 format
}
```

---

## Error Handling

### HTTP Status Codes

- **200 OK** - Successful GET, PUT, PATCH, DELETE
- **201 Created** - Successful POST
- **400 Bad Request** - Validation errors, malformed request
- **404 Not Found** - Model not found, record not found
- **500 Internal Server Error** - Server errors

### Error Response Format

All error responses follow this format:

```typescript
{
  success: false;
  message: string;        // Human-readable error message
  responseObject: any;    // Error details (validation errors, etc.)
  statusCode: number;     // HTTP status code
}
```

### Common Error Scenarios

#### Model Not Found (404)
```json
{
  "success": false,
  "message": "Model 'products' not found",
  "responseObject": null,
  "statusCode": 404
}
```

#### Validation Error (400)
```json
{
  "success": false,
  "message": "Invalid request data",
  "responseObject": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "number",
      "path": ["email"],
      "message": "Expected string, received number"
    }
  ],
  "statusCode": 400
}
```

#### Server Error (500)
```json
{
  "success": false,
  "message": "An error occurred while processing the request",
  "responseObject": null,
  "statusCode": 500
}
```

---

## Advanced Usage

### Filtering

You can filter results using query parameters that match model fields:

```bash
# Filter users by role
GET /v1/dynamic/users?roleId=1

# Filter by multiple fields
GET /v1/dynamic/users?roleId=1&emailVerified=true

# Filter roles by name
GET /v1/dynamic/roles?name=Admin
```

### Pagination

All GET endpoints support pagination:

```bash
# Get first page (default)
GET /v1/dynamic/users

# Get specific page
GET /v1/dynamic/users?page=2

# Custom page size
GET /v1/dynamic/users?page=1&limit=20

# Combine with filtering
GET /v1/dynamic/users?roleId=1&page=2&limit=5
```

### Bulk Operations

Currently, bulk operations are not supported. Each record must be created, updated, or deleted individually.

---

## Rate Limiting

> ⚠️ **Production Note**: Implement rate limiting for production use to prevent abuse.

Recommended rate limits:
- **GET requests**: 100 requests per minute
- **POST/PUT/PATCH requests**: 30 requests per minute
- **DELETE requests**: 10 requests per minute

---

## Security Considerations

### Current State
- No authentication required (demo purposes)
- No authorization checks
- No rate limiting
- No input sanitization beyond validation

### Production Recommendations

1. **Authentication**: Implement JWT or session-based auth
2. **Authorization**: Add role-based access control
3. **Rate Limiting**: Prevent abuse and DoS attacks
4. **Input Sanitization**: Sanitize all inputs
5. **Audit Logging**: Log all operations
6. **HTTPS**: Use HTTPS in production
7. **CORS**: Configure CORS properly

---

## Testing

### Example Test Suite

```typescript
import request from 'supertest';
import { app } from '../src/server';

describe('Dynamic Router API', () => {
  describe('GET /v1/dynamic/users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/v1/dynamic/users')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.responseObject.data).toBeInstanceOf(Array);
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

---

## Changelog

### v2.0.0 (Current)
- Moved MODEL_REGISTRY to centralized config
- Improved type safety
- Better error handling
- Enhanced documentation

### v1.0.0
- Initial dynamic router implementation
- Basic CRUD operations
- Model registry in router file

---

## Support

For issues, questions, or contributions:

1. Check the [Dynamic Router README](../src/router/README.md)
2. Review the [Configuration Guide](./dynamic-router-configuration.md)
3. Create an issue in the project repository
4. Consult the main project documentation

---

*This documentation is automatically generated based on the current MODEL_REGISTRY configuration. Last updated: 2024-01-01*