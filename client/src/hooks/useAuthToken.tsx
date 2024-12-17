import { useState } from 'react'

export default function useAuthToken() {

    const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));

    function get() {
        return token;
    }

    // Función para guardar el token
    function save(newToken: string) {
        localStorage.setItem('auth_token', newToken);
        setToken(newToken);
    }   

    // Función para remover el token
    function remove() {
        localStorage.removeItem('auth_token');
        setToken(null);
    }

    async function refresh() {
        if (!token) return null;
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
    
            if (!response.ok) throw new Error('Failed to refresh token.');
    
            const data = await response.json();
            save(data.token);
            return data.token;
        } catch (error) {
            console.error('Error refreshing token:', error.message);
            remove();
            return null;
        }
    }

  return { get, save, remove, refresh };
} 
