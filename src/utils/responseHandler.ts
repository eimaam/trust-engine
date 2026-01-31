import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';

export interface ISuccessResponse {
    c: Context;
    message: string;
    data?: any;
    meta?: {
        [key: string]: any;
    }
}

interface IErrorResponse {
    c: Context;
    message: string;
    error?: any;
    status?: ContentfulStatusCode;
    code?: string;
}

export const sendResponse = (
    c: Context,
    message: string,
    data: any = null,
    status: ContentfulStatusCode = 200,
    code?: string
) => {
    return c.json(
        {
            success: status >= 200 && status < 300,
            message,
            data,
            code,
        },
        status
    );
};

export const sendSuccess = ({
    c,
    message,
    data,
}: ISuccessResponse) => {
    return c.json(
        {
            success: true,
            message,
            data,
        },
        200
    );
};

export const sendError = ({
    c,
    message,
    status = 500,
    error,
    code
}: IErrorResponse) => {
    return c.json(
        {
            success: false,
            message,
            error: process.env.NODE_ENV !== 'production' ? error : undefined,
            code,
        },
        status
    );
};

export const responseHandler = {
    badRequest: (c: Context, message: string, error?: any, code?: string) => {
        return sendError({ c, message, status: 400, error, code });
    },
    unauthorized: (c: Context, message: string, error?: any, code?: string) => {
        return sendError({ c, message, status: 401, error, code });
    },
    forbidden: (c: Context, message: string, error?: any, code?: string) => {
        return sendError({ c, message, status: 403, error, code });
    },
    notFound: (c: Context, message: string, error?: any, code?: string) => {
        return sendError({ c, message, status: 404, error, code });
    },
    conflict: (c: Context, message: string, error?: any, code?: string) => {
        return sendError({ c, message, status: 409, error, code });
    },
    tooManyRequests: (c: Context, message: string, error?: any, code?: string) => {
        return sendError({ c, message, status: 429, error, code });
    },
    internalServerError: (c: Context, message: string, error?: any, code?: string) => {
        return sendError({ c, message, status: 500, error, code });
    },
};
