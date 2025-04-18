import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { openAPISchemas } from "./schema";

const registry = new OpenAPIRegistry();
openAPISchemas.forEach(({ method, path, schema, statusCode }) => {
    registry.registerPath({
        method,
        path,
        operationId: `${method}_${path.replace(/\//g, "_")}`,
        summary: `Operation for ${method} ${path}`,
        request: {
            params: schema.params.openapi({}),
            body: {
                content: {
                    "application/json": {
                        schema: schema.body.openapi({}),
                    }
                }
            },
        },
        responses: {
            [statusCode || "200"]: {
                description: "Success",
                content: {
                    "application/json": {
                        schema: schema.response.openapi({}),
                    },
                },
            },
        },
    })
});

const generator = new OpenApiGeneratorV3(registry.definitions);
export const openApiDocument = generator.generateDocument({
    info: {
      title: "Sticky Notes API",
      version: "1.0.0",
    },
    openapi: '3.0.0',
    servers: [
        {
            "url": "http://localhost:3001/api/v1",
        },
    ],
});
