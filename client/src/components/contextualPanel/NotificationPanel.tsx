// NotificationPanel.tsx

import { useEffect, useState } from 'react';
import ProfilePicture from '../ProfilePicture';
import './ContextualPanel.scss';
import { useAppContext } from '../../contexts/AppProvider';
import useAuthToken from '../../hooks/useAuthToken';
import { NotificationType } from '../../types/notification';

export default function NotificationPanel() {

    const { apiUrl } = useAppContext();
    const handleToken = useAuthToken();
    const [notifications, setNotifications] = useState<NotificationType[] | undefined>(undefined);

    useEffect(() => {
        const fetchNotifications = async() => {
            const token = handleToken.get();
            try {
                const response = await fetch(`${apiUrl}/users/notifications`, {
                    method: 'GET', 
                    headers: {
                        'Content-Type': 'application/json', 
                        Authorization: `Bearer ${token}`
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data.notifications);
                    console.log(data);
                } else {
                    console.error('Server internal error.');
                }
            } catch(err) {
                console.error(err);
            }
        };

        fetchNotifications();
    }, [apiUrl]); 

    return (
        <div className="notification-panel">
            {notifications && notifications.length > 0 ? (
                <>
                    {notifications.map((not, id) => (
                        <div key={id} className="notification-panel__item">
                            <div className="notification-panel__content">
                                <ProfilePicture
                                    url={not.sender.pictureUrl} 
                                    size={2.5} 
                                    isOnline={false} 
                                    outline={false} 
                                    handleClick={()=>{}}
                                />
                                <div className="notification-panel__body">
                                    <div className="notification-panel__text">
                                        <label className="notification-panel__username">{not.sender.username}</label>
                                        <label>has reacted to your post</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <p>No notifications available</p>
            )}
            <label id="notification-panel__navigate">View more notifications</label>
        </div>
    );
}

