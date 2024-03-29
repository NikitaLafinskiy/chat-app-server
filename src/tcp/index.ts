import { Server } from "socket.io";
import { Server as ServerType } from "http";
import { initSocketListeners } from "./listeners";

export const initIO = (server: ServerType) => {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    initSocketListeners(socket, io);
  });
};
