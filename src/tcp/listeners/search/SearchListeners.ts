import { User } from "../../../entity";
import { SocketType } from "../../../types/socket";

export class SearchListeners {
  static async queryUsers(query: string, socket: SocketType): Promise<void> {
    const users = await User.findBy({ username: query });
    if (!users) {
      socket.emit("queryUsersRes", {
        users: [],
        error: "Could not find any users with a similar username.",
      });
    }
    socket.emit("queryUsersRes", { users, error: "" });
  }
}
