import type { Request, Response } from "express";

import { type LoginInput, type RegisterInput, loginSchema, registerSchema } from "./authModel";
import { authService } from "./authService";

export class AuthController {
	public async login(req: Request, res: Response): Promise<void> {
		const loginInput: LoginInput = loginSchema.parse(req.body);
		const response: any = await authService.login(loginInput);
		// Forward all headers (including set-cookie) from response to Express
		for (const [key, value] of response.headers.entries()) {
			if (key.toLowerCase() === "set-cookie") {
				res.append("Set-Cookie", value);
			} else {
				res.setHeader(key, value);
			}
		}
		const data = await response.json();
		res.status(response.status).json(data);
	}

	public async logout(req: Request, res: Response): Promise<void> {
		const response: any = await authService.logout(req as any);
		// Forward all headers (including set-cookie) from response to Express
		for (const [key, value] of response.headers.entries()) {
			if (key.toLowerCase() === "set-cookie") {
				res.append("Set-Cookie", value);
			} else {
				res.setHeader(key, value);
			}
		}
		const data = await response.json();
		res.status(response.status).json(data);
	}

	public async register(req: Request, res: Response): Promise<void> {
		const registerInput: RegisterInput = registerSchema.parse(req.body);
		const serviceResponse = await authService.register(registerInput);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	}

	public async me(req: Request, res: Response): Promise<void> {
		const session = await authService.me(req as any);
		res.status(session.statusCode).send(session);
	}

	public async google(req: Request, res: Response): Promise<void> {
		const data = await authService.loginWithGoogle();
		res.status(data.statusCode).send(data);
	}
}

export const authController = new AuthController();
