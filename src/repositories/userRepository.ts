import { eq } from "drizzle-orm";
import { db } from "../db";
import { type NewUser, type User, type UserWithRole, roles, users } from "../db/schema";
import { logger } from "../common/logger";

export class UserRepository {
	/**
	 * Find all users with their roles
	 */
	async find(): Promise<UserWithRole[]> {
		try {
			const result = await db
				.select({
					id: users.id,
					name: users.name,
					email: users.email,
					password: users.password,
					emailVerified: users.emailVerified,
					roleId: users.roleId,
					createdAt: users.createdAt,
					updatedAt: users.updatedAt,
					role: {
						id: roles.id,
						name: roles.name,
						isSystem: roles.isSystem,
						permissions: roles.permissions,
						createdAt: roles.createdAt,
						updatedAt: roles.updatedAt,
					},
				})
				.from(users)
				.leftJoin(roles, eq(users.roleId, roles.id));

			return result as UserWithRole[];
		} catch (error) {
			logger.error("Error finding users:", error);
			throw error;
		}
	}

	/**
	 * Find user by ID with role populated
	 */
	async findById(id: string): Promise<UserWithRole | null> {
		try {
			const userId = Number.parseInt(id, 10);
			if (Number.isNaN(userId)) {
				return null;
			}

			const result = await db
				.select({
					id: users.id,
					name: users.name,
					email: users.email,
					password: users.password,
					emailVerified: users.emailVerified,
					roleId: users.roleId,
					createdAt: users.createdAt,
					updatedAt: users.updatedAt,
					role: {
						id: roles.id,
						name: roles.name,
						isSystem: roles.isSystem,
						permissions: roles.permissions,
						createdAt: roles.createdAt,
						updatedAt: roles.updatedAt,
					},
				})
				.from(users)
				.leftJoin(roles, eq(users.roleId, roles.id))
				.where(eq(users.id, userId))
				.limit(1);

			return (result[0] as UserWithRole) || null;
		} catch (error) {
			logger.error(`Error finding user by ID ${id}:`, error);
			throw error;
		}
	}

	/**
	 * Find user by email
	 */
	async findOne(criteria: { email: string }): Promise<User | null> {
		try {
			const result = await db
				.select({
					id: users.id,
					name: users.name,
					email: users.email,
					password: users.password,
					emailVerified: users.emailVerified,
					roleId: users.roleId,
					createdAt: users.createdAt,
					updatedAt: users.updatedAt,
					role: {
						id: roles.id,
						name: roles.name,
						isSystem: roles.isSystem,
						permissions: roles.permissions,
						createdAt: roles.createdAt,
						updatedAt: roles.updatedAt,
					},
				})
				.from(users)
				.leftJoin(roles, eq(users.roleId, roles.id))
				.where(eq(users.email, criteria.email))
				.limit(1);

			return (result[0] as User) || null;
		} catch (error) {
			logger.error(`Error finding user by email ${criteria.email}:`, error);
			throw error;
		}
	}

	/**
	 * Create a new user
	 */
	async create(userData: NewUser): Promise<User> {
		try {
			const result = await db.insert(users).values(userData).returning();

			return result[0] as User;
		} catch (error) {
			logger.error("Error creating user:", error);
			throw error;
		}
	}

	/**
	 * Update user by ID
	 */
	async updateById(id: string, updateData: Partial<NewUser>): Promise<User | null> {
		try {
			const userId = Number.parseInt(id, 10);
			if (Number.isNaN(userId)) {
				return null;
			}

			const result = await db
				.update(users)
				.set({ ...updateData, updatedAt: new Date() })
				.where(eq(users.id, userId))
				.returning();

			return (result[0] as User) || null;
		} catch (error) {
			logger.error(`Error updating user ${id}:`, error);
			throw error;
		}
	}

	/**
	 * Delete user by ID
	 */
	async deleteById(id: string): Promise<boolean> {
		try {
			const userId = Number.parseInt(id, 10);
			if (Number.isNaN(userId)) {
				return false;
			}

			const result = await db.delete(users).where(eq(users.id, userId)).returning();

			return result.length > 0;
		} catch (error) {
			logger.error(`Error deleting user ${id}:`, error);
			throw error;
		}
	}

	/**
	 * Populate method for compatibility (returns user with role)
	 */
	populate() {
		// This method is for compatibility with the existing service
		// The actual population is handled in the query methods above
		return this;
	}
}

export const userRepository = new UserRepository();
