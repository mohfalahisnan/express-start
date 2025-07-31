import { PermissionSchema } from "@/module/rbac/rbacModel";
import { z } from "zod";

export const BaseSchema = z.object({
	createAt: z.date().optional(),
	updateAt: z.date().optional(),
	removeAt: z.date().optional(),
	permissions: PermissionSchema.array()
		.optional()
		.default(["admin:read", "admin:create", "admin:update", "admin:delete", "admin:view"]),
});
