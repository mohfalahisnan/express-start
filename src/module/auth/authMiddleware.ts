import type { Handler, Request } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
	user?: any;
}

export const authMiddleware: Handler = async (req: AuthRequest, res, next): Promise<void> => {
	try {
		// Get token from cookie
		const token = req.headers.cookie?.split("=")[1];

		if (!token) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

		// Add user data to request
		req.user = decoded;

		next();
	} catch (error) {
		res.status(401).json({ message: "Unauthorized" });
	}
};
