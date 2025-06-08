import { authController } from "@/module/auth/authController";

import type { Handler } from "express";

export const post: Handler = authController.refreshToken;
