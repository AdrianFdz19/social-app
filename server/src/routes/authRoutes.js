// authRoutes.js

import express from 'express'
import { handleSignIn, handleSignUp, refreshToken, testDatabase, validateToken, validationRules } from '../controllers/authControllers.js';
const auth = express.Router();

auth.use(express.json());

auth.get('/validate', validateToken);

auth.post('/refresh', refreshToken);

auth.get('/test', testDatabase); // Route for database testing connection

auth.post('/sign-up', validationRules, handleSignUp); 

auth.post('/sign-in', handleSignIn); 

export default auth;