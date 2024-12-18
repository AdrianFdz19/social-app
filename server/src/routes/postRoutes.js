// postRoutes.js

import express from 'express'
import { authMiddleware } from '../middlewares/authMiddlewares.js';
import { handleCreatePost, handleFeedPosts, handlePostReaction } from '../controllers/postControllers.js';
const posts = express.Router();

posts.use(authMiddleware);

posts.post('/', handleCreatePost);

posts.get('/', handleFeedPosts);

posts.post('/:postId/reactions', handlePostReaction);

export default posts;