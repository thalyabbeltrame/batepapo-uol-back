import { Router } from 'express';

import { postStatus } from '../controllers/statusController.js';

export const statusRoutes = Router();

statusRoutes.post('/status', postStatus);