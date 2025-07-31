// Re-export all tables and types from individual schema files
export * from "./roles";
export * from "./users";
export * from "./auth";

// Import tables for relations
import { relations } from "drizzle-orm";
import { roles } from "./roles";
import { users } from "./users";

// Define proper relations here to avoid circular imports
export const rolesRelations = relations(roles, ({ many }) => ({
	users: many(users),
}));

export const usersRelations = relations(users, ({ one }) => ({
	role: one(roles, {
		fields: [users.roleId],
		references: [roles.id],
	}),
}));