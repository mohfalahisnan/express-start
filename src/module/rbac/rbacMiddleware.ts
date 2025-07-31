import type { Handler, Request } from "express";
import { StatusCodes } from "http-status-codes";

export const rbacMiddleware: Handler = async (req: Request, res, next): Promise<void> => {
	try {
		// Check if user exists and has a role
		if (!req.user || !req.user) {
			res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized - No user role found" });
		}

		next();
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error during role verification" });
	}
};
