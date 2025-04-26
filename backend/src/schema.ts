import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { statusCode } from "./status";

extendZodWithOpenApi(z);

export type SchemaType = {
    params: z.ZodObject<any>;
    body: z.ZodObject<any>;
    response: z.ZodTypeAny;
};

export type Method = "get" | "post" | "put" | "delete";

export const FetchStickyNoteSchema: SchemaType = {
    params: z.object({
        tagId: z.string().nullish(),
    }),
    body: z.object({}),
    response: z.object({
        meta: z.object({
            count: z.number(),
        }),
        list: z.array(z.object({
            id: z.number(),
            content: z.string(),
            positionX: z.number(),
            positionY: z.number(),
            createdAt: z.date(),
            tag: z.object({
                id: z.number().nullable(),
                name: z.string().nullable(),
            }).nullable(),
        })),
    }),
} as const;

export const CreateStickyNoteSchema: SchemaType = {
    params: z.object({}),
    body: z.object({
        content: z.string(),
        positionX: z.number(),
        positionY: z.number(),
        tagName: z.string().nullish(),
    }),
    response: z.object({
        id: z.number(),
    }),
} as const;

export const UpdateStickyNoteSchema: SchemaType = {
    params: z.object({
        id: z.string(),
    }),
    body: z.object({
        content: z.string(),
        positionX: z.number(),
        positionY: z.number(),
        tagName: z.string().nullish(),
    }),
    response: z.object({}),
} as const;

export const DeleteStickyNoteSchema: SchemaType = {
    params: z.object({
        id: z.string(),
    }),
    body: z.object({}),
    response: z.object({}),
} as const;

export type SchemaObjectType = {
    method: Method;
    path: string;
    schema: SchemaType;
    statusCode: 200 | 201 | 204;
};

export const openAPISchemas: SchemaObjectType[] = [
    {
        method: "get",
        path: "/sticky-notes",
        schema: FetchStickyNoteSchema,
        statusCode: statusCode.OK,
    },
    {
        method: "post",
        path: "/sticky-notes",
        schema: CreateStickyNoteSchema,
        statusCode: statusCode.Created,
    },
    {
        method: "put",
        path: "/sticky-notes/{id}",
        schema: UpdateStickyNoteSchema,
        statusCode: statusCode.NoContent,
    },
    {
        method: "delete",
        path: "/sticky-notes/{id}",
        schema: DeleteStickyNoteSchema,
        statusCode: statusCode.NoContent,
    },
];
