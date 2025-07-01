import type { Handler, Request } from "express";
import { StatusCodes } from "http-status-codes";

export const rbacMiddleware = (allowedRoles: string[]): Handler => {
	return async (req: Request, res, next): Promise<void> => {
		try {
			// Check if user exists and has a role
			if (!req.user || !req.user) {
				res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized - No user role found" });
			}

			// Check if user's role is allowed

			// TODO: Implement permissions logic
			// if (!allowedRoles.includes(userRole)) {
			// 	res.status(StatusCodes.UNAUTHORIZED).json({ message: "Forbidden - Insufficient permissions" });
			// }

			next();
		} catch (error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error during role verification" });
		}
	};
};
