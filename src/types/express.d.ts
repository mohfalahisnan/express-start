declare namespace Express {
	export interface Request {
		user?: string;
		session?: {
			user: any;
			session: any;
		};
	}
}
