import { Router } from "express";
import { requestHandlerWrapper } from "../handlers/requestHandler";
import { createStickyNotesHandler, deleteStickyNotesHandler, fetchStickyNotesHandler, updateStickyNotesHandler } from "../handlers/stickyNoteHandler";

const stickyNoteRouter = Router()
stickyNoteRouter.get('/', requestHandlerWrapper(fetchStickyNotesHandler));
stickyNoteRouter.post('/', requestHandlerWrapper(createStickyNotesHandler));
stickyNoteRouter.put('/:id', requestHandlerWrapper(updateStickyNotesHandler));
stickyNoteRouter.delete('/:id', requestHandlerWrapper(deleteStickyNotesHandler));

export default stickyNoteRouter;
