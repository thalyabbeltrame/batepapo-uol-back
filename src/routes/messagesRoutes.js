import { Router } from 'express';

import { insertMessage, getMessages, deleteMessage, updateMessage } from '../controllers/messagesController.js';

export const messagesRoutes = Router();

messagesRoutes.post('/', insertMessage);
messagesRoutes.get('/', getMessages);
messagesRoutes.delete('/:messageId', deleteMessage);
messagesRoutes.put('/:messageId', updateMessage);