import { Context, Next } from 'hono';

export const apiKeyAuth = async (c: Context, next: Next) => {
    const apiKey = c.req.header('X-API-KEY');

    // Placeholder for internal testing. In production, this would check against a DB.
    const VALID_API_KEY = process.env.INTERNAL_API_KEY || 'trust-engine-internal-secret';

    if (!apiKey || apiKey !== VALID_API_KEY) {
        return c.json({
            success: false,
            message: 'Unauthorized: Invalid or missing API key',
        }, 401);
    }

    await next();
};
