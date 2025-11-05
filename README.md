# Social App Documentación

## Descripción
Esta es una red social básica que permite a los usuarios crear publicaciones, seguir a otros usuarios, dar "me gusta" a publicaciones, buscar perfiles, enviar mensajes en tiempo real y recibir notificaciones relacionadas con la aplicación.

--- 

## Características Principales
- Registro e inicio de sesión para usuarios.
- Acciones CRUD en publicaciones y perfiles.
- Interfaz intuitiva y cómoda.
- Backend seguro utilizando JWT para la autenticación.
- Base de datos para gestionar usuarios, publicaciones, mensajes y más.

---

## Tecnologías Utilizadas
- *Frontent*: React.js con TypeScript y SCSS como preprocesador de estilos.
- *Backend*: Node.js y Express para el servidor y controladores principales.
- *Base de datos*: PostgreSQL.
- *Integraciones*: Cloudinary para almacenamiento de archivos multimedia (fotos de perfil y publicaciones).

---

## Requisitos Previos
- **Node.js** v16+ instalado.
- **PostgreSQL** configurado.
- Cuenta de Cloudinary para el administrador de archivos multimedia de la aplicacion.
- Yarn o npm como gestor de paquetes.

---

## Instrucciones de Instalación

### 1. Clonar el repositorio
Abre tu terminal y ejecuta los siguientes comandos:
```bash
git clone https://github.com/AdrianFdz19/social-app.git
cd social-app
```

### 2. Configurar el backend
1. Ve a la carpeta del servidor:
   ```bash
   cd server
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` basado en el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
4. Completa las variables de entorno en el archivo `.env`:
   ```
    PORT=5000
    DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/tu_base_datos
    SECRET_KEY=tu_clave_secreta
    CLOUDINARY_CLOUD_NAME=nombre_de_tu_cloudinary
    CLOUDINARY_API_KEY=tu_api_key
    CLOUDINARY_API_SECRET=tu_api_secret
   ```
5. Inicia el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

### 3. Configurar el frontend
1. Ve a la carpeta del cliente:
   ```bash
   cd ../client
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```

---

## Guías de Uso
1. Accede al frontend en tu navegador.
2. Regístrate o inicia sesión en la aplicación.
3. Disfruta de la red social: crea publicaciones, sigue usuarios, envía mensajes y más.

---

## Estructura del Proyecto
```
/client  - Contiene el código del frontend.
/server  - Contiene el código del backend.
```
- **Archivos clave**:
  - `server/src/app.js`: Lógica base del servidor.
  - `client/src/contexts/AppProvider.tsx`: contexto principal de la aplicación.

---

## Capturas de Pantalla

![Feed del home](https://res.cloudinary.com/dlnapytj1/image/upload/v1737223467/Captura_de_pantalla_2025-01-10_185445_eqvyzy.png)
![Chat entre usuarios en tiempo real](https://res.cloudinary.com/dlnapytj1/image/upload/v1737223489/Captura_de_pantalla_2025-01-10_185745_viemc5.png)
![Notificaciones](https://res.cloudinary.com/dlnapytj1/image/upload/v1737223508/Captura_de_pantalla_2025-01-10_185604_t9ix2i.png)

---

## Consideraciones Técnicas
- Las claves de la API de Cloudinary se gestionan a través de variables de entorno para garantizar la seguridad.
- Middlewares en Express aseguran que las solicitudes al backend estén correctamente validadas.

---

## Futuras Mejoras
- Agregar opciones de edición o eliminación de publicaciones.
- Implementar comentarios en las publicaciones.
- Mejorar el diseño del frontend para una experiencia de usuario más refinada.
- Mejorar la lógica para subir imagenes a traves de Cloudinary.

---

## Licencia
Este proyecto está bajo la licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.

---

## Contribuciones
Las contribuciones son bienvenidas. Si deseas colaborar:
1. Haz un fork del proyecto.
2. Crea una rama para tus cambios:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Envía un Pull Request describiendo tus cambios.

