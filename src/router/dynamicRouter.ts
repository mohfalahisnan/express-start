import { logger } from "@/common/logger";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import config, { type ModelName } from "@/config";
import { type NextFunction, type Request, type Response, Router } from "express";

// Middleware to validate model exists
const validateModel = (req: Request, res: Response, next: NextFunction) => {
	const { MODEL_REGISTRY } = config;
	const { model } = req.params;

	if (!MODEL_REGISTRY[model as ModelName]) {
		const serviceResponse = ServiceResponse.failure(`Model '${model}' not found`, null, 404);
		handleServiceResponse(serviceResponse, res);
		return;
	}

	// Attach model config to request
	req.modelConfig = MODEL_REGISTRY[model as ModelName];
	req.modelName = model;
	next();
};

// Extend Request interface
declare global {
	namespace Express {
		interface Request {
			modelConfig?: (typeof config.MODEL_REGISTRY)[ModelName];
			modelName?: string;
		}
	}
}

export const dynamicRouter = Router();

/**
 * GET /v1/dynamic/:model
 * Get all records for a model with optional filtering and pagination
 */
dynamicRouter.get("/:model", validateModel, async (req: Request, res: Response) => {
	try {
		const { modelConfig, modelName } = req;
		const { page = 1, limit = 10, ...filters } = req.query;

		if (!modelConfig) {
			const serviceResponse = ServiceResponse.failure("Model configuration not found", null, 500);
			handleServiceResponse(serviceResponse, res);
			return;
		}

		// Parse pagination
		const pageNum = Number.parseInt(page as string, 10);
		const limitNum = Number.parseInt(limit as string, 10);
		const offset = (pageNum - 1) * limitNum;

		// Build query options
		const options: any = {
			limit: limitNum,
			offset: offset,
		};

		// Add filters if provided
		if (Object.keys(filters).length > 0) {
			options.where = filters;
		}

		const data = await modelConfig.service.find(options);

		const serviceResponse = ServiceResponse.success(`${modelName} retrieved successfully`, {
			data,
			pagination: {
				page: pageNum,
				limit: limitNum,
				total: data.length,
			},
		});

		handleServiceResponse(serviceResponse, res);
	} catch (error) {
		logger.error(`Error getting ${req.modelName}:`, error);
		const serviceResponse = ServiceResponse.failure("An error occurred while retrieving records", null, 500);
		handleServiceResponse(serviceResponse, res);
	}
});

/**
 * POST /v1/dynamic/:model
 * Create a new record for a model
 */
dynamicRouter.post("/:model", validateModel, async (req: Request, res: Response) => {
	try {
		const { modelConfig, modelName } = req;

		if (!modelConfig) {
			const serviceResponse = ServiceResponse.failure("Model configuration not found", null, 500);
			handleServiceResponse(serviceResponse, res);
			return;
		}

		// Validate request body
		const validationResult = modelConfig.createSchema.safeParse(req.body);

		if (!validationResult.success) {
			const serviceResponse = ServiceResponse.failure("Invalid request data", validationResult.error.errors, 400);
			handleServiceResponse(serviceResponse, res);
			return;
		}

		const data = await modelConfig.service.create(validationResult.data);

		const serviceResponse = ServiceResponse.success(`${modelName} created successfully`, data, 201);

		handleServiceResponse(serviceResponse, res);
	} catch (error) {
		logger.error(`Error creating ${req.modelName}:`, error);
		const serviceResponse = ServiceResponse.failure("An error occurred while creating the record", null, 500);
		handleServiceResponse(serviceResponse, res);
	}
});

/**
 * GET /v1/dynamic/:model/:id
 * Get a specific record by ID
 */
dynamicRouter.get("/:model/:id", validateModel, async (req: Request, res: Response) => {
	try {
		const { modelConfig, modelName } = req;
		const { id } = req.params;

		if (!modelConfig) {
			const serviceResponse = ServiceResponse.failure("Model configuration not found", null, 500);
			handleServiceResponse(serviceResponse, res);
			return;
		}

		const data = await modelConfig.service.findById(id);

		if (!data) {
			const serviceResponse = ServiceResponse.failure(`${modelName} not found`, null, 404);
			handleServiceResponse(serviceResponse, res);
			return;
		}

		const serviceResponse = ServiceResponse.success(`${modelName} retrieved successfully`, data);

		handleServiceResponse(serviceResponse, res);
	} catch (error) {
		logger.error(`Error getting ${req.modelName} by ID:`, error);
		const serviceResponse = ServiceResponse.failure("An error occurred while retrieving the record", null, 500);
		handleServiceResponse(serviceResponse, res);
	}
});

/**
 * PUT /v1/dynamic/:model/:id
 * Update a specific record by ID (full update)
 */
dynamicRouter.put("/:model/:id", validateModel, async (req: Request, res: Response) => {
	try {
		const { modelConfig, modelName } = req;
		const { id } = req.params;

		if (!modelConfig) {
			const serviceResponse = ServiceResponse.failure("Model configuration not found", null, 500);
			handleServiceResponse(serviceResponse, res);
			return;
		}

		// Validate request body
		const validationResult = modelConfig.updateSchema.safeParse(req.body);

		if (!validationResult.success) {
			const serviceResponse = ServiceResponse.failure("Invalid request data", validationResult.error.errors, 400);
			handleServiceResponse(serviceResponse, res);
			return;
		}

		// Check if record exists
		const existingRecord = await modelConfig.service.findById(id);
		if (!existingRecord) {
			const serviceResponse = ServiceResponse.failure(`${modelName} not found`, null, 404);
			handleServiceResponse(serviceResponse, res);
			return;
		}

		const data = await modelConfig.service.update(id, validationResult.data);

		const serviceResponse = ServiceResponse.success(`${modelName} updated successfully`, data);

		handleServiceResponse(serviceResponse, res);
	} catch (error) {
		logger.error(`Error updating ${req.modelName}:`, error);
		const serviceResponse = ServiceResponse.failure("An error occurred while updating the record", null, 500);
		handleServiceResponse(serviceResponse, res);
	}
});

/**
 * PATCH /v1/dynamic/:model/:id
 * Partially update a specific record by ID
 */
dynamicRouter.patch("/:model/:id", validateModel, async (req: Request, res: Response) => {
	try {
		const { modelConfig, modelName } = req;
		const { id } = req.params;

		if (!modelConfig) {
			const serviceResponse = ServiceResponse.failure("Model configuration not found", null, 500);
			handleServiceResponse(serviceResponse, res);
			return;
		}

		// Validate request body (partial update)
		const validationResult = modelConfig.updateSchema.partial().safeParse(req.body);

		if (!validationResult.success) {
			const serviceResponse = ServiceResponse.failure("Invalid request data", validationResult.error.errors, 400);
			handleServiceResponse(serviceResponse, res);
			return;
		}

		// Check if record exists
		const existingRecord = await modelConfig.service.findById(id);
		if (!existingRecord) {
			const serviceResponse = ServiceResponse.failure(`${modelName} not found`, null, 404);
			handleServiceResponse(serviceResponse, res);
			return;
		}

		const data = await modelConfig.service.update(id, validationResult.data);

		const serviceResponse = ServiceResponse.success(`${modelName} updated successfully`, data);

		handleServiceResponse(serviceResponse, res);
	} catch (error) {
		logger.error(`Error updating ${req.modelName}:`, error);
		const serviceResponse = ServiceResponse.failure("An error occurred while updating the record", null, 500);
		handleServiceResponse(serviceResponse, res);
	}
});

/**
 * DELETE /v1/dynamic/:model/:id
 * Delete a specific record by ID
 */
dynamicRouter.delete("/:model/:id", validateModel, async (req: Request, res: Response) => {
	try {
		const { modelConfig, modelName } = req;
		const { id } = req.params;

		if (!modelConfig) {
			const serviceResponse = ServiceResponse.failure("Model configuration not found", null, 500);
			handleServiceResponse(serviceResponse, res);
			return;
		}

		// Check if record exists
		const existingRecord = await modelConfig.service.findById(id);
		if (!existingRecord) {
			const serviceResponse = ServiceResponse.failure(`${modelName} not found`, null, 404);
			handleServiceResponse(serviceResponse, res);
			return;
		}

		const data = await modelConfig.service.delete(id);

		const serviceResponse = ServiceResponse.success(`${modelName} deleted successfully`, data);

		handleServiceResponse(serviceResponse, res);
	} catch (error) {
		logger.error(`Error deleting ${req.modelName}:`, error);
		const serviceResponse = ServiceResponse.failure("An error occurred while deleting the record", null, 500);
		handleServiceResponse(serviceResponse, res);
	}
});

/**
 * Get list of available models
 */
export function getAvailableModels(): string[] {
	return Object.keys(config.MODEL_REGISTRY);
}

/**
 * Health check endpoint for dynamic routes
 */
dynamicRouter.get("/health", (_req: Request, res: Response) => {
	const serviceResponse = ServiceResponse.success("Dynamic API is running", {
		availableModels: getAvailableModels(),
		endpoints: {
			"GET /v1/dynamic/:model": "Get all records with optional filtering and pagination",
			"POST /v1/dynamic/:model": "Create a new record",
			"GET /v1/dynamic/:model/:id": "Get a specific record by ID",
			"PUT /v1/dynamic/:model/:id": "Update a record (full update)",
			"PATCH /v1/dynamic/:model/:id": "Partially update a record",
			"DELETE /v1/dynamic/:model/:id": "Delete a record by ID",
		},
	});

	handleServiceResponse(serviceResponse, res);
});
