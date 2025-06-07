import type { Handler } from "express";

import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

import { userController } from "@/module/users/userController";
import { UserSchema } from "@/module/users/userModel";

export const userRegistry = new OpenAPIRegistry();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
	method: "get",
	path: "/user",
	tags: ["User"],
	responses: createApiResponse(z.array(UserSchema), "Success"),
});

export const get: Handler = userController.getUsers;
