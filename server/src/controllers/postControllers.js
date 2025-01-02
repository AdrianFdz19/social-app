import pool from "../config/databaseConfig.js";
import { handleNotification } from "../events/notificationHandler.js";

export const handleCreatePost = async (req, res) => {
    const { content, mediaUrls } = req.body;
    const userId = req.user.id;

    console.log(req.body);

    try {
        // Validar datos de entrada
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        // Crear el post
        const createPostQuery = await pool.query(`INSERT INTO posts (user_id, content) VALUES($1, $2) RETURNING *`, [userId, content]);
        const data = createPostQuery.rows[0];
        const postId = data.id;

        // Si existen archivos multimedia entonces agregarlos a la tabla media_files
        if (mediaUrls.length > 0) {
            for (let url of mediaUrls) {
                await pool.query(`INSERT INTO media_files (user_id, post_id, url, file_type, context) VALUES($1, $2, $3, $4, $5)`, [userId, postId, url, 'image', 'post']);
                console.log(`SE AGREGO UNA URL: ${url} AL POST CON EL ID: ${postId}`);
            }
        }

        // Crear el nuevo objeto post para el cliente
        let newPost = {
            id: data.id, 
            content: data.content, 
            mediaFiles: mediaUrls,
            reactions: {
                like: 0,
            }, 
            commentsCount: 0, 
            userReaction: null, 
            createdAt: data.created_at
        };

        res.status(200).json({newPost});
    } catch(err) {
        console.error(err);
        res.status(500).json({
            succes: false,
            error: err
        });
    }

};  

export const handlePostReaction = async (req, res) => {
    const { postId } = req.params;
    const { reaction } = req.body;
    const userId = req.user.id;

    const validReactions = ['like', 'love', 'haha', 'sad', 'angry'];

    if (!reaction || !postId || !validReactions.includes(reaction)) {
        return res.status(400).json({ error: 'Invalid reaction or post ID.' });
    }

    const client = await pool.connect();
    let reactionUpdate = { type: '' };

    try {
        await client.query('BEGIN');

        // **Obtener el propietario de la publicación**
        const postQuery = await client.query(
            `SELECT id, user_id FROM posts WHERE id = $1`,
            [postId]
        );
        const post = postQuery.rows[0];

        if (!post) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Post not found.' });
        }

        const existingReaction = await client.query(
            `SELECT id, reaction_type FROM post_reactions WHERE post_id = $1 AND user_id = $2`,
            [postId, userId]
        );

        if (existingReaction.rows.length > 0) {
            const prevReaction = existingReaction.rows[0].reaction_type;

            if (prevReaction === reaction) {
                // **Eliminar la reacción**
                await client.query(`DELETE FROM post_reactions WHERE id = $1`, [
                    existingReaction.rows[0].id,
                ]);
                reactionUpdate.type = 'none';

                // **Actualizar el contador de la reacción previa**
                await client.query(
                    `UPDATE posts SET reactions_count = jsonb_set(reactions_count, '{${prevReaction}}', (COALESCE(reactions_count->>'${prevReaction}', '1')::int - 1)::text::jsonb) WHERE id = $1`,
                    [postId]
                );
            } else {
                // **Actualizar la reacción**
                await client.query(
                    `UPDATE post_reactions SET reaction_type = $1 WHERE id = $2`,
                    [reaction, existingReaction.rows[0].id]
                );
                reactionUpdate.type = reaction;

                // **Ajustar los contadores**
                await client.query(
                    `UPDATE posts SET reactions_count = jsonb_set(reactions_count, '{${prevReaction}}', (COALESCE(reactions_count->>'${prevReaction}', '1')::int - 1)::text::jsonb) WHERE id = $1`,
                    [postId]
                );
                await client.query(
                    `UPDATE posts SET reactions_count = jsonb_set(reactions_count, '{${reaction}}', (COALESCE(reactions_count->>'${reaction}', '0')::int + 1)::text::jsonb) WHERE id = $1`,
                    [postId]
                );
            }
        } else {
            // **Crear una nueva reacción**
            await client.query(
                `INSERT INTO post_reactions (post_id, user_id, reaction_type) VALUES ($1, $2, $3)`,
                [postId, userId, reaction]
            );
            reactionUpdate.type = reaction;

            // **Incrementar el contador de la nueva reacción**
            await client.query(
                `UPDATE posts SET reactions_count = jsonb_set(reactions_count, '{${reaction}}', (COALESCE(reactions_count->>'${reaction}', '0')::int + 1)::text::jsonb) WHERE id = $1`,
                [postId]
            );
        }

        await client.query('COMMIT');

        // **Enviar notificación al propietario de la publicación**
        if (userId !== post.user_id && reactionUpdate.type !== 'none') {
            await handleNotification(
                "post_reaction", // Tipo de notificación
                userId, // Usuario que realiza la reacción
                post.user_id, // Propietario de la publicación
                postId, // ID de la publicación relacionada
                null, // ID de comentario relacionado (no aplica aquí)
                reaction // Tipo de reacción
            );
        }

        res.status(200).json({ message: 'Reaction updated successfully', reactionUpdate });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Failed to update reaction' });
    } finally {
        client.release();
    }
};

export const handleFeedPosts = async (req, res) => {
    const { context, profileid: profileId } = req.query;
    const userId = req.user.id; // ID del usuario autenticado

    try {
        // Selección dinámica de filtros según el contexto
        let filterClause = '';

        if (context === 'profile' && profileId) {
            filterClause = `WHERE p.user_id = ${profileId}`;
        }

        const query = `
            SELECT 
                p.id AS post_id,
                p.content,
                p.created_at,
                u.id AS user_id,
                u.username,
                u.profile_picture_url,
                u.is_online,
                COUNT(r.id) FILTER (WHERE r.reaction_type = 'like') AS like_count,
                COUNT(r.id) FILTER (WHERE r.reaction_type = 'love') AS love_count,
                COUNT(r.id) FILTER (WHERE r.reaction_type = 'haha') AS haha_count,
                COUNT(r.id) FILTER (WHERE r.reaction_type = 'sad') AS sad_count,
                COUNT(r.id) FILTER (WHERE r.reaction_type = 'angry') AS angry_count,
                ur.reaction_type AS user_reaction,
                ARRAY_AGG(m.url) FILTER (WHERE m.url IS NOT NULL) AS media_files
            FROM 
                posts p
            INNER JOIN 
                users u ON u.id = p.user_id
            LEFT JOIN 
                post_reactions r ON r.post_id = p.id
            LEFT JOIN 
                post_reactions ur ON ur.user_id = $1 AND ur.post_id = p.id
            LEFT JOIN 
                media_files m ON m.post_id = p.id
            ${filterClause}  -- Aplica el filtro según el contexto
            GROUP BY 
                p.id, u.id, ur.reaction_type
            ORDER BY 
                p.created_at DESC;
        `;

        const result = await pool.query(query, [userId]);

        // Transformar los datos directamente
        const finalPosts = result.rows.map(post => ({
            id: post.post_id,
            author: {
                id: post.user_id,
                username: post.username,
                profilePictureUrl: post.profile_picture_url,
                isOnline: post.is_online,
            },
            content: post.content,
            mediaFiles: post.media_files || [], // Garantiza un array incluso si no hay URLs
            reactions: {
                like: parseInt(post.like_count) || 0,
                love: parseInt(post.love_count) || 0,
                haha: parseInt(post.haha_count) || 0,
                sad: parseInt(post.sad_count) || 0,
                angry: parseInt(post.angry_count) || 0,
            },
            commentsCount: 0, // Ajusta esto si necesitas incluir comentarios
            userReaction: post.user_reaction,
            createdAt: post.created_at,
        }));

        res.status(200).json({ success: true, posts: finalPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};


