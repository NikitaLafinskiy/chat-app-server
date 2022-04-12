import { Server } from "socket.io";
import { Server as ServerType } from "http";
import { initSocketListeners } from "./listeners";

export const initIO = (server: ServerType) => {
  const io = new Server(server, {
    cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    //socket.join("AN ARRAY OF CONVERSATIONS RETRIEVED FROM USER")
    initSocketListeners(socket);
  });
};
