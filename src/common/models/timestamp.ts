import { z } from "zod";

export const zodTimestamp = {
	createdAt: z.date(),
	updatedAt: z.date(),
};
