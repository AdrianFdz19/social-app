// services/notification.service.js
import { NotificationType } from "../types/notification";

export const fetchNotifications = async (
    token: string,
    apiUrl: string,
    max: number | null
): Promise<{ notifications: NotificationType[] }> => {
    try {
        console.log(`${apiUrl}/users/notifications${max > 0 && `?max=${max}`}`);
        const response = await fetch(`${apiUrl}/users/notifications${max > 0 && `?max=${max}`}`, {
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