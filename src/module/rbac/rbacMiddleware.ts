import type { Handler, Request } from "express";

export const rbacMiddleware = (allowedRoles: string[]): Handler => {
	return async (req: Request, res, next): Promise<void> => {
		try {
			// Check if user exists and has a role
			if (!req.user || !req.user.role) {
				res.status(401).json({ message: "Unauthorized - No user role found" });
			}

			// Check if user's role is allowed
			const userRole = req.user.role;
			if (!allowedRoles.includes(userRole)) {
				res.status(403).json({ message: "Forbidden - Insufficient permissions" });
			}

			next();
		} catch (error) {
			res.status(500).json({ message: "Internal server error during role verification" });
		}
	};
};
