import { Router } from 'express';

import { updateStatus } from '../controllers/statusController.js';

export const statusRoutes = Router();

statusRoutes.post('/', updateStatus);