import pool from "../config/databaseConfig.js";
import { handleNotification } from "../events/notificationHandler.js";

export const allUsers = async (req, res) => {
    try {   
        const query = await pool.query(`SELECT * FROM users`);
        const users = query.rows;

        res.status(200).json({
            users
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: 'Error',
        })
    }
};

// user profile info
export const profileInfo = async (req, res) => {
    try {   
        const userId = req.params.userId;
        const query = await pool.query(`
            SELECT
                id,
                username, 
                email, 
                bio, 
                profile_picture_url,
                banner_picture_url,
                created_at,
                updated_at  
            FROM users WHERE id = $1    
        `, [userId]);
        const profileInfo = query.rows[0];

        res.status(200).json({
            profileInfo
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: 'Error',
        })
    }
};

// user notifications
export const handleUserNotifications = async (req, res) => {
    try {   
        const userId = req.user.id;
        const max = req.query.max || null;

        if (!userId) return res.status(400).json({ error: 'Invalid user ID.' });

        // Traer la informacion de todas las notificaciones del usuario
        const query = `
            SELECT
                n.id, 
                n.recipient_id,
                n.sender_id,
                n.type, 
                n.related_post_id, 
                n.related_comment_id, 
                n.reaction_type, 
                n.is_read, 
                n.created_at, 
                u.username, 
                u.profile_picture_url
            FROM notifications n 
            JOIN users u ON u.id = n.sender_id
            WHERE n.recipient_id = $1
            ORDER BY n.created_at DESC
            ${max && `LIMIT ${max}`}
        `;
        const notificationQuery = await pool.query(query, [userId]);
        const allNotifications = notificationQuery.rows;

        const notifications = allNotifications.map((not, i) => {
            return {
                id: not.id, 
                type: not.type,
                isRead: not.is_read,
                createdAt: not.created_at, 
                sender: {
                    username: not.username, 
                    pictureUrl: not.profile_picture_url
                },
                reactionType: not.reaction_type,
                relatedPostId: not.related_post_id,
                relatedCommentId: not.related_comment_id
            }
        });

        return res.status(200).json({
            succes: true, 
            notifications
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({
            succes: false, 
            error: err,
        });
    }
}

// user no read notifications count 
export const handleNoReadNotificationsCount = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId);

        if (!userId) return res.status(400);

        const query = await pool.query(`SELECT COUNT(id) FROM notifications WHERE recipient_id = $1 AND is_read != true`, [userId]);
        const { count } = query.rows[0];

        res.status(200).json({
            succes: true, 
            message: 'Succes',
            count
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            error: err
        });
    }
}

// Handle search 
export const handleSearch = async (req, res) => {
    try {
        const { searchValue } = req.body;

        if (!searchValue || searchValue.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Search value is required.",
            });
        }

        // Query para buscar usuarios con un username similar
        const query = `
            SELECT id, username, profile_picture_url
            FROM users
            WHERE username ILIKE $1
            LIMIT 10;
        `;
 
        const values = [`%${searchValue}%`]; // Añade comodines para buscar coincidencias parciales

        const findQuery = await pool.query(query, values);

        if (findQuery.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found matching the search value.",
            });
        }

        const users = findQuery.rows.map((user) => {
            return {
                id: user.id, 
                username: user.username, 
                pictureUrl: user.profile_picture_url
            };
        });

        res.status(200).json({
            success: true,
            users, // Devuelve los usuarios encontrados
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Server error",
        });
    }
};

// Handle follow
export const handleFollow = async (req, res) => {
    try {
        const userId = req.user.id; // ID del usuario autenticado
        const { userId: targetUserId } = req.body; // ID del usuario objetivo

        if (!targetUserId || userId === targetUserId) {
            return res.status(400).json({
                success: false,
                message: "Invalid target user ID.",
            });
        }

        // 1. Verificar si ya existe el registro entre userId y targetUserId
        const { rows: existingFollow } = await pool.query(
            `SELECT id FROM follows WHERE follower_id = $1 AND followed_id = $2`,
            [userId, targetUserId]
        );

        if (existingFollow.length > 0) {
            // 2. Si existe, eliminar el registro
            await pool.query(
                `DELETE FROM follows WHERE id = $1`,
                [existingFollow[0].id]
            );

            await pool.query(
                `DELETE FROM notifications WHERE type = $1 AND recipient_id = $2 AND sender_id = $3`, 
                ['follow', targetUserId, userId]
            );

            return res.status(200).json({
                success: true,
                message: "Follow removed.",
            });
        } else {
            // 3. Si no existe, crear el nuevo registro
            await pool.query(
                `INSERT INTO follows (follower_id, followed_id, created_at) VALUES ($1, $2, NOW())`,
                [userId, targetUserId]
            );

            // **Enviar notificación al usuario target**
            await handleNotification(
                "follow", // Tipo de notificación
                userId, // Usuario que realiza la reacción
                targetUserId, // Usuario seguido
                null, // ID de la publicación relacionada
                null, // ID de comentario relacionado (no aplica aquí)
                null // Tipo de reacción
            );

            return res.status(201).json({
                success: true,
                message: "Follow created.",
            });
        }
    } catch (err) {
        console.error("Error in handleFollow:", err);
        res.status(500).json({
            success: false,
            error: "Server error.",
        });
    }
};
