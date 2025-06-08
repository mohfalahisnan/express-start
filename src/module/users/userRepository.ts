import type { User } from "@/module/users/userModel";
import bcrypt from "bcryptjs";

const salt = 10;

export const users: User[] = [
	{
		id: 1,
		name: "Admin",
		email: "admin@example.com",
		age: 42,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
		password: bcrypt.hashSync("admin123", salt),
	},
	{
		id: 2,
		name: "Robert",
		email: "robert@example.com",
		age: 21,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
		password: bcrypt.hashSync("admin123", salt),
	},
];

export class UserRepository {
	async findAllAsync(): Promise<User[]> {
		return users;
	}

	async findByIdAsync(id: number): Promise<User | null> {
		return users.find((user) => user.id === id) || null;
	}

	async findByEmailAsync(email: string): Promise<User | null> {
		return users.find((user) => user.email === email) || null;
	}
}
