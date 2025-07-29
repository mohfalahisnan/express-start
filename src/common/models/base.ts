import { z } from "zod";

export const BaseSchema = z.object({
	createAt: z.date().optional(),
	updateAt: z.date().optional(),
	removeAt: z.date().optional(),
});
