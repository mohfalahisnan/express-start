import { env } from "@/common/utils/envConfig";
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
			console.log("MongoDB is already connected");
			return;
		}

		try {
			await mongoose.connect(env.MONGO_URI);

			this.isConnected = true;
			console.log("MongoDB connected successfully");

			mongoose.connection.on("error", (error) => {
				console.error("MongoDB connection error:", error);
				this.isConnected = false;
			});

			mongoose.connection.on("disconnected", () => {
				console.log("MongoDB disconnected");
				this.isConnected = false;
			});
		} catch (error) {
			console.error("Error connecting to MongoDB:", error);
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
			console.log("MongoDB disconnected successfully");
		} catch (error) {
			console.error("Error disconnecting from MongoDB:", error);
			throw error;
		}
	}

	public getConnection(): typeof mongoose {
		return mongoose;
	}
}

export const db = await Database.getInstance();
