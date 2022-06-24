import { Router } from 'express';

import { postParticipant, getParticipants } from '../controllers/participantsController.js';

export const participantsRoutes = Router();

participantsRoutes.post('/participants', postParticipant);
participantsRoutes.get('/participants', getParticipants);