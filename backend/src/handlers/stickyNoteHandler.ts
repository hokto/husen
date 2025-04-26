import { Request, Response } from "express";
import { z } from "zod";
import { CustomError, errorList, statusCode } from "../status";
import {
    CreateStickyNoteSchema,
    DeleteStickyNoteSchema,
    FetchStickyNoteSchema,
    UpdateStickyNoteSchema,
} from "../schema";
import { StickyNote, StickyNoteTag, Tag } from "../types";
import pool from "../db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const fetchStickyNotesHandler = async (req: Request, res: Response) => {
    const query = req.query as z.infer<typeof FetchStickyNoteSchema.query>;
    const tagId = query.tagId;
    const [result] = await pool.query<{
        sticky_notes: StickyNote;
        sticky_note_tags: StickyNoteTag;
        tags: Tag;
    }[] & RowDataPacket[]>(
        {
            sql: `
                select * from sticky_notes
                  left outer join sticky_note_tags on sticky_notes.id = sticky_note_tags.sticky_note_id
                  left outer join tags on sticky_note_tags.tag_id = tags.id
                where is_deleted = 0
                  and sticky_note_tags.tag_id = ? or 1 = ?
            `,
            nestTables: true,
        },
        [
            tagId ?? null,
            !tagId,
        ]
    );

    res.json({
        meta: {
            count: result.length,
        },
        list: result.map(it => {
            return {
                id: it.sticky_notes.id,
                content: it.sticky_notes.content!,
                positionX: it.sticky_notes.position_x!,
                positionY: it.sticky_notes.position_y!,
                createdAt: it.sticky_notes.created_at!,
                tag: {
                    id: it.tags.id,
                    name: it.tags.name,
                },
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
    const tag = {
        name: body.tagName,
    } as Tag;

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
        const [insertedStickyNote] = await conn.query<ResultSetHeader>(
            "insert into sticky_notes(content, position_x, position_y) values (?, ?, ?) on duplicate key update id = LAST_INSERT_ID(id)",
            [
                stickyNote.content,
                stickyNote.position_x,
                stickyNote.position_y,
            ],
        )
        if (tag.name) {
            const [insertedTag] = await conn.query<ResultSetHeader>(
                "insert into tags(name) values (?) on duplicate key update id = LAST_INSERT_ID(id)",
                [ tag.name, ]
            );
            await conn.query(
                "insert into sticky_note_tags(sticky_note_id, tag_id) values (?, ?) on duplicate key update id = LAST_INSERT_ID(id), tag_id = values(tag_id)",
                [
                    insertedStickyNote.insertId,
                    insertedTag.insertId,
                ]
            )
        }
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }

    res.status(statusCode.Created).send();
};

export const updateStickyNotesHandler = async (req: Request, res: Response) => {
    const params = req.params as z.infer<typeof UpdateStickyNoteSchema.params>;
    const body = req.body as z.infer<typeof UpdateStickyNoteSchema.body>;
    const stickyNoteId = params.id;
    const tag = {
        name: body.tagName,
    } as Tag;

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        await conn.query(
            "update sticky_notes set ? where id = ?",
            [
                {
                    content: body.content,
                    position_x: body.positionX,
                    position_y: body.positionY,
                },
                stickyNoteId,
            ]
        );
        if (tag.name) {
            const [insertedTag] = await conn.query<ResultSetHeader>(
                "insert into tags(name) values (?) on duplicate key update id = LAST_INSERT_ID(id)",
                [ tag.name, ]
            );
            await conn.query(
                "insert into sticky_note_tags(sticky_note_id, tag_id) values (?, ?) on duplicate key update id = LAST_INSERT_ID(id), tag_id = values(tag_id)",
                [
                    stickyNoteId,
                    insertedTag.insertId,
                ]
            )
        }
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }

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
