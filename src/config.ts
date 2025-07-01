type Config = {
	VALID_FILE_EXTENSIONS: string[];
	INVALID_NAME_SUFFIXES: string[];
	IGNORE_PREFIX_CHAR: string;
	DEFAULT_METHOD_EXPORTS: string[];
	SENSITIVE_KEYS: string[];
};

const config: Config = {
	VALID_FILE_EXTENSIONS: [".ts", ".js", ".mjs", ".tsx", ".jsx"],
	INVALID_NAME_SUFFIXES: [".d.ts", ".test.ts"],
	IGNORE_PREFIX_CHAR: "_",
	DEFAULT_METHOD_EXPORTS: ["get", "post", "put", "patch", "delete", "head", "connect", "options", "trace"],
	SENSITIVE_KEYS: ["password", "token", "secret", "accessToken", "refreshToken", "apiKey", "authorization"],
};

export default config;
