import path from "node:path";
import { generateRoutesSync, walkTree } from "@/common/libs/router";
import { getHandlers, getMethodKey, isHandler } from "@/common/utils/buildRoute";
import config from "@/config";
import type { ExpressLike, Options } from "@/types";
import { Router, type RouterOptions } from "express";

const CJS_MAIN_FILENAME = typeof require !== "undefined" && require.main?.filename;
const PROJECT_DIRECTORY = CJS_MAIN_FILENAME ? path.dirname(CJS_MAIN_FILENAME) : process.cwd();

/**
 * Attach routes to an Express app or router instance
 *
 * ```ts
 * createRouter(app)
 * ```
 *
 * @param app An express app or router instance
 * @param options An options object (optional)
 */
const createRouter = <T extends ExpressLike = ExpressLike>(app: T, options: Options = {}): T => {
	const files = walkTree(options.directory || path.join(PROJECT_DIRECTORY, "routes"));

	// Use a synchronous version of generateRoutes
	const routes = generateRoutesSync(files || []);

	for (const { url, exports } of routes) {
		const exportedMethods = Object.entries(exports);

		for (const [method, handler] of exportedMethods) {
			const methodKey = getMethodKey(method);
			const handlers = handler ? getHandlers(handler) : [];

			if (!options.additionalMethods?.includes(methodKey) && !config.DEFAULT_METHOD_EXPORTS.includes(methodKey))
				continue;

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(app as any)[methodKey](url, ...handlers);
		}

		// wildcard default export route matching
		if (typeof exports.default !== "undefined") {
			if (isHandler(exports.default)) {
				(app as Router).all(url, ...getHandlers(exports.default));
			} else if (typeof exports.default === "object" && isHandler(exports.default.default)) {
				(app as Router).all(url, ...getHandlers(exports.default.default));
			}
		}
	}

	return app;
};

export const router = (options: Options & { routerOptions?: RouterOptions } = {}) => {
	const routerOptions = options?.routerOptions || {};
	return createRouter(Router(routerOptions), options);
};

export default createRouter;
