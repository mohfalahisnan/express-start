import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import type { Handler, Request, Response } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { ServiceResponse } from "@/common/models/serviceResponse";

export const healthCheckRegistry = new OpenAPIRegistry();

healthCheckRegistry.registerPath({
	method: "get",
	path: "/v1/healthCheck",
	tags: ["Health Check"],
	responses: createApiResponse(z.null(), "Success"),
});

export const get: Handler = async (req: Request, res: Response) => {
	const serviceResponse = ServiceResponse.success("Service is healthy", null);
	res.status(serviceResponse.statusCode).send(serviceResponse);
};
