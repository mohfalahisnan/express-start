import fs from "node:fs/promises";
import path from "node:path";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";
import mongoose from "mongoose";
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
			logger.info("MongoDB is already connected");
			return;
		}

		try {
			await mongoose.connect(env.MONGO_URI);

			this.isConnected = true;
			logger.info("MongoDB connected successfully");

			mongoose.connection.on("error", (error) => {
				logger.error("MongoDB connection error:", error);
				this.isConnected = false;
			});

			mongoose.connection.on("disconnected", () => {
				logger.info("MongoDB disconnected");
				this.isConnected = false;
			});
		} catch (error) {
			logger.error("Error connecting to MongoDB:", error);
			throw error;
		}
	}

	public async disconnect(): Promise<void> {
		if (!this.isConnected) {
			return;
		}

		try {
			await mongoose.disconnect();
			this.isConnected = false;
			logger.info("MongoDB disconnected successfully");
		} catch (error) {
			logger.error("Error disconnecting from MongoDB:", error);
			throw error;
		}
	}

	public getConnection(): typeof mongoose {
		return mongoose;
	}

	public async seed(): Promise<void> {
		await this.connect();
		const Role = mongoose.model("Role");
		const seedPath = path.resolve(process.cwd(), "seed.roles.json");
		let rolesData;
		try {
			const file = await fs.readFile(seedPath, "utf-8");
			rolesData = JSON.parse(file);
		} catch (err) {
			logger.error("Failed to read seed.roles.json:", err);
			return;
		}

		for (const role of rolesData) {
			const exists = await Role.findOne({ name: role.name });
			if (!exists) {
				await Role.create({
					name: role.name,
					permissions: role.permissions,
				});
				logger.info(`Seeded role: ${role.name}`);
			} else {
				logger.info(`Role already exists: ${role.name}`);
			}
		}
	}
}

export const db = await Database.getInstance();
