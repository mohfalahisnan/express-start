import { healthCheckRouter } from "@/common/healthCheck";
import { authMiddleware } from "@/module/auth/authMiddleware";
import { authRouter } from "@/module/auth/authRouter";
import { demoRouter } from "@/module/demo/demoRouter";
import { userRouter } from "@/module/users/userRouter";
import { dynamicRouter } from "@/router/dynamicRouter";
import express, { type Router } from "express";

export const routerV1: Router = express.Router();

routerV1.use("/health-check", healthCheckRouter);
routerV1.use("/demo", demoRouter);

// Dynamic API routes (no auth required for demo purposes)
routerV1.use("/dynamic", dynamicRouter);

// register all routers here
routerV1.use(authMiddleware);
routerV1.use("/auth", authRouter);
routerV1.use("/user", userRouter);
