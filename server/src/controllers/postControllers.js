import pool from "../config/databaseConfig.js";

export const handleCreatePost = async (req, res) => {
    const { content, mediaUrls } = req.body;
    const userId = req.user.id;

    try {
        // Validar datos de entrada
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        // Crear el post
        const createPostQuery = await pool.query(`INSERT INTO posts (user_id, content) VALUES($1, $2) RETURNING *`, [userId, content]);
        const data = createPostQuery.rows[0];
        const postId = data.post_id;

        // Si existen archivos multimedia entonces agregarlos a la tabla media_files
        if (mediaUrls.length > 0) {
            for (let url of mediaUrls) {
                await pool.query(`INSERT INTO media_files (user_id, post_id, url, file_type, context) VALUES($1, $2, $3, $4, $5)`, [userId, postId, url, 'image', 'post']);
            }
        }

        // Crear el nuevo objeto post para el cliente
        let newPost = {
            id: data.id, 
            content: data.content, 
            mediaFiles: mediaUrls,
            reactions: {
                likes: 0,
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
    const userId = req.user.id; // Extraído del token

    // Validar datos de entrada
    if (!reaction || !postId) {
        return res.status(400).json({ error: 'Post ID and reaction are required.' });
    }

    const validReactions = ['like', 'love', 'dislike', 'haha', 'sad', 'angry']; // Reacciones válidas
    if (!validReactions.includes(reaction)) {
        return res.status(400).json({ error: 'Invalid reaction type.' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Iniciar la transacción

        // Verificar si el usuario ya reaccionó al post
        const alreadyReactedQuery = await client.query(
            `SELECT id, reaction_type FROM post_reactions WHERE post_id = $1 AND user_id = $2`,
            [postId, userId]
        );

        const existingReaction = alreadyReactedQuery.rows[0];

        if (existingReaction) {
            // Si la reacción es la misma, eliminarla
            if (reaction === existingReaction.reaction_type) {
                await client.query(`DELETE FROM post_reactions WHERE id = $1`, [existingReaction.id]);
            } 
            // Si la reacción es diferente, actualizarla
            else {
                await client.query(
                    `UPDATE post_reactions SET reaction_type = $1 WHERE id = $2`,
                    [reaction, existingReaction.id]
                );
            }
        } else {
            // Si no hay reacción existente, crear una nueva
            await client.query(
                `INSERT INTO post_reactions (post_id, user_id, reaction_type) VALUES ($1, $2, $3)`,
                [postId, userId, reaction]
            );
        }

        await client.query('COMMIT'); // Confirmar la transacción
        res.status(200).json({ message: 'Reaction updated successfully' });
    } catch (error) {
        await client.query('ROLLBACK'); // Revertir la transacción en caso de error
        console.error('Database error:', error);

        if (error.code === '23505') { // Manejo de errores específicos (violación de unicidad, si aplica)
            res.status(409).json({ error: 'Duplicate reaction detected' });
        } else {
            res.status(500).json({ error: 'Failed to update reaction' });
        }
    } finally {
        client.release(); // Liberar el cliente de la conexión
    }
};