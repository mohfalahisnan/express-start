import { z } from "zod";

const MODELS = ["user", "product", "order", "inventory"] as const;
const ACTIONS = ["create", "read", "update", "delete"] as const;

type Model = (typeof MODELS)[number];
type Action = (typeof ACTIONS)[number];

export type Permission = `${Model}:${Action}`;

export const PERMISSIONS = MODELS.flatMap((model) =>
	ACTIONS.map((action) => `${model}:${action}` as const),
) as Permission[];

export const PermissionSchema = z.enum(PERMISSIONS as [Permission, ...Permission[]]);
