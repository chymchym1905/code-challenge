import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

export default function setupSocket(server: HttpServer): Server {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        }
    });
    return io;
}
