import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import { z } from "zod";

import { createApiResponse, createRequestBody } from "@/api-docs/openAPIResponseBuilders";
import express, { type Router } from "express";
import { authController } from "./authController";
import { authMiddleware } from "./authMiddleware";
import { loginSchema, registerSchema, sessionSchema } from "./authModel";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.register("Auth", loginSchema);

authRouter.use(authMiddleware);

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
	method: "get",
	path: "/v1/auth/me",
	tags: ["Auth"],
	responses: createApiResponse(sessionSchema, "Success"),
});
authRouter.get("/me", authController.me);

authRegistry.registerPath({
	method: "post",
	path: "/v1/auth/login",
	tags: ["Auth"],
	request: createRequestBody(loginSchema),
	responses: createApiResponse(sessionSchema, "Success"),
});
authRouter.post("/login", authController.login);

authRegistry.registerPath({
	method: "get",
	path: "/v1/auth/logout",
	tags: ["Auth"],
	responses: createApiResponse(sessionSchema, "Success"),
});
authRouter.get("/logout", authController.logout);

authRegistry.registerPath({
	method: "post",
	path: "/v1/auth/register",
	tags: ["Auth"],
	request: createRequestBody(registerSchema),
	responses: createApiResponse(sessionSchema, "Success"),
});

authRouter.post("/register", authController.register);
