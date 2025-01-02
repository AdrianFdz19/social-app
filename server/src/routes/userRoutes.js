import express from 'express'
import { allUsers, handleNoReadNotificationsCount, handleSearch, handleUserNotifications, profileInfo } from '../controllers/userControllers.js';
import { authMiddleware } from '../middlewares/authMiddlewares.js';
const users = express.Router();

users.get('/', allUsers);

users.get('/profile/:userId', profileInfo);

users.get(`/notifications`, authMiddleware, handleUserNotifications);

users.get('/notifications/noread', authMiddleware, handleNoReadNotificationsCount);

users.post('/search', handleSearch);

export default users;