declare namespace Express {
	export interface Request {
		user?: string;
		session?: {
			user: {
				id: string;
				name: string;
				emailVerified: boolean;
				email: string;
				createdAt: Date;
				updatedAt: Date;
				image?: string | null | undefined | undefined;
				role: string;
			};
			session: {
				id: string;
				token: string;
				userId: string;
				expiresAt: Date;
				createdAt: Date;
				updatedAt: Date;
				ipAddress?: string | null | undefined;
				userAgent?: string | null | undefined;
			};
		};
	}
}
