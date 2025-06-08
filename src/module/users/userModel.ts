import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
	id: z.number(),
	name: z.string(),
	email: z.string().email(),
	password: z.string(),
	age: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
	token: z.string().optional(),
	refreshToken: z.string().optional(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
	params: z.object({ id: commonValidations.id }),
});
