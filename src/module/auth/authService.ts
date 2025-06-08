import { ServiceResponse } from "@/common/models/serviceResponse";

import { logger } from "@/server";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { userService } from "../users/userService";
import type { LoginInput, SessionData } from "./authModel";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export class AuthService {
	async login(input: LoginInput) {
		try {
			const user = await userService.findByEmail(input.email);
			if (!user.success || !user.data) {
				return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}

			const isPasswordValid = await this.comparePassword(input.password, user.data.password);

			if (!isPasswordValid) {
				return ServiceResponse.failure("Invalid password", null, StatusCodes.UNAUTHORIZED);
			}

			const payload: SessionData = {
				id: user.data.id,
				email: user.data.email,
			};

			const result = {
				token: jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" }),
				refreshToken: jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }),
			};

			return ServiceResponse.success("Login successful", { result }, StatusCodes.OK);
		} catch (error) {
			if (error instanceof z.ZodError) {
				logger.error(error.issues);
				return ServiceResponse.failure("Validation failed", error.issues, StatusCodes.BAD_REQUEST);
			}
			if (error instanceof Error) {
				logger.error(error.message);
				return ServiceResponse.failure("An error occurred", error.message, StatusCodes.INTERNAL_SERVER_ERROR);
			}
			logger.error(`error login with email ${input.email}`, error);
			return ServiceResponse.failure("An unexpected error occurred", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	private async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
		return bcrypt.compare(plainPassword, hashedPassword);
	}

	async verifyToken(token: string) {
		try {
			const decoded = jwt.verify(token, JWT_SECRET) as SessionData;
			return ServiceResponse.success("Token verified", decoded, StatusCodes.OK);
		} catch (error) {
			return ServiceResponse.failure("Invalid token", null, StatusCodes.UNAUTHORIZED);
		}
	}

	async refreshToken(refreshToken: string) {
		try {
			const decoded = jwt.verify(refreshToken, JWT_SECRET) as SessionData;
			const payload: SessionData = {
				id: decoded.id,
				email: decoded.email,
			};
			const newToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
			return ServiceResponse.success("Token refreshed", { token: newToken }, StatusCodes.OK);
		} catch (error) {
			return ServiceResponse.failure("Invalid refresh token", null, StatusCodes.UNAUTHORIZED);
		}
	}
}

export const authService = new AuthService();
