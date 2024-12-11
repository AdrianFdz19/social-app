import { createContext, useContext } from 'react';

interface AppContextType {
    apiUrl: string;
    appEnv: string;
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
    const value: AppContextType = {
        apiUrl: import.meta.env.VITE_API_URL || '',
        appEnv: import.meta.env.VITE_APP_ENV || '',
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
