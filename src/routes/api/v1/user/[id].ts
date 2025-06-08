import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "@/module/users/userController";
import { GetUserSchema, UserSchema } from "@/module/users/userModel";
import type { Handler } from "express";
import { userRegistry } from ".";

userRegistry.registerPath({
	method: "get",
	path: "/v1/user/{id}",
	tags: ["User"],
	request: { params: GetUserSchema.shape.params },
	responses: createApiResponse(UserSchema, "Success"),
});

export const get: Handler[] = [validateRequest(GetUserSchema), userController.getUser];
