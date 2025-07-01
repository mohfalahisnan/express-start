import { ServiceResponse } from "@/common/models/serviceResponse";
import { auth } from "@/lib/auth";
import { type User, UserModel } from "@/module/users/userModel";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";

/**
 * Service class for handling user-related business logic and operations
 */
export class UserService {
	private userRepository: typeof UserModel;

	/**
	 * Creates a new instance of UserService
	 * @param repository - The user repository instance to use. Defaults to a new UserRepository instance
	 */
	constructor() {
		this.userRepository = UserModel;
	}

	/**
	 * Retrieves all users from the database
	 * @returns A ServiceResponse containing an array of users if found, null otherwise
	 * @throws Will return a failure ServiceResponse if an error occurs
	 */
	async findAll(): Promise<ServiceResponse<User[] | null>> {
		try {
			const users = await this.userRepository.find();
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
	async findById(id: string): Promise<ServiceResponse<User | null>> {
		try {
			const user = await this.userRepository.findById(id);
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
			const user = await this.userRepository.findOne({ email });
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
	async create(user: User) {
		try {
			const registeredUser = await auth.api.signUpEmail({
				body: {
					...user,
				},
			});
			return ServiceResponse.success("User created", registeredUser, StatusCodes.CREATED);
		} catch (ex) {
			const errorMessage = `Error creating user: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while creating user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async getRole(id: string) {
		try {
			const user = await this.userRepository.findById(id).populate("role");
			if (!user) {
				return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}

			// TODO: Implement permissions logic
			return ServiceResponse.success<User>("User found", user);
		} catch (ex) {
			const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

export const userService = new UserService();
