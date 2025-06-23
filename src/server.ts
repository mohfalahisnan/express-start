import { logger } from "@/common/logger";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";

import { env } from "@/common/utils/envConfig";
import requestLogger from "./common/middleware/requestLogger";
import { routerV1 } from "./router/v1Router";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

logger.info("Starting server...");

const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

app.all("/api/auth/*splat", toNodeHandler(auth));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/v1", routerV1);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
