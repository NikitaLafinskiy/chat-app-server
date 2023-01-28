import { UserDTO } from "../../dtos/User.dto";
import { Conversation, User } from "../../entity";
import { IUser } from "../../types/models/IUser";
import { AppDataSource } from "../../config/db.config";

export class SearchService {
  static async queryUsers(currentUser: IUser, users: IUser[]) {
    const mappedUsers = await Promise.all(
      users.map(async (user) => {
        const conversationDoesExist =
          (await Conversation.findOneBy({
            name: `pm__${currentUser.username}__${user.username}`,
          })) ||
          (await Conversation.findOneBy({
            name: `pm__${user.username}__${currentUser.username}`,
          }));

        if (conversationDoesExist) {
          return null;
        }

        return new UserDTO(user);
      })
    );

    return mappedUsers.filter(
      (user) => user !== null && user.username !== currentUser.username
    );
  }

  static async findMatchingUsers(query: string): Promise<{ users: IUser[] }> {
    if (query.length === 0) {
      return { users: [] };
    }

    const users = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .where("user.username like :username", { username: `${query}%` })
      .getMany();
    console.log(users);

    return { users };
  }
}
