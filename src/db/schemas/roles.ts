import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import type { Permission } from "../../module/rbac/rbacModel";

// Roles table
export const roles = pgTable("roles", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull().unique(),
	isSystem: boolean("is_system").default(false).notNull(),
	permissions: text("permissions").array().notNull().$type<Permission[]>(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations are defined in the main index file to avoid circular imports

// Type exports
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;