import { db } from "@/db";
import { z } from "zod";
const ACTIONS = ["create", "read", "update", "delete", "view"] as const;
type Action = (typeof ACTIONS)[number];

// Get roles from database
async function getRoles() {
	const roles = await db.query.roles.findMany({
		columns: {
			name: true,
		},
	});
	return roles.map((role) => role.name);
}

// Generate permissions based on roles and actions
async function generatePermissions() {
	const roles = await getRoles();
	return roles.flatMap((role) => ACTIONS.map((action) => `${role}:${action}` as const));
}

export type Permission = `${string}:${Action}`;

// Initialize permissions array
export let PERMISSIONS: Permission[] = [];

// Update permissions on startup
generatePermissions().then((perms) => {
	PERMISSIONS = perms;
});

export const PermissionSchema = z.string().refine((val): val is Permission => PERMISSIONS.includes(val as Permission), {
	message: "Invalid permission format",
});
