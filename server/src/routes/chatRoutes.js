import express from 'express'
import { handleGetChatInfo, handleGetChats, handleGetCurrentChat, handleSendMessage } from '../controllers/chatControllers.js';
import { authMiddleware } from '../middlewares/authMiddlewares.js';

const chat = express.Router();

/* Recibir la informacion del chat seleccionado */
chat.get('/open/:targetId', authMiddleware, handleGetChatInfo);

chat.get('/current/:currentChatId', authMiddleware, handleGetCurrentChat);

chat.get('/', authMiddleware, handleGetChats);

chat.post('/message', authMiddleware, handleSendMessage);

export default chat;