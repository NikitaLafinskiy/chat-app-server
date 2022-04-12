import { Socket } from "socket.io";
import { IUser } from "./models/IUser.d";

interface ClientToServer {
  queryUsers: (query: string) => void;
  createConversation: (data: {
    isPrivate: boolean;
    users: IUser[];
    currentUser: IUser;
    groupName: string;
    id: string;
  }) => void;
}

interface ServerToClient {
  queryUsersRes: (data: { users: IUser[]; error: string }) => void;
}

export type SocketType = Socket<ClientToServer, ServerToClient>;
