import { logger } from "@/common/logger";
import path from "node:path";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";

import { env } from "@/common/utils/envConfig";
import requestLogger from "./common/middleware/requestLogger";
import createRouter from "./router";

logger.info("Starting server...");

const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
const routesDir = path.join(process.cwd(), "src", "routes");
createRouter(app, { directory: routesDir });

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
