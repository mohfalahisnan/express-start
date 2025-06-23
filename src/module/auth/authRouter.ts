import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import { z } from "zod";

import { createApiResponse, createRequestBody } from "@/api-docs/openAPIResponseBuilders";
import express, { type Router } from "express";
import { authController } from "./authController";
import { loginSchema, registerSchema, sessionSchema } from "./authModel";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.register("Auth", loginSchema);

// better-auth routes
authRegistry.registerPath({
	method: "post",
	path: "/api/auth/sign-up/email",
	tags: ["Auth"],
	request: createRequestBody(registerSchema),
	responses: createApiResponse(sessionSchema, "Success"),
});
authRegistry.registerPath({
	method: "post",
	path: "/api/auth/sign-in/email",
	tags: ["Auth"],
	request: createRequestBody(loginSchema),
	responses: createApiResponse(
		z.array(sessionSchema.extend({ token: z.string(), refreshToken: z.string() })),
		"Success",
	),
});
authRegistry.registerPath({
	method: "post",
	path: "/api/auth/sign-out",
	tags: ["Auth"],
	responses: createApiResponse(z.object({ success: z.boolean() }), "Success"),
});
// end of better-auth routes

authRegistry.registerPath({
	method: "post",
	path: "/v1/auth/refresh",
	tags: ["Auth"],
	request: createRequestBody(sessionSchema.extend({ token: z.string(), refreshToken: z.string() })),
	responses: createApiResponse(
		z.array(sessionSchema.extend({ token: z.string(), refreshToken: z.string() })),
		"Success",
	),
});

authRouter.post("/refresh", authController.refreshToken);

// authRegistry.registerPath({
// 	method: "post",
// 	path: "/v1/auth/refresh",
// 	tags: ["Auth"],
// 	request: createRequestBody(sessionSchema.extend({ token: z.string(), refreshToken: z.string() })),
// 	responses: createApiResponse(
// 		z.array(sessionSchema.extend({ token: z.string(), refreshToken: z.string() })),
// 		"Success",
// 	),
// });

authRouter.post("/me", authController.me);
