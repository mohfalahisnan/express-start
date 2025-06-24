import { auth } from "@/lib/auth";
import { logger } from "@/server";
import type { Handler, Request } from "express";

export const authMiddleware: Handler = async (req: Request, res, next): Promise<void> => {
	try {
		const session = await auth.api.getSession({
			headers: req.headers as unknown as Headers,
		});

		// add session to req
		if (session?.user) {
			req.user = session.user.id;
			req.session = {
				...session,
			};
			logger.info(`Login as : ${session?.user.email}`);
		} else {
			logger.info("Guest mode");
		}
		next();
	} catch (error) {
		// Continue without user data in case of any errors
		logger.info("Guest mode");
		next();
	}
};
