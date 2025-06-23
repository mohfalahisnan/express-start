import { z } from "zod";

export const zTimestamp = z.object({
	createdAt: z.date(),
	updatedAt: z.date(),
});
