import { UserService, userService } from "@/module/users/userService";
import type { Request, RequestHandler, Response } from "express";

const userRepository = new UserService();
class UserController {
	public getUsers: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await userService.findAll();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getUser: RequestHandler = async (req: Request, res: Response) => {
		const id = Number.parseInt(req.params.id as string, 10);
		const serviceResponse = await userService.findById(id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const userController = new UserController();
