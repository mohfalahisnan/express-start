import fs from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { logger } from "../common/logger";
import { auth } from "../lib/auth";
import type { Permission } from "../module/rbac/rbacModel";
import { db } from "./index";
import { roles, users } from "./schema";

interface SeedRole {
	name: string;
	permissions: Permission[];
	isSystem?: boolean;
}

async function seedRoles() {
	try {
		const seedPath = path.resolve(process.cwd(), "seed.roles.json");
		let rolesData: SeedRole[];

		try {
			const file = await fs.readFile(seedPath, "utf-8");
			rolesData = JSON.parse(file);
		} catch (err) {
			logger.error("Failed to read seed.roles.json:", err);
			return;
		}

		for (const roleData of rolesData) {
			// Check if role already exists
			const existingRole = await db.select().from(roles).where(eq(roles.name, roleData.name)).limit(1);

			if (existingRole.length === 0) {
				// Create new role
				await db.insert(roles).values({
					name: roleData.name,
					permissions: roleData.permissions,
					isSystem: roleData.isSystem || false,
				});
				logger.info(`Seeded role: ${roleData.name}`);
			} else {
				logger.info(`Role already exists: ${roleData.name}`);
			}
		}

		logger.info("Role seeding completed");
	} catch (error) {
		logger.error("Error seeding roles:", error);
		throw error;
	}
}

async function seedUsers() {
	try {
		// Get admin role
		const adminRole = await db.select().from(roles).where(eq(roles.name, "admin")).limit(1);

		if (adminRole.length === 0) {
			logger.error("Admin role not found. Please seed roles first.");
			return;
		}

		// Check if admin user already exists
		const existingUser = await db.select().from(users).where(eq(users.email, "admin@example.com")).limit(1);

		if (existingUser.length === 0) {
			// Create admin user using better-auth signup
			const signUpResult = await auth.api.signUpEmail({
				body: {
					email: "admin@example.com",
					password: "admin123",
					name: "Admin User",
				},
			});

			// Update user with admin role
			if (signUpResult.user.id) {
				await db
					.update(users)
					.set({ roleId: adminRole[0].id, emailVerified: true })
					.where(eq(users.id, signUpResult.user.id));
				logger.info("Seeded admin user: admin@example.com");
			} else {
				logger.error("Failed to create admin user");
			}
		} else {
			logger.info("Admin user already exists: admin@example.com");
		}

		logger.info("User seeding completed");
	} catch (error) {
		logger.error("Error seeding users:", error);
		throw error;
	}
}

async function seedDatabase() {
	try {
		logger.info("Starting database seeding...");

		// Test database connection
		await db.select().from(roles).limit(1);
		logger.info("Database connection verified");

		// Seed roles
		await seedRoles();

		// Seed users
		await seedUsers();

		logger.info("Database seeding completed successfully");
	} catch (error) {
		logger.error("Database seeding failed:", error);
		process.exit(1);
	}
}

// Run seeding if this file is executed directly
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"))) {
	seedDatabase();
}

export { seedDatabase, seedRoles, seedUsers };
