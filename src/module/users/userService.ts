import { ServiceResponse } from "@/common/models/serviceResponse";
import type { User } from "@/module/users/userModel";
import { UserRepository } from "@/module/users/userRepository";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";

/**
 * Service class for handling user-related business logic and operations
 */
export class UserService {
	private userRepository: UserRepository;

	/**
	 * Creates a new instance of UserService
	 * @param repository - The user repository instance to use. Defaults to a new UserRepository instance
	 */
	constructor(repository: UserRepository = new UserRepository()) {
		this.userRepository = repository;
	}

	/**
	 * Retrieves all users from the database
	 * @returns A ServiceResponse containing an array of users if found, null otherwise
	 * @throws Will return a failure ServiceResponse if an error occurs
	 */
	async findAll(): Promise<ServiceResponse<User[] | null>> {
		try {
			const users = await this.userRepository.findAllAsync();
			if (!users || users.length === 0) {
				return ServiceResponse.failure("No Users found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<User[]>("Users found", users);
		} catch (ex) {
			const errorMessage = `Error finding all users: $${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while retrieving users.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	/**
	 * Retrieves a single user by their ID
	 * @param id - The ID of the user to find
	 * @returns A ServiceResponse containing the user if found, null otherwise
	 * @throws Will return a failure ServiceResponse if an error occurs
	 */
	async findById(id: number): Promise<ServiceResponse<User | null>> {
		try {
			const user = await this.userRepository.findByIdAsync(id);
			if (!user) {
				return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<User>("User found", user);
		} catch (ex) {
			const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Retrieves a single user by their email address
	 * @param email - The email address of the user to find
	 * @returns A ServiceResponse containing the user if found, null otherwise
	 * @throws Will return a failure ServiceResponse if an error occurs
	 */
	async findByEmail(email: string): Promise<ServiceResponse<User | null>> {
		try {
			const user = await this.userRepository.findByEmailAsync(email);
			if (!user) {
				return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<User>("User found", user);
		} catch (ex) {
			const errorMessage = `Error finding user with email ${email}:, ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Creates a new user
	 * @param user - The user data to create
	 * @returns A ServiceResponse containing the created user data
	 * @todo Implement actual user creation logic
	 */
	async create(user: Partial<User>): Promise<ServiceResponse<Partial<User> | null>> {
		return ServiceResponse.success<Partial<User>>("User created", user);
	}
}

export const userService = new UserService();
