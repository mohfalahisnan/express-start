import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { userService } from "../users/userService";
import { type LoginInput, loginSchema } from "./authModel";

export class AuthService {
	async login(input: LoginInput): Promise<ServiceResponse<string> | undefined> {
		try {
			const validatedInput = loginSchema.parse(input);

			const user = await userService.findByEmail(validatedInput.email);
			if (!user) {
				ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}

			const isPasswordValid = await this.comparePassword(validatedInput);
			if (!isPasswordValid) {
				ServiceResponse.failure("Invalid password", null, StatusCodes.UNAUTHORIZED);
			}

			// todo: generate token and return it instead of "token"

			return ServiceResponse.success("Login successful", "token", StatusCodes.OK);
		} catch (error) {
			if (error instanceof z.ZodError) {
				logger.error(error.issues);
				ServiceResponse.failure("Validation failed", error.issues, StatusCodes.BAD_REQUEST);
			}
			if (error instanceof Error) {
				logger.error(error.message);
				ServiceResponse.failure("An error occurred", error.message, StatusCodes.INTERNAL_SERVER_ERROR);
			}
			logger.error(`error login with email ${input.email}`, error);
			ServiceResponse.failure("An unexpected error occurred", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	private async comparePassword({ email, password }: LoginInput): Promise<boolean> {
		return true; // TODO: Implement password compare logic
	}
}

export const authService = new AuthService();
