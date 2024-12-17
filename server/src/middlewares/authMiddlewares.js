// authMiddlewares.js

import JWT from 'jsonwebtoken';
import { config } from 'dotenv';
config();

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'No token provided',
        });
    }

    const token = authHeader.split(' ')[1];
    const secretKey = process.env.SECRET_KEY;

    if (!secretKey) {
        console.error('SECRET_KEY not defined in environment variables');
        return res.status(500).json({
            success: false,
            message: 'Internal server error: Missing SECRET_KEY',
        });
    }

    JWT.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }

        req.user = decoded; // Asigna los datos del token al objeto req
        next();
    });
};