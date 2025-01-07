// messageHandler.js

import pool from "../config/databaseConfig.js";
import { io } from "../server.js";
import { socketByUserId } from "./socketHandlers.js";

export async function handleMessage(message, chatId, participantId) {
    // Seguir con la logica de el evento para enviar el mensaje.
    /* 
        1.- Averiguar el status del usuario:
            1.1.- si esta conectado y activo en la conversacion.
            1.2.- si esta conectado pero activo en otra conversacion. 
            1.3.- si esta desconectado 
        2.- Si esta desconectado entonces no hacer nada.
        3.- si esta conectado entonces manejar el evento segun si esta o no activo en la conversacion afectada.
    */

    try {
        // Saber si el usuario esta conectado en la aplicacion
        const isParticipantConnectedQuery = await pool.query(`SELECT is_online FROM users WHERE id = $1`, [participantId]);
        const isParticipantConnected = isParticipantConnectedQuery.rows[0].is_online;
    
        if (!isParticipantConnected) return;
    
        // Buscar el socket id del participante 
        const participantSocketId = await socketByUserId(participantId);

        if (participantSocketId) {
            io.to(participantSocketId).emit('new-message', message);
        }
    } catch(err) {
        console.error(err);
    }
};