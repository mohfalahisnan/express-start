import { eq } from "drizzle-orm";
import { db } from "../../db";
import { type NewRole, type Role, roles } from "../../db/schema";
import { logger } from "../../common/logger";

export class RoleRepository {
	/**
	 * Find all roles
	 */
	async find(): Promise<Role[]> {
		try {
			const result = await db.select().from(roles);
			return result;
		} catch (error) {
			logger.error("Error finding roles:", error);
			throw error;
		}
	}

	/**
	 * Find role by ID
	 */
	async findById(id: number): Promise<Role | null> {
		try {
			const result = await db.select().from(roles).where(eq(roles.id, id)).limit(1);

			return result[0] || null;
		} catch (error) {
			logger.error(`Error finding role by ID ${id}:`, error);
			throw error;
		}
	}

	/**
	 * Find role by name
	 */
	async findOne(criteria: { name: string }): Promise<Role | null> {
		try {
			const result = await db.select().from(roles).where(eq(roles.name, criteria.name)).limit(1);

			return result[0] || null;
		} catch (error) {
			logger.error(`Error finding role by name ${criteria.name}:`, error);
			throw error;
		}
	}

	/**
	 * Create a new role
	 */
	async create(roleData: NewRole): Promise<Role> {
		try {
			const result = await db.insert(roles).values(roleData).returning();

			return result[0];
		} catch (error) {
			logger.error("Error creating role:", error);
			throw error;
		}
	}

	/**
	 * Update role by ID
	 */
	async updateById(id: number, updateData: Partial<NewRole>): Promise<Role | null> {
		try {
			const result = await db
				.update(roles)
				.set({ ...updateData, updatedAt: new Date() })
				.where(eq(roles.id, id))
				.returning();

			return result[0] || null;
		} catch (error) {
			logger.error(`Error updating role ${id}:`, error);
			throw error;
		}
	}

	/**
	 * Delete role by ID
	 */
	async deleteById(id: number): Promise<boolean> {
		try {
			const result = await db.delete(roles).where(eq(roles.id, id)).returning();

			return result.length > 0;
		} catch (error) {
			logger.error(`Error deleting role ${id}:`, error);
			throw error;
		}
	}

	/**
	 * Find system roles
	 */
	async findSystemRoles(): Promise<Role[]> {
		try {
			const result = await db.select().from(roles).where(eq(roles.isSystem, true));

			return result;
		} catch (error) {
			logger.error("Error finding system roles:", error);
			throw error;
		}
	}

	/**
	 * Find non-system roles
	 */
	async findUserRoles(): Promise<Role[]> {
		try {
			const result = await db.select().from(roles).where(eq(roles.isSystem, false));

			return result;
		} catch (error) {
			logger.error("Error finding user roles:", error);
			throw error;
		}
	}
}

export const roleRepository = new RoleRepository();
