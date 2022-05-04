import { IUser } from "../../../types/models/IUser";
import { SocketType } from "../../../types/socket";
import { SearchService } from "../../../services/socket/SearchService";

export class SearchListeners {
  static async queryUsers(
    data: { query: string; user: IUser },
    socket: SocketType
  ): Promise<void> {
    const { user: currentUser, query } = data;
    const { users } = await SearchService.findMatchingUsers(query);

    if (users.length === 0) {
      socket.emit("queryUsersRes", {
        users: [],
        error: "Could not find any users with a similar username.",
      });
    }

    const userDTOS = await SearchService.queryUsers(currentUser, users);

    socket.emit("queryUsersRes", { users: userDTOS, error: "" });
  }
}
