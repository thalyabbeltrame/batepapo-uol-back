import { Router } from 'express';

import { postParticipant, getParticipants } from '../controllers/participantsController.js';

export const participantsRoute = Router();

participantsRoute.post('/participants', postParticipant);
participantsRoute.get('/participants', getParticipants);

