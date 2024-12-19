import pool from "../config/databaseConfig.js";

/**
 * Maneja la conexión de un usuario.
 * @param {Socket} socket - El socket de la conexión del cliente.
 * @param {string} userId - El ID del usuario que se conecta.
*/

export async function handleUserConnection(socket, userId) {
    try {
        // Actualizar el estado del usuario a 'online'
        const { rows } = await pool.query(
            `UPDATE users SET is_online = true WHERE id = $1 RETURNING is_online`,
            [userId]
        );

        const isUserOnline = rows[0]?.is_online;

        if (!isUserOnline) {
            throw new Error('No se pudo actualizar el estado de conexión del usuario.');
        }

        // Asociar el socket del usuario
        const { rows: socketRows } = await pool.query(
            `
            INSERT INTO user_sockets (user_id, socket_id) 
            VALUES ($1, $2)
            ON CONFLICT (user_id)
            DO UPDATE SET 
                socket_id = EXCLUDED.socket_id, 
                connected_at = NOW() -- Actualiza el timestamp cuando se reconecta
            RETURNING user_id, socket_id;
            `,
            [userId, socket.id]
        );        

        const socketAssociation = socketRows[0];

        if (!socketAssociation.user_id || !socketAssociation.socket_id) {
            throw new Error('No se pudo asociar el socket al usuario.');
        }

        console.log(`Usuario conectado: ${socket.id}, Usuario ID: ${userId}`);
    } catch (error) {
        console.error('Error al manejar la conexión del usuario:', error.message);
    }
}

/**
 * Maneja la desconexión de un usuario.
 * @param {Socket} socket - El socket de la desconexión del cliente.
 * @param {string} userId - El ID del usuario que se desconecta.
*/

export async function handleUserDisconnection(socket, userId) {
    try {
        // Actualizar el estado del usuario a 'offline'
        const { rows } = await pool.query(
            `UPDATE users SET is_online = false WHERE id = $1 RETURNING is_online`,
            [userId]
        );

        const isUserOffline = rows[0]?.is_online;

        if (isUserOffline) {
            throw new Error('No se pudo actualizar el estado de desconexión del usuario.');
        }

        // Eliminar la asociación entre el socket y el usuario
        await pool.query(
            `DELETE FROM user_sockets WHERE user_id = $1 AND socket_id = $2`,
            [userId, socket.id]
        );

        console.log(`Usuario desconectado: ${socket.id}`);
    } catch (error) {
        console.error('Error al manejar la desconexión del usuario:', error.message);
    }
}

export async function isUserOnline(userId) {
    const query = await pool.query(`SELECT is_online FROM users WHERE id = $1`, [userId]); 
    const result = query.rows[0]?.is_online;
    return result;
};

export async function handleIsUserOnline(userId) {
    console.log(userId);
    const query = await pool.query(`SELECT is_online FROM users WHERE id = $1`, [userId]); 
    const result = query.rows[0]?.is_online;
    return result;
};


