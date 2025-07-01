import { auth } from "@/lib/auth";
import type { Handler, Request } from "express";
import { userService } from "../users/userService";

export const authMiddleware: Handler = async (req: Request, res, next): Promise<void> => {
	try {
		const session = await auth.api.getSession({
			headers: req.headers as unknown as Headers,
		});

		// add session to req
		if (session?.user) {
			req.user = session.user.id;
			req.session = {
				session: session.session,
				user: {
					...session.user,
					role: "guest",
				},
			};
		}

		// always check for user role instead of get role from session directly to avoid race conditions
		// if user role is not found, set it to guest
		if (req.session) {
			const user = await userService.getRole(req.user as string);
			if (user.data?.role) req.session.user.role = user.data.role;
		}

		next();
	} catch (error) {
		next();
	}
};
