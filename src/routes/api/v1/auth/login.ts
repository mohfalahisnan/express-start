import { validateRequest } from "@/common/utils/httpHandlers";
import { authController } from "@/module/auth/authController";
import { postLoginSchema } from "@/module/auth/authModel";
import type { Handler } from "express";

export const post: Handler[] = [validateRequest(postLoginSchema), authController.login];
