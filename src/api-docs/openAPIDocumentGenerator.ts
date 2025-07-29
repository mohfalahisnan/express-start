import { healthCheckRegistry } from "@/common/healthCheck";
import { authRegistry, betterAuthRegistry } from "@/module/auth/authRouter";
import { userRegistry } from "@/module/users/userRouter";
import { demoRegistry } from "@/module/demo/demoRouter";
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

export type OpenAPIDocument = ReturnType<OpenApiGeneratorV3["generateDocument"]>;

export function generateOpenAPIDocument(): OpenAPIDocument {
	const registry = new OpenAPIRegistry([
		healthCheckRegistry,
		userRegistry,
		authRegistry,
		betterAuthRegistry,
		demoRegistry,
	]);
	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Swagger API",
		},
		externalDocs: {
			description: "View the raw OpenAPI Specification in JSON format",
			url: "/swagger.json",
		},
	});
}
