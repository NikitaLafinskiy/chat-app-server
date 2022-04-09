import { Server } from 'socket.io';
import { Server as ServerType } from 'http';

export const initIO = (server: ServerType) => {
  const io = new Server(server, {
    cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] },
  });
};
