import express from 'express'
import { testDatabase } from '../controllers/authControllers';
const auth = express.Router();

auth.use(express.json());

auth.get('/test', testDatabase); // Route for database testing connection

export default auth;