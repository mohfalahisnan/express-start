import { ServiceResponse } from "@/common/models/serviceResponse";

import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import type { Request } from "express";
import type { LoginInput, RegisterInput } from "./authModel";

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

	async loginWithGoogle() {
		try {
			const result = await auth.api.signInSocial({
				body: {
					provider: "google",
				},
			});
			return ServiceResponse.success("Login with google generated", result.url, StatusCodes.CREATED);
		} catch (error) {
			return this.errorResponse("An unexpected error occurred", null, StatusCodes.INTERNAL_SERVER_ERROR, error);
		}
	}

	async logout(req: Request) {
		try {
			const result = await auth.api.signOut({
				headers: req.headers as unknown as Headers,
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

	async me(req: Request) {
		const session = await auth.api.getSession({
			headers: req.headers as unknown as Headers,
		});

		if (!session) {
			return ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED);
		}
		return ServiceResponse.success("Authorized", session, StatusCodes.OK);
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
		if (error instanceof APIError) {
			return ServiceResponse.failure(
				message,
				error.message || "Internal Server Error",
				error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
		if (error instanceof Error) {
			logger.error(error.stack || error.message);
		}
		logger.error(message);

		return ServiceResponse.failure(message, data, statusCode);
	}
}

export const authService = new AuthService();
