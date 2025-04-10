import { NextFunction, Request, Response } from "express";
import { CustomError, errorList } from "../status";

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            code: err.code,
            statusCode: err.statusCode,
            message: err.message,
            detail: err.detail,
        });
    }

    if (process.env.ENV === "development") {
        console.error(err);
    }

    const fallback = errorList.InternalServerError;
    return res.status(fallback.statusCode).json({
        code: fallback.code,
        statusCode: fallback.statusCode,
        message: fallback.message,
    });
};
