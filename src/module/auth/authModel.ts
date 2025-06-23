import { commonValidations } from "@/common/utils/commonValidation";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const loginSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	rememberMe: z.boolean().optional(), // Optional field, defaults to false if not provided
});

export const registerSchema = z.object({
	username: z.string().min(3, "Username must be at least 3 characters"),
	name: z.string().min(3, "Name must be at least 3 characters"),
	email: z.string().email("Invalid email format"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
});

export const postLoginSchema = z.object({
	body: loginSchema,
});

export const resetPasswordSchema = z.object({
	email: z.string().email("Invalid email format"),
});

export const changePasswordSchema = z.object({
	oldPassword: z.string().min(6, "Password must be at least 6 characters"),
	newPassword: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[0-9]/, "Password must contain at least one number"),
});

export const sessionSchema = z.object({
	id: z.number(),
	email: z.string().email("Invalid email format"),
	role: z.string(),
});

export const getSessionSchema = z.object({
	params: z.object({ id: commonValidations.objectId }),
});

export const PostRegisterSchema = z.object({
	body: registerSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type SessionData = z.infer<typeof sessionSchema>;
