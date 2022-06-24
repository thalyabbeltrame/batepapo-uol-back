import { Router } from 'express';

import { postMessage, getMessage, deleteMessage, putMessage } from '../controllers/messagesController.js';

export const messagesRoute = Router();

messagesRoute.post('/messages', postMessage);
messagesRoute.get('/messages', getMessage);
messagesRoute.delete('/messages/:messageId', deleteMessage);
messagesRoute.put('/messages/:messageId', putMessage);
