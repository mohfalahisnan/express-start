import { authRouter } from "@/module/auth/authRouter";
import { userRouter } from "@/module/users/userRouter";
import express, { type Router } from "express";

export const routerV1: Router = express.Router();

routerV1.use("/auth", authRouter);
routerV1.use("/user", userRouter);
