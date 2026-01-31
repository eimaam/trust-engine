import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import cacRoutes from './routes/cac.routes';
import { sendError } from './utils/responseHandler';

type Bindings = {
    INTERNAL_API_KEY: string;
    NODE_ENV: string;
};

export const app = new Hono<{ Bindings: Bindings }>();

// global middleware
app.use('*', honoLogger());

// configure cors
app.use('*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'X-API-KEY'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
}));

// error handling
app.onError((err, c) => {
    console.error('Global Error:', err);
    return sendError({
        c,
        message: err.message || 'Internal Server Error',
        error: (c.env?.NODE_ENV as string || process.env?.NODE_ENV) !== 'production' ? err : undefined,
    });
});

// health check
app.get('/health', (c) => {
    return c.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'trust-engine'
    });
});

// routes
app.route('/api/v1/cac', cacRoutes);

export default app;
