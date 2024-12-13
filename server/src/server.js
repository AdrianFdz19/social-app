import app from "./app.js";
import http from 'http';
import {Server as SocketServer} from 'socket.io'

const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: ['http://localhost:5173/', ], 
    method: ['GET', 'POST', 'DELETE']
});

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('New connected client: ', socket.id, 'user id: ', userId);

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

export default server;