import type { NextFunction, Request, Response } from "express";
import config from "@/config";

/**
 * Recursively removes sensitive data from an object based on configured sensitive keys
 * @param obj - The object to sanitize
 * @param sensitiveKeys - Array of keys that should be removed
 * @returns The sanitized object
 */
function sanitizeObject(obj: any, sensitiveKeys: string[]): any {
	if (obj === null || obj === undefined) {
		return obj;
	}

	// Handle arrays
	if (Array.isArray(obj)) {
		return obj.map((item) => sanitizeObject(item, sensitiveKeys));
	}

	// Handle objects
	if (typeof obj === "object") {
		const sanitized: any = {};
		for (const [key, value] of Object.entries(obj)) {
			// Check if the key (case-insensitive) is in the sensitive keys list
			const isSensitive = sensitiveKeys.some((sensitiveKey) => key.toLowerCase().includes(sensitiveKey.toLowerCase()));

			if (isSensitive) {
				// Replace sensitive data with a placeholder
				sanitized[key] = "[REDACTED]";
			} else {
				// Recursively sanitize nested objects
				sanitized[key] = sanitizeObject(value, sensitiveKeys);
			}
		}
		return sanitized;
	}

	// Return primitive values as-is
	return obj;
}

/**
 * Middleware to sanitize sensitive data from response bodies
 * Uses the SENSITIVE_KEYS configuration to determine which fields to redact
 */
const sanitizeResponse = (req: Request, res: Response, next: NextFunction) => {
	// Store the original send method
	const originalSend = res.send;

	// Override the send method to sanitize the response
	res.send = function (body: any) {
		try {
			// Only sanitize JSON responses
			if (typeof body === "string") {
				try {
					const parsedBody = JSON.parse(body);
					const sanitizedBody = sanitizeObject(parsedBody, config.SENSITIVE_KEYS);
					body = JSON.stringify(sanitizedBody);
				} catch {
					// If it's not valid JSON, leave it as-is
				}
			} else if (typeof body === "object" && body !== null) {
				body = sanitizeObject(body, config.SENSITIVE_KEYS);
			}
		} catch (error) {
			// If sanitization fails, log the error but don't break the response
			console.error("Error sanitizing response:", error);
		}

		// Call the original send method with the sanitized body
		return originalSend.call(this, body);
	};

	next();
};

export default sanitizeResponse;
