import { Request, Response, NextFunction, RequestHandler } from "express";

export const loggerHandler = async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.ENV === "development") {
        console.log({
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params,
            body: req.body,
        });
    }
    next();
};

export const requestHandlerWrapper = (
    handler: (req: Request, res: Response, next?: NextFunction) => Promise<any>
): RequestHandler => (req, res, next) => {
    handler(req, res, next).catch(next);
};

