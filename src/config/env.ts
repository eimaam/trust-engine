export const config = {
    CAC_API_URL: process.env.CAC_API_URL || '',
    CAC_ORIGIN: process.env.CAC_ORIGIN || '',
    CAC_REFERER: process.env.CAC_REFERER || '',
    INTERNAL_API_KEY: process.env.INTERNAL_API_KEY || '',
    NODE_ENV: process.env.NODE_ENV || 'development',
};

// for hono context compatibility if needed in the future
import { Context } from 'hono';
export const getEnv = (c: Context) => {
    return {
        CAC_API_URL: (c.env?.CAC_API_URL as string) || config.CAC_API_URL,
        CAC_ORIGIN: (c.env?.CAC_ORIGIN as string) || config.CAC_ORIGIN,
        CAC_REFERER: (c.env?.CAC_REFERER as string) || config.CAC_REFERER,
        INTERNAL_API_KEY: (c.env?.INTERNAL_API_KEY as string) || config.INTERNAL_API_KEY,
        NODE_ENV: (c.env?.NODE_ENV as string) || config.NODE_ENV,
    };
};
