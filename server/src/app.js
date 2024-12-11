import express from 'express'
import cors from 'cors'
import auth from './routes/authRoutes.js';
const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', auth);

app.get('/', (req,res) => res.send('Server is online'));

export default app;