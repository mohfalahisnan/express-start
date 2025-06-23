import { ServiceResponse } from "@/common/models/serviceResponse";

import { logger } from "@/server";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { env } from "@/common/utils/envConfig";
import { auth } from "@/lib/auth";
import { userService } from "../users/userService";
import type { LoginInput, RegisterInput, SessionData } from "./authModel";

const JWT_SECRET = env.JWT_SECRET || "your_jwt_secret";

export const PERMISSIONS = {
	USER_CREATE: "user:create",
	USER_EDIT: "user:edit",
	USER_DELETE: "user:delete",
	REPORT_VIEW: "report:view",
	INVENTORY_MANAGE: "inventory:manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Service class handling authentication-related operations
 */
export class AuthService {
	/**
	 * Authenticates a user and generates access tokens
	 * @param input - Login credentials containing email, password and remember me option
	 * @returns ServiceResponse containing authentication tokens or error message
	 */
	async login(input: LoginInput) {
		try {
			const result = await auth.api.signInEmail({
				body: input,
				asResponse: true,
			});

			return result;
		} catch (error) {
			return this.errorResponse("An unexpected error occurred", null, StatusCodes.INTERNAL_SERVER_ERROR, error);
		}
	}

	async register(data: RegisterInput) {
		try {
			const { token, user } = await auth.api.signUpEmail({
				body: data,
			});
			return ServiceResponse.success("User registered", { token, user }, StatusCodes.CREATED);
		} catch (error: any) {
			if (error.statusCode === 422) {
				return this.errorResponse(
					"Validation failed",
					error.body?.message || "Unprocessable Entity",
					StatusCodes.UNPROCESSABLE_ENTITY,
				);
			}
			return this.errorResponse(
				"Failed to register user",
				null,
				error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
				error,
			);
		}
	}

	/**
	 * Verifies the validity of a JWT token
	 * @param token - JWT token to verify
	 * @returns ServiceResponse containing decoded token data or error message
	 */
	async verifyToken(token: string) {
		try {
			const decoded = jwt.verify(token, JWT_SECRET) as SessionData;
			return ServiceResponse.success("Token verified", decoded, StatusCodes.OK);
		} catch (error) {
			return this.errorResponse("Invalid token", null, StatusCodes.UNAUTHORIZED, error);
		}
	}

	/**
	 * Generates a new access token using a refresh token
	 * @param refreshToken - Refresh token to use for generating new access token
	 * @returns ServiceResponse containing new access token or error message
	 */
	async refreshToken(refreshToken: string) {
		try {
			const decoded = jwt.verify(refreshToken, JWT_SECRET) as SessionData;
			if (!decoded || !decoded.id || !decoded.email) {
				return this.errorResponse("Invalid refresh token payload", null, StatusCodes.UNAUTHORIZED);
			}
			const user = await userService.findByEmail(decoded.email);
			if (!user.success || !user.data) {
				return this.errorResponse("User not found for refresh", null, StatusCodes.NOT_FOUND);
			}
			const role = typeof user.data.role?.name === "string" ? user.data.role.name : "guest";
			const payload: SessionData = {
				id: user.data.id,
				email: user.data.email,
				role,
			};
			const newToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
			return ServiceResponse.success("Token refreshed", { token: newToken }, StatusCodes.OK);
		} catch (error) {
			return this.errorResponse("Invalid refresh token", null, StatusCodes.UNAUTHORIZED, error);
		}
	}

	async me(req: Request) {
		const session = await auth.api.getSession({
			headers: req.headers,
		});

		if (!session) {
			return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
		}
		return ServiceResponse.success("User found", session, StatusCodes.OK);
	}

	/**
	 * Handles error responses with appropriate logging
	 * @param message - Error message to return
	 * @param data - Additional error data
	 * @param statusCode - HTTP status code
	 * @param error - Error object if available
	 * @returns ServiceResponse with error details
	 */
	private errorResponse(message: string, data: any, statusCode: number, error?: any) {
		if (error instanceof z.ZodError) {
			logger.error(error.issues);
			return ServiceResponse.failure(message, error.issues, StatusCodes.BAD_REQUEST);
		}
		if (error instanceof Error) {
			logger.error(error.stack || error.message);
		}
		logger.error("Unknown error occurred during token refresh");

		return ServiceResponse.failure(message, data, statusCode);
	}

	/**
	 * Hashes a plain text password
	 * @param password - Plain text password to hash
	 * @returns Promise resolving to hashed password
	 */
	private async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 10);
	}

	/**
	 * Compares a plain text password with a hashed password
	 * @param plainPassword - Plain text password to compare
	 * @param hashedPassword - Hashed password to compare against
	 * @returns Promise resolving to boolean indicating if passwords match
	 */
	private async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
		return bcrypt.compare(plainPassword, hashedPassword);
	}
}

export const authService = new AuthService();
