import { Router, Request, Response } from "express";
import pool from './db';
import { sticky_notes } from './types';


const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.json("OK");
});

router.post('/', (req: Request, res: Response) => {
    res.status(201).send();
});

router.put('/:id', (req: Request, res: Response) => {
    res.status(204).send();
});

router.delete('/:id', (req: Request, res: Response) => {
    res.status(204).send();
});

export default router;
