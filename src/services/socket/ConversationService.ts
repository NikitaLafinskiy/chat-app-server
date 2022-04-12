import { Conversation, User } from "../../entity";
import { IUser } from "../../types/models/IUser";
import { ApiError } from "../../exceptions/ApiError";

export class ConversationService {
  static async createConversation(
    id: string,
    users: IUser[],
    name: string,
    isPrivate: boolean
  ): Promise<Conversation> {
    const newConversation = await Conversation.create({
      id,
      name,
      members: [...users],
      isPrivate,
    }).save();

    for (let i = 0; i < users.length; i++) {
      const user = await User.findOneBy({ id: users[i].id });
      console.log(user);

      if (!user) {
        throw ApiError.BadRequestError(
          "User that is being added to a conversation doesnt exist"
        );
      }

      user.conversations.push(newConversation);
    }

    return newConversation;
  }
}
