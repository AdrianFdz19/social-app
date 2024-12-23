// services/notification.service.js
import { NotificationType } from "../types/notification";

export const fetchNotifications = async (
    token: string,
    apiUrl: string
): Promise<{ notifications: NotificationType[] }> => {
    try {
        const response = await fetch(`${apiUrl}/users/notifications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener notificaciones');
        }

        return await response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
};