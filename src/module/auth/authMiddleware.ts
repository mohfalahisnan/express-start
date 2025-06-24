import { auth } from "@/lib/auth";
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
		}
		next();
	} catch (error) {
		// Continue without user data in case of any errors
		next();
	}
};
