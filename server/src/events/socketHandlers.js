import pool from "../config/databaseConfig.js";
import { handleIsUserOnline } from "./connectionHandlers.js";

// Obtener el socket id de un usuario activo mediante su user_id 
export async function socketByUserId(userId) {
    // Verificar si el usuario esta activo en la pagina
    const isUserOnline = await handleIsUserOnline(userId);

    if (!isUserOnline) return null; 

    const socketIdQuery = await pool.query(`SELECT socket_id FROM user_sockets WHERE user_id = $1`, [userId]);
    const socketId = socketIdQuery.rows[0]?.socket_id;
    console.log(socketId);

    return socketId;
};