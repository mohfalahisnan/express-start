// Re-export from the new database module for compatibility
export { Database, database as db } from "../db";
export type { User, Role } from "../db/schema";
