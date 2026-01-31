import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { config } from 'dotenv';
import cacRoutes from './routes/cac.routes';
import { sendError } from './utils/responseHandler';

config();

const app = new Hono();

// Global Middleware
app.use('*', logger());
app.use('*', cors());

// Error Handling
app.onError((err, c) => {
    console.error('Global Error:', err);
    return sendError({
        c,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : undefined,
    });
});

// Health Check
app.get('/health', (c) => {
    return c.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'trust-engine'
    });
});

// Routes
app.route('/api/v1/cac', cacRoutes);

const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Trust Engine is running on port ${port}`);

serve({
    fetch: app.fetch,
    port,
});
