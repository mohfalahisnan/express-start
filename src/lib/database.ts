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
}

export const db = await Database.getInstance();
