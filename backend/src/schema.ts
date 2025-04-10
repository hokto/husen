import { z } from "zod";

export const FetchStickyNoteSchema = {
    response: z.object({
        list: z.array(z.object({
            id: z.number(),
            content: z.string(),
            positionX: z.number(),
            positionY: z.number(),
            createdAt: z.date(),
        })),
    }),
} as const;

export const CreateStickyNoteSchema = {
    body: z.object({
        content: z.string(),
        positionX: z.number(),
        positionY: z.number(),
    }),
} as const;

export const UpdateStickyNoteSchema = {
    params: z.object({
        id: z.string(),
    }),
    body: z.object({
        content: z.string(),
        positionX: z.number(),
        positionY: z.number(),
    }),
} as const;

export const DeleteStickyNoteSchema = {
    params: z.object({
        id: z.string(),
    }),
} as const;
