// NotificationPanel.tsx

import { useEffect, useState } from 'react';
import ProfilePicture from '../ProfilePicture';
import './ContextualPanel.scss';
import { useAppContext } from '../../contexts/AppProvider';
import useAuthToken from '../../hooks/useAuthToken';
import { useNotifications } from '../../hooks/useNotifications';

export default function NotificationPanel() {

    const { apiUrl } = useAppContext();
    const token = useAuthToken().get();
    const { notifications, error } = useNotifications(apiUrl, token);

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

