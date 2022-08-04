import { Conversation, User, Message } from "../../entity";
import { ApiError } from "../../exceptions/ApiError";

export class ChatService {
  static async getConversations(
    userID: number
  ): Promise<{ conversations: Conversation[] }> {
    const user = await User.findOne({
      relations: ["conversations"],
      where: { id: userID },
    });

    if (!user) {
      throw ApiError.UnauthorizedError(`No user with such id ${userID}`);
    }

    return { conversations: user.conversations };
  }

  static async getMessages(
    conversationID: string,
    index: number
  ): Promise<{ messages: Message[] }> {
    const take = 30;
    const skip = index * 30;

    const conversation = (
      await Promise.all(
        await Conversation.find({
          relations: ["messages"],
          take,
          skip,
          where: { id: conversationID },
        })
      )
    )[0];

    if (!conversation) {
      return { messages: [] };
    }

    return { messages: conversation.messages };
  }
}
