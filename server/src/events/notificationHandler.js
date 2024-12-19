// notificationHandler.js

import pool from "../config/databaseConfig.js";
import { io } from "../server.js";
import { socketByUserId } from "./socketHandlers.js";

export async function handleNotification(type, senderId, recipientId, relatedPostId = null, relatedCommentId = null, reactionType = null) {
    try {
        // 1. Recuperar datos del usuario destinatario
        const recipientDataQuery = await pool.query(
            `SELECT id, username, profile_picture_url, is_online FROM users WHERE id = $1`,
            [recipientId]
        );
        const recipientUser = recipientDataQuery.rows[0];
        if (!recipientUser) throw new Error('Recipient user not found');

        // 2. Registrar la notificación en la base de datos
        let notificationQuery, notificationValues, specificData = {};

        switch (type) {
            case 'post_reaction':
                notificationQuery = `
                    INSERT INTO notifications (recipient_id, sender_id, type, reaction_type, related_post_id) 
                    VALUES ($1, $2, $3, $4, $5) 
                    RETURNING *`;
                notificationValues = [recipientId, senderId, type, reactionType, relatedPostId];
                specificData = { reactionType, relatedPostId };
                break;

            case 'comment':
                notificationQuery = `
                    INSERT INTO notifications (recipient_id, sender_id, type, related_comment_id) 
                    VALUES ($1, $2, $3, $4) 
                    RETURNING *`;
                notificationValues = [recipientId, senderId, type, relatedCommentId];
                specificData = { relatedCommentId };
                break;

            default:
                console.error('Unsupported notification type:', type);
                return;
        }

        const notificationQueryData = await pool.query(notificationQuery, notificationValues);
        const notificationResult = notificationQueryData.rows[0];

        // 3. Crear el objeto de notificación
        const notificationData = {
            id: notificationResult.id,
            createdAt: notificationResult.created_at,
            is_read: notificationResult.is_read,
            sender: {
                id: senderId,
                username: recipientUser.username,
                pictureUrl: recipientUser.profile_picture_url,
            },
            type,
            ...specificData,
        };

        // 4. Enviar la notificación en tiempo real si el usuario está en línea
        if (recipientUser.is_online) {
            const recipientSocketId = await socketByUserId(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('new-notification', notificationData);
            } else {
                console.log(`Recipient ${recipientId} is no longer connected`);
            }
        }
    } catch (err) {
        console.error(`Error handling notification (${type}):`, err.message);
        throw new Error('Notification handling failed');
    }
};

/* 
    ARREGLAR:
        - Solo enviar la notificacion de reaccion a un post cuando esta no sea none! 
        - Si ya existe una reaccion ( una notificacion sobre el mismo post del mismo usuario ) entonces no mandar una segunda 
        notificacion si no hasta dentro de 1 hora, y actualizarla en ves de crear una nueva
        - Arreglar el problema de los likes ( sumar 1 en 1 , error posible de sumar strings con numbers ) 
        - Recibir el evento new-notification, escucharlo en el cliente y ver los datos para despues trabajar con ellos!!!
*/