import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { roles } from "./roles";

// Users table
export const users = pgTable("users", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	password: varchar("password", { length: 255 }),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	roleId: integer("role_id").references(() => roles.id),
	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.notNull(),
});

// Relations are defined in the main index file to avoid circular imports

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// User with role relation
export type UserWithRole = User & {
	role?: import("./roles").Role | null;
};