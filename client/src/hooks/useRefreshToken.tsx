/* SI EL TOKEN ESTA POR EXPIRAR ENTONCES REFRESCARLO O AVISAR AL USUARIO */

/* useEffect(() => {
    if (authToken) {
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        const exp = payload.exp * 1000; // Convertir a milisegundos
        const remainingTime = exp - Date.now();

        if (remainingTime <= 5 * 60 * 1000) { // Menos de 5 minutos
            console.log('Token está cerca de expirar.');
            // Opcional: intentar refrescar automáticamente
            manageToken.refresh();
        }
    }
}, [authToken]); */