// useNotifications.tsx

import { useEffect, useState } from "react";
import { NotificationType } from "../types/notification";
import { fetchNotifications } from "../services/notification.service";


export const useNotifications = (apiUrl: string, token: string, max: number | null = null) => {
    const [notifications, setNotifications] = useState<NotificationType[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleFetchNotification = async () => {
            try {
                const result = await fetchNotifications(token, apiUrl, max);
                setNotifications(result.notifications);
            } catch (err) {
                setError('Failed to fetch notifications.');
            }
        };

        handleFetchNotification();
    }, [apiUrl, token]);

    return { notifications, error };
};