import { userService } from "@/module/users/userService";
import type { Request, RequestHandler, Response } from "express";

class UserController {
	public getUsers: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await userService.findAll();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getUser: RequestHandler = async (req: Request, res: Response) => {
		const id = req.params.id;
		const serviceResponse = await userService.findById(id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public createUser: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await userService.create(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const userController = new UserController();
