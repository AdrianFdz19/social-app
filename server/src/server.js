import app from "./app.js";
import http from 'http';
import {Server as SocketServer} from 'socket.io'
import events from './events/index.js';

const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: ['http://localhost:5173/', ], 
    method: ['GET', 'POST', 'DELETE']
});

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    events.handleUserConnection(socket, userId);

    socket.on('disconnect', () => events.handleUserDisconnection(socket, userId));
});

export default server;