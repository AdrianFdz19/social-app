import express from 'express'
import { handleGetChatInfo } from '../controllers/chatControllers.js';
import { authMiddleware } from '../middlewares/authMiddlewares.js';

const chat = express.Router();

chat.get('/', (req, res) => res.json({message: 'chats'}));

/* Recibir la informacion del chat seleccionado */
chat.get('/open/:targetId', authMiddleware, handleGetChatInfo);

export default chat;