import { RowDataPacket } from "mysql2";

export interface StickyNote extends RowDataPacket {
    id?: number,
    content: string,
    position_x: number,
    position_y: number,
    is_deleted?: boolean,
    created_at?: Date,
};

export interface StickyNoteTag extends RowDataPacket {
    id?: number,
    stiky_note_id: number,
    tag_id: number,
    created_at?: Date,
};

export interface Tag extends RowDataPacket {
    id?: number,
    name: string,
    created_at?: Date,
};

export interface ErrorInfo {
    code: number;
    statusCode: number;
    message: string;
};
