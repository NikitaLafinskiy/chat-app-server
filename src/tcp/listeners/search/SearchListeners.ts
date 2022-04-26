import { UserDTO } from "../../../dtos/User.dto";
import { User } from "../../../entity";
import { SocketType } from "../../../types/socket";

export class SearchListeners {
  static async queryUsers(query: string, socket: SocketType): Promise<void> {
    const users = await User.findBy({ username: query });
    const userDTOS = users.map((user) => {
      return new UserDTO(user);
    });

    if (!userDTOS) {
      socket.emit("queryUsersRes", {
        users: [],
        error: "Could not find any users with a similar username.",
      });
    }
    socket.emit("queryUsersRes", { users: userDTOS, error: "" });
  }
}
