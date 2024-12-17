// postRoutes.js

import express from 'express'
import { authMiddleware } from '../middlewares/authMiddlewares.js';
import { handleCreatePost, handlePostReaction } from '../controllers/postControllers.js';
const posts = express.Router();

posts.use(authMiddleware);

posts.post('/', handleCreatePost);

posts.post('/:postId/reactions', handlePostReaction);

export default posts;