import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { logger } from "../common/logger";
import { env } from "../common/utils/envConfig";
import * as schema from "./schema";

// Create the HTTP connection
const sql = neon(env.DATABASE_URL);

// Create the drizzle instance with HTTP driver
export const db = drizzle(sql, {
	schema,
});

// Export the sql connection for direct queries if needed
export { sql };

// Database connection class for compatibility
export class Database {
	private static instance: Database;
	private isConnected = false;

	private constructor() {}

	public static async getInstance(): Promise<Database> {
		if (!Database.instance) {
			Database.instance = new Database();
			await Database.instance.connect();
		}
		return Database.instance;
	}

	public async connect(): Promise<void> {
		if (this.isConnected) {
			logger.info("Database is already connected");
			return;
		}

		try {
			// Test the connection
			await sql`SELECT 1`;
			this.isConnected = true;
			logger.info("Database connected successfully");
		} catch (error) {
			logger.error("Error connecting to database:", error);
			throw error;
		}
	}

	public async disconnect(): Promise<void> {
		if (!this.isConnected) {
			return;
		}

		try {
			// Neon serverless doesn't require explicit disconnection
			this.isConnected = false;
			logger.info("Database disconnected successfully");
		} catch (error) {
			logger.error("Error disconnecting from database:", error);
			throw error;
		}
	}

	public getConnection() {
		return db;
	}

	public async seed(): Promise<void> {
		await this.connect();
		// Seed logic will be implemented in separate seed file
		logger.info("Seeding completed");
	}
}

// Export the database instance
export const database = await Database.getInstance();

// Export types
export type { User, NewUser, Role, NewRole } from "./schema";
