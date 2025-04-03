import { RowDataPacket } from "mysql2";

export interface sticky_notes extends RowDataPacket {
    id: number,
    content: string,
    position_x: number,
    position_y: number,
    is_deleted: boolean,
    created_at: Date,
};
