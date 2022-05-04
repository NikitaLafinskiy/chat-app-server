import { SocketType } from "../../types/socket.d";
import { SearchListeners } from "./search/SearchListeners";
import { ConversationListeners } from "./conversation/ConversationListeners";
import { IMessagePayload } from "../../types/models/IMessage";
import { Server } from "socket.io";

export const initSocketListeners = (socket: SocketType, io: Server) => {
  socket.on("queryUsers", (data) => {
    SearchListeners.queryUsers(data, socket);
  });
  socket.on("createConversation", async (data) => {
    await ConversationListeners.createConversation(data, socket);
    socket.emit("conversationCreated");
  });
  socket.on("sendMessage", async (data: IMessagePayload) => {
    await ConversationListeners.sendMessage(data, socket);
  });
  socket.on("joinUser", (data) => {
    ConversationListeners.joinUser(data, socket, io);
  });
};
