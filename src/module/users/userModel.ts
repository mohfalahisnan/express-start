import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { zTimestamp } from "@/common/models/timestamp";
import mongoose from "mongoose";
import { PERMISSIONS, PermissionSchema } from "../rbac/rbacModel";

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
	emailVerified: z.boolean(),
	password: z.string(),
	role: z.any(),
	zTimestamp,
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
	params: z.object({ id: z.string() }),
});

const roleSchema = new mongoose.Schema<Role>({
	id: {
		type: Number,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	permissions: [{ type: String, enum: PERMISSIONS, required: true }],
});
export const RoleModel = mongoose.model<Role>("Role", roleSchema);

const userSchema = new mongoose.Schema<User>(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Role",
		},
	},
	{
		timestamps: true, // This will automatically add createdAt and updatedAt fields
	},
);

export const UserModel = mongoose.model<User>("User", userSchema, "user");
