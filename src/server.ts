import { serve } from '@hono/node-server';
import { config as dotenvConfig } from 'dotenv';
import app from './app';

dotenvConfig();

const port = Number(process.env.PORT) || 8000;

console.log(`🚀 trust engine (Node.js) is running on port ${port}`);

serve({
    fetch: app.fetch,
    port,
});
