import { SocketType } from "../../types/socket.d";
import { SearchListeners } from "./search/SearchListeners";
import { ConversationListeners } from "./conversation/ConversationListeners";

export const initSocketListeners = (socket: SocketType) => {
  socket.on("queryUsers", (query) => {
    SearchListeners.queryUsers(query, socket);
  });
  socket.on("createConversation", (data) => {
    ConversationListeners.createConversation(data, socket);
  });
};
