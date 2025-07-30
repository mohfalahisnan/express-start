import { AppService } from "./common/service/appService";
import { db } from "./db";
import { roles, users } from "./db/schema";
import { CreateRoleSchema, CreateUserSchema, UpdateRoleSchema, UpdateUserSchema } from "./module/users/userModel";
import type { ModelConfig } from "./types";

interface Config {
	VALID_FILE_EXTENSIONS: string[];
	INVALID_NAME_SUFFIXES: string[];
	IGNORE_PREFIX_CHAR: string;
	DEFAULT_METHOD_EXPORTS: string[];
	SENSITIVE_KEYS: string[];
	MODEL_REGISTRY: Record<string, ModelConfig>;
}

/**
 * Global configuration object for the application.
 * Contains various settings and constants used throughout the app.
 *
 * @property {string[]} VALID_FILE_EXTENSIONS - List of file extensions that are valid for processing
 * @property {string[]} INVALID_NAME_SUFFIXES - File name suffixes that should be ignored
 * @property {string} IGNORE_PREFIX_CHAR - Character used to prefix files/folders that should be ignored
 * @property {string[]} DEFAULT_METHOD_EXPORTS - Supported HTTP methods for route handlers
 * @property {string[]} SENSITIVE_KEYS - List of keys that contain sensitive information and should be handled securely
 */
const config: Config = {
	VALID_FILE_EXTENSIONS: [".ts", ".js", ".mjs", ".tsx", ".jsx"],
	INVALID_NAME_SUFFIXES: [".d.ts", ".test.ts"],
	IGNORE_PREFIX_CHAR: "_",
	DEFAULT_METHOD_EXPORTS: ["get", "post", "put", "patch", "delete", "head", "connect", "options", "trace"],
	SENSITIVE_KEYS: ["password", "token", "secret", "accessToken", "refreshToken", "apiKey", "authorization"],
	MODEL_REGISTRY: {
		users: {
			table: users,
			service: new AppService(db, users),
			createSchema: CreateUserSchema.shape.body,
			updateSchema: UpdateUserSchema.shape.body,
		},
		roles: {
			table: roles,
			service: new AppService(db, roles),
			createSchema: CreateRoleSchema.shape.body,
			updateSchema: UpdateRoleSchema.shape.body,
		},
	},
};

export type ModelName = keyof typeof config.MODEL_REGISTRY;

export default config;
