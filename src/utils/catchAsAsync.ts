import { Context } from 'hono';
import { sendError } from './responseHandler';

export type ControllerHandler = (c: Context) => Promise<Response | void> | Response | void;

export const catchAsync = (handler: ControllerHandler) => {
    return async (c: Context) => {
        try {
            const response = await handler(c);
            return response;
        } catch (error: any) {
            console.error('Controller Error:', error);

            if (error.name === 'ZodError') {
                return sendError({
                    c,
                    message: 'Validation failed',
                    error: error.issues || error.errors || error,
                    status: 400
                });
            }

            return sendError({
                c,
                message: error.message || 'Internal Server Error',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    };
};
