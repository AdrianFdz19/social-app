// notificationHandler.js

import pool from "../config/databaseConfig.js";
import { io } from "../server.js";
import { socketByUserId } from "./socketHandlers.js";

export async function handleNotification(
    type,
    senderId,
    recipientId,
    relatedPostId = null,
    relatedCommentId = null,
    reactionType = null
) {
    try {
        const NOTIFICATION_THRESHOLD_MS = 60 * 60 * 1000; // 1 hora (configurable)
        let specifiedData = {};

        console.log('SE ESTA PROCESANDO UNA NOTIFICACION');

        // 1. Recuperar datos del remitente
        const senderDataQuery = await pool.query(
            `SELECT id, username, profile_picture_url FROM users WHERE id = $1`,
            [senderId]
        );
        const senderUser = senderDataQuery.rows[0];
        if (!senderUser) throw new Error('Sender user not found');

        // 1. Recuperar datos del usuario destinatario
        const recipientDataQuery = await pool.query(
            `SELECT id, username, profile_picture_url, is_online FROM users WHERE id = $1`,
            [recipientId]
        );
        const recipientUser = recipientDataQuery.rows[0];
        if (!recipientUser) throw new Error('Recipient user not found');

        // 2. Verificar si existe una notificación similar
        const existingNotification = await pool.query(
            `
            SELECT id, created_at FROM notifications
            WHERE recipient_id = $1 AND sender_id = $2 AND type = $3
            AND (related_post_id = $4 OR related_comment_id = $5)
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [recipientId, senderId, type, relatedPostId, relatedCommentId]
        );

        if (existingNotification.rows.length > 0) {
            const lastNotification = existingNotification.rows[0];
            const timeDifference = Date.now() - new Date(lastNotification.created_at).getTime();

            if (timeDifference < NOTIFICATION_THRESHOLD_MS) {
                console.log('Notificación ya enviada recientemente, no se duplicará');
                return;
            }

            // Actualizar la notificación existente si está fuera del umbral
            await pool.query(`UPDATE notifications SET created_at = NOW() WHERE id = $1`, [lastNotification.id]);
        } else {
            // Insertar una nueva notificación si no existe una similar
            let notificationQuery, notificationValues;

            switch (type) {
                case 'post_reaction':
                    notificationQuery = `
                        INSERT INTO notifications (recipient_id, sender_id, type, reaction_type, related_post_id) 
                        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
                    notificationValues = [recipientId, senderId, type, reactionType, relatedPostId];
                    specifiedData = { reactionType, relatedPostId };
                    break;

                case 'comment':
                    notificationQuery = `
                        INSERT INTO notifications (recipient_id, sender_id, type, related_comment_id) 
                        VALUES ($1, $2, $3, $4) RETURNING *`;
                    notificationValues = [recipientId, senderId, type, relatedCommentId];
                    specifiedData = { relatedCommentId };
                    break;

                case 'follow':
                    notificationQuery = `
                        INSERT INTO notifications (recipient_id, sender_id, type) VALUES ($1, $2, $3) 
                        RETURNING *`;  
                    notificationValues = [recipientId, senderId, type];
                    specifiedData = {}; // no hay una informacion especifica para el tipo 'follows'
                    break;

                default:
                    console.error('Unsupported notification type:', type);
                    return;
            }

            const notificationQueryData = await pool.query(notificationQuery, notificationValues);
            const notificationResult = notificationQueryData.rows[0];

            // Crear el objeto de notificación
            const notificationData = {
                id: notificationResult.id,
                createdAt: notificationResult.created_at,
                is_read: notificationResult.is_read,
                sender: {
                    id: senderId,
                    username: senderUser.username,
                    pictureUrl: senderUser.profile_picture_url,
                },
                type,
                ...specifiedData
            };

            // Enviar la notificación en tiempo real
            if (recipientUser.is_online) {
                const recipientSocketId = await socketByUserId(recipientId);
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('new-notification', notificationData);
                }
            }
        }
    } catch (err) {
        console.error(`Error handling notification (${type}):`, err.message);
        throw new Error('Notification handling failed');
    }
}

/* 
    ARREGLAR:
        - Arreglar el problema de los likes ( sumar 1 en 1 , error posible de sumar strings con numbers ) 
*/