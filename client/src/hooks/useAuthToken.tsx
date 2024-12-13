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

  return { get, save, remove };
} 
