import type { User } from "@/module/users/userModel";

export const users: User[] = [
	{
		id: 1,
		name: "Alice",
		email: "alice@example.com",
		age: 42,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
		password: "",
	},
	{
		id: 2,
		name: "Robert",
		email: "Robert@example.com",
		age: 21,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
		password: "",
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
