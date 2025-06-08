import { logger } from "@/server";
import { z } from "zod";

const SENSITIVE_KEYS = ["password", "token", "secret", "accessToken", "refreshToken", "apiKey", "authorization"];

const ServiceActivityLogSchema = z.object({
	serviceName: z.string(),
	action: z.string(),
	userId: z.string().optional(),
	details: z.record(z.unknown()).optional(),
	timestamp: z.string().optional(),
});

type ServiceActivityLog = z.infer<typeof ServiceActivityLogSchema>;

function logServiceActivity(activity: ServiceActivityLog) {
	const timestamp = activity.timestamp || new Date().toISOString();
	const userId = activity.userId || "system";

	logger.info(
		`[${timestamp}] Service: ${activity.serviceName} | Action: ${activity.action} | User: ${userId}`,
		activity.details,
	);

	// todo: log to db
}

function sanitizeArgs(args: any[]): any[] {
	function redact(value: any): any {
		if (Array.isArray(value)) {
			return value.map(redact);
		}
		if (value && typeof value === "object") {
			const clone: Record<string, any> = {};
			for (const key in value) {
				if (SENSITIVE_KEYS.includes(key)) {
					clone[key] = "[REDACTED]";
				} else {
					clone[key] = redact(value[key]);
				}
			}
			return clone;
		}
		return value;
	}
	return args.map(redact);
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export function withActivityLogging<T extends { new (...args: any[]): {} }>(
	ServiceClass: T,
	defaultServiceName: string,
) {
	return class extends ServiceClass {
		constructor(...args: any[]) {
			super(...args);
			const methodNames = Object.getOwnPropertyNames(ServiceClass.prototype).filter(
				(name) => typeof (this as any)[name] === "function" && name !== "constructor",
			);
			for (const methodName of methodNames) {
				const original = (this as any)[methodName] as () => void;
				(this as any)[methodName] = (...methodArgs: []) => {
					logServiceActivity({
						serviceName: defaultServiceName,
						action: methodName,
						details: { args: sanitizeArgs(methodArgs) },
					});

					return original.apply(this, methodArgs);
				};
			}
		}
	};
}
