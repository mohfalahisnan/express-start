import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import { z } from "zod";

import { createApiResponse, createRequestBody } from "@/api-docs/openAPIResponseBuilders";
import express, { type Router } from "express";
import { authController } from "./authController";
import { loginSchema, sessionSchema } from "./authModel";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.register("Auth", loginSchema);

authRegistry.registerPath({
	method: "post",
	path: "/v1/auth/login",
	tags: ["Auth"],
	request: createRequestBody(loginSchema),
	responses: createApiResponse(
		z.array(sessionSchema.extend({ token: z.string(), refreshToken: z.string() })),
		"Success",
	),
});

authRouter.post("/login", authController.login);

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
