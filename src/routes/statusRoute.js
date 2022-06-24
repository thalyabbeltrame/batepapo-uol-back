import { Router } from 'express';

import { postStatus } from '../controllers/statusController.js';

export const statusRoute = Router();

statusRoute.post('/status', postStatus);

