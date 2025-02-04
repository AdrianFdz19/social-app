// AppProvider.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/user';
import useAuthToken from '../hooks/useAuthToken';

interface AppContextType {
    apiUrl: string;
    appEnv: string;
    user: User | undefined;
    setUser: (user: User | undefined) => void;
    isLoading: boolean;
    noReadNotificationsCount: null | number;
    setNoReadNotificationsCount: React.Dispatch<React.SetStateAction<null | number>>
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext debe usarse dentro de un AppProvider');
    }
    return context;
};

export default function AppProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true); 
    const manageToken = useAuthToken();
    const authToken = manageToken.get();
    const [noReadNotificationsCount, setNoReadNotificationsCount] = useState<null | number>(null);

    // Verify token
    useEffect(() => {
        async function verifyToken() {
            if (!authToken) {
                console.log('No session token found.');
                setIsLoading(false);
                return;
            }
    
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/validate`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Token is invalid or expired.');
                }
    
                const data = await response.json();
                setUser({
                    id: data.user.id,
                    username: data.user.username,
                    email: data.user.email,
                    profilePictureUrl: data.user.profile_picture_url,
                    bannerPictureUrl: data.user.banner_picture_url,
                    bio: data.user.bio,
                    isOnline: data.user.is_online,
                    createdAt: data.user.created_at,
                    updatedAt: data.user.updated_at,
                });
            } catch (error) {
                console.error('Token verification failed:', error.message);
                manageToken.remove(); // Eliminar token del cliente
                setUser(undefined);
            } finally {
                setIsLoading(false);
            }
        }
    
        verifyToken();
    }, [authToken]);    

    useEffect(() => {
       if (user) {
        setIsLoading(false);
       };
    }, [user]);
    
    const value: AppContextType = {
        apiUrl: import.meta.env.VITE_API_URL || '',
        appEnv: import.meta.env.VITE_APP_ENV || '',
        user, setUser,
        isLoading,
        noReadNotificationsCount,
        setNoReadNotificationsCount
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
