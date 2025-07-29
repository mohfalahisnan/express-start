import { BaseSchema } from "@/common/models/base";
import type { Role as DrizzleRole, User as DrizzleUser } from "@/db/schema";
import { PermissionSchema } from "@/module/rbac/rbacModel";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// Role schema definition for API validation
export const RoleSchema = BaseSchema.extend({
	id: z.number(),
	name: z.string(),
	isSystem: z.boolean().default(false),
	permissions: z.array(PermissionSchema),
});

// User schema definition for API validation
export const UserSchema = BaseSchema.extend({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean().default(false),
	password: z.string(),
	roleId: z.number().optional().nullable(),
	role: RoleSchema.optional().nullable(),
});

// Export types from Drizzle schema
export type User = DrizzleUser;
export type Role = DrizzleRole;

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
	params: z.object({ id: z.string() }),
});

// Mongoose models removed - using Drizzle ORM instead
// Database operations are now handled through repositories
