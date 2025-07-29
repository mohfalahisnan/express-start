import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

export const demoRegistry = new OpenAPIRegistry();
export const demoRouter: Router = express.Router();

// Demo response schema
const demoResponseSchema = z.object({
	message: z.string(),
	user: z.object({
		id: z.number(),
		username: z.string(),
		email: z.string(),
		password: z.string(), // This will be sanitized
		accessToken: z.string(), // This will be sanitized
		refreshToken: z.string(), // This will be sanitized
	}),
	secret: z.string(), // This will be sanitized
	apiKey: z.string(), // This will be sanitized
});

demoRegistry.registerPath({
	method: "get",
	path: "/v1/demo/sensitive-data",
	tags: ["Demo"],
	responses: createApiResponse(demoResponseSchema, "Demo response with sensitive data"),
});

// Demo endpoint that returns sensitive data (will be sanitized by middleware)
demoRouter.get("/sensitive-data", (_req, res) => {
	const responseData = {
		message: "This response contains sensitive data that should be sanitized",
		user: {
			id: 1,
			username: "john_doe",
			email: "john@example.com",
			password: "super_secret_password_123", // Will be redacted
			accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Will be redacted
			refreshToken: "refresh_token_abc123", // Will be redacted
		},
		secret: "top_secret_api_key", // Will be redacted
		apiKey: "api_key_xyz789", // Will be redacted
	};

	res.json(responseData);
});
