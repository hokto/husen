import { ErrorInfo } from "./types";

export class CustomError extends Error {
    code: number;
    statusCode: number;
    detail?: object | string;

    constructor(errorInfo: ErrorInfo, detail?: object | string) {
        super(errorInfo.message ?? "Error");
        this.code = errorInfo.code;
        this.statusCode = errorInfo.statusCode;
        this.detail = detail;
    };
};

export const errorList = {
    Error: {
        code: 400001,
        statusCode: 400,
        message: "Error",
    },
    NotFound: {
        code: 404001,
        statusCode: 404,
        message: "Not Found",
    },
    InternalServerError: {
        code: 500001,
        statusCode: 500,
        message: "Internal Server Error",
    },
} as const satisfies Record<string, ErrorInfo>;

export const statusCode = {
    OK: 200,
    Created: 201,
    NoContent: 204,
} as const;
