import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";
import { PermissionSchema } from "../rbac/rbacModel";

extendZodWithOpenApi(z);

// Role schema definition
export type Role = z.infer<typeof RoleSchema>;
export const RoleSchema = z.object({
	id: z.number(),
	name: z.string(),
	permissions: z.array(PermissionSchema),
});

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
	id: z.number(),
	name: z.string(),
	email: z.string().email(),
	password: z.string(),
	age: z.number(),
	roleId: z.number(), // Reference to Role model
	role: RoleSchema.optional(), // For populated role data
	createdAt: z.date(),
	updatedAt: z.date(),
	token: z.string().optional(),
	refreshToken: z.string().optional(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
	params: z.object({ id: commonValidations.id }),
});
