import { IUser } from "../../../types/models/IUser";
import { SocketType } from "../../../types/socket";
import { ConversationService } from "../../../services/socket/ConversationService";
import { v4 } from "uuid";

export class ConversationListeners {
  static async createConversation(
    data: {
      isPrivate: boolean;
      users: IUser[];
      currentUser: IUser;
      groupName: string;
    },
    socket: SocketType
  ) {
    console.log(data);
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
}
