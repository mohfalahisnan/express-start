import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import sanitizeResponse from "../sanitizeResponse";

describe("sanitizeResponse middleware", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let next: NextFunction;
	let originalSend: any;

	beforeEach(() => {
		req = {};
		originalSend = vi.fn();
		res = {
			send: originalSend,
		};
		next = vi.fn();
	});

	it("should sanitize sensitive data from JSON string responses", () => {
		sanitizeResponse(req as Request, res as Response, next);

		const sensitiveData = {
			username: "testuser",
			password: "secret123",
			token: "abc123",
			email: "test@example.com",
		};

		res.send!(JSON.stringify(sensitiveData));

		const sentData = JSON.parse(originalSend.mock.calls[0][0]);
		expect(sentData.username).toBe("testuser");
		expect(sentData.email).toBe("test@example.com");
		expect(sentData.password).toBe("[REDACTED]");
		expect(sentData.token).toBe("[REDACTED]");
	});

	it("should sanitize sensitive data from object responses", () => {
		sanitizeResponse(req as Request, res as Response, next);

		const sensitiveData = {
			user: {
				id: 1,
				username: "testuser",
				password: "secret123",
				accessToken: "token123",
			},
			message: "Success",
		};

		res.send!(sensitiveData);

		const sentData = originalSend.mock.calls[0][0];
		expect(sentData.user.id).toBe(1);
		expect(sentData.user.username).toBe("testuser");
		expect(sentData.user.password).toBe("[REDACTED]");
		expect(sentData.user.accessToken).toBe("[REDACTED]");
		expect(sentData.message).toBe("Success");
	});

	it("should handle arrays with sensitive data", () => {
		sanitizeResponse(req as Request, res as Response, next);

		const sensitiveData = {
			users: [
				{ id: 1, username: "user1", password: "pass1" },
				{ id: 2, username: "user2", secret: "secret2" },
			],
		};

		res.send!(sensitiveData);

		const sentData = originalSend.mock.calls[0][0];
		expect(sentData.users[0].username).toBe("user1");
		expect(sentData.users[0].password).toBe("[REDACTED]");
		expect(sentData.users[1].username).toBe("user2");
		expect(sentData.users[1].secret).toBe("[REDACTED]");
	});

	it("should not modify non-JSON string responses", () => {
		sanitizeResponse(req as Request, res as Response, next);

		const plainText = "This is plain text with password in it";
		res.send!(plainText);

		expect(originalSend).toHaveBeenCalledWith(plainText);
	});

	it("should handle null and undefined values", () => {
		sanitizeResponse(req as Request, res as Response, next);

		const dataWithNulls = {
			username: "test",
			password: null,
			token: undefined,
			profile: {
				name: "Test User",
				secret: null,
			},
		};

		res.send!(dataWithNulls);

		const sentData = originalSend.mock.calls[0][0];
		expect(sentData.username).toBe("test");
		expect(sentData.password).toBe("[REDACTED]");
		expect(sentData.token).toBe("[REDACTED]");
		expect(sentData.profile.name).toBe("Test User");
		expect(sentData.profile.secret).toBe("[REDACTED]");
	});

	it("should call next function", () => {
		sanitizeResponse(req as Request, res as Response, next);
		expect(next).toHaveBeenCalled();
	});
});
