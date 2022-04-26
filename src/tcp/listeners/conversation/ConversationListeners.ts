import { IUser } from "../../../types/models/IUser";
import { SocketType } from "../../../types/socket";
import { ConversationService } from "../../../services/socket/ConversationService";
import { v4 } from "uuid";
import { IConversation } from "../../../types/models/IConversation";
import { Server } from "socket.io";

export class ConversationListeners {
  static async joinUserOnConnection() {}

  static joinUser(conversationID: string, socket: SocketType, io: Server) {
    socket.join(conversationID);
  }

  static async createConversation(
    data: {
      isPrivate: boolean;
      users: IUser[];
      currentUser: IUser;
      groupName: string;
    },
    socket: SocketType
  ) {
    const { isPrivate, users, currentUser, groupName } = data;
    const id = v4();

    await ConversationService.createConversation(
      id,
      [...users, currentUser],
      groupName,
      isPrivate
    );

    socket.join(id);
  }

  static async sendMessage(
    payload: {
      conversation: IConversation;
      from: IUser;
      body: string;
      file?: File;
    },
    socket: SocketType
  ) {
    const { body, from, conversation } = payload;

    const { newMessage } = await ConversationService.createMessage(
      body,
      from,
      conversation
    );

    socket.to(payload.conversation.id).emit("sendMessage", newMessage);
  }
}
