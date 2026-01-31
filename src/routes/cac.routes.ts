import { Hono } from 'hono';
import { verifyCac } from '../controllers/cac.controller';
import { apiKeyAuth } from '../middleware/auth.middleware';

const cacRoutes = new Hono();

cacRoutes.post('/verify', apiKeyAuth, verifyCac);

export default cacRoutes;
