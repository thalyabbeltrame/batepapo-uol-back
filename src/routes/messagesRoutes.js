import { Router } from 'express';

import { postMessage, getMessage, deleteMessage, putMessage } from '../controllers/messagesController.js';

export const messagesRoutes = Router();

messagesRoutes.post('/messages', postMessage);
messagesRoutes.get('/messages', getMessage);
messagesRoutes.delete('/messages/:messageId', deleteMessage);
messagesRoutes.put('/messages/:messageId', putMessage);