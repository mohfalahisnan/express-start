import { env } from "@/common/utils/envConfig";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import type mongoose from "mongoose";
import { db } from "./database";

const connection = db.getConnection();
const client = connection.connection.db as mongoose.mongo.Db;

export const auth = betterAuth({
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	database: mongodbAdapter(client),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/google`,
		},
	},
});
