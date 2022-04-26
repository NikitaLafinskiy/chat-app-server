import { Socket } from "socket.io";
import { IUser } from "./models/IUser.d";
import { IMessagePayload } from "./models/IMessage.d";

interface ClientToServer {
  queryUsers: (query: string) => void;
  createConversation: (data: {
    isPrivate: boolean;
    users: IUser[];
    currentUser: IUser;
    groupName: string;
    id: string;
  }) => void;
  sendMessage: (data: IMessagePayload) => void;
  joinUser: (data: string) => void;
}

interface ServerToClient {
  queryUsersRes: (data: { users: IUser[]; error: string }) => void;
  conversationCreated: () => void;
  sendMessage: (payload: IMessage) => void;
}

export type SocketType = Socket<ClientToServer, ServerToClient>;
