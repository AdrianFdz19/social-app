import pool from "../config/databaseConfig.js";

export const handleGetChatInfo = async (req, res) => {
    try {   
        const userId = req.user.id; // Usuario actual
        const targetId = req.params.targetId; // Usuario objetivo
        
        const query = `
            SELECT chat_id
            FROM chat_participants
            WHERE user_id IN ($1, $2)
            GROUP BY chat_id
            HAVING COUNT(DISTINCT user_id) = 2;
        `;

        const result = await pool.query(query, [userId, targetId]);

        if (result.rows.length > 0) {
            // El chat existe
            res.status(200).json({
                success: true, 
                chatId: result.rows[0].chat_id,
                message: 'Chat exists between the two users.',
            });
        } else {
            // El chat no existe, entonces crearlo, y en el user_chats mantener
            const createChatQuery = await pool.query(`
             INSERT INTO chats (is_group) VALUES($1) RETURNING id   
            `, [false]);

            const newChatId = createChatQuery.rows[0]?.id;

            let participantsId = [{id: userId, isCreator: true}, {id: targetId, isCreator: false}];

            for (let participant of participantsId) {
                await pool.query(`
                    INSERT INTO chat_participants (chat_id, user_id) VALUES($1, $2)
                `, [newChatId, participant.id]);
            }

            for (let participant of participantsId) {
                await pool.query(`
                    INSERT INTO user_chats (chat_id, user_id, is_active) VALUES($1, $2, $3)
                `, [newChatId, participant.id, participant.isCreator ? true : false]);
            }

            res.status(404).json({
                success: false, 
                chatId: newChatId,
                message: 'No chat found between the two users.',
            });
        }
    } catch (err) {
        console.error('Error while fetching chat info:', err);
        res.status(500).json({
            success: false, 
            message: 'Internal server error.',
        });
    }
};
