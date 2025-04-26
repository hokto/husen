import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { statusCode } from "./status";

extendZodWithOpenApi(z);



export type SchemaType<
    Params extends z.ZodTypeAny = z.ZodUnknown,
    Query extends z.ZodTypeAny = z.ZodUnknown,
    Body extends z.ZodTypeAny = z.ZodUnknown,
    Response extends z.ZodTypeAny = z.ZodUnknown,
> = {
    params: Params;
    query: Query;
    body: Body;
    response: Response;
};

const defineSchema = <Params extends z.ZodTypeAny, Query extends z.ZodTypeAny, Body extends z.ZodTypeAny, Response extends z.ZodTypeAny>(
    schema: SchemaType<Params, Query, Body, Response>
) => {
    return schema;
}

export type Method = "get" | "post" | "put" | "delete";

export const FetchStickyNoteSchema = defineSchema({
    params: z.object({}),
    query: z.object({
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
            }),
        })),
    }),
});

export const CreateStickyNoteSchema = defineSchema({
    params: z.object({}),
    query: z.object({}),
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

export const UpdateStickyNoteSchema = defineSchema({
    params: z.object({
        id: z.string(),
    }),
    query: z.object({}),
    body: z.object({
        content: z.string(),
        positionX: z.number(),
        positionY: z.number(),
        tagName: z.string().nullish(),
    }),
    response: z.object({}),
});

export const DeleteStickyNoteSchema = defineSchema({
    params: z.object({
        id: z.string(),
    }),
    query: z.object({}),
    body: z.object({}),
    response: z.object({}),
});

export type SchemaObjectType <
    Params extends z.ZodTypeAny = z.ZodUnknown,
    Query extends z.ZodTypeAny = z.ZodUnknown,
    Body extends z.ZodTypeAny = z.ZodUnknown,
    Response extends z.ZodTypeAny = z.ZodUnknown,
> = {
    method: Method;
    path: string;
    schema: SchemaType<Params, Query, Body, Response>;
    statusCode: 200 | 201 | 204;
};

export const openAPISchemas = [
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
] as const satisfies readonly SchemaObjectType<any, any, any, any>[];
