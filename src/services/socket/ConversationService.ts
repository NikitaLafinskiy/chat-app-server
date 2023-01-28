import { Conversation, Message } from "../../entity";
import { IUser } from "../../types/models/IUser";
import { IConversation } from "../../types/models/IConversation";

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

    return newConversation;
  }

  static async createMessage(
    body: string,
    from: IUser,
    conversation: IConversation
  ) {
    const newMessage = await Message.create({
      body,
      from: from.id,
      conversation,
    }).save();

    return { newMessage };
  }
}
