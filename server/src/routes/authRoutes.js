// authRoutes.js

import express from 'express'
import { handleSignIn, handleSignUp, testDatabase, validationRules } from '../controllers/authControllers.js';
const auth = express.Router();

auth.use(express.json());

auth.get('/test', testDatabase); // Route for database testing connection

auth.post('/sign-up', validationRules, handleSignUp); 

auth.post('/sign-in', handleSignIn); 

export default auth;