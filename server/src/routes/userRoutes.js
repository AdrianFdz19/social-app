import express from 'express'
import { allUsers, profileInfo } from '../controllers/userControllers.js';
const users = express.Router();

users.get('/', allUsers);

users.get('/profile/:userId', profileInfo);

export default users;