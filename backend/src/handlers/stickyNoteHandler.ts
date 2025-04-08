import { Request, Response } from "express";
import { z } from "zod";
import { CustomError, errorList, statusCode } from "../status";
import {
    CreateStickyNoteSchema,
    DeleteStickyNoteSchema,
    FetchStickyNoteSchema,
    UpdateStickyNoteSchema,
} from "../schema";
import { StickyNote } from "../types";
import pool from "../db";

export const fetchStickyNotesHandler = async (req: Request, res: Response) => {
    const [result] = await pool.query<StickyNote[]>("select * from sticky_notes where is_deleted = 0");

    res.json({
        list: result.map(it => {
            return {
                id: it.id!,
                content: it.content!,
                position_x: it.position_x!,
                position_y: it.position_y!,
                created_at: it.created_at!,
            };
        }),
    } as z.infer<typeof FetchStickyNoteSchema.response>);
};

export const createStickyNotesHandler = async (req: Request, res: Response) => {
    const body = req.body as z.infer<typeof CreateStickyNoteSchema.body>;
    const stickyNote = {
        content: body.content,
        position_x: body.positionX,
        position_y: body.positionY,
    } as StickyNote;

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const [stickyNotes] = await conn.query<StickyNote[]>(
            `
            select *
            from sticky_notes
            where content = ?
                and position_x = ?
                and position_y = ?
                and is_deleted = 0
            `,
            [
                stickyNote.content,
                stickyNote.position_x,
                stickyNote.position_y,
            ],
        );
        if (stickyNotes.length > 0) {
            throw new CustomError(errorList.Error, "already exists");
        }
        await conn.query(
            "insert into sticky_notes(content, position_x, position_y) values (?, ?, ?)",
            [
                stickyNote.content,
                stickyNote.position_x,
                stickyNote.position_y,
            ],
        )
        await conn.commit();

        res.status(statusCode.Created).send();
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

export const updateStickyNotesHandler = async (req: Request, res: Response) => {
    const params = req.params as z.infer<typeof UpdateStickyNoteSchema.params>;
    const body = req.body as z.infer<typeof UpdateStickyNoteSchema.body>;

    await pool.query(
        "update sticky_notes set ? where id = ?",
        [
            {
                content: body.content,
                position_x: body.positionX,
                position_y: body.positionY,
            },
            params.id,
        ]
    );

    res.status(statusCode.NoContent).send();
};

export const deleteStickyNotesHandler = async (req: Request, res: Response) => {
    const params = req.params as z.infer<typeof DeleteStickyNoteSchema.params>;

    await pool.query(
        "update sticky_notes set is_deleted = 1 where id = ?",
        [
            params.id,
        ]
    );

    res.status(statusCode.NoContent).send();
};
