import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import {
	buildRoutePath,
	buildRouteUrl,
	calculatePriority,
	isFileIgnored,
	mergePaths,
	prioritizeRoutes,
} from "@/common/utils/buildRoute";
import type { File, Route } from "@/types";

/**
 * Recursively walk a directory and return all nested files.
 */
export const walkTree = (directory: string, tree: string[] = []) => {
	const results: File[] = [];
	for (const fileName of readdirSync(directory)) {
		const filePath = path.join(directory, fileName);
		const fileStats = statSync(filePath);
		if (fileStats.isDirectory()) {
			results.push(...walkTree(filePath, [...tree, fileName]));
		} else {
			results.push({
				name: fileName,
				path: directory,
				rel: mergePaths(...tree, fileName),
			});
		}
	}
	return results;
};

/**
 * Generate routes from an array of files by loading them as modules (sync).
 */
export const generateRoutesSync = (files: File[]) => {
	const routes: Route[] = [];
	for (const file of files) {
		const parsedFile = path.parse(file.rel);
		if (isFileIgnored(parsedFile)) continue;
		const routePath = buildRoutePath(parsedFile);
		const url = buildRouteUrl(routePath);
		const priority = calculatePriority(url);
		// Use require for sync module loading
		const modulePath = path.join(file.path, file.name);

		let exports;
		try {
			exports = require(modulePath);
		} catch (err) {
			// Optionally handle or log error
			continue;
		}
		routes.push({
			url,
			priority,
			exports,
		});
	}
	return prioritizeRoutes(routes);
};
