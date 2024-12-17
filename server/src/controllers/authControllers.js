// authControllers.js

import pool from '../config/databaseConfig.js';
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import {body, validationResult} from 'express-validator'
import { config } from 'dotenv'
config();

export const testDatabase = async (req, res) => {
    const query = await pool.query(`SELECT * FROM NOW()`);
    const data = query.rows[0];
    res.status(200).json(data);
};

export const validationRules = [
    body('username')
        .isLength({ min: 5 }).withMessage('Username must have 5 characters at least.')
        .escape(), 
    
    body('email')
        .isEmail().withMessage('Email must be a valid email address.') // Asegúrate de usar isEmail para validar un correo electrónico
        .normalizeEmail().withMessage('Email must be a valid email address.') 
        .escape(),
    
    body('password')
        .isLength({ min: 5 }).withMessage('Password must have 5 characters at least.') // Corregido el mensaje
        .escape()
];

export const validateToken = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    try {
        const decoded = JWT.verify(token, process.env.SECRET_KEY);
        res.status(200).json({ success: true, user: decoded });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export const refreshToken = (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    try {
        const decoded = JWT.verify(token, process.env.SECRET_KEY, { ignoreExpiration: true });
        const newToken = JWT.sign(
            { id: decoded.id, username: decoded.username },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.status(200).json({ success: true, token: newToken });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

export const handleSignUp = async (req, res) => {
    try {
        // Extraer datos del cuerpo de la solicitud
        const { username, email, password } = req.body;

        // Verificar si hay errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().reduce((acc, error) => {
                acc[error.path] = error.msg;
                return acc;
            }, {});
            console.log(errorMessages);
            return res.status(400).json({ errors: errorMessages });
        }

        // Verificar si el correo electrónico o nombre de usuario ya están registrados
        const isExistingUserQuery = await pool.query(
            `SELECT username, email FROM users WHERE username = $1 OR email = $2`,
            [username, email]
        );
        const isExistingUser = isExistingUserQuery.rows[0];

        if (isExistingUser) {
            // Determinar el campo de conflicto
            const conflictField = isExistingUser.username === username ? 'username' : 'email';
            
            // Enviar una respuesta con el conflicto específico y su mensaje
            return res.status(409).json({
                errors: {
                    [conflictField]: `${conflictField.charAt(0).toUpperCase() + conflictField.slice(1)} is already registered.`
                }
            });
        }        

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario en la base de datos
        const userQuery = await pool.query(
            `INSERT INTO users (username, email, password_hash, is_online) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, username, email, is_online, created_at, updated_at`,
            [username, email, hashedPassword, true]
        );

        const user = userQuery.rows[0];

        // Preparar los datos del usuario
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: '', // Valores predeterminados
            profile_picture_url: '',
            banner_picture_url: '',
            is_online: user.is_online,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };

        // Crear el token JWT
        const token = JWT.sign(userData, process.env.SECRET_KEY, { expiresIn: '1h' }); // Añadir expiración al token

        // Enviar la respuesta al cliente
        res.status(201).json({ message: 'Successfully registered!', token, user: userData });

    } catch (err) {
        console.error('Error in handleSignUp:', err);

        // Enviar un mensaje de error claro al cliente
        res.status(500).json({ message: 'An internal server error occurred. Please try again later.', error: err.message });
    }
};

export const handleSignIn = async (req, res) => {
    try {
        // Extraer datos del cuerpo de la solicitud
        const { username, password } = req.body;

        // Verificar si el correo electrónico o nombre de usuario ya están registrados
        const isExistingUserQuery = await pool.query(
            `SELECT * FROM users WHERE username = $1 OR email = $1`,
            [username]
        );
        const user = isExistingUserQuery.rows[0];

        if (!user) {
            // Enviar una respuesta con un mensaje específico
            return res.status(404).json({
                errors: {
                    username: `The username or email you entered is not registered.`
                }
            });
        }

        // Comprobar la contraseña
        const matchPswd = await bcrypt.compare(password, user.password_hash);

        if (!matchPswd) {
            return res.status(401).json({
                errors: {
                    password: `The password you entered is incorrect.`
                }
            });
        }

        // Preparar los datos del usuario
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio, 
            profile_picture_url: user.profile_picture_url,
            banner_picture_url: user.banner_picture_url,
            is_online: user.is_online,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };

        // Crear el token JWT
        const token = JWT.sign(userData, process.env.SECRET_KEY, { expiresIn: '1h' });

        // Enviar la respuesta al cliente
        res.status(200).json({ message: 'You have successfully signed in!', token, user: userData });

    } catch (err) {
        console.error('Error in handleSignIn:', err);

        // Enviar un mensaje de error genérico para problemas inesperados
        res.status(500).json({
            message: 'Something went wrong on our end. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined // Mostrar detalles solo en desarrollo
        });
    }
};
