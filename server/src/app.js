// app.js

import express from 'express'
import cors from 'cors'
import auth from './routes/authRoutes.js';
import users from './routes/userRoutes.js';
import posts from './routes/postRoutes.js';
import media from './routes/mediaRoutes.js';
import chat from './routes/chatRoutes.js';
const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', auth);
app.use('/users', users);
app.use('/posts', posts);
app.use('/media', media);
app.use('/chats', chat);

app.get('/', (req,res) => res.send('Server is online'));

export default app;