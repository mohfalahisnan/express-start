import type { Request, Response } from "express";

import { type LoginInput, loginSchema } from "./authModel";
import { authService } from "./authService";

export class AuthController {
	public async login(req: Request, res: Response): Promise<void> {
		const loginInput: LoginInput = loginSchema.parse(req.body);
		const serviceResponse = await authService.login(loginInput);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	}

	public async validateToken(req: Request, res: Response): Promise<void> {
		const token = req.headers?.cookie?.split("=")[1];
		if (!token) {
			throw new Error("No token provided");
		}
		const result = await authService.verifyToken(token);
		res.status(200).json(result);
	}

	public async refreshToken(req: Request, res: Response): Promise<void> {
		const refreshToken = req.body.refreshToken;
		if (!refreshToken) {
			throw new Error("No refresh token provided");
		}
		const result = await authService.refreshToken(refreshToken);
		res.status(200).json(result);
	}
}

export const authController = new AuthController();
