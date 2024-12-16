import { useEffect, useState } from 'react';

export default function useMobileSize() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600); // Inicialización correcta

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };

        handleResize(); // Asegurarse de que el estado se actualiza al montarse

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Array vacío: este efecto solo necesita ejecutarse una vez

    return isMobile;
}
