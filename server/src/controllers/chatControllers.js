import pool from "../config/databaseConfig.js";

export const handleGetChatInfo = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userId = Number(req.user.id);
        const targetId = Number(req.params.targetId);

        // Verificar si el chat ya existe
        const query = `
            SELECT chat_id
            FROM chat_participants
            WHERE user_id IN ($1, $2)
            GROUP BY chat_id
            HAVING COUNT(DISTINCT user_id) = 2;
        `;
        const result = await client.query(query, [userId, targetId]);

        if (result.rows.length > 0) {
            // Chat ya existe
            await client.query('COMMIT');
            return res.status(200).json({
                success: true,
                chatId: result.rows[0].chat_id,
                message: 'Chat exists between the two users.',
            });
        }

        // Crear nuevo chat
        const createChatQuery = `
            INSERT INTO chats (is_group)
            VALUES ($1)
            RETURNING id;
        `;
        const createChatResult = await client.query(createChatQuery, [false]);
        const newChatId = createChatResult.rows[0].id;

        // Insertar participantes
        const participants = [{ id: userId, isCreator: true }, { id: targetId, isCreator: false }];

        for (const participant of participants) {
            console.log(`SE ESTA AGREGANDO AL USUARIO CON EL ID: ${participant.id} AL CHAT CON EL ID: ${newChatId}`);
            console.log(`EL TIPO DE DATO DEL ID DEL USUARIO ES: ${typeof participant.id}`);
            await client.query(
                `INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2)`,
                [newChatId, participant.id]
            );

            await client.query(
                `INSERT INTO user_chats (chat_id, user_id, is_active) VALUES ($1, $2, $3)`,
                [newChatId, participant.id, participant.isCreator]
            );
        }

        await client.query('COMMIT');

        return res.status(201).json({
            success: true,
            chatId: newChatId,
            message: 'New chat created between the two users.',
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error while fetching chat info:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    } finally {
        client.release();
    }
};

export const handleGetCurrentChat = async (req, res) => {
    try {
        const userId = req.user.id;
        const chatId = req.params.currentChatId;

        let chat = {};

        const chatQuery = await pool.query(`
            SELECT
                id, 
                is_group, 
                name
            FROM chats WHERE id = $1
        `, [chatId]);

        const userChatQuery = await pool.query(`
            SELECT
                is_active
            FROM user_chats
            WHERE chat_id = $1 AND user_id = $2
        `, [chatId, userId]);   

        const userChatResult = userChatQuery.rows[0];

        const chatResult = chatQuery.rows[0];

        if (!chatResult) return res.status(401).json({
            succes: false,
            message: 'There is no chat with that id. try again.'
        });

        chat.id = chatResult.id;
        chat.is_group = chatResult.is_group;
        chat.isActive = userChatResult.is_active;

        if (chatResult.is_group) {
            // gestionar la logica para un grupo. esto mejorarlo mas tarde, ahora no es importante
            chat.name = chatResult.name;
            chat.name = '';
            chat.pictureUrl = '';
        } else {
            // Tomar los datos de la segunda persona en el chat
            const participantQuery = await pool.query(`
                SELECT 
                    u.id AS user_id, 
                    u.username, 
                    u.profile_picture_url,
                    p.chat_id
                FROM users u
                INNER JOIN chat_participants p
                ON u.id = p.user_id
                WHERE p.chat_id = $2
                  AND u.id != $1
            `, [userId, chatId]);            

            const participant = participantQuery.rows[0];
            chat.name = participant.username;
            chat.pictureUrl = participant.profile_picture_url;
        }

        // Messages del chat 
        const messagesQuery = await pool.query(`
            SELECT 
                id,
                chat_id, 
                sender_id,
                content,
                created_at
            FROM messages
            WHERE chat_id = $1
        `, [chatId]);
        const messagesResult = messagesQuery.rows;

        const messages = messagesResult.map((msg) => {
            return {
                id: msg.id, 
                chatId: msg.chat_id, 
                senderId: msg.sender_id, 
                text: msg.content, 
                sendAt: msg.created_at,
                isUserMsg: userId == msg.sender_id
            }
        });

        res.status(200).json({
            succes: true, 
            message: 'succesfully', 
            chat, 
            messages
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({
            succes: false, 
            message: 'error'
        })
    }
}

export const handleGetChats = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Consulta SQL para obtener los chats individuales con su último mensaje
      const chatsQuery = await pool.query(
        `
        SELECT 
          c.id AS chat_id,
          c.is_group,
          u2.username AS other_user_name,
          u2.profile_picture_url AS other_user_picture,
          m.sender_id,
          m.content AS last_message_text,
          m.created_at AS last_message_sent_at,
          m.status AS last_message_status,
          (
            SELECT COUNT(*)
            FROM messages
            WHERE chat_id = c.id AND status = 'unread' AND sender_id != $1
          ) AS unread_count
        FROM 
          chat_participants cp
        INNER JOIN chats c ON cp.chat_id = c.id
        INNER JOIN chat_participants cp2 ON cp.chat_id = cp2.chat_id AND cp2.user_id != $1
        INNER JOIN users u2 ON u2.id = cp2.user_id
        LEFT JOIN messages m ON m.id = (
          SELECT id FROM messages 
          WHERE chat_id = c.id 
          ORDER BY created_at DESC LIMIT 1
        )
        WHERE 
          cp.user_id = $1
          AND c.is_group = false
        GROUP BY 
          c.id, u2.username, u2.profile_picture_url, m.sender_id, m.content, m.created_at, m.status
        ORDER BY 
          m.created_at DESC
        `,
        [userId]
      );
  
      // Formatear los resultados según lo especificado
      const chats = chatsQuery.rows.map((row) => ({
        id: row.chat_id,
        name: row.other_user_name,
        pictureUrl: row.other_user_picture,
        lastMessage: {
          senderId: row.sender_id,
          text: row.last_message_text,
          sendAt: row.last_message_sent_at,
          status: row.last_message_status,
        },
        unReadCount: row.unread_count,
      }));
  
      res.status(200).json({
        success: true,
        chats,
      });
    } catch (err) {
      console.error('Error fetching chats:', err);
      res.status(500).json({
        success: false,
        message: 'Internal server error. Please try again later.',
      });
    }
};

export const handleSendMessage = async (req, res) => {
    try {
        const userId = req.user.id;
        const {chatId, senderId, isFirstMessage, message} = req.body;

        if (!userId || !chatId || ( userId != senderId )) return res.status(400).json({message: 'Missing valid props.'});

        console.log(userId, chatId, senderId, typeof userId, typeof chatId, typeof senderId);

        if (isFirstMessage) {
            // Seleccionar el id del segundo participante
            const otherParticipantQuery = await pool.query(`
                SELECT 
                u.id AS other_user_id
                FROM users u
                INNER JOIN chat_participants cp ON u.id = cp.user_id
                WHERE cp.chat_id = $1 AND cp.user_id != $2
            `, [chatId, userId]);
            
            const otherParticipantId = otherParticipantQuery.rows[0]?.other_user_id;
  
            // Actualizar el is_active del user_chats para el participante receptos del mensaje
            await pool.query(`UPDATE user_chats SET is_active = true WHERE user_id = $1`, [otherParticipantId]);
        };
        
        // Guardamos el mensaje en la base de datos
        const messageQuery = await pool.query(`
            INSERT INTO messages
            (chat_id, sender_id, content, status) VALUES ($1, $2, $3, $4) 
            RETURNING *
        `, [chatId, senderId, message, 'sent']);

        const data = messageQuery.rows[0];

        const messageData = {
            id: data.id,
            text: data.content, 
            sendAt: data.created_at, 
            status: data.status,
            isUserMsg: true
        };

        res.status(200).json({
            succes: true, 
            message: messageData
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({
            succes: false, 
            message: ''
        })
    }
} 
