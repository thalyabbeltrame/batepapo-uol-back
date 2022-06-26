import { Router } from 'express';

import { insertParticipant, getParticipants } from '../controllers/participantsController.js';

export const participantsRoutes = Router();

participantsRoutes.post('/', insertParticipant);
participantsRoutes.get('/', getParticipants);