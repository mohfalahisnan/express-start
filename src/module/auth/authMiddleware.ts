import { env } from "node:process";
import type { Handler, Request } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware: Handler = async (req: Request, res, next): Promise<void> => {
	try {
		// Get token from cookie
		const token = req.headers.cookie?.split("=")[1];

		if (token) {
			// Verify token and set user if valid
			try {
				const decoded = jwt.verify(token, env.JWT_SECRET || "your-secret-key");
				req.user = decoded;
			} catch {
				// Invalid token, but we'll continue without setting user
			}
		}

		next();
	} catch (error) {
		// Continue without user data in case of any errors
		next();
	}
};
