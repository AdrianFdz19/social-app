import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/user';
import useAuthToken from '../hooks/useAuthToken';
import { useNavigate } from 'react-router-dom';

interface AppContextType {
    apiUrl: string;
    appEnv: string;
    user: User | undefined;
    setUser: (user: User | undefined) => void;
    isLoading: boolean;
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

    useEffect(() => {
        const token = authToken; // Obtener el token reactivo del hook
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el token

            if (payload) {
                setUser({
                    id: payload.id, 
                    username: payload.username, 
                    email: payload.email, 
                    profilePictureUrl: payload.profile_picture_url,
                    bannerPictureUrl: payload.banner_picture_url,
                    bio: payload.bio, 
                    isOnline: payload.is_online, 
                    createdAt: payload.created_at, 
                    updatedAt: payload.updated_at
                });
            }
        } else {
            console.log('No session token found.');
            setIsLoading(false);
        }
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
        isLoading
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
