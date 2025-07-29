import { eq } from "drizzle-orm";

export class AppService<T> {
	constructor(
		private readonly db: any,
		private readonly table: any
	) {}

	// use for post method
	async create(data: Partial<T>): Promise<T> {
		const result = await this.db.insert(this.table).values(data).returning();
		return result[0];
	}

	// use for get method
	async find(options?: { where?: Partial<T>; limit?: number; offset?: number }): Promise<T[]> {
		let query = this.db.select().from(this.table);

		if (options?.where) {
			query = query.where(options.where);
		}

		if (options?.limit) {
			query = query.limit(options.limit);
		}

		if (options?.offset) {
			query = query.offset(options.offset);
		}

		return await query;
	}

	async findById(id: number | string): Promise<T | null> {
		const result = await this.db
			.select()
			.from(this.table)
			.where(eq(this.table.id, id))
			.limit(1);
		
		return result[0] || null;
	}

	// use for put method
	async update(id: number | string, data: Partial<T>): Promise<T> {
		const result = await this.db
			.update(this.table)
			.set(data)
			.where(eq(this.table.id, id))
			.returning();
		
		return result[0];
	}

	// use for delete method
	async delete(id: number | string): Promise<T> {
		const result = await this.db
			.delete(this.table)
			.where(eq(this.table.id, id))
			.returning();
		
		return result[0];
	}
}
