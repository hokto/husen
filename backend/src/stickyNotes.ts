import { Router, Request, Response } from "express";
import { StatusInfo } from "./status";


const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.json("OK");
});

router.post('/', (req: Request, res: Response) => {
    res.status(StatusInfo.Created.statusCode).send();
});

router.put('/:id', (req: Request, res: Response) => {
    res.status(StatusInfo.NoContent.statusCode).send();
});

router.delete('/:id', (req: Request, res: Response) => {
    res.status(StatusInfo.NoContent.statusCode).send();
});

export default router;
